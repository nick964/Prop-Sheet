import { Member } from "./profile-response";

export interface GroupDetails {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  icon: string | null;
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
  lineValue: number;
}

export interface TrackingResponse {
    groupDetails: GroupDetails;
    position: number;
    totalScore: number;
    gameStarted: boolean;
    responses: Response[]; 

}

export interface BasicGroupDetails {
  id: number;
  name: string;
  description: string;
  icon: string | null;
  admin: Member
}