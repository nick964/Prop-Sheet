// Import necessary libraries and components
import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { ProfileResponse } from '../models/profile-response';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ProfileComponentProps {
  profileData: ProfileResponse;
}

const ProfileComponent: React.FC<ProfileComponentProps> = ({ profileData }) => {
  const router = useRouter();

  const handleGroupClick = (groupId: number) => {
    router.push(`/submit/${groupId}`);
  };

  return (
    <Card>
      <Card.Header>Your Groups</Card.Header>
      <Card.Body>
        <ListGroup>
          {profileData.members.map((member, index) => (
            <ListGroup.Item key={index}>
              <h5>
              <Link href={`/submit/${member.groupDto.id}`}>
                  {`Group: ${member.groupDto.name}`}
                </Link>
              </h5>
              <p>{`Group Key: ${member.groupDto.groupKey}`}</p>
              <p>{`Group Role: ${member.groupDto.groupRole}`}</p>
              {member.icon && <img src={member.icon} alt="Group Icon" />}
              <p>{`Question ID: ${member.questionId}`}</p>
              <p>{`Answer: ${member.answer}`}</p>
              <p>{`Submission Status: ${member.submission_status}`}</p>
              <p>{`Score: ${member.score}`}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default ProfileComponent;
