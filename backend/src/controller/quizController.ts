import { Request, Response } from "express";
import { db } from "../db";
import { and, eq, inArray, sql } from "drizzle-orm";
import { answerTable, optionTable, questionTable, quizTable } from "../db/schema";

export const getAllQuiz = async (req: Request, res: Response) => {
    const userId = req.user.id;

    try {
        const quiz = await db.select().from(quizTable).where(eq(quizTable.createdBy, userId)).execute();

        if (!quiz || quiz.length == 0) {
            res.status(404).json({
                success: false,
                message: 'No Quiz found'
            })
            return;
        }

        res.status(200).json({
            success: true,
            data: quiz
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error in server'
        })
        return;
    }
}

export const deleteQuiz = async (req: Request, res: Response) => {
    const { quizId } = req.params;
    const userId = req.user.id

    try {

        const quiz = await db
            .select()
            .from(quizTable)
            .where(and(eq(quizTable.id, Number(quizId)), eq(quizTable.createdBy, userId)))
            .execute();

        if (quiz.length == 0) {
            res.status(400).json({
                error: 'validation_error',
                message: 'No quiz found to be deleted'
            })
            return;
        }

        const deleteQuizId = await db.delete(quizTable).where(eq(quizTable.id, Number(quizId))).returning({ deletedId: quizTable.id })

        res.status(200).json({
            success: true,
            data: deleteQuizId
        })
        return;

    } catch (error) {
        console.log('error', error);
        res.status(400).json({
            success: false,
            message: 'Error in server'
        });
        return;
    }
}

export const createQuiz = async (req: Request, res: Response) => {
    const { heading, description, bgImageUrl } = req.body;

    try {
        if (!heading || typeof heading !== 'string' || !description || typeof description !== 'string') {
            res.status(400).json({ error: "validation_error", message: "Error in heading/description" });
            return;
        }

        const newQuiz = await db.insert(quizTable).values({
            heading,
            description,
            bgImageUrl,
            createdBy: req.user.id
        }).returning();

        res.status(200).json({
            success: true,
            data: newQuiz
        });
        return;

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error in server'
        });
        return;
    }
}

