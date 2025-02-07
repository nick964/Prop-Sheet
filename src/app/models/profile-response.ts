

interface GroupDto {
    id: number;
    name: string;
    groupKey: string;
    groupRole: number;
    memberCount: number;
    icon: string | null;
    venmoLink: string | null;
    cost: number | 0;
  }

export interface Member {
    name: string;
    questionId: number | null;
    answer: string | null;
    submission_status: Number | null;
    score: number | null;
    groupDto: GroupDto;
    icon: string | null;
    groupAdmin: boolean;
  }

export interface ProfileResponse {
    members: Member[]
    gameStarted: boolean;
}