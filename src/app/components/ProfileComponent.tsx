// Import necessary libraries and components
import React from 'react';
import { Card, ListGroup, Button } from 'react-bootstrap';
import { ProfileResponse } from '../models/profile-response';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ProfileComponentProps {
  profileData: ProfileResponse;
}

const EmptyGroupsComponent: React.FC = () => (
  <p>You are not a member of any groups. <Link href="/create-group">Create a group</Link>.</p>
);

const ProfileComponent: React.FC<ProfileComponentProps> = ({ profileData }) => {
  const router = useRouter();

  return (
    <Card>
      <Card.Header>Your Groups</Card.Header>
      <Card.Body>
        {profileData.members.length > 0 ? (
          <ListGroup>
            {profileData.members.map((member, index) => (
              <ListGroup.Item key={index} className="list-group-item">
                <h5>
                  <Link href={`/submit/${member.groupDto.id}`}>
                    {`Group: ${member.groupDto.name}`}
                  </Link>
                </h5>
                <p>{`Group Key: ${member.groupDto.groupKey}`}</p>
                <p>{`Group Role: ${member.groupDto.groupRole}`}</p>
                {member.icon && <img src={member.icon} alt="Group Icon" className="group-icon" />}
                {member.submission_status == 0 ? (
                    <div>
                      <p>You have not yet submitted</p>
                      <Button variant="primary" href={`/submit/${member.groupDto.id}`}>
                        Submit Now
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <p>{`Submission Status: Submitted!`}</p>
                      <p>{`Score: ${member.score}`}</p>
                      <Button variant="primary" href={`/track/${member.groupDto.id}`}>
                        Track
                      </Button>
                    </div>
      )}
                <p>{`Score: ${member.score}`}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <EmptyGroupsComponent />
        )}
      </Card.Body>
    </Card>
  );
};

export default ProfileComponent;
