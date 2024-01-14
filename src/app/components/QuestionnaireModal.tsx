// components/QuestionnaireModal.tsx

import React from 'react';
import { Modal, Button, Alert, ProgressBar, Form, Spinner } from 'react-bootstrap';
import { QuestionSection } from '../models/question-section';
import styles from './SubmitComponent.module.css';

interface QuestionnaireModalProps {
  showModal: boolean;
  currentSection: number;
  data: QuestionSection[];
  userResponses: any[];
  onClose: () => void;
  onPreviousSection: () => void;
  onNextSection: () => void;
  loading: boolean;
  sectionError: string | null;
  handleResponse: (questionId: any, response: any) => void;
}

const QuestionnaireModal: React.FC<QuestionnaireModalProps> = ({
  showModal,
  currentSection,
  data,
  userResponses,
  onClose,
  onPreviousSection,
  onNextSection,
  loading,
  sectionError,
  handleResponse,
}) => {
  const currentSectionData = data[currentSection];
  const isFirstSection = currentSection === 0;
  const progress = Math.round(((currentSection + 1) / data.length) * 100);

  return (
    <Modal show={showModal} onHide={onClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{currentSectionData.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={'modal-content'} key={currentSection}>
        <ProgressBar now={progress} label={`${progress}%`} />
        {currentSectionData.questions.map((question) => (
          <Form key={question.id}>
            <Form.Group controlId={question.id}>
              <Form.Label>
                {question.text}
                {question.lineValue !== null && `: ${question.lineValue}`}
              </Form.Label>
              {question.options.map((option) => (
                <Form.Check
                  key={option}
                  type="radio"
                  label={option}
                  name={`question-${question.id}`}
                  checked={userResponses[currentSection]?.[question.id] === option}
                  onChange={() => handleResponse(question.id, option)}
                />
              ))}
            </Form.Group>
          </Form>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={onPreviousSection} disabled={isFirstSection}>
          Previous Section
        </Button>
        <Button variant="primary" onClick={onNextSection}>
          {currentSection === data.length - 1 ? 'Submit' : 'Next Section'}
        </Button>
      </Modal.Footer>
      {sectionError && <Alert variant="danger">{sectionError}</Alert>}
      {loading && (
        <div className={styles.loader}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
    </Modal>
  );
};

export default QuestionnaireModal;
