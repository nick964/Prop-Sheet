// components/QuestionnaireModal.tsx

import React from 'react';
import { Modal, Button, Alert, ProgressBar, Form, Spinner, Row, Col } from 'react-bootstrap';
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
  const mapOptionLabel = (option: string) => {
    switch (option) {
      case 'O':
        return 'Over';
      case 'U':
        return 'Under';
      case 'Y':
        return 'Yes';
      case 'N':
        return 'No';
      default:
        return option;
    }
  }
  const currentSectionData = data[currentSection];
  const isFirstSection = currentSection === 0;
  const progress = Math.round(((currentSection + 1) / data.length) * 100);

  return (
    <Modal size="lg" show={showModal} onHide={onClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{currentSectionData.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={'modal-content'} key={currentSection}>
        <ProgressBar now={progress} label={`${progress}%`} />
        {currentSectionData.questions.map((question) => (
          <div key={question.id} className='mb-2 mt-2'>
            <Form key={question.id}>
              <Form.Group controlId={question.id}>
                <Form.Label >
                  <b>
                  {question.text}
                  {question.lineValue !== null && `: ${question.lineValue}`}
                  </b>
                </Form.Label>
                <Row className='g-3'>              
                {question.options.map((option) => (
                  <Col
                    xs={12} sm={6} md={4} lg={3} xl={3} // Responsive grid columns
                    className="d-flex" // This will help with aligning the label and input
                    key={option}
                  >
                  <Form.Check
                    key={option}
                    type="radio"
                    label={mapOptionLabel(option)}
                    name={`question-${question.id}`}
                    checked={userResponses[currentSection]?.[question.id] === option}
                    onChange={() => handleResponse(question.id, option)}
                    className="flex-grow-1"
                  />
                  </Col>
                ))}
                </Row>
              </Form.Group>
            </Form>
          </div>
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
