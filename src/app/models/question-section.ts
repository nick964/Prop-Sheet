export interface QuestionSection {
    id: number,
    name: string
    questions: Question[]
}

export interface Question {
    id: number,
    text: string,
    questionType: string,
    lineValue: number | null,
    options: string[]
}

