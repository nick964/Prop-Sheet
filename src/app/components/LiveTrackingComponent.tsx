// Import necessary libraries and components
import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';

interface Response {
  questionText: string;
  section: string;
  answer: string;
  correctAnswer: string;
  className: string;
  isCorrect: boolean;
  correct: boolean;
}

interface LiveTrackingProps {
  position: number;
  totalScore: number;
  responses: Response[];
}

const LiveTracking: React.FC<LiveTrackingProps> = ({ position, totalScore, responses }) => {
  // Organize responses by section
  const sections: { [key: string]: Response[] } = {};
  responses.forEach((response) => {
    if (!sections[response.section]) {
      sections[response.section] = [];
    }
    if(response.correctAnswer == '') {
      response.className = 'text-secondary'
    } else if(response.isCorrect || response.answer === response.correctAnswer) {
      response.className = 'text-success'
    } else {
      response.className = 'text-danger'
    }
    sections[response.section].push(response);
  });

  return (
    <Container className="mt-4">
      <h2>Live Submission Tracking</h2>
      <Row className="mb-3">
        <Col>
          <p>
            Group Position: {position} | Total Score: {totalScore}
          </p>
        </Col>
      </Row>

      <Row>
        {Object.entries(sections).map(([section, sectionResponses]) => (
          <Col key={section} md={6}>
            <h3>{section}</h3>
            <ListGroup>
              {sectionResponses.map((response, index) => (
                <ListGroup.Item key={index} className={response.className}>
                  <strong>{response.questionText}</strong>
                  <br />
                  Your Answer: {response.answer}
                  <br />
                  Correct Answer: {response.correctAnswer}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default LiveTracking;
