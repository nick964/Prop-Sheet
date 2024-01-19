import { Member } from "./profile-response";

interface GroupDetails {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  inLead: Member
}

interface Response {
  questionText: string;
  section: string;
  answer: string;
  correctAnswer: string;
  className: string;
  isCorrect: boolean;
  correct: boolean;
}

export interface TrackingResponse {
    groupDetails: GroupDetails;
    position: number;
    totalScore: number;
    gameStarted: boolean;
    responses: Response[]; 
}