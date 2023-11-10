export interface QuestionSection {
    id: number,
    name: string
}

export interface Question {
    id: number,
    text: string,
    section: QuestionSection,
    questionType: string,
    lineValue: number,
    options: string[]
}

