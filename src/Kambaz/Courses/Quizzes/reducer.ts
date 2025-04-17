import { createSlice } from "@reduxjs/toolkit";
import {Question} from "./Questions/QuestionTypes.tsx";
import {v4 as uuidv4} from "uuid";

const initialState = {
    quizzes: [] as any[],
    draftQuestions: [] as Question[],
};

const quizzesSlice = createSlice({
    name: "quizzes",
    initialState,
    reducers: {
        setQuizzes: (state, action) => {
            state.quizzes = action.payload;
        },
        addQuiz: (state, { payload: quiz }) => {
            console.log("new quiz id (from reducer): " + quiz._id)
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
            console.log("in reducer:" + quizId, question);
            state.quizzes = state.quizzes.map((q: any) => {
                if (q._id === quizId) {
                    console.log("adding...");
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
            state.quizzes = state.quizzes.map((quiz: any) => {
                if (quiz._id === quizId) {
                    // calculate new points
                    const oldQuestion = quiz.questions.find((q: any) => q._id === question._id);
                    const pointsDifference = (question.points || 1) - (oldQuestion?.points || 1);

                    return {
                        ...quiz,
                        questions: quiz.questions.map((q: any) =>
                            q._id === question._id ? question : q
                        ),
                        points: quiz.points + pointsDifference
                    };
                }
                return quiz;
            });
        },
        removeQuestionFromQuiz: (state, { payload: { quizId, question } }) => {
            state.quizzes = state.quizzes.map((q: any) => {
                if (q._id === quizId) {
                    const questionToRemove = q.questions.find((qq: any) => qq._id === question.id);
                    return {
                        ...q,
                        questions: q.questions.filter((qq: any) => qq._id !== question.id),
                        points: q.points - (questionToRemove?.points || 1)
                    };
                }
                return q;
            });
        },

        addDraftQuestion: (state, { payload: question }) => {
            state.draftQuestions.push(question);
        },

        updateDraftQuestion: (state, { payload: question }) => {
            state.draftQuestions = state.draftQuestions.map((q) =>
                q.id === question.id ? question : q
            );
        },

        removeDraftQuestion: (state, { payload: question }) => {
            state.draftQuestions = state.draftQuestions.filter((q: any) => q.id !== question.id);
        },

        clearDraftQuestions: (state) => {
            state.draftQuestions = [];
        },

        // Convert all to drafts when starting editing
        // Add this to your reducer slice
        convertQuizToDrafts: (state, { payload: quizId }) => {
            // Find the quiz to convert
            const quizIndex = state.quizzes.findIndex((q) => q._id === quizId);

            if (quizIndex !== -1 && state.quizzes[quizIndex].questions) {
                const quiz = state.quizzes[quizIndex];

                // Calculate points to subtract from the quiz
                const pointsToSubtract = quiz.questions.reduce(
                    (sum: number, question: any) => sum + (question.points || 1),
                    0
                );

                // Convert all quiz questions to drafts by setting isDraft: true
                const draftQuestions = quiz.questions.map((question: Question) => ({
                    ...question,
                    isDraft: true,
                    // Generate a new ID for each draft to avoid collisions
                    id: uuidv4()
                }));

                // Add converted questions to draftQuestions
                state.draftQuestions = [
                    ...state.draftQuestions,
                    ...draftQuestions
                ];

                // Remove questions from the quiz and update points
                state.quizzes[quizIndex] = {
                    ...quiz,
                    questions: [], // Remove all questions
                    points: quiz.points - pointsToSubtract // Update points
                };

                console.log("Converted quiz questions to drafts:");
                console.log(draftQuestions);
            }
        },
        
        // Add a helper action to transfer draft questions to a real quiz
        transferDraftQuestionsToQuiz: (state, { payload: quizId }) => {
            // Find the quiz to update
            const quizIndex = state.quizzes.findIndex((q: any) => q._id === quizId);
            if (quizIndex !== -1) {
                // Calculate additional points
                const additionalPoints = state.draftQuestions.reduce(
                    (sum: number, question: any) => sum + (question.points || 1),
                    0
                );

                // Convert draft questions to non-draft by setting isDraft to false
                const convertedQuestions = state.draftQuestions.map(question => ({
                    ...question,
                    isDraft: false
                }));
                
                // Add all draft questions to the quiz
                state.quizzes[quizIndex] = {
                    ...state.quizzes[quizIndex],
                    questions: [
                        ...state.quizzes[quizIndex].questions,
                        ...convertedQuestions
                    ],
                    points: state.quizzes[quizIndex].points + additionalPoints
                };
                
                // Clear the draft questions
                state.draftQuestions = [];

                console.log("LOGGING SPREE")
                console.log(state.quizzes[quizIndex].questions)
                console.log(state.quizzes[quizIndex].questions.length)
            }
        }
    },
});

export const {
    setQuizzes,
    addQuiz,
    deleteQuiz,
    updateQuiz,
    publishQuiz,
    // question actions
    addQuestionToQuiz,
    updateQuestionInQuiz,
    removeQuestionFromQuiz,
    addDraftQuestion,
    updateDraftQuestion,
    removeDraftQuestion,
    clearDraftQuestions,
    transferDraftQuestionsToQuiz,
    convertQuizToDrafts
} = quizzesSlice.actions;

export default quizzesSlice.reducer;