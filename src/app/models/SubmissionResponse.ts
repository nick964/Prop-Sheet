export interface SubmissionResponse {
    position: number;
    totalScore: number;
    responses: TrackResponse[];
}


export interface TrackResponse {
    questionText: string;
    section: string;
    answer: string;
    correctAnswer: string;
    correct: boolean;
}