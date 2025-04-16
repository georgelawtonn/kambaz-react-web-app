import {useNavigate, useParams} from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
    addDraftQuestion,
    removeDraftQuestion,
    clearDraftQuestions, 
    addQuestionToQuiz, 
    removeQuestionFromQuiz
} from '../reducer';
import { Question, MultipleChoiceQuestion } from './QuestionTypes';

function QuestionPlaceholder({ question, onDelete }: { question: Question; onDelete: (id: string) => void }) {
    return (
        <div className="question-item mb-3 p-3 border rounded">
            <h4>{question.title} ({question.points} pts)</h4>
            <p>{question.question || "No question text yet"}</p>
            <p>Type: {question.type}</p>

            {/* Display specific content based on question type */}
            {question.type === 'multiple_choice' && (
                <div>
                    <p>Choices: {question.choices.length > 0 ?
                        question.choices.map((choice, i) => `${i+1}. ${choice}`).join(', ') :
                        'No choices added yet'}
                    </p>
                    <p>Correct Answer: {question.correctAnswer !== null ?
                        `Choice ${question.correctAnswer + 1}` :
                        'Not set'}
                    </p>
                </div>
            )}

            {question.type === 'true_false' && (
                <p>Correct Answer: {question.correctAnswer === null ?
                    'Not set' :
                    question.correctAnswer ? 'True' : 'False'}
                </p>
            )}

            {question.type === 'fill_in_blank' && (
                <div>
                    <p>Acceptable Answers: {question.answers && question.answers.length > 0 ?
                        question.answers.join(', ') :
                        'No answers added yet'}
                    </p>
                    <p>Case Sensitive: {question.caseSensitive ? 'Yes' : 'No'}</p>
                </div>
            )}

            <div className="mt-2">
                <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => { /* Handle edit */ }}
                >
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

export default function QuizQuestionsContainer() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cid, qid } = useParams();

    // Get draft questions from Redux
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

    const handleAddQuestion = () => {
        // Create new question as draft
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

    const handleDeleteQuestion = (questionId: string) => {
        if (isNewQuiz) { // Remove from draft questions
            dispatch(removeDraftQuestion(questionId));
        } else { // Remove from redux quiz list of questions
            dispatch(removeQuestionFromQuiz(questionId));
        }
    };

    const handleSave = async () => {
        if (!cid) return;
        /* hmmm not sure what to do here
        if (qid === 'new') {
            const newQuiz = await coursesClient.createQuizForCourse(cid, quizData);
            dispatch(addQuiz(newQuiz));
        } else {
            await quizzesClient.updateQuiz(quizData);
            dispatch(updateQuiz(quizData));
        }
        */
        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    }

    const handleCancel = () => {
        dispatch(clearDraftQuestions());
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/view`);
        // not sure if this is good ? Quizzes/new/view ?
        // if not, then either:
        //     navigate(`/Kambaz/Courses/${cid}/Quizzes`);
        // or pass activeTab from quizEditor down and change it to 'details'
    }

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
                        <QuestionPlaceholder
                            key={question.id}
                            question={question}
                            onDelete={handleDeleteQuestion}
                        />
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
