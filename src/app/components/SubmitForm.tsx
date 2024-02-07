// components/SubmitForm.tsx

import React, { useEffect, useState } from 'react';
import { AnswerDto } from '../models/answer';
import { QuestionSection } from '../models/question-section';
import QuestionnaireModal from './QuestionnaireModal';
import ConfirmationModal from './ConfirmationModal';
import { useRouter } from 'next/navigation';

interface SubmitFormProps {
  data: QuestionSection[] | null;
  groupId: string;
  onSubmit: (answers: any) => Promise<void>;
}

interface Response {
  [questionId: string]: string; // Assuming questionId is a string and response is a string
  response: string;
}

const SubmitForm: React.FC<SubmitFormProps> = ({ data, onSubmit, groupId }) => {
  const [showModal, setShowModal] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [userResponses, setUserResponses] =  useState<Response[]>([]);
  const [loading, setLoading] = useState(false);
  const [sectionError, setSectionError] = useState<string | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const router = useRouter();

  const handleResponse = (questionId: any, response: any) => {
    setUserResponses((prevResponses) => {
      const updatedResponses = [...prevResponses];
      const currentSectionResponses = updatedResponses[currentSection] || {};
      updatedResponses[currentSection] = { ...currentSectionResponses, [questionId]: response };
      return updatedResponses;
    });
  };

  const validateResponses = (responses: Array<Record<number, string>>, currentSection: number) => {
    const sectionResponses = responses[currentSection] || {};
    const sectionQuestions = data && data[currentSection] ? data[currentSection].questions : [];

    const missingResponses = sectionQuestions.filter((question) => {
      const qNumber = question.id as unknown as number;
      const response = sectionResponses[qNumber];
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
      if (data && currentSection === data.length - 1) {
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
      if(data) {
        for (let j = 0; j < data[i].questions.length; j++) {
          const ans: AnswerDto = {
            questionId: data && data[i] && data[i].questions[j] ? data[i].questions[j].id : null,
            answer: data && data[i] && data[i].questions[j] ? userResponses[i][data[i].questions[j].id] : null,
          };
          answers.push(ans);
        }
      }
    }
    return answers;
  };

  const onCloseModal = () => {
    router.push('/profile');
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

  if(data) {
    return (
      <>
        <QuestionnaireModal
          showModal={showModal}
          currentSection={currentSection}
          data={data || []}
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
  }

};

export default SubmitForm;
