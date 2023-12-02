// components/SubmitForm.tsx

import React, { useEffect, useState } from 'react';
import { AnswerDto } from '../models/answer';
import { QuestionSection } from '../models/question-section';
import QuestionnaireModal from './QuestionnaireModal';
import ConfirmationModal from './ConfirmationModal';

interface SubmitFormProps {
  data: QuestionSection[] | null;
  groupId: string;
  onSubmit: (answers: any) => Promise<void>;
}

const SubmitForm: React.FC<SubmitFormProps> = ({ data, onSubmit, groupId }) => {
  const [showModal, setShowModal] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [userResponses, setUserResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sectionError, setSectionError] = useState<string | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleResponse = (questionId: any, response: any) => {
    setUserResponses((prevResponses) => {
      const updatedResponses = [...prevResponses];
      updatedResponses[currentSection] = { ...updatedResponses[currentSection], [questionId]: response };
      return updatedResponses;
    });
  };

  const validateResponses = (responses: Array<Record<number, string>>, currentSection: number) => {
    const sectionResponses = responses[currentSection] || {};
    const sectionQuestions = data[currentSection].questions;

    const missingResponses = sectionQuestions.filter((question) => {
      const response = sectionResponses[question.id];
      return !response || response.trim() === '';
    });

    return missingResponses;
  };

  const handleNextSection = async () => {
    const missingResponses = validateResponses(userResponses, currentSection);

    if (missingResponses.length > 0) {
      const errMsg = 'Please fill out all questions before proceeding to the next section';
      setSectionError(errMsg);
    } else {
      if (currentSection === data.length - 1) {
        setShowConfirmationModal(true);
      } else {
        setSectionError(null);
        setCurrentSection((prevSection) => prevSection + 1);
      }
    }
  };

  const handlePreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection((prevSection) => prevSection - 1);
    }
  };

  const handleSubmit = async () => {
    const answers = await mapToAnswers();
    const submissionRequest = {
      groupId: groupId,
      finalSubmit: 1,
      answers: answers
    }

    await onSubmit(submissionRequest);
  };

  const mapToAnswers = async () => {
    const answers: AnswerDto[] = [];
    for (let i = 0; i < userResponses.length; i++) {
      for (let j = 0; j < data[i].questions.length; j++) {
        const ans: AnswerDto = {
          questionId: data[i].questions[j].id,
          answer: userResponses[i][data[i].questions[j].id],
        };
        answers.push(ans);
      }
    }
    return answers;
  };

  const onCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmSubmission = async () => {
    setLoading(true);
    await handleSubmit();
    setShowConfirmationModal(false);
    setLoading(false);
  };

  const handleCancelSubmission = () => {
    setShowConfirmationModal(false);
  };

  return (
    <>
      <QuestionnaireModal
        showModal={showModal}
        currentSection={currentSection}
        data={data}
        userResponses={userResponses}
        onClose={onCloseModal}
        onPreviousSection={handlePreviousSection}
        onNextSection={handleNextSection}
        loading={loading}
        sectionError={sectionError}
        handleResponse={handleResponse}
      />
      <ConfirmationModal
      showModal={showConfirmationModal}
      onConfirm={handleConfirmSubmission}
      onCancel={handleCancelSubmission}
    />
      </>
  );
};

export default SubmitForm;
