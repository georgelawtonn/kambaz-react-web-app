import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    quizzes: [] as any[],
};

const quizzesSlice = createSlice({
    name: "quizzes",
    initialState,
    reducers: {
        setQuizzes: (state, action) => {
            state.quizzes = action.payload;
        },
        addQuiz: (state, { payload: quiz }) => {
            const now = new Date().toISOString();
            const newQuiz = {
                title: quiz.title || "New Quiz",
                course: quiz.course,
                description: quiz.description || "Quiz description",
                quiz_type: quiz.quiz_type || "GRADED_QUIZ",
                points: quiz.points || 0,
                assignment_group: quiz.assignment_group || "QUIZZES",
                shuffle_answers: quiz.shuffle_answers || true,
                has_time_limit: quiz.has_time_limit || true,
                time_limit: quiz.time_limit || 20,
                multiple_attempts: quiz.multiple_attempts || false,
                attempts_allowed: quiz.attempts_allowed || 1,
                show_correct_answers: quiz.show_correct_answers || true,
                show_correct_answers_date: quiz.show_correct_answers_date || now,
                access_code: quiz.access_code || "",
                one_question_at_a_time: quiz.one_question_at_a_time || true,
                webcam_required: quiz.webcam_required || false,
                lock_questions_after_answering: quiz.lock_questions_after_answering || false,
                available_from: quiz.available_from || now,
                available_until: quiz.available_until || now,
                due: quiz.due || now,
                published: quiz.published || false,
                questions: quiz.questions || [],
            };
            state.quizzes = [...state.quizzes, newQuiz];
        },
        deleteQuiz: (state, { payload: quizId }) => {
            state.quizzes = state.quizzes.filter(
                (q: any) => q._id !== quizId
            );
        },
        updateQuiz: (state, { payload: quiz }) => {
            state.quizzes = state.quizzes.map((q: any) =>
                q._id === quiz._id ? quiz : q
            );
        },
        publishQuiz: (state, { payload: { quizId, publishState } }) => {
            state.quizzes = state.quizzes.map((q: any) =>
                q._id === quizId ? { ...q, published: publishState } : q
            );
        },
        addQuestionToQuiz: (state, { payload: { quizId, question } }) => {
            state.quizzes = state.quizzes.map((q: any) => {
                if (q._id === quizId) {
                    return {
                        ...q,
                        questions: [...q.questions, question],
                        points: q.points + (question.points || 1)
                    };
                }
                return q;
            });
        },
        updateQuestionInQuiz: (state, { payload: { quizId, question } }) => {
            state.quizzes = state.quizzes.map((q: any) => {
                if (q._id === quizId) {
                    const oldQuestion = q.questions.find((qq: any) => qq._id === question._id);
                    const pointsDifference = (question.points || 1) - (oldQuestion?.points || 1);

                    return {
                        ...q,
                        questions: q.questions.map((qq: any) =>
                            qq._id === question._id ? question : qq
                        ),
                        points: q.points + pointsDifference
                    };
                }
                return q;
            });
        },
        removeQuestionFromQuiz: (state, { payload: { quizId, questionId } }) => {
            state.quizzes = state.quizzes.map((q: any) => {
                if (q._id === quizId) {
                    const questionToRemove = q.questions.find((qq: any) => qq._id === questionId);
                    return {
                        ...q,
                        questions: q.questions.filter((qq: any) => qq._id !== questionId),
                        points: q.points - (questionToRemove?.points || 1)
                    };
                }
                return q;
            });
        }
    },
});

export const {
    setQuizzes,
    addQuiz,
    deleteQuiz,
    updateQuiz,
    publishQuiz,
    addQuestionToQuiz,
    updateQuestionInQuiz,
    removeQuestionFromQuiz
} = quizzesSlice.actions;

export default quizzesSlice.reducer;