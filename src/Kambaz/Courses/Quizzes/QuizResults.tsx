import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { Question, MultipleChoiceQuestion, TrueFalseQuestion, FillInBlankQuestion } from './Questions/QuestionTypes';
import './QuizPreview.css'; // Reuse the same CSS
import { findQuestionsForQuiz } from './client';
import * as userClient from "../../Account/client.ts";

export default function QuizResults() {
    const navigate = useNavigate();
    const { cid, qid } = useParams();
    const { currentUser } = useSelector((state: any) => state.accountReducer);

    // Get the quiz from Redux store
    const quiz = useSelector((state: any) =>
        state.quizzesReducer.quizzes.find((q: any) => q._id === qid)
    );

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [studentAnswers, setStudentAnswers] = useState<Record<string, any>>({});
    const [attempt, setAttempt] = useState<any>(null);
    const [score, setScore] = useState(0);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [submissionDate, setSubmissionDate] = useState<Date | null>(null);
    const [hasAttemptsRemaining, setHasAttemptsRemaining] = useState(false);

    const convertDBQuestionToRedux = (dbQuestion: any) => {
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

    const loadQuizData = async () => {
        if (!qid || !currentUser?._id) return;
        try {
            setIsLoading(true);

            // Load questions
            const questionData = await findQuestionsForQuiz(qid);
            const convertedQuestions = questionData.map((q: any) => convertDBQuestionToRedux(q));
            setQuestions(convertedQuestions);

            // Load student's attempt
            const attemptData = await userClient.findAttemptForUserAndQuiz(currentUser._id, qid);
            if (attemptData) {
                setAttempt(attemptData);

                // Calculate score percentage
                const totalPoints = quiz?.points || 100;
                const scorePercentage = Math.round((attemptData.score / totalPoints) * 100);
                setScore(scorePercentage);

                // Parse submission date
                if (attemptData.updatedAt) {
                    setSubmissionDate(new Date(attemptData.updatedAt));
                }

                // Map student answers from attempt
                const answers: Record<string, any> = {};
                attemptData.answers.forEach((answer: any) => {
                    if (answer.selectedChoiceIndex !== null) {
                        answers[answer.question] = answer.selectedChoiceIndex;
                    } else if (answer.trueFalseAnswer !== null) {
                        answers[answer.question] = answer.trueFalseAnswer;
                    } else if (answer.textAnswers !== null) {
                        answers[answer.question] = answer.textAnswers;
                    }
                });
                setStudentAnswers(answers);

                // Check if student has attempts remaining
                const attemptsAllowed = quiz?.attempts_allowed || 1;
                setHasAttemptsRemaining(attemptData.attemptNumber < attemptsAllowed);
            }
        } catch (error) {
            console.error("Error loading quiz data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadQuizData();
    }, [qid, currentUser?._id]);

    // If quiz isn't loaded yet
    if (!quiz || isLoading) {
        return <div>Loading quiz results...</div>;
    }

    // If no attempt found
    if (!attempt) {
        return (
            <div className="quiz-preview-container">
                <div className="alert alert-info">
                    You haven't attempted this quiz yet.
                </div>
                <Button
                    variant="primary"
                    onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/preview`)}
                >
                    Take Quiz
                </Button>
            </div>
        );
    }

    // If no questions in the quiz
    if (!questions || questions.length === 0) {
        return (
            <div className="quiz-preview-container">
                <div className="alert alert-warning">
                    This quiz doesn't have any questions.
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    // Navigate to next question
    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    // Navigate to previous question
    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    // Return to course
    const handleReturnToCourse = () => {
        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    };

    // Try again
    const handleTryAgain = () => {
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/preview`);
    };

    // Render the current question with student's answers
    const renderCurrentQuestion = () => {
        const question = currentQuestion;
        const answer = studentAnswers[question.id];

        // Find the corresponding answer in the attempt
        const attemptAnswer = attempt?.answers?.find((a: any) => a.question === question.id);
        const isQuestionCorrect = attemptAnswer?.isCorrect || false;

        return (
            <div className={`question ${!hasAttemptsRemaining ? (isQuestionCorrect ? 'correct' : 'incorrect') : ''}`}>
                <div className="question-header">
                    <h3>{question.title || `Question ${currentQuestionIndex + 1}`}</h3>
                    <span className="points">{question.points || 1} pts</span>
                </div>

                <div className="question-text" dangerouslySetInnerHTML={{ __html: question.question }}></div>

                {question.type === 'multiple_choice' && (
                    <div className="choices-container">
                        {(question as MultipleChoiceQuestion).choices.map((choice, choiceIndex) => (
                            <div
                                key={choiceIndex}
                                className={`form-check ${
                                    !hasAttemptsRemaining && choiceIndex === (question as MultipleChoiceQuestion).correctAnswer
                                        ? 'correct-answer'
                                        : !hasAttemptsRemaining && answer === choiceIndex && !isQuestionCorrect
                                            ? 'incorrect-answer'
                                            : answer === choiceIndex
                                                ? 'selected-answer'
                                                : ''
                                }`}
                            >
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    id={`mc-${question.id}-${choiceIndex}`}
                                    checked={answer === choiceIndex}
                                    disabled={true}
                                />
                                <label className="form-check-label" htmlFor={`mc-${question.id}-${choiceIndex}`}>
                                    {choice}
                                </label>
                            </div>
                        ))}

                        {!hasAttemptsRemaining && (question as MultipleChoiceQuestion).correctAnswer !== null && (
                            <div className="correct-answer-display">
                                Correct Answer: {(question as MultipleChoiceQuestion).choices[(question as MultipleChoiceQuestion).correctAnswer || 0]}
                            </div>
                        )}
                    </div>
                )}

                {question.type === 'true_false' && (
                    <div className="true-false-container">
                        <div
                            className={`form-check ${
                                !hasAttemptsRemaining && (question as TrueFalseQuestion).correctAnswer === true
                                    ? 'correct-answer'
                                    : !hasAttemptsRemaining && answer === true && !isQuestionCorrect
                                        ? 'incorrect-answer'
                                        : answer === true
                                            ? 'selected-answer'
                                            : ''
                            }`}
                        >
                            <input
                                type="radio"
                                className="form-check-input"
                                id={`tf-${question.id}-true`}
                                checked={answer === true}
                                disabled={true}
                            />
                            <label className="form-check-label" htmlFor={`tf-${question.id}-true`}>
                                True
                            </label>
                        </div>
                        <div
                            className={`form-check ${
                                !hasAttemptsRemaining && (question as TrueFalseQuestion).correctAnswer === false
                                    ? 'correct-answer'
                                    : !hasAttemptsRemaining && answer === false && !isQuestionCorrect
                                        ? 'incorrect-answer'
                                        : answer === false
                                            ? 'selected-answer'
                                            : ''
                            }`}
                        >
                            <input
                                type="radio"
                                className="form-check-input"
                                id={`tf-${question.id}-false`}
                                checked={answer === false}
                                disabled={true}
                            />
                            <label className="form-check-label" htmlFor={`tf-${question.id}-false`}>
                                False
                            </label>
                        </div>

                        {!hasAttemptsRemaining && (question as TrueFalseQuestion).correctAnswer !== null && (
                            <div className="correct-answer-display">
                                Correct Answer: {(question as TrueFalseQuestion).correctAnswer ? 'True' : 'False'}
                            </div>
                        )}
                    </div>
                )}

                {question.type === 'fill_in_blank' && (
                    <div className="fill-blank-container">
                        <input
                            type="text"
                            className={`form-control ${
                                !hasAttemptsRemaining ? (isQuestionCorrect ? 'correct-answer' : 'incorrect-answer') : 'selected-answer'
                            }`}
                            value={answer || ''}
                            disabled={true}
                        />

                        {!hasAttemptsRemaining && (
                            <div className="correct-answer-display">
                                Accepted Answers: {(question as FillInBlankQuestion).answers.join(', ')}
                            </div>
                        )}
                    </div>
                )}

                <div className="answer-status mt-2">
                    {!hasAttemptsRemaining ? (
                        isQuestionCorrect ? (
                            <div className="text-success">
                                <strong>✓ Correct</strong> - {attemptAnswer.pointsEarned} points earned
                            </div>
                        ) : (
                            <div className="text-danger">
                                <strong>✗ Incorrect</strong> - 0 points earned
                            </div>
                        )
                    ) : (
                        <div className="text-muted">
                            <strong>Your answer</strong> is shown above
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Return the wrapped component
    return (
        <div className="quiz-preview-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>{quiz.title} - Results</h2>

                <div className="score-display">
                    Score: {score}%
                </div>
            </div>

            <div className={`alert ${hasAttemptsRemaining ? 'alert-info' : 'alert-warning'}`}>
                {hasAttemptsRemaining ? (
                    <>
                        This is your previous quiz attempt. You still have attempts remaining.
                        {/* Only showing your answers, not the correct solutions. */}
                    </>
                ) : (
                    <>
                        This is your final quiz attempt. You can review your answers and see the correct solutions.
                    </>
                )}
            </div>

            <div className="completed-info mb-4">
                Submitted: {submissionDate ? submissionDate.toLocaleDateString() : 'Unknown'} at {submissionDate ? submissionDate.toLocaleTimeString() : 'Unknown'}
            </div>

            {/* Progress bar */}
            <div className="progress mb-4">
                <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    aria-valuenow={(currentQuestionIndex + 1) / questions.length * 100}
                    aria-valuemin={0}
                    aria-valuemax={100}
                >
                    Question {currentQuestionIndex + 1} of {questions.length}
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

                {currentQuestionIndex < questions.length - 1 ? (
                    <Button
                        variant="primary"
                        onClick={handleNextQuestion}
                    >
                        Next
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        onClick={handleReturnToCourse}
                    >
                        Return to Course
                    </Button>
                )}
            </div>

            {/* Quiz summary */}
            <div className="quiz-completed-info d-flex justify-content-between align-items-center mt-4 p-3 border-top">
                <div>
                    Quiz score: {score}% ({attempt.score} out of {quiz.points} points)
                </div>

                <div>
                    {hasAttemptsRemaining && (
                        <Button
                            variant="success"
                            onClick={handleTryAgain}
                            className="me-2"
                        >
                            Try Again
                        </Button>
                    )}
                    <Button
                        variant="outline-primary"
                        onClick={handleReturnToCourse}
                    >
                        Back to Quizzes
                    </Button>
                </div>
            </div>
        </div>
    );
}