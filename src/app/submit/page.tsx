"use client";

import  { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Alert, ProgressBar, Modal, Button, Stack, Form, Spinner} from "react-bootstrap";
import { QuestionSection } from "../models/question-section";
import { Formik } from 'formik';
import styles from './SubmitComponent.module.css';

interface SubmitPageProps {
  groupId: string;
}

const Questionnaire = ({ data }) => {
  const [showModal, setShowModal] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [userResponses, setUserResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sectionError, setSectionError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const accessToken = session?.user?.accessToken;


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
      return !response || response.trim() === ''; // You can adjust this based on your validation logic
    });

    return missingResponses;
  };

  const mapToAnswers = async () => {
    const answers: AnswerDto[] = [];
    for(let i = 0; i < userResponses.length; i++) {
      for(let j = 0; j < data[i].questions.length; j++) {
        const ans: AnswerDto = {
          questionId: data[i].questions[j].id,
          answer: userResponses[i][data[i].questions[j].id]
        }
        answers.push(ans);
      }
    }
    return answers;
  }

  const handleNextSection = async (formik: any) => {
    const missingResponses = validateResponses(userResponses, currentSection);
    console.log(accessToken);

    if (missingResponses.length > 0) {
      const errMsg = 'Please fill out all questions before proceeding to the next section';
      setSectionError(errMsg);
    } else {
      // Check if the current section is the last one
      if (currentSection === data.length - 1) {
        // Perform submit action (replace this with your actual submit logic)
        console.log('Submitting:', userResponses);
        await handleSubmit();
        setShowModal(false); // Close the modal after submitting
      } else {
        await handleSubmit();
        setSectionError(null);
        setCurrentSection((prevSection) => prevSection + 1);
      }
    }
  };

  const submitCurrentSelections = async (submissions: any) => {
    console.log('Submitting current selections', submissions);
    await handleSubmit();
  }

  const handlePreviousSection = () => {
    if(currentSection > 0) {
      setCurrentSection((prevSection) => prevSection - 1);
    }
  }


  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const answers = await mapToAnswers();
    console.log('Submitting:', answers);

    const submissionRequest = {
      groupId: 1,
      answers: answers
    }

    try {
      console.log('hitting this url');
      console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}members/submit`);
      // Assuming you have an endpoint to handle the user's responses
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}members/submit`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( submissionRequest ),
      });

      if (response.ok) {
        console.log('Submission successful!');
        // Handle success, e.g., show a success message or redirect
      } else {
        console.error('Submission failed:', response.statusText);
        // Handle failure, e.g., show an error message
      }
    } catch (error) {
      console.error('Error during submission:', error);
      // Handle error, e.g., show an error message
    } finally {
      setLoading(false);
    }
  };

  const currentSectionData = data == null ? true : data[currentSection];
  const isFirstSection = currentSection === 0;
   // Calculate progress percentage
   
   const progress = ((currentSection + 1) / data.length) * 100;

  return (
    <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
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
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handlePreviousSection} disabled={isFirstSection}>
          Previous Section
        </Button>
        <Button variant="primary" onClick={handleNextSection}>
        {currentSection === data.length - 1 ? 'Submit' : 'Next Section'}
        </Button>
      </Modal.Footer>
       {/* Error Message */}
       {sectionError && (
            <Alert variant="danger">
              {sectionError}
            </Alert>
       )}
        {/* Loader */}
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

const ExampleComponent: React.FC<SubmitPageProps> = ({ groupId }) => {
  const { data: session, status } = useSession();
  const accessToken = session?.user?.accessToken;
  console.log('loggin session details in signed up form');
  console.log(JSON.stringify(session));

  const [questions, setQuestions] = useState<QuestionSection[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (accessToken) {
          // Assuming you have an API endpoint that requires authentication
        const requestOptions = {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${accessToken}`}
        };
        console.log('calling this url for question data');
        console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}questions/all`);
        console.log(requestOptions);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}questions/all`, requestOptions);

          if (response.ok) {
            const result: QuestionSection[] = await response.json();
            console.log('logging result for questions');
            console.log(result);
            setQuestions(result);
          } else {
            console.error('Failed to fetch data from the API');
          }
        } 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    }, []);

  if(status === 'loading' || questions == null) {
    return <div>Loading...</div>;
  }
  
  return <Questionnaire data={questions} />;
};

export default ExampleComponent;