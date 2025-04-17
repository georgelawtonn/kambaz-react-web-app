import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { TrueFalseQuestion } from './QuestionTypes';
import Editor from "react-simple-wysiwyg";

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

                    {/* WYSIWYG editor */}
                    <Form.Group className="mb-3">
                        <Form.Label>Question Text</Form.Label>
                        <Editor value={editedQuestion.question}
                                onChange={(e) => updateField('question', e.target.value)}></Editor>
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

            {/* To display as HTML instead of plaintext with tags*/}
            <div
                className="question-text mb-3"
                dangerouslySetInnerHTML={{__html: question.question || "No question text yet"}}
            />

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
                    variant="primary"
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