import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FillInBlankQuestion } from './QuestionTypes';

interface FIBQuestionComponentProps {
    question: FillInBlankQuestion;
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
    onSave: (question: FillInBlankQuestion) => void;
    onCancel: (question: FillInBlankQuestion) => void;
}

export default function FIBQuestionComponent({
                                                 question,
                                                 onDelete,
                                                 onEdit,
                                                 onSave,
                                                 onCancel
                                             }: FIBQuestionComponentProps) {
    const [editedQuestion, setEditedQuestion] = useState<FillInBlankQuestion>({...question});
    const [newAnswer, setNewAnswer] = useState('');

    // Helper to update edited question
    const updateField = (field: keyof FillInBlankQuestion, value: any) => {
        setEditedQuestion({
            ...editedQuestion,
            [field]: value
        });
    };

    // Add a new possible answer to the question
    const addAnswer = () => {
        if (newAnswer.trim()) {
            setEditedQuestion({
                ...editedQuestion,
                answers: [...editedQuestion.answers, newAnswer.trim()]
            });
            setNewAnswer('');
        }
    };

    // Remove an answer
    const removeAnswer = (index: number) => {
        const newAnswers = [...editedQuestion.answers];
        newAnswers.splice(index, 1);

        setEditedQuestion({
            ...editedQuestion,
            answers: newAnswers
        });
    };

    // Save the edited question
    const handleSave = () => {
        onSave(editedQuestion);
    };

    // Cancel editing
    const handleCancel = () => {
        onCancel(question); // Clear the editing state
    };

    // Render the edit mode
    if (question.isEditing) {
        return (
            <div className="question-item mb-3 p-3 border rounded">
                <h4>Edit Fill in the Blank Question</h4>

                <Form>
                    {/* Title & Points */}
                    <div className="d-flex align-items-end mb-3">
                        <Form.Group className="me-3 flex-grow-1">
                            <Form.Label>Question Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedQuestion.title}
                                onChange={(e) => updateField('title', e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group style={{width: '100px'}}>
                            <Form.Label>Points</Form.Label>
                            <Form.Control
                                type="number"
                                size="sm"
                                value={editedQuestion.points}
                                onChange={(e) => {
                                    // Convert to number and handle empty case
                                    const numValue = e.target.value === '' ? 0 : Number(e.target.value);
                                    updateField('points', numValue);
                                }}
                            />
                        </Form.Group>
                    </div>
                    <Form.Group className="mb-3">
                        <Form.Label>Question Text</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={editedQuestion.question}
                            placeholder="Enter your question text, then define all possible correct answers for the blank."
                            onChange={(e) => updateField('question', e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Possible Answers</Form.Label>

                        {editedQuestion.answers.map((answer, index) => (
                            <div key={index} className="d-flex mb-2 align-items-center">
                                <span className="me-2">Possible Answer:</span>
                                <Form.Control
                                    type="text"
                                    value={answer}
                                    onChange={(e) => {
                                        const newAnswers = [...editedQuestion.answers];
                                        newAnswers[index] = e.target.value;
                                        updateField('answers', newAnswers);
                                    }}
                                    className="me-2"
                                />
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => removeAnswer(index)}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </Button>
                            </div>
                        ))}

                        <div className="d-flex mt-2">
                            <Form.Control
                                type="text"
                                placeholder="Add another possible answer"
                                value={newAnswer}
                                onChange={(e) => setNewAnswer(e.target.value)}
                                className="me-2"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addAnswer();
                                    }
                                }}
                            />
                            <Button
                                variant="outline-primary"
                                onClick={addAnswer}
                            >
                                Add Answer
                            </Button>
                        </div>
                    </Form.Group>

                    <div className="mt-3">
                        <Button
                            variant="secondary"
                            className="me-2"
                            onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleSave}>
                            Save Question
                        </Button>
                    </div>
                </Form>
            </div>
        );
    }

    // Render the preview mode
    return (
        <div className="question-item mb-3 p-3 border rounded">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h4>{question.title}</h4>
                <span className="badge bg-secondary fs-5 px-3 py-2">
                  {question.points} {question.points === 1 ? 'point' : 'points'}
                </span>
            </div>
            <p>{question.question || "No question text yet"}</p>

            <div className="answers-list">
                <h5>Correct Answers:</h5>
                {question.answers.length > 0 ? (
                    <ul className="list-group">
                        {question.answers.map((answer, index) => (
                            <li key={index} className="list-group-item">
                                {answer}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No answers added yet</p>
                )}
            </div>

            <div className="mt-3">
                <Button
                    variant="primary"
                    size="sm"
                    className="me-2"
                    onClick={() => onEdit(question.id)}>
                    Edit
                </Button>
                <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onDelete(question.id)}
                >
                    Delete
                </Button>
            </div>
        </div>
    );
}