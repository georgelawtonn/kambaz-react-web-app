import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { MultipleChoiceQuestion } from './QuestionTypes';

interface MCQuestionComponentProps {
    question: MultipleChoiceQuestion;
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
    onSave: (question: MultipleChoiceQuestion) => void;
    onCancel: (question: MultipleChoiceQuestion) => void;
}

export default function MCQuestionComponent({
                                                question,
                                                onDelete,
                                                onEdit,
                                                onSave,
                                                onCancel
                                            }: MCQuestionComponentProps) {
    const [editedQuestion, setEditedQuestion] = useState<MultipleChoiceQuestion>({...question});
    const [newChoice, setNewChoice] = useState('');

    // Helper to update edited question
    const updateField = (field: keyof MultipleChoiceQuestion, value: any) => {
        setEditedQuestion({
            ...editedQuestion,
            [field]: value
        });
    };

    // Add a new choice to the question
    const addChoice = () => {
        if (newChoice.trim()) {
            setEditedQuestion({
                ...editedQuestion,
                choices: [...editedQuestion.choices, newChoice.trim()]
            });
            setNewChoice('');
        }
    };

    // Remove a choice
    const removeChoice = (index: number) => {
        const newChoices = [...editedQuestion.choices];
        newChoices.splice(index, 1);

        // If we're removing the correct answer or an answer before it, adjust the correctAnswer
        let newCorrectAnswer = editedQuestion.correctAnswer;
        if (newCorrectAnswer !== null) {
            if (index === newCorrectAnswer) {
                newCorrectAnswer = null; // The correct answer was removed
            } else if (index < newCorrectAnswer) {
                newCorrectAnswer = newCorrectAnswer - 1; // Adjust index
            }
        }

        setEditedQuestion({
            ...editedQuestion,
            choices: newChoices,
            correctAnswer: newCorrectAnswer
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
                <h4>Edit Multiple Choice Question</h4>

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
                            placeholder="Enter your question and multiple answers, then select the one correct answer."
                            onChange={(e) => updateField('question', e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Choices</Form.Label>
                        {editedQuestion.choices.map((choice, index) => (
                            <div key={index} className="d-flex mb-2 align-items-center">
                                <Form.Check
                                    type="radio"
                                    name="correctAnswer"
                                    checked={editedQuestion.correctAnswer === index}
                                    onChange={() => updateField('correctAnswer', index)}
                                    label={`Correct Answer`}
                                    className="me-2"
                                />
                                <Form.Control
                                    type="text"
                                    value={choice}
                                    onChange={(e) => {
                                        const newChoices = [...editedQuestion.choices];
                                        newChoices[index] = e.target.value;
                                        updateField('choices', newChoices);
                                    }}
                                    className="me-2"
                                />
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => removeChoice(index)}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}

                        <div className="d-flex mt-2">
                            <Form.Control
                                type="text"
                                placeholder="Add a new choice"
                                value={newChoice}
                                onChange={(e) => setNewChoice(e.target.value)}
                                className="me-2"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addChoice();
                                    }
                                }}
                            />
                            <Button
                                variant="outline-primary"
                                onClick={addChoice}
                            >
                                Add Choice
                            </Button>
                        </div>
                    </Form.Group>

                    <div className="me-2">
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

            <div className="choices-list">
                {question.choices.length > 0 ? (
                    question.choices.map((choice, index) => (
                        <div key={index} className="choice-item d-flex align-items-center mb-1">
                            <Form.Check
                                type="radio"
                                disabled
                                checked={question.correctAnswer === index}
                                label={choice}
                            />
                            {question.correctAnswer === index && (
                                <span className="text-success ms-2">✓ Correct Answer</span>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No choices added yet</p>
                )}
            </div>

            <div className="mt-2">
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