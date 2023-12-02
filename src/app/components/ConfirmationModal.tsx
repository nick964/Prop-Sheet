// ConfirmationModal.tsx

import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ConfirmationModalProps {
  showModal: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ showModal, onConfirm, onCancel }) => {
  return (
    <Modal show={showModal} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to submit? Once you submit this entry, your submission will be locked!</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
