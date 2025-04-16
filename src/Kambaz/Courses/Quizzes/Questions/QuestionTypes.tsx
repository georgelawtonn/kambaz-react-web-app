export interface BaseQuestion {
    id: string;
    title: string;
    type: string;
    points: number;
    question: string;
    isEditing?: boolean;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
    type: 'multiple_choice';
    choices: string[];
    correctAnswer: number | null;
}

export interface TrueFalseQuestion extends BaseQuestion {
    type: 'true_false';
    correctAnswer: boolean | null;
}

export interface FillInBlankQuestion extends BaseQuestion {
    type: 'fill_in_blank';
    answers: string[];
    caseSensitive: boolean;
}

// Union type for all question types
export type Question = MultipleChoiceQuestion | TrueFalseQuestion | FillInBlankQuestion;