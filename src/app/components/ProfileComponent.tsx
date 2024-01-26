// Import necessary libraries and components
import React, { useState} from 'react';
import { Card, ListGroup, Button, Modal, Form, Spinner, Row, Col } from 'react-bootstrap';
import { ProfileResponse } from '../models/profile-response';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import styles from './ProfileComponent.module.css';

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
  const [error, setError] = useState('');
  const [isGameStarted, setIsGameStarted] = useState(profileData.gameStarted);
  console.log('lgging profile data');
  console.log(profileData);

  if(session?.user?.accessToken == null) {
    router.push('/api/auth/signin/credentials');
  }
  const accessToken = session?.user?.accessToken;


  const handleShareClick = (groupId: number) => {
    setSelectedGroup(groupId);
    setShowModal(true);
  };

  const showDefaultIcon = (icon: string | null) => {
    if(icon == null || icon == '') {
      return "/images/DefaultGroupIcon.png";
    } else {
      return icon;
    }
  }

  const handleCopyInviteLink = async () => {
    const inviteLink = "https://www.superbowlproptracker.com/signup?groupid=" + selectedGroup; // Replace with your actual invite link
  
    try {
      await navigator.clipboard.writeText(inviteLink);
      alert("Invite link copied to clipboard!"); // Or update the UI to show confirmation
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Failed to copy the link. Please try again."); // Or handle the error in the UI
    }
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
    <>

    {isGameStarted && (
      <div className='mb-5 mt-5 text-center'>
        <Card className={`${styles.card} shadow-sm`}>
          <Card.Header className="bg-danger text-white">Game Status</Card.Header> {/* Colorful header */}
          <Card.Body>
            <p className="text-danger">The game has already started! You can no longer submit your picks.</p>
          </Card.Body>
        </Card>
      </div>
    )}
    <Card className={`${styles.card} shadow-sm`}>
      <Card.Header className="bg-primary text-white">Your Groups</Card.Header> {/* Colorful header */}
      <Card.Body>
  {profileData.members.length > 0 ? (
    <div>
      {profileData.members.map((member, index) => (
        <Row key={index} className="align-items-center mb-3"> {/* Each member is a row */}
          <Col md={8} className="mb-2 mb-md-0"> {/* Adjust sizes as per your need */}
            <h5>
              <img 
              src={showDefaultIcon(member.groupDto.icon)}
                alt="Group Icon" 
                className="rounded-circle me-2"
                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
              />
              <Link href={member.submission_status === 0 ? `/submit/${member.groupDto.id}` : `/track/${member.groupDto.id}`}>
                {`Group: ${member.groupDto.name}`}
              </Link>

            </h5>
            {member.icon && <img src={member.icon} alt="Group Icon" className="group-icon img-fluid" />}
            <p>
              Member Count: <strong>{member.groupDto.memberCount}</strong>
            </p>
            <p className={`${member.submission_status == 0 ? 'text-danger' : 'text-success'}`}>
              {member.submission_status == 0 ? 'You have not yet submitted' : `Submission Status: Submitted! Score: ${member.score}`}
            </p>
          </Col>
          <Col md={4} className="text-md-end"> {/* Buttons Column */}
            <div className="d-flex flex-column flex-md-row justify-content-md-end">
              {member.submission_status == 0 ? (
                <Button variant="primary" className="me-2 mb-2 mb-md-0" href={`/submit/${member.groupDto.id}`} disabled={isGameStarted}>
                  Submit Now
                </Button>
              ) : (
                <Button variant="primary" className="me-2 mb-2 mb-md-0" href={`/track/${member.groupDto.id}`}>
                  Track Submission
                </Button>
              )}
              <Button variant="outline-info" onClick={() => handleShareClick(member.groupDto.id)}>
                Share
              </Button>
            </div>
          </Col>
        </Row>
      ))}
    </div>
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
          <Row>
            <Col>
              <Button variant="secondary" onClick={() => handleShareOptionClick('email')}>
                Email
              </Button>{' '}
            </Col>
            <Col>
              <Button variant="secondary" onClick={() => handleShareOptionClick('existingUser')}>
                Existing User
              </Button>
            </Col>
            <Col>
              <Button variant="secondary" onClick={handleCopyInviteLink}>
                Copy Link
              </Button>
            </Col>
            <Col>
              <Button variant="secondary" onClick={() => handleShareOptionClick('sms')}>
                SMS
              </Button>
            </Col>
          </Row>

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
    </>
  );
};

export default ProfileComponent;
