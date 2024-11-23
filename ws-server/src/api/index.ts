import axios from "axios";
const BASE_URL = "http://localhost:4000";

export const getQuizByIdApi = async (quizId: string) => {
  try {
    const fetchQuiz = await axios.get(`${BASE_URL}/api/v1/quiz/${quizId}`);

    if (!fetchQuiz.data) {
      return { status: false, message: "Unable to fetch Quiz Data" };
    }

    return { status: true, quiz: fetchQuiz.data };
  } catch (error: any) {
    return { status: false, message: error.message };
  }
};
