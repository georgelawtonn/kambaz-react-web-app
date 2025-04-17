import {useNavigate, useParams} from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
    addDraftQuestion,
    removeDraftQuestion,
    clearDraftQuestions,
    removeQuestionFromQuiz,
    addQuiz,
    updateDraftQuestion,
    addQuestionToQuiz,
    transferDraftQuestionsToQuiz,
    updateQuestionInQuiz,
    convertQuizToDrafts, setDraftQuestions
} from '../reducer';
import {v4 as uuidv4} from "uuid";


import * as quizzesClient from "../../Quizzes/client.ts";
import * as coursesClient from "../../client.ts";
import {Question, MultipleChoiceQuestion, TrueFalseQuestion, BaseQuestion, FillInBlankQuestion} from './QuestionTypes';
import MCQuestionComponent from "./MCQuestionComponent.tsx";
import TFQuestionComponent from "./TFQuestionComponent.tsx";
import QuestionTypeSelector from "./QuestionTypeSelector.tsx";
import {useEffect} from "react";
import FIBQuestionComponent from "./FIBQuestionComponent.tsx";
import {syncQuestionsForQuiz} from "../client.ts";

// Main component that holds all questions, and manages communication with redux
export default function QuizQuestionsEditor({quizData}: { quizData: any; }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cid, qid } = useParams();

    /*
    // get draft questions from Redux
    const draftQuestions = useSelector((state: any) => state.quizzesReducer.draftQuestions);

    // get the actual quiz if editing an existing one
    const quiz = useSelector((state: any) =>
        qid !== 'new' ? state.quizzesReducer.quizzes.find((q: any) => q._id === qid) : null
    );

    // determine if it's a new quiz
    const isNewQuiz = qid === 'new';

    // combine both sources of questions (drafts and existing quiz questions)
    const displayQuestions: Question[] = [
        ...(isNewQuiz ? [] : (quiz?.questions || [])),  // Include quiz questions if not a new quiz
        ...draftQuestions                                // Always include draft questions
    ];
     */

    // Determine if it's a new quiz
    const isNewQuiz = qid === 'new';

    // Get the actual quiz if editing an existing one
    const quiz = useSelector((state: any) =>
        qid !== 'new' ? state.quizzesReducer.quizzes.find((q: any) => q._id === qid) : null
    );

    // When component first loads, convert quiz questions to drafts if editing existing quiz
    useEffect(() => {
        if (!isNewQuiz && quiz && quiz._id) {
            // Check if we have any quiz questions
            if (quiz.questions && quiz.questions.length > 0) {
                // Convert quiz questions to drafts
                dispatch(convertQuizToDrafts(quiz._id));
            }
        }
        
    }, [isNewQuiz, quiz, dispatch]);
    
    const displayQuestions = useSelector((state: any) => state.quizzesReducer.draftQuestions);
    
    // calculate total points
    const totalPoints = displayQuestions.reduce((sum: number, q: any) => sum + (q.points || 1), 0);


    const convertQuestionForDB = (question : any, quizId: any) => {
        const baseFields = {
            _id: question.id,
            title: question.title,
            type: question.type,
            points: question.points,
            question: question.question,
            quiz: quizId
        };

        switch (question.type) {
            case 'multiple_choice':
                return {
                    ...baseFields,
                    choices: question.choices,
                    multipleChoiceAnswer: question.correctAnswer
                };
            case 'true_false':
                return {
                    ...baseFields,
                    trueFalseAnswer: question.correctAnswer
                };
            case 'fill_in_blank':
                return {
                    ...baseFields,
                    answers: question.answers
                };
            default:
                throw new Error(`Unknown question type: ${question.type}`);
        }
    };


    // when the whole list of questions is saved
    const handleSave = async () => {
        if (!cid) return;
        if (isNewQuiz) {
            const newQuiz = await coursesClient.createQuizForCourse(cid, quizData);
            const newQuizId = newQuiz._id;
            console.log("new qid (handleSave): " + newQuizId);

            dispatch(addQuiz(newQuiz));

            const dbQuestions = displayQuestions.map((q : any) => convertQuestionForDB(q, newQuizId));
            await syncQuestionsForQuiz(newQuizId, dbQuestions);

            setTimeout(() => {
                dispatch(transferDraftQuestionsToQuiz(newQuiz._id));
                dispatch(clearDraftQuestions()); // remove drafts (they've been pushed)
            }, 150); // this is bad code, but the better solution is overcomplicated
        }
        else {
            const dbQuestions = displayQuestions.map((q : any) => convertQuestionForDB(q, qid));

            await syncQuestionsForQuiz(qid, dbQuestions);

            dispatch(transferDraftQuestionsToQuiz(qid));
            dispatch(clearDraftQuestions());
        }

        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    }


    // when the whole list of questions is cancelled
    const handleCancel = () => {
        dispatch(clearDraftQuestions());
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/view`);
        // not sure if this is good ? Quizzes/new/view ?
        // if not, then either:
        //     navigate(`/Kambaz/Courses/${cid}/Quizzes`);
        // or pass activeTab from quizEditor down and change it to 'details'

        // also, I could just not clear it yet, and have it still transfer all drafts to quiz when "save" in details is clicked
    }

    // when '+ new question' is clicked
    const handleAddQuestion = () => {
        const newQuestion: MultipleChoiceQuestion = {
            id: uuidv4(),
            title: `Question ${displayQuestions.length + 1 || 1}`,
            type: 'multiple_choice',
            points: 1,
            question: '',
            choices: [],
            correctAnswer: null,
            isEditing: false,
            isDraft: true
        };
        
        if (newQuestion.isDraft) { // Add to draft questions
            dispatch(addDraftQuestion(newQuestion));
        } else { // Add to redux quiz list of questions (it probably should make a new draft and remove old, but tbd)
            dispatch(addQuestionToQuiz(newQuestion));
        }
    };

    // when 'Delete' is clicked, for a specific question
    const handleDeleteQuestion = (questionId: string) => {
        const q = displayQuestions.find((q: Question) => q.id === questionId);
        console.log("questionId: " + questionId);
        if (q) {
            if (q.isDraft) { // Remove from draft questions
                console.log("is draft")
                dispatch(removeDraftQuestion(q));
            } else { // Remove from redux quiz list of questions
                console.log("is not draft")
                dispatch(removeQuestionFromQuiz(q));
            }
        }
    };

    // when 'Edit' on a specific question is clicked (toggle editing state)
    const handleEditQuestion = (questionId: string) => {
        const questionToEdit = displayQuestions.find((q: Question) => q.id === questionId);

        if (questionToEdit) {
            console.log(questionId, questionToEdit.isEditing);
            const updatedQuestion = {
                ...questionToEdit,
                isEditing: !questionToEdit.isEditing
            };

            if (updatedQuestion.isDraft) {
                dispatch(updateDraftQuestion(updatedQuestion));
            } else {
                dispatch(updateQuestionInQuiz(updatedQuestion));
            }
        }
    };

    // when cancelling editing for a specific question
    const handleCancelEdit = (question: Question) => {
        const updatedQuestionNotEditing = { // remove editing state
            ...question,
            isEditing: false
        }
        dispatch(updateDraftQuestion(updatedQuestionNotEditing));
    };

    // when 'Save' for an individual question is clicked (in editing mode)
    const handleSaveQuestion = (updatedQuestion: Question) => {
        const updatedQuestionNotEditing = { // remove editing state
            ...updatedQuestion,
            isEditing: false
        }
        if (updatedQuestionNotEditing.isDraft) {
            dispatch(updateDraftQuestion(updatedQuestionNotEditing));
        } else {
            dispatch(updateQuestionInQuiz(updatedQuestionNotEditing));
        }
    };

    // To swap between question components (when using dropdown selector)
    const handleQuestionTypeChange = (questionId: string, newType: 'multiple_choice' | 'true_false' | 'fill_in_blank') => {
        // Find current question
        const question = displayQuestions.find((q: Question) => q.id === questionId)

        if (!question) return;

        // Extract base properties from the existing question
        const baseProps: BaseQuestion = {
            id: question.id,
            title: question.title,
            type: newType, // Update the type
            points: question.points,
            question: question.question,
            isEditing: question.isEditing,
            isDraft: question.isDraft
        };

        // Create a new question of the target type
        let convertedQuestion: Question;

        switch (newType) {
            case 'multiple_choice':
                convertedQuestion = {
                    ...baseProps,
                    type: 'multiple_choice',
                    choices: [],
                    correctAnswer: null
                };
                break;
            case 'true_false':
                convertedQuestion = {
                    ...baseProps,
                    type: 'true_false',
                    correctAnswer: null
                };
                break;
            case 'fill_in_blank':
                convertedQuestion = {
                    ...baseProps,
                    type: 'fill_in_blank',
                    answers: []
                };
                break;
        }

        // Replace the question in the appropriate state
        dispatch(updateDraftQuestion(convertedQuestion));
    };

    // Figures out which question component to render
    const renderQuestionComponent = (question: Question) => {
        switch (question.type) {
            case 'multiple_choice':
                return (
                    <div className="question-container" key={question.id}>
                        <QuestionTypeSelector
                            currentType={question.type}
                            onTypeChange={(newType) => handleQuestionTypeChange(question.id, newType)}
                        />
                        <MCQuestionComponent
                            question={question as MultipleChoiceQuestion}
                            onDelete={handleDeleteQuestion}
                            onEdit={handleEditQuestion}
                            onSave={handleSaveQuestion}
                            onCancel={handleCancelEdit}
                        />
                    </div>
                );
            case 'true_false':
                return (
                    <div className="question-container" key={question.id}>
                        <QuestionTypeSelector
                            currentType={question.type}
                            onTypeChange={(newType) => handleQuestionTypeChange(question.id, newType)}
                        />
                        <TFQuestionComponent
                            key={question.id}
                            question={question as TrueFalseQuestion}
                            onDelete={handleDeleteQuestion}
                            onEdit={handleEditQuestion}
                            onSave={handleSaveQuestion}
                            onCancel={handleCancelEdit}/>
                    </div>
                )
            case 'fill_in_blank':
                return (<div className="question-container" key={question.id}>
                    <QuestionTypeSelector
                        currentType={question.type}
                        onTypeChange={(newType) => handleQuestionTypeChange(question.id, newType)}
                    />
                    <FIBQuestionComponent
                        key={question.id}
                        question={question as FillInBlankQuestion}
                        onDelete={handleDeleteQuestion}
                        onEdit={handleEditQuestion}
                        onSave={handleSaveQuestion}
                        onCancel={handleCancelEdit}
                    />
                </div>);
        }
    };

    // Clear drafts when leaving page

    // React.useEffect(() => {
    //     return () => {
    //         if (isNewQuiz) {
    //             dispatch(clearDraftQuestions());
    //         }
    //     };
    // }, [isNewQuiz, dispatch]);

    const convertDBQuestionToRedux = (dbQuestion : any) => {
        const baseQuestion = {
            id: dbQuestion._id,
            title: dbQuestion.title,
            type: dbQuestion.type,
            points: dbQuestion.points,
            question: dbQuestion.question,
            isEditing: false,
            isDraft: true
        };

        switch (dbQuestion.type) {
            case 'multiple_choice':
                return {
                    ...baseQuestion,
                    choices: dbQuestion.choices || [],
                    correctAnswer: dbQuestion.multipleChoiceAnswer
                };
            case 'true_false':
                return {
                    ...baseQuestion,
                    correctAnswer: dbQuestion.trueFalseAnswer
                };
            case 'fill_in_blank':
                return {
                    ...baseQuestion,
                    answers: dbQuestion.answers || []
                };
            default:
                console.warn(`Unknown question type: ${dbQuestion.type}`);
                return baseQuestion;
        }
    };

    const fetchQuestions = async () => {
        const dbQuestions = await quizzesClient.findQuestionsForQuiz(qid as string);
        const reduxQuestions = dbQuestions.map((q : any) => convertDBQuestionToRedux(q));
        dispatch(setDraftQuestions(reduxQuestions));
    };
    useEffect(() => {
        fetchQuestions();
    }, [qid]);


    return (
        <div className="quiz-questions-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Questions</h3>
                <div>
                    <span className="me-3">
                        Total Points: {totalPoints}
                    </span>
                </div>
            </div>

            {/* Display questions if available */}
            {displayQuestions.length > 0 && (
                <div className="questions-list">
                    {displayQuestions.map((question: Question) => (
                        renderQuestionComponent(question)
                    ))}
                </div>
            )}

            {/* Add new question button */}
            <div className="text-center py-5">
                <Button
                    variant="secondary"
                    size="lg"
                    className="me-1"
                    onClick={handleAddQuestion}>
                    + New Question
                </Button>
            </div>

            {/* Save & Cancel buttons */}
            <Button variant="danger" size="lg" className="me-1 float-end" id="wd-add-module-btn"
                    onClick={handleSave}>
                Save
            </Button>
            <Button variant="secondary" size="lg" className="me-1 float-end" id="wd-view-progress"
                    onClick={handleCancel}>
                Cancel
            </Button>
        </div>
    );
}

// TODO: alert when leaving (save or cancel?)
