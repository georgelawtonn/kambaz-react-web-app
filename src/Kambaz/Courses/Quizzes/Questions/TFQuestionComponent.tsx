import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { TrueFalseQuestion } from './QuestionTypes';

interface TFQuestionComponentProps {
    question: TrueFalseQuestion;
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
    onSave: (question: TrueFalseQuestion) => void;
    onCancel: (question: TrueFalseQuestion) => void;
}

export default function TFQuestionComponent({
                                                question,
                                                onDelete,
                                                onEdit,
                                                onSave,
                                                onCancel
                                            }: TFQuestionComponentProps) {
    const [editedQuestion, setEditedQuestion] = useState<TrueFalseQuestion>({...question});

    // Helper to update edited question
    const updateField = (field: keyof TrueFalseQuestion, value: any) => {
        setEditedQuestion({
            ...editedQuestion,
            [field]: value
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
                <h4>Edit True/False Question</h4>

                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Question Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={editedQuestion.title}
                            onChange={(e) => updateField('title', e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Points</Form.Label>
                        <Form.Control
                            type="number"
                            value={editedQuestion.points}
                            onChange={(e) => updateField('points', parseInt(e.target.value) || 0)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Question Text</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={editedQuestion.question}
                            onChange={(e) => updateField('question', e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Correct Answer</Form.Label>
                        <div>
                            <Form.Check
                                type="radio"
                                name="correctAnswer"
                                id="correctAnswerTrue"
                                label="True"
                                checked={editedQuestion.correctAnswer === true}
                                onChange={() => updateField('correctAnswer', true)}
                                className="mb-2"
                            />
                            <Form.Check
                                type="radio"
                                name="correctAnswer"
                                id="correctAnswerFalse"
                                label="False"
                                checked={editedQuestion.correctAnswer === false}
                                onChange={() => updateField('correctAnswer', false)}
                            />
                        </div>
                    </Form.Group>

                    <div className="mt-3">
                        <Button
                            variant="primary"
                            className="me-2"
                            onClick={handleSave}
                        >
                            Save Question
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                    </div>
                </Form>
            </div>
        );
    }

    // Render the preview mode
    return (
        <div className="question-item mb-3 p-3 border rounded">
            <h4>{question.title} ({question.points} pts)</h4>
            <p>{question.question || "No question text yet"}</p>

            <div className="choices-list">
                <div className="choice-item d-flex align-items-center mb-1">
                    <Form.Check
                        type="radio"
                        disabled
                        checked={question.correctAnswer === true}
                        label="True"
                    />
                    {question.correctAnswer === true && (
                        <span className="text-success ms-2">✓ Correct Answer</span>
                    )}
                </div>
                <div className="choice-item d-flex align-items-center mb-1">
                    <Form.Check
                        type="radio"
                        disabled
                        checked={question.correctAnswer === false}
                        label="False"
                    />
                    {question.correctAnswer === false && (
                        <span className="text-success ms-2">✓ Correct Answer</span>
                    )}
                </div>
            </div>

            <div className="mt-2">
                <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => onEdit(question.id)}
                >
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