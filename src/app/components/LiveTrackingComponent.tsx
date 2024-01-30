// Import necessary libraries and components
import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { TrackingResponse } from '../models/tracking-response';


interface Response {
  questionText: string;
  section: string;
  answer: string;
  correctAnswer: string;
  className: string;
  isCorrect: boolean;
  correct: boolean;
  lineValue: number;
}

interface LiveTrackingProps {
  data: TrackingResponse | null;
}

const LiveTracking: React.FC<LiveTrackingProps> = ({ data }) => {
  // Organize responses by section
  const sections: { [key: string]: Response[] } = {};
  data?.responses.forEach((response) => {
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
      <div className="live-tracking-container">
        <h2 className="live-tracking-header tracking">Live Submission Tracking</h2>
        
        <Row className="mb-4 live-tracking-group-details">
          <Col>
            <h3 className="group-name-title">
              Group: <span className="group-name">{data?.groupDetails?.name}</span>
            </h3>
            <div className="leader-details">
            {data?.position == 1 && (
              <p className="lead-message">You are currently in the lead!!</p>
            )}
              <p className="current-leader">Current Leader: <strong>{data?.groupDetails?.inLead?.name}</strong></p>
              <p className="leader-score">{data?.groupDetails?.inLead?.name}&apos;s score: <strong>{data?.groupDetails?.inLead?.score}</strong></p>
            </div>
          </Col>
        </Row>
        
        <Row className="mb-3 scoreHighlightRow">
          <Col md={12} className="scoreHighlightCol">
            <div className="user-details groupPosition">
              <h3>
                Group Position: <span className="positionNumber">{data?.position}</span>
              </h3>
            </div>
            <div className="totalScore">
              <h3>
                Total Score: <span className="scoreNumber">{data?.totalScore}</span>
              </h3>
            </div>
          </Col>
        </Row>
      </div>

      <Row>
        {Object.entries(sections).map(([section, sectionResponses]) => (
          <Col key={section} md={6}>
            <div className="mt-4">
              <h3 className="text-center tracking">{section}</h3>
              <ListGroup>
                {sectionResponses.map((response, index) => (
                  <ListGroup.Item key={index} className={response.className}>
                    <strong>{response.questionText}
                    {response.lineValue ? ` (Line: ${response.lineValue})` : ""}
                    </strong>

                    <br />
                    Your Answer: {response.answer}
                    <br />
                    Correct Answer: {response.correctAnswer}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default LiveTracking;
