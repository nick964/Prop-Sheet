"use client";

import  { useState } from 'react';
import { Alert, ProgressBar, Modal, Button, Stack, Form, Spinner} from "react-bootstrap";
import { QuestionSection } from "../models/question-section";
import { Formik } from 'formik';
import styles from './SubmitComponent.module.css';

const Questionnaire = ({ data }) => {
  const [showModal, setShowModal] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [userResponses, setUserResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sectionError, setSectionError] = useState<string | null>(null);

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

  const mapToAnswers = async () => {--
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
        setSectionError(null);
        setCurrentSection((prevSection) => prevSection + 1);
      }
    }
  };

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

    try {
      // Assuming you have an endpoint to handle the user's responses
      const response = await fetch('https://your-api-endpoint.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userResponses }),
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

  const currentSectionData = data[currentSection];
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

const ExampleComponent = () => {
  const jsonData: QuestionSection[] = [{"id":2,"name":"Game Points","questions":[{"id":1,"text":"1st Quarter","questionType":"radio","lineValue":5.5,"options":["O","U"]},{"id":2,"text":"2nd Quarter","questionType":"radio","lineValue":null,"options":["O","U"]},{"id":3,"text":"3rd Quarter","questionType":"radio","lineValue":null,"options":["O","U"]},{"id":4,"text":"4th Quarter","questionType":"radio","lineValue":null,"options":["O","U"]}]},{"id":3,"name":"National Anthem","questions":[{"id":5,"text":"Heads or Tails","questionType":"radio","lineValue":null,"options":["Y","N"]},{"id":6,"text":"Winner of Coin Toss","questionType":"radio","lineValue":null,"options":["Y","N"]}]},{"id":4,"name":"Halftime","questions":[{"id":7,"text":"First Song \"Umbrella\"","questionType":"radio","lineValue":null,"options":["Y","N"]},{"id":8,"text":"Last Song Diamonds","questionType":"radio","lineValue":null,"options":["Y","N"]}]},{"id":5,"name":"Yes or No Propositions","questions":[{"id":9,"text":"Will Mary J. Blige Perform First?","questionType":"radio","lineValue":null,"options":["Y","N"]},{"id":10,"text":"Will Eminem Sing “Lose Yourself”?","questionType":"radio","lineValue":null,"options":["Y","N"]},{"id":11,"text":"Will Snoop Dogg Smoke and Sing “The Next Episode”?","questionType":"radio","lineValue":null,"options":["Y","N"]},{"id":12,"text":"Will Kendrick Lamar Sing “HUMBLE”?","questionType":"radio","lineValue":null,"options":["Y","N"]},{"id":13,"text":"Will Dr. Dre Sing “California Love”?","questionType":"radio","lineValue":null,"options":["Y","N"]},{"id":14,"text":"Will the First Commercial Break Contain a Car Commercial?","questionType":"radio","lineValue":null,"options":["Y","N"]},{"id":15,"text":"Will a Cheetos Commercial Appear Before a Pringles Commercial?","questionType":"radio","lineValue":null,"options":["Y","N"]},{"id":16,"text":"Will a Captain Morgan Commercial Appear Before a BMW Commercial?","questionType":"radio","lineValue":null,"options":["Y","N"]}]}];

  return <Questionnaire data={jsonData} />;
};

export default ExampleComponent;