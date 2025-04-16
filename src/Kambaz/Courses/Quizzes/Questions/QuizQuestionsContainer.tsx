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
import {Question, MultipleChoiceQuestion, TrueFalseQuestion} from './QuestionTypes';
import MCQuestionComponent from "./MCQuestionComponent.tsx";
import TFQuestionComponent from "./TFQuestionComponent.tsx";

// Placeholder component before a question is edited and made into one of the 3 (MC, TF, FIB)
function QuestionPlaceholder({ question, onDelete }: { question: Question; onDelete: (id: string) => void }) {
    return (
        <div className="question-item mb-3 p-3 border rounded">
            <h4>{question.title} ({question.points} pts)</h4>
            <p>{question.question || "No question text yet"}</p>
            <p>Type: {question.type}</p>

            <p>PLACEHOLDER QUESTION</p>

            <div className="mt-2">
                <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => { /* Handle edit */ }}>
                    Edit
                </Button>
                <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onDelete(question.id)}>
                    Delete
                </Button>
            </div>
        </div>
    );
}

export default function QuizQuestionsContainer({quizData}: { quizData: any; }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cid, qid } = useParams();

    // get draft questions from Redux
    const draftQuestions = useSelector((state: any) => state.quizzesReducer.draftQuestions);

    // Get the actual quiz if we're editing an existing one
    const quiz = useSelector((state: any) =>
        qid !== 'new' ? state.quizzesReducer.quizzes.find((q: any) => q._id === qid) : null
    );

    // Determine which questions to display based on if we're editing a new or existing quiz
    const isNewQuiz = qid === 'new';
    const displayQuestions = isNewQuiz ? draftQuestions : (quiz?.questions || []);

    // Calculate total points
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
        // Create new question as draft (multiple choice default)
        /*
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
         */

        // remove this and do ^^
        const newQuestion: TrueFalseQuestion = {
            id: Date.now().toString(),
            title: `Question ${draftQuestions.length + 1 || 1}`,
            type: 'true_false',
            points: 1,
            question: '',
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
        if (isNewQuiz) { // Remove from draft questions
            dispatch(removeDraftQuestion(questionId));
        } else { // Remove from redux quiz list of questions
            dispatch(removeQuestionFromQuiz(questionId));
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

    const renderQuestionComponent = (question: Question) => {
        switch (question.type) {
            case 'multiple_choice':
                return (
                    <MCQuestionComponent
                        key={question.id}
                        question={question as MultipleChoiceQuestion}
                        onDelete={handleDeleteQuestion}
                        onEdit={handleEditQuestion}
                        onSave={handleSaveQuestion}
                        onCancel={handleCancelEdit}
                    />
                );
            case 'true_false':
                return (
                    <TFQuestionComponent
                        key={question.id}
                        question={question as TrueFalseQuestion}
                        onDelete={handleDeleteQuestion}
                        onEdit={handleEditQuestion}
                        onSave={handleSaveQuestion}
                        onCancel={handleCancelEdit}/>
                )
            default:
                return (
                    <QuestionPlaceholder
                        key={question.id}
                        question={question}
                        onDelete={handleDeleteQuestion}
                        // onEdit={handleEditQuestion}
                    />
                );
        }
    };

    /*
// Clear drafts when component unmounts (optional)
React.useEffect(() => {
    // If we're creating a new quiz, clear drafts when component unmounts
    return () => {
        if (isNewQuiz) {
            // Uncomment this if you want to clear drafts on unmount
            // dispatch(clearDraftQuestions());
        }
    };
}, [isNewQuiz, dispatch]);
*/
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

// TODO: add save & cancel buttons
// -- cancel, remove all drafts, navigate to quizzes
// -- save, push all drafts to quiz? create new quiz id?, navigate back
// TODO: alert when leaving (save or cancel?)