export const addQuizQuestionsData = async (req: Request, res: Response) => {

    const { quizIds } = req.params;
    const { questions } = req.body;

    try {
        for (const questionData of questions) {
            const correctOptions = questionData.options.filter(
                (opt: { value: string, isAns?: boolean }) => opt.isAns
            );

            if (correctOptions.length !== 1) {
                res.status(400).json({
                    message: `Question "${questionData.question}" must have exactly one correct answer`
                });
                return;
            }
        }

        const quizExists = await db
            .select({ id: quizTable.id })
            .from(quizTable)
            .where(eq(quizTable.id, Number(quizIds)))
            .execute();

        if (quizExists.length === 0) {
            res.status(404).json({ message: "Quiz not found" });
            return;
        }

        await db.transaction(async (tx) => {
            for (const questionData of questions) {
                const [insertedQuestion] = await tx
                    .insert(questionTable)
                    .values({
                        question: questionData.question,
                        imageUrl: questionData.imageUrl || null,
                        quizId: Number(quizIds)
                    })
                    .returning({ id: questionTable.id });

                const questionId = insertedQuestion.id;

                let correctOptionId: number | null = null;

                for (const option of questionData.options) {
                    const [insertedOption] = await tx
                        .insert(optionTable)
                        .values({
                            value: option.value,
                            questionId,
                        })
                        .returning({ id: optionTable.id });

                    if (option.isAns) {
                        correctOptionId = insertedOption.id;
                    }
                }

                if (correctOptionId) {
                    await tx.insert(answerTable).values({
                        questionId,
                        optionId: correctOptionId,
                        answerDescription: questionData.answers?.[0]?.answerDescription || "Correct Answer",
                    });
                }
            }
        });

        res.status(201).json({ message: "Questions, options, and answers added successfully" });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}

export const editQuizMetaData = async (req: Request, res: Response) => {
    const { heading, description, bgImageUrl } = req.body
    const { quizId } = req.params;

    try {

        if (!heading || !description || !bgImageUrl) {
            res.status(402).json({
                success: false,
                message: 'Atleast all (heading , desc, bgImageUrl) you dumb'
            });
            return;
        }

        const quiz = await db
            .select()
            .from(quizTable)
            .where(and(eq(quizTable.id, Number(quizId)), eq(quizTable.createdBy, req.user.id)))
            .execute();

        if (quiz.length == 0) {
            res.status(400).json({
                error: 'validation_error',
                message: 'No quiz found to be updated'
            })
            return;
        }

        const updatedQuiz = await db.update(quizTable)
            .set({ updated_at: sql`NOW()`, heading, description, bgImageUrl })
            .where(eq(quizTable.createdBy, req.user.id))
            .returning({ id: quizTable.id });

        res.status(202).json({
            success: true,
            data: updatedQuiz
        });
        return;

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Something wrong with updating quix data'
        });
        return;
    }
}
//TODO:OPTIMIZE
export const editQuizQuestionData = async (req: Request, res: Response) => {
    const { questionId } = req.params;
    const { question, options, answers, quizId } = req.body;

    try {
        if (!questionId || !quizId) {
            res.status(400).json({
                message: !questionId ? "Question ID is required" : "Quiz ID is required"
            });
            return;
        }

        const quiz = await db.select().from(quizTable).where(and(
            eq(quizTable.id, Number(quizId)),
            eq(quizTable.createdBy, req.user.id)
        )).execute();

        if (quiz.length === 0) {
            res.status(400).json({
                error: 'Not_Found',
                message: 'No quiz exists with given quizId and userId'
            });
            return;
        }

        const existingQuestion = await db.select().from(questionTable).where(eq(questionTable.id, Number(questionId))).execute();

        if (existingQuestion.length === 0) {
            res.status(404).json({ message: "Question not found" });
            return;
        }

        const correctOptions = options?.filter((opt: any) => opt.isAns) || [];
        if (correctOptions.length > 1) {
            res.status(400).json({ message: "Only 1 option can be correct" });
            return;
        }

        await db.transaction(async (tx) => {
            if (question?.value || question?.imageUrl !== undefined) {
                await tx.update(questionTable).set({
                    question: question.value,
                    imageUrl: question.imageUrl || null,
                    updated_at: sql`NOW()`
                }).where(eq(questionTable.id, Number(questionId)));
            }

            if (options && options.length > 0) {
                const existingOptions = await tx.select({ id: optionTable.id }).from(optionTable)
                    .where(eq(optionTable.questionId, Number(questionId))).execute();

                const existingOptionIds = new Set(existingOptions.map(opt => opt.id));
                const inputOptionIds = new Set(options?.filter((opt: any) => opt.id).map((opt: any) => opt.id));

                const [currentAnswer] = await tx.select().from(answerTable).where(eq(answerTable.questionId, Number(questionId))).execute();
                if (!inputOptionIds.has(currentAnswer.optionId)) {
                    db.delete(answerTable).where(eq(answerTable.questionId, Number(questionId))).execute();
                }
                for (const opt of options) {
                    if (opt.id) {
                        await tx.update(optionTable).set({
                            value: opt.value,
                            updated_at: sql`NOW()`
                        }).where(eq(optionTable.id, opt.id));

                        existingOptionIds.delete(opt.id)
                    } else {

                        const [newOption] = await tx.insert(optionTable).values({
                            value: opt.value,
                            questionId: Number(questionId)
                        }).returning({ id: optionTable.id });

                        opt.id = newOption.id
                    }

                    if (opt.isAns) {
                        if (answerTable.optionId !== opt.id) {
                            await tx.delete(answerTable)
                                .where(eq(answerTable.questionId, Number(questionId)));

                            await tx.insert(answerTable).values({
                                questionId: Number(questionId),
                                optionId: opt.id,
                                answerDescription: answers?.[0]?.answerDescription ||
                                    (currentAnswer?.answerDescription)
                            });
                        }
                    }
                }

                const optionsToRemove = [...existingOptionIds]
                if (optionsToRemove.length > 0) {
                    await tx.delete(optionTable)
                        .where(inArray(optionTable.id, optionsToRemove));
                }
            }
            if (answers?.[0]?.answerDescription) {
                await tx
                    .update(answerTable)
                    .set({
                        answerDescription: answers[0].answerDescription,
                        updated_at: sql`NOW()`
                    })
                    .where(eq(answerTable.questionId, Number(questionId)));

            }
        });

        res.status(200).json({ message: "Question updated successfully" });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
};
