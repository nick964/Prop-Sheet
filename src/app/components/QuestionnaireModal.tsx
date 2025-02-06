import React from 'react';
import { Modal, Button, Alert, ProgressBar, Form, Spinner, Row, Col, Card } from 'react-bootstrap';
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
    <Modal 
      size="lg" 
      show={showModal} 
      onHide={onClose} 
      backdrop="static" 
      keyboard={false}
      className={styles.questionnaireModal}
    >
      <Modal.Header className={styles.modalHeader}>
        <Modal.Title className={styles.modalTitle}>{currentSectionData.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody} key={currentSection}>
        <div className={styles.progressContainer}>
          <ProgressBar 
            now={progress} 
            label={`${progress}%`} 
            variant="success"
            className={styles.progressBar}
          />
          <span className={styles.sectionIndicator}>
            Section {currentSection + 1} of {data.length}
          </span>
        </div>

        {currentSectionData.questions.map((question) => (
          <Card key={question.id} className={styles.questionCard}>
            <Card.Body>
              <Form.Group controlId={question.id}>
                <Form.Label className={styles.questionLabel}>
                  {question.text}
                  {question.lineValue !== null && (
                    <span className={styles.lineValue}>Line: {question.lineValue}</span>
                  )}
                </Form.Label>
                <div className={styles.optionsContainer}>
                  {question.options.map((option) => (
                    <div
                      key={option}
                      className={`${styles.optionButton} ${
                        userResponses[currentSection]?.[question.id] === option ? styles.selected : ''
                      }`}
                      onClick={() => handleResponse(question.id, option)}
                    >
                      <div className={styles.optionContent}>
                        <div className={styles.radioCircle}>
                          {userResponses[currentSection]?.[question.id] === option && (
                            <div className={styles.radioInner} />
                          )}
                        </div>
                        <span className={styles.optionLabel}>{mapOptionLabel(option)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Form.Group>
            </Card.Body>
          </Card>
        ))}
      </Modal.Body>
      <Modal.Footer className={styles.modalFooter}>
        <div className={styles.footerButtons}>
          <Button 
            variant="outline-secondary" 
            onClick={onClose}
            className={styles.footerButton}
          >
            Close
          </Button>
          <Button 
            variant="outline-primary" 
            onClick={onPreviousSection} 
            disabled={isFirstSection}
            className={styles.footerButton}
          >
            Previous
          </Button>
          <Button 
            variant="primary" 
            onClick={onNextSection}
            className={styles.footerButton}
          >
            {currentSection === data.length - 1 ? 'Submit' : 'Next'}
          </Button>
        </div>
        {sectionError && (
          <Alert variant="danger" className={styles.errorAlert}>
            {sectionError}
          </Alert>
        )}
      </Modal.Footer>
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