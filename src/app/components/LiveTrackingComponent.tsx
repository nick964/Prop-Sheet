// Import necessary libraries and components
import React from 'react';
import { Container, Row, Col, ListGroup, Image } from 'react-bootstrap';
import { TrackingResponse } from '../models/tracking-response';
import  ResultsPage  from '../components/ResultsWrapper';

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
  gameStarted: boolean;
  calculationFinished: boolean;
  gameOver: boolean;
}

const LiveTracking: React.FC<LiveTrackingProps> = ({ data, gameStarted, calculationFinished, gameOver }) => {
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

  const showDefaultIcon = (icon: string | null | undefined) => {
    if(icon == null || icon == '') {
      return "/images/DefaultGroupIcon.png";
    } else {
      return icon;
    }
  }



  return (
    <Container className="mt-4">
      <div className="live-tracking-container">
        <div className="live-tracking-image-header">
          <Image 
                    src={"/images/SuperBowl_Header2.png"} 
                    alt="Group Icon"
                    fluid
                    
            />
        </div>

        <h2 className="live-tracking-header tracking">Live Submission Tracking</h2>
        
        <Row className="mb-4 live-tracking-group-details">
          <Col>
            <h3 className="group-name-title">
              Group: 
              <Image 
                src={showDefaultIcon(data?.groupDetails?.icon)} 
                alt="Group Icon"
                roundedCircle // Optional: Makes the image round. Remove if you prefer a square or the original shape.
                className="group-icon" // Custom class for additional styling if needed
                style={{ width: '30px', height: '30px', marginRight: '10px' }} // Inline styles for size & spacing, adjust as needed
              />
              <span className="group-name">{data?.groupDetails?.name}</span>
            </h3>
            <div className="leader-details">
              
            {(data?.position == 1 && gameOver && calculationFinished) && (
              <p className="lead-message">You are the winner!!</p>
            )}

            {(data?.position == 1 && gameStarted && !gameOver) && (
              <p className="lead-message">You are currently in the lead!</p>
            )}
              {(calculationFinished && gameOver) && (
                <p className="lead-message">Winner: {data?.groupDetails?.inLead?.name}</p>
              )}

              {(!calculationFinished) && (
                <div>
                  <p className="lead-message">Current Leader: {data?.groupDetails?.inLead?.name}</p>
                  <p className="leader-score">{data?.groupDetails?.inLead?.name}&apos;s score: {data?.groupDetails?.inLead?.score}</p>
                </div>
              )}

              {(!gameStarted && !gameOver && !calculationFinished) && (
                <div>
                  <p className="lead-message">Waiting for game to start</p>
                </div>
              )}
            </div>
          </Col>
        </Row>

        <Row className="mb-4 live-tracking-group-details">
          <Col xs={12} md={6} className='mb-3'>
            <h3 className="group-name-title text-center">
              Game Status: <br />
              <span className="statusResult">
                {gameOver ? "Game Over" : (gameStarted ? "Game in Progress" : "Game Not Started")}
                
              </span>
            </h3>
          </Col>
          <Col xs={12} md={6}>
            <h3 className="group-name-title text-center">
              Calulation Status: <br/>
              <span className="statusResult">
                {calculationFinished ? "All answers entered! Results are in!" : 
                "Still waiting for all answers to be entered.."}
              </span>
            </h3>
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

        <Row>
          {(data?.groupDetails?.id !== null && data?.groupDetails.id !== undefined) && 
            <ResultsPage groupId={data?.groupDetails.id} isGlobal={false} />
          }
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
