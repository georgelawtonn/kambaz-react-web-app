import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { QuestionBase } from './QuestionTypes';

interface BaseQuestionEditorProps<T extends QuestionBase> {
    question: T;
    onChange: (updatedQuestion: T) => void;
    onSave: (updatedQuestion: T) => void;
    onCancel: () => void;
    instructions: string;
}

export default function BaseQuestion<T extends QuestionBase>({
                                                                       question,
                                                                       onChange,
                                                                       onSave,
                                                                       onCancel,
                                                                       instructions,
                                                                       children
                                                                   }: BaseQuestionEditorProps<T> & { children: React.ReactNode }) {

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...question, title: e.target.value } as T);
    };

    const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...question, points: parseInt(e.target.value) || 0 } as T);
    };

    const handleQuestionTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange({ ...question, question: e.target.value } as T);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(question);
    };

    return (
        <div className="question-editor border rounded p-3">
            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Col md={8}>
                        <Form.Control
                            type="text"
                            placeholder="Question Title"
                            value={question.title}
                            onChange={handleTitleChange}
                        />
                    </Col>
                    <Col md={2} className="text-end d-flex align-items-center">
                        <Form.Label className="mb-0 me-2">pts:</Form.Label>
                    </Col>
                    <Col md={2}>
                        <Form.Control
                            type="number"
                            min="0"
                            value={question.points}
                            onChange={handlePointsChange}
                        />
                    </Col>
                </Row>

                <div className="mb-3">
                    <p className="text-muted">{instructions}</p>
                    <Form.Label>Question:</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Type your question here"
                        value={question.question}
                        onChange={handleQuestionTextChange}
                    />
                </div>

                {children}

                <div className="d-flex justify-content-end">
                    <Button variant="secondary" className="me-2" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                        Update Question
                    </Button>
                </div>
            </Form>
        </div>
    );
}