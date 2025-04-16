import {useNavigate, useParams} from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
    addDraftQuestion,
    removeDraftQuestion,
    clearDraftQuestions,
    removeQuestionFromQuiz,
    addQuiz,
    transferDraftQuestionsToQuiz,
    updateQuestionInQuiz,
    updateDraftQuestion,
    addQuestionToQuiz
} from '../reducer';
import * as coursesClient from "../../client.ts";
import {Question, MultipleChoiceQuestion, TrueFalseQuestion, BaseQuestion, FillInBlankQuestion} from './QuestionTypes';
import MCQuestionComponent from "./MCQuestionComponent.tsx";
import TFQuestionComponent from "./TFQuestionComponent.tsx";
import QuestionTypeSelector from "./QuestionTypeSelector.tsx";
import React from "react";
import FIBQuestionComponent from "./FIBQuestionComponent.tsx";

// Main component that holds all questions, and manages communication with redux
export default function QuizQuestionsEditor({quizData}: { quizData: any; }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cid, qid } = useParams();

    // get draft questions from Redux
    const draftQuestions = useSelector((state: any) => state.quizzesReducer.draftQuestions);

    // get the actual quiz if editing an existing one
    const quiz = useSelector((state: any) =>
        qid !== 'new' ? state.quizzesReducer.quizzes.find((q: any) => q._id === qid) : null
    );

    // determine which questions to display based on if quiz is new or not
    const isNewQuiz = qid === 'new';
    const displayQuestions = isNewQuiz ? draftQuestions : (quiz?.questions || []);

    // calculate total points
    const totalPoints = displayQuestions.reduce((sum: number, q: any) => sum + (q.points || 1), 0);

    // helper function to update question
    const pushQuestionUpdate = async (question: Question) => {
        if (isNewQuiz) { // update depending on if new quiz
            dispatch(updateDraftQuestion(question));
        } else {
            dispatch(updateQuestionInQuiz(question));
        }
    }

    // when the whole list of questions is saved
    const handleSave = async () => {
        if (!cid) return;

        if (isNewQuiz) {
            const newQuiz = await coursesClient.createQuizForCourse(cid!, quizData);
            dispatch(addQuiz(newQuiz));
            dispatch(transferDraftQuestionsToQuiz(qid));
            dispatch(clearDraftQuestions()); // remove drafts (they've been pushed)
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
    }

    // when '+ new question' is clicked
    const handleAddQuestion = () => {
        const newQuestion: MultipleChoiceQuestion = {
            id: Date.now().toString(),
            title: `Question ${draftQuestions.length + 1 || 1}`,
            type: 'multiple_choice',
            points: 1,
            question: '',
            choices: [],
            correctAnswer: null,
            isEditing: false
        };

        if (isNewQuiz) { // Add to draft questions
            dispatch(addDraftQuestion(newQuestion));
        } else { // Add to redux quiz list of questions
            dispatch(addQuestionToQuiz(newQuestion));
        }
    };

    // when 'Delete' is clicked, for a specific question
    const handleDeleteQuestion = (questionId: string) => {
        const q = displayQuestions.find((q: Question) => q.id === questionId);
        if (isNewQuiz) { // Remove from draft questions
            dispatch(removeDraftQuestion(q));
        } else { // Remove from redux quiz list of questions
            dispatch(removeQuestionFromQuiz(q));
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
            console.log(questionId, updatedQuestion.isEditing);

            pushQuestionUpdate(updatedQuestion);
        }
    };

    // when cancelling editing for a specific question
    const handleCancelEdit = (question: Question) => {
        const updatedQuestionNotEditing = { // remove editing state
            ...question,
            isEditing: false
        }
        pushQuestionUpdate(updatedQuestionNotEditing);
    };

    // when 'Save' for an individual question is clicked (in editing mode)
    const handleSaveQuestion = (updatedQuestion: Question) => {
        const updatedQuestionNotEditing = { // remove editing state
            ...updatedQuestion,
            isEditing: false
        }
        pushQuestionUpdate(updatedQuestionNotEditing);
    };

    // To swap between question components (when using dropdown selector)
    const handleQuestionTypeChange = (questionId: string, newType: 'multiple_choice' | 'true_false' | 'fill_in_blank') => {
        // Find current question
        const question = isNewQuiz
            ? draftQuestions.find((q: Question) => q.id === questionId) // if in drafts
            : quiz.questions.find((q: Question) => q.id === questionId); // if in quiz

        if (!question) return;

        // Extract base properties from the existing question
        const baseProps: BaseQuestion = {
            id: question.id,
            title: question.title,
            type: newType, // Update the type
            points: question.points,
            question: question.question,
            isEditing: question.isEditing
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
                    answers: [],
                    caseSensitive: false
                };
                break;
        }

        // Replace the question in the appropriate state
        pushQuestionUpdate(convertedQuestion);
    };

    // Figures out which question component to render
    const renderQuestionComponent = (question: Question) => {
        switch (question.type) {
            case 'multiple_choice':
                return (
                    <div className="question-container">
                        <QuestionTypeSelector
                            currentType={question.type}
                            onTypeChange={(newType) => handleQuestionTypeChange(question.id, newType)}
                        />
                        <MCQuestionComponent
                            key={question.id}
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
                    <div className="question-container">
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
                return (<div className="question-container">
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
    React.useEffect(() => {
        return () => {
            if (isNewQuiz) {
                dispatch(clearDraftQuestions());
            }
        };
    }, [isNewQuiz, dispatch]);

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
