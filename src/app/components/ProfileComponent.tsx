// Import necessary libraries and components
import React, { useState} from 'react';
import { Card, ListGroup, Button, Modal } from 'react-bootstrap';
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
  const [showModal, setShowModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [selectedShareOption, setSelectedShareOption] = useState('');

  const handleShareClick = (groupId: number) => {
    setSelectedGroup(groupId);
    setShowModal(true);
  };

  const handleShareOptionClick = (shareOption: string) => {
    setSelectedShareOption(shareOption);
    // Handle the respective action based on the selected share option
    switch (shareOption) {
      case 'email':
        // Add logic to send email invitation
        break;
      case 'sms':
        // Add logic to send SMS invitation
        break;
      case 'existingUser':
        // Add logic to search for existing users
        break;
      default:
        break;
    }
  };

  const handleCloseModal = () => {
    setSelectedGroup(0);
    setSelectedShareOption('');
    setShowModal(false);
  };

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

                <Button variant="outline-info" onClick={() => handleShareClick(member.groupDto.id)}>
                  Share
                </Button>
              </ListGroup.Item>
            ))}

            
          </ListGroup>
        ) : (
          <EmptyGroupsComponent />
        )}
      </Card.Body>

        {/* Modal for sharing */}
        <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Share Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Invite others to join this group:</p>
          <Button variant="outline-info" onClick={() => handleShareOptionClick('email')}>
            Invite via Email
          </Button>{' '}
          <Button variant="outline-info" onClick={() => handleShareOptionClick('sms')}>
            Invite via SMS
          </Button>{' '}
          <Button variant="outline-info" onClick={() => handleShareOptionClick('existingUser')}>
            Invite Existing User
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default ProfileComponent;
