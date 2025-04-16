import { Form } from 'react-bootstrap';

interface QuestionTypeSelectorProps {
    currentType: string;
    onTypeChange: (newType: 'multiple_choice' | 'true_false' | 'fill_in_blank') => void;
    disabled?: boolean;
}

export default function QuestionTypeSelector({
                                                 currentType,
                                                 onTypeChange,
                                                 disabled = false
                                             }: QuestionTypeSelectorProps) {
    return (
        <Form.Group className="mb-3">
            <Form.Label>Question Type</Form.Label>
            <Form.Select
                value={currentType}
                onChange={(e) => {
                    const newType = e.target.value as 'multiple_choice' | 'true_false' | 'fill_in_blank';
                    onTypeChange(newType);
                }}
                disabled={disabled}
                size="sm"
            >
                <option value="multiple_choice">Multiple Choice</option>
                <option value="true_false">True/False</option>
                <option value="fill_in_blank">Fill in the Blank</option>
            </Form.Select>
        </Form.Group>
    );
}