

interface GroupDto {
    id: number;
    name: string;
    groupKey: string;
    groupRole: number;
    memberCount: number;
    icon: string | null;
  }

export interface Member {
    name: string;
    questionId: number | null;
    answer: string | null;
    submission_status: Number | null;
    score: number | null;
    groupDto: GroupDto;
    icon: string | null;
  }

export interface ProfileResponse {
    members: Member[]
    gameStarted: boolean;
}