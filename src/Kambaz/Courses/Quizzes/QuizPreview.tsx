import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {Button, Form} from 'react-bootstrap';
import FacultyProtected from '../../Account/FacultyProtected';
import {Question, MultipleChoiceQuestion, TrueFalseQuestion, FillInBlankQuestion} from './Questions/QuestionTypes';
import './QuizPreview.css';
import {findQuestionsForQuiz} from './client';
import * as userClient from "../../Account/client.ts";

export default function QuizPreview() {
    const navigate = useNavigate();
    const {cid, qid} = useParams();

    // Get the quiz from Redux store
    const quiz = useSelector((state: any) =>
        state.quizzesReducer.quizzes.find((q: any) => q._id === qid)
    );

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [studentAnswers, setStudentAnswers] = useState<Record<string, any>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

    const loadQuizQuestions = async () => {
        if (!qid) return;
        try {
            setIsLoading(true);
            const questionData = await findQuestionsForQuiz(qid);
            const convertedQuestions = questionData.map((q : any) => convertDBQuestionToRedux(q));
            setQuestions(convertedQuestions);
        } catch (error) {
            console.error("Error loading questions:", error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        loadQuizQuestions();
    }, [qid]);


    useEffect(() => {
        if (quiz && quiz.questions) {
            const initialAnswers: Record<string, any> = {};
            quiz.questions.forEach((q: any) => {
                initialAnswers[q] = null;
            });
            setStudentAnswers(initialAnswers);
        }
    }, [quiz]);

    // If quiz isn't loaded yet
    if (!quiz || isLoading) {
        return <div>Loading quiz...</div>;
    }

    // If no questions in the quiz
    if (!quiz.questions || quiz.questions.length === 0) {
        return (
            <div className="quiz-preview-container">
                <div className="alert alert-warning">
                    This quiz doesn't have any questions yet.
                </div>
                <FacultyProtected>
                    <Button
                        variant="primary"
                        onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`)}
                    >
                        Add Questions
                    </Button>
                </FacultyProtected>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    // Handle selecting an answer for multiple choice
    const handleMultipleChoiceAnswer = (questionId: string, choiceIndex: number) => {
        if (isSubmitted) return; // Don't allow changes after submission

        setStudentAnswers(prev => ({
            ...prev,
            [questionId]: choiceIndex
        }));
    };

    // Handle selecting an answer for true/false
    const handleTrueFalseAnswer = (questionId: string, isTrue: boolean) => {
        if (isSubmitted) return; // Don't allow changes after submission

        setStudentAnswers(prev => ({
            ...prev,
            [questionId]: isTrue
        }));
    };

    // Handle text input for fill-in-blank
    const handleFillInBlankAnswer = (questionId: string, value: string) => {
        if (isSubmitted) return; // Don't allow changes after submission

        setStudentAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    // Navigate to next question
    const handleNextQuestion = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    // Navigate to previous question
    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    // Submit the quiz for grading
    const handleSubmit = async () => {
        if (!qid) return;
        // Calculate score
        let totalPoints = 0;
        let earnedPoints = 0;
        const gradedAnswers: any[] = [];

        questions.forEach((question: Question) => {
            const questionPoints = question.points || 1;
            totalPoints += questionPoints;

            const userAnswer = studentAnswers[question.id];
            let isCorrect = false;
            switch (question.type) {
                case 'multiple_choice':
                    const mcQuestion = question as MultipleChoiceQuestion;
                    // Convert both to same type for comparison (to number)
                    isCorrect = userAnswer !== null && Number(userAnswer) === Number(mcQuestion.correctAnswer);
                    break;

                case 'true_false':
                    const tfQuestion = question as TrueFalseQuestion;
                    // Handle both string and boolean representations
                    if (typeof userAnswer === 'string') {
                        isCorrect = (userAnswer.toLowerCase() === 'true') === tfQuestion.correctAnswer;
                    } else {
                        isCorrect = userAnswer === tfQuestion.correctAnswer;
                    }
                    break;

                case 'fill_in_blank':
                    const fibQuestion = question as FillInBlankQuestion;
                    // For fill-in-blank, compare with all possible answers (case-insensitive)
                    if (userAnswer !== null && userAnswer !== undefined && fibQuestion.answers) {
                        isCorrect = fibQuestion.answers.some(answer =>
                            String(userAnswer).toLowerCase() === answer.toLowerCase()
                        );
                    }
                    break;
            }

            const pointsEarned = isCorrect ? questionPoints : 0;
            earnedPoints += pointsEarned;

            const answerObject = {
                question: question.id,
                isCorrect: isCorrect,
                pointsEarned: pointsEarned,
                textAnswers: null,
                selectedChoiceIndex: null,
                trueFalseAnswer: null
            };
            console.log(answerObject);
            if (question.type === 'multiple_choice') {
                answerObject.selectedChoiceIndex = userAnswer;
            } else if (question.type === 'true_false') {
                answerObject.trueFalseAnswer = userAnswer;
            } else if (question.type === 'fill_in_blank') {
                answerObject.textAnswers = userAnswer;
            }
            gradedAnswers.push(answerObject);
        });

        const finalScore = Math.round((earnedPoints / totalPoints) * 100);
        setScore(finalScore);
        setIsSubmitted(true);


        const attemptData = {
            answers: gradedAnswers,
            score: earnedPoints // Store the raw points, not the percentage
        };

        await userClient.createOrUpdateAttempt("current", qid, attemptData);
    };

    // Return to editing
    const handleKeepEditing = () => {
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`);
    };

    // Render the current question
    const renderCurrentQuestion = () => {
        const question = currentQuestion;
        const answer = studentAnswers[question.id];

        // Check if the answer is correct (when submitted)
        const isQuestionCorrect = isSubmitted && answer !== null && (() => {
            switch (question.type) {
                case 'multiple_choice':
                    const mcQuestion = question as MultipleChoiceQuestion;
                    return answer === mcQuestion.correctAnswer;
                case 'true_false':
                    const tfQuestion = question as TrueFalseQuestion;
                    return answer === tfQuestion.correctAnswer;
                case 'fill_in_blank':
                    const fibQuestion = question as FillInBlankQuestion;
                    return fibQuestion.answers.some(a => a.toLowerCase() === answer.toLowerCase());
                default:
                    return false;
            }
        })();

        return (
            <div className={`question ${isSubmitted ? (isQuestionCorrect ? 'correct' : 'incorrect') : ''}`}>
                <div className="question-header">
                    <h3>{question.title || `Question ${currentQuestionIndex + 1}`}</h3>
                    <span className="points">{question.points || 1} pts</span>
                </div>

                <div className="question-text" dangerouslySetInnerHTML={{__html: question.question}}></div>

                {question.type === 'multiple_choice' && (
                    <div className="choices-container">
                        {(question as MultipleChoiceQuestion).choices.map((choice, choiceIndex) => (
                            <Form.Check
                                key={choiceIndex}
                                type="radio"
                                id={`mc-${question.id}-${choiceIndex}`}
                                label={choice}
                                checked={answer === choiceIndex}
                                onChange={() => handleMultipleChoiceAnswer(question.id, choiceIndex)}
                                disabled={isSubmitted}
                                className={isSubmitted ? (
                                    choiceIndex === (question as MultipleChoiceQuestion).correctAnswer ? 'correct-answer' :
                                        (answer === choiceIndex ? 'incorrect-answer' : '')
                                ) : ''}
                            />
                        ))}

                        {isSubmitted && (question as MultipleChoiceQuestion).correctAnswer !== null && (
                            <div className="correct-answer-display">
                                Correct
                                Answer: {(question as MultipleChoiceQuestion).choices[(question as MultipleChoiceQuestion).correctAnswer || 0]}
                            </div>
                        )}
                    </div>
                )}

                {question.type === 'true_false' && (
                    <div className="true-false-container">
                        <Form.Check
                            type="radio"
                            id={`tf-${question.id}-true`}
                            label="True"
                            checked={answer === true}
                            onChange={() => handleTrueFalseAnswer(question.id, true)}
                            disabled={isSubmitted}
                            className={isSubmitted ? (
                                (question as TrueFalseQuestion).correctAnswer === true ? 'correct-answer' :
                                    (answer === true ? 'incorrect-answer' : '')
                            ) : ''}
                        />
                        <Form.Check
                            type="radio"
                            id={`tf-${question.id}-false`}
                            label="False"
                            checked={answer === false}
                            onChange={() => handleTrueFalseAnswer(question.id, false)}
                            disabled={isSubmitted}
                            className={isSubmitted ? (
                                (question as TrueFalseQuestion).correctAnswer === false ? 'correct-answer' :
                                    (answer === false ? 'incorrect-answer' : '')
                            ) : ''}
                        />

                        {isSubmitted && (question as TrueFalseQuestion).correctAnswer !== null && (
                            <div className="correct-answer-display">
                                Correct Answer: {(question as TrueFalseQuestion).correctAnswer ? 'True' : 'False'}
                            </div>
                        )}
                    </div>
                )}

                {question.type === 'fill_in_blank' && (
                    <div className="fill-blank-container">
                        <Form.Control
                            type="text"
                            value={answer || ''}
                            onChange={(e) => handleFillInBlankAnswer(question.id, e.target.value)}
                            disabled={isSubmitted}
                            className={isSubmitted ? (isQuestionCorrect ? 'correct-answer' : 'incorrect-answer') : ''}
                        />

                        {isSubmitted && (
                            <div className="correct-answer-display">
                                Accepted Answers: {(question as FillInBlankQuestion).answers.join(', ')}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    // Return the wrapped component
    return (
        <div className="quiz-preview-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>{quiz.title}</h2>

                <div className="d-flex">
                    <FacultyProtected>
                        <Button
                            variant="outline-primary"
                            className="me-3"
                            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`)}
                        >
                            Edit Quiz
                        </Button>
                    </FacultyProtected>

                    {isSubmitted && (
                        <div className="score-display">
                            Score: {score}%
                        </div>
                    )}
                </div>
            </div>
            <FacultyProtected>
                <div className="preview-notice alert alert-warning">
                    ⓘ This is a preview of the published version of the quiz
                </div>
            </FacultyProtected>
            <div className="started-info mb-4">
                Started: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </div>

            <h3 className="border-bottom pb-3 mb-4">Quiz Instructions</h3>

            {/* Progress bar */}
            <div className="progress mb-4">
                <div
                    className="progress-bar"
                    role="progressbar"
                    style={{width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`}}
                    aria-valuenow={(currentQuestionIndex + 1) / quiz.questions.length * 100}
                    aria-valuemin={0}
                    aria-valuemax={100}
                >
                    Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </div>
            </div>

            {/* Render current question */}
            {renderCurrentQuestion()}

            {/* Navigation buttons */}
            <div className="quiz-navigation d-flex justify-content-between mt-4">
                <Button
                    variant="secondary"
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                >
                    Previous
                </Button>

                {currentQuestionIndex < quiz.questions.length - 1 ? (
                    <Button
                        variant="primary"
                        onClick={handleNextQuestion}
                    >
                        Next
                    </Button>
                ) : (
                    <Button
                        variant="danger"
                        onClick={handleSubmit}
                        disabled={isSubmitted}
                    >
                        Submit Quiz
                    </Button>
                )}
            </div>

            {/* Quiz completed info */}
            {isSubmitted && (
                <div
                    className="quiz-completed-info d-flex justify-content-between align-items-center mt-4 p-3 border-top">
                    <div>
                        Quiz saved at {new Date().toLocaleTimeString()}
                    </div>

                    <FacultyProtected>
                        <Button
                            variant="outline-secondary"
                            onClick={handleKeepEditing}
                        >
                            <span>✏️ Keep Editing This Quiz</span>
                        </Button>
                    </FacultyProtected>
                </div>
            )}
        </div>
    );
}