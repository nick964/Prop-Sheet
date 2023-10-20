export interface Question {
    id: number,
    text: string,
    section: string,
    question_type: number,
    line_value: number,
    questionOptions: QuestionOption[]
}

export interface QuestionOption {
    id: number,
    option: string,
    input_type: string
}
