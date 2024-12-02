import axios from "axios";
const BASE_URL = "http://localhost:4000";

export const getQuizByIdApi = async (quizId: string, authToken?: string) => {
  console.log(`Fetching Quiz`, quizId);
  console.log(`Auth Token`, authToken);
  try {
    const fetchQuiz = await axios.get(`${BASE_URL}/api/v1/quiz/${quizId}`, {
      headers: {
        Cookie: `jwt=${authToken}`,
      },
    });

    if (!fetchQuiz.data) {
      return { status: false, message: "Unable to fetch Quiz Data" };
    }

    return { status: true, quiz: fetchQuiz.data };
  } catch (error: any) {
    console.log(`Error`, error.message);
    return { status: false, message: error.message };
  }
};
