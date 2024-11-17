import { Request, Response } from "express";
import { db } from "../db";
import { and, desc, eq, sql } from "drizzle-orm";
import { quizTable } from "../db/schema";

export const getAllQuiz = async (req: Request, res: Response) => {
    const userId = req.user.id;

    try {
        const quiz = await db.select().from(quizTable).where(eq(quizTable.createdBy, userId)).execute();

        if(!quiz || quiz.length == 0){
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
            success: false,
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

export const addQuestionIntoQuiz = (req: Request, res: Response) => {
    
}

export const editQuizMetaData = async (req: Request, res: Response) => {
    const {heading, description, bgImageUrl} = req.body
    const {quizId} = req.params;

    try {

        if(!heading || !description || !bgImageUrl){            
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
            .returning({id: quizTable.id});

        res.status(202).json({
            success: true,
            data: updatedQuiz
        });
        return;
        
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Something wronf with updating quix data'
        });
        return;
    }
}