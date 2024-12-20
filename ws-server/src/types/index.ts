export interface QuizStructure {
  id: string;
  heading: string;
  description: string;
  bgImageUrl: string;
  createdBy: string;
  currentQuestionIndex: number;
  questions: QuestionMap;
}

interface Question {
  problem: string;
  index: number;
  imageUrl: string;
  options: OptionsMap;
  correctAnswer: answer[];
}

interface Options {
  value: string;
}

interface answer {
  id: string;
  questionId: string;
  optionId: string;
  answerDescription: string;
}

type OptionsMap = Record<string, Options>;
type QuestionMap = Record<string, Question>;
export type QuizMap = Record<string, QuizStructure>;
