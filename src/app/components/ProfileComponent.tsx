// Import necessary libraries and components
import React, { useState} from 'react';
import { Card, ListGroup, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { ProfileResponse } from '../models/profile-response';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';


interface ProfileComponentProps {
  profileData: ProfileResponse;
}

const EmptyGroupsComponent: React.FC = () => (
  <p>You are not a member of any groups. <Link href="/create-group">Create a group</Link>.</p>
);

const ProfileComponent: React.FC<ProfileComponentProps> = ({ profileData }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const { data: session, status } = useSession();
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [selectedShareOption, setSelectedShareOption] = useState('');
  const [showUserSearchModal, setShowUserSearchModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if(session?.user?.accessToken == null) {
    router.push('/api/auth/signin/credentials');
  }
  const accessToken = session?.user?.accessToken;


  const handleShareClick = (groupId: number) => {
    setSelectedGroup(groupId);
    setShowModal(true);
  };

    // Add additional handlers and logic as needed
    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsLoading(true);
      console.log('in form submit');
      try {
        if (accessToken) {

          let req;
          if(selectedShareOption === 'email') {
            req = {
              groupId: selectedGroup,
              inviteType: selectedShareOption,
              recipient: event.currentTarget.formBasicEmail.value,
              name: event.currentTarget.formBasicName.value,
            };
          } else {
            req = {
              groupId: selectedGroup,
              inviteType: selectedShareOption,
              recipient: event.currentTarget.formBasicPhone.value,
              name: event.currentTarget.formBasicName.value,
            };
          }

        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json'},
            body: JSON.stringify(req) 
        };
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}groups/share`, requestOptions);

          if (response.ok) {
            console.log('success');
          } else {
            console.error('Failed to fetch data from the API');
          }
        } 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      
  
  
      setIsLoading(false);
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
        setShowUserSearchModal(true);
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

  const handleCloseUserSearchModal = () => {
    setShowUserSearchModal(false);
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
                  <Link href={member.submission_status === 0 ? `/submit/${member.groupDto.id}` : `/track/${member.groupDto.id}`}>
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

          {selectedShareOption === 'email' && (
            <Form onSubmit={handleFormSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
              </Form.Group>
              <Form.Group controlId="formBasicName">
                <Form.Label>Recipient Name</Form.Label>
                <Form.Control type="text" placeholder="Name" />
              </Form.Group>
              <Button variant="primary" type="submit" disabled={isLoading}>
                  {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Invite'}
              </Button>
            </Form>
          )}

          {selectedShareOption === 'sms' && (
            <Form onSubmit={handleFormSubmit}>
              <Form.Group controlId="formBasicPhone">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="tel" placeholder="Enter phone number" min={10} max={10}/>
              </Form.Group>
              <Form.Group controlId="formBasicName">
                <Form.Label>Recipient Name</Form.Label>
                <Form.Control type="text" placeholder="Name" />
              </Form.Group>
              <Button variant="primary" type="submit" disabled={isLoading}>
                  {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Invite'}
              </Button>
            </Form>

          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

         {/* User Search Modal */}
        <Modal show={showUserSearchModal} onHide={handleCloseUserSearchModal}>
        <Modal.Header closeButton>
          <Modal.Title>Search User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formSearchUser">
              <Form.Label>Search for existing user</Form.Label>
              <Form.Control type="text" placeholder="Search by name or email" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUserSearchModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </Card>
  );
};

export default ProfileComponent;
