"use client"

import React, { useState } from 'react';
import { Card, Button, Form, Spinner, Row, Col, Modal, Container, Alert, Toast } from 'react-bootstrap';
import { ProfileResponse } from '../models/profile-response';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import styles from './ProfileComponent.module.css';
import Image from 'next/image';

interface ProfileComponentProps {
  profileData: ProfileResponse;
}

const EmptyGroupsComponent: React.FC = () => (
  <div className="text-center py-5">
    <h3 className="mb-4">You are not a member of any groups yet</h3>
    <Link href="/create-group">
      <Button variant="primary" size="lg">Create Your First Group</Button>
    </Link>
  </div>
);

const ProfileComponent: React.FC<ProfileComponentProps> = ({ profileData }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const { data: session } = useSession();
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [selectedShareOption, setSelectedShareOption] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGameStarted] = useState(profileData.gameStarted);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  if (session?.user?.accessToken == null) {
    router.push('/login');
    return null;
  }

  const accessToken = session?.user?.accessToken;

  const handleShareClick = (groupId: number) => {
    setSelectedGroup(groupId);
    setShowModal(true);
  };

  const showDefaultIcon = (icon: string | null) => {
    return icon || "/images/DefaultGroupIcon.png";
  };

  const handleDeleteClick = (groupId: number) => {
    setSelectedGroup(groupId);
    setShowDeleteConfirmation(true);
  };

  const handleCopyInviteLink = async () => {
    const inviteLink = `https://www.superbowlproptracker.com/signup?groupid=${selectedGroup}`;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setToastMessage('Invite link copied to clipboard!');
      setShowToast(true);
      setShowModal(false);
    } catch (err) {
      console.error("Failed to copy: ", err);
      setToastMessage('Failed to copy the link. Please try again.');
      setShowToast(true);
    }
  };

  const handleGroupDelete = async () => {
    setIsLoading(true);
    try {
      if (accessToken) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}groups/delete`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ groupId: selectedGroup })
        });
        
        if (response.ok) {
          removeGroup(selectedGroup);
        } else {
          setError('Failed to delete group');
        }
      }
    } catch (error) {
      setError('Error deleting group');
    }
    setIsLoading(false);
    setShowDeleteConfirmation(false);
  };

  const removeGroup = (groupId: number) => {
    profileData.members = profileData.members.filter(
      (group) => group.groupDto.id !== groupId
    );
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.toastContainer}>
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={3000} 
          autohide
          className={styles.toast}
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </div>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Your Groups</h1>
      </div>

      {isGameStarted && (
        <Alert variant="danger" className={styles.gameAlert}>
          <Alert.Heading>Game In Progress</Alert.Heading>
          <p className="mb-0">The game has started! You can no longer submit your picks.</p>
        </Alert>
      )}

      <Container>
        {profileData.members.length > 0 ? (
          profileData.members.map((member, index) => (
            <Card key={index} className={styles.groupCard}>
              <Card.Body>
                <div className={styles.groupHeader}>
                  <Image
                    src={showDefaultIcon(member.groupDto.icon)}
                    alt={member.groupDto.name}
                    width={60}
                    height={60}
                    className={styles.groupIcon}
                  />
                  <h3 className={styles.groupName}>
                    <Link href={member.submission_status === 0 ? `/submit/${member.groupDto.id}` : `/track/${member.groupDto.id}`}>
                      {member.groupDto.name}
                    </Link>
                  </h3>
                </div>

                <div className={styles.groupDetails}>
                  <div className={styles.detailItem}>
                    <i className="fas fa-users detailIcon"></i>
                    <span>Members: {member.groupDto.memberCount}</span>
                  </div>

                  {(member.groupDto.venmoLink || member.groupDto.cost) && (
                    <div className={styles.detailItem}>
                      <i className="fas fa-money-bill detailIcon"></i>
                      <a 
                        href={`https://venmo.com/${member.groupDto.venmoLink?.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.venmoLink}
                      >
                        Pay via Venmo {member.groupDto.cost && `($${member.groupDto.cost})`}
                        <br />
                        <span className={styles.venmoUsername}>{member.groupDto.venmoLink}</span>
                      </a>
                    </div>
                  )}

                  <div className={`${styles.submissionStatus} ${member.submission_status === 0 ? styles.notSubmitted : styles.submitted}`}>
                    {member.submission_status === 0 ? (
                      <>
                        <i className="fas fa-exclamation-circle"></i>
                        <span>Not Submitted</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check-circle"></i>
                        <span>Submitted • Score: {member.score}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className={styles.actionButtons}>
                  {member.submission_status === 0 ? (
                    <Button
                      className={`${styles.actionButton} ${styles.primaryButton}`}
                      href={`/submit/${member.groupDto.id}`}
                      disabled={isGameStarted}
                    >
                      Submit Picks
                    </Button>
                  ) : (
                    <Button
                      className={`${styles.actionButton} ${styles.primaryButton}`}
                      href={`/track/${member.groupDto.id}`}
                    >
                      Track Progress
                    </Button>
                  )}

                  <Button
                    className={`${styles.actionButton} ${styles.secondaryButton}`}
                    onClick={() => handleShareClick(member.groupDto.id)}
                  >
                    Share Group
                  </Button>

                  {member.groupAdmin && (
                    <>
                      <Button
                        className={`${styles.actionButton} ${styles.secondaryButton}`}
                        href={`/update-group/${member.groupDto.id}`}
                      >
                        Edit Group
                      </Button>
                      <Button
                        className={`${styles.actionButton} ${styles.dangerButton}`}
                        onClick={() => handleDeleteClick(member.groupDto.id)}
                      >
                        Delete Group
                      </Button>
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))
        ) : (
          <EmptyGroupsComponent />
        )}
      </Container>

      {/* Share Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header className={styles.modalHeader} closeButton>
          <Modal.Title>Share Group</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
          <p>Share this group with others:</p>
          <Button
            variant="primary"
            onClick={handleCopyInviteLink}
            className="w-100"
          >
            Copy Invite Link
          </Button>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteConfirmation}
        onHide={() => setShowDeleteConfirmation(false)}
        centered
      >
        <Modal.Header className={styles.modalHeader} closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
          <p>Are you sure you want to delete this group? This action cannot be undone.</p>
          <p className="text-danger">All members associated with this group will be removed.</p>
        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirmation(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleGroupDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Deleting...
              </>
            ) : (
              'Delete Group'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProfileComponent;