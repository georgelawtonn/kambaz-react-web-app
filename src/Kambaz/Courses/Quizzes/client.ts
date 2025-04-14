import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;
const QUESTIONS_API = `${REMOTE_SERVER}/api/questions`;

export const updateQuiz = async (quiz: any) => {
    const { data } = await axiosWithCredentials.put(
        `${QUIZZES_API}/${quiz._id}`,
        quiz
    );
    return data;
};

export const deleteQuiz = async (quizId: string) => {
    const { data } = await axiosWithCredentials.delete(
        `${QUIZZES_API}/${quizId}`
    );
    return data;
};

export const findQuizById = async (quizId: string) => {

    const { data } = await axiosWithCredentials.get(
        `${QUIZZES_API}/${quizId}`
    );
    return data;
};

export const publishQuiz = async (quizId: string, publishState: boolean) => {
    const { data } = await axiosWithCredentials.put(
        `${QUIZZES_API}/${quizId}/publish`,
        { publishState }
    );
    return data;
};

export const createQuestionForQuiz = async (quizId: string, question: any) => {
    const { data } = await axiosWithCredentials.post(
        `${QUIZZES_API}/${quizId}/questions`,
        question
    );
    return data;
};

export const findQuestionsForQuiz = async (quizId: string) => {
    const { data } = await axiosWithCredentials.get(
        `${QUIZZES_API}/${quizId}/questions`
    );
    return data;
};

export const updateQuestion = async (question: any) => {
    const { data } = await axiosWithCredentials.put(
        `${QUESTIONS_API}/${question._id}`,
        question
    );
    return data;
};

export const deleteQuestion = async (questionId: string) => {
    const { data } = await axiosWithCredentials.delete(
        `${QUESTIONS_API}/${questionId}`
    );
    return data;
};