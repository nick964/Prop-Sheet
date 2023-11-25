

interface GroupDto {
    id: number;
    name: string;
    groupKey: string;
    groupRole: number;
    icon: string | null;
  }

interface Member {
    questionId: number | null;
    answer: string | null;
    submission_status: string | null;
    score: number | null;
    groupDto: GroupDto;
    icon: string | null;
  }

export interface ProfileResponse {
    members: Member[]
}