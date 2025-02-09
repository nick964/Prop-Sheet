import React from 'react';
import { Container, ListGroup, Image } from 'react-bootstrap';
import { TrackingResponse } from '../models/tracking-response';
import ResultsPage from '../components/ResultsWrapper';
import styles from './LiveTracking.module.css';

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

const LiveTracking: React.FC<LiveTrackingProps> = ({ 
  data, 
  gameStarted, 
  calculationFinished, 
  gameOver 
}) => {
  const sections: { [key: string]: Response[] } = {};
  data?.responses.forEach((response) => {
    if (!sections[response.section]) {
      sections[response.section] = [];
    }
    sections[response.section].push(response);
  });

  const showDefaultIcon = (icon: string | null | undefined) => {
    return icon || "/images/DefaultGroupIcon.png";
  };

  const getStatusText = () => {
    if (gameOver) return "Game Over";
    if (gameStarted) return "Game in Progress";
    return "Game Not Started";
  };

  const getCalculationText = () => {
    return calculationFinished 
      ? "All answers entered! Results are in!"
      : "Still waiting for all answers to be entered..";
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Image 
            src="/images/SuperBowl_Header3.png"
            alt="Super Bowl Header"
            className={styles.headerImage}
            fluid
          />
          <h1 className={`${styles.title} tracking`}>Live Submission Tracking</h1>
        </div>

        <div className={styles.groupSection}>
          <div className={styles.groupHeader}>
            <Image 
              src={showDefaultIcon(data?.groupDetails?.icon)}
              alt="Group Icon"
              className={styles.groupIcon}
            />
            <div className={styles.groupInfo}>
              <h2 className={styles.groupName}>{data?.groupDetails?.name}</h2>
              {(data?.groupDetails?.venmo || data?.groupDetails?.cost) && (
                <div className={styles.paymentInfo}>
                  {data.groupDetails.cost > 0 && (
                    <span className={styles.cost}>Entry Fee: ${data.groupDetails.cost}</span>
                  )}
                  {data.groupDetails.venmo && (
                    <a 
                      href={`https://venmo.com/${data.groupDetails.venmo.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.venmoLink}
                    >
                      Pay via Venmo: @{data.groupDetails.venmo}
                    </a>
                  )}
                </div>
              )}
              {data?.groupDetails?.description && (
                <p className={styles.groupDescription}>
                  {data.groupDetails.description}
                </p>
              )}
            </div>
          </div>

          {(data?.position === 1 && gameOver && calculationFinished) && (
            <div className={styles.winnerMessage}>
              🏆 Congratulations! You are the winner!!
            </div>
          )}

          {(data?.position === 1 && gameStarted && !gameOver) && (
            <div className={styles.leadMessage}>
              🌟 You are currently in the lead!
            </div>
          )}

          <div className={styles.statusGrid}>
            <div className={styles.statusCard}>
              <div className={styles.statusLabel}>Game Status</div>
              <div className={styles.statusValue}>{getStatusText()}</div>
            </div>
            <div className={styles.statusCard}>
              <div className={styles.statusLabel}>Calculation Status</div>
              <div className={styles.statusValue}>{getCalculationText()}</div>
            </div>
          </div>

          <div className={styles.scoreSection}>
            <div className={styles.scoreCard}>
              <div className={styles.scoreLabel}>Group Position</div>
              <div className={styles.scoreValue}>#{data?.position}</div>
            </div>
            <div className={styles.scoreCard}>
              <div className={styles.scoreLabel}>Total Score</div>
              <div className={styles.scoreValue}>{data?.totalScore}</div>
            </div>
          </div>

          {(data?.groupDetails?.id !== null && data?.groupDetails.id !== undefined) && (
            <ResultsPage groupId={data?.groupDetails.id} isGlobal={false} />
          )}
        </div>

        <div className={styles.questionsGrid}>
          {Object.entries(sections).map(([section, sectionResponses]) => (
            <React.Fragment key={section}>
              <h3 className={styles.sectionTitle}>{section}</h3>
              {sectionResponses.map((response, index) => (
                <div key={index} className={styles.questionCard}>
                  <div className={styles.questionText}>
                    {response.questionText}
                    {response.lineValue && (
                      <span className={styles.lineValue}>Line: {response.lineValue}</span>
                    )}
                  </div>
                  <div className={styles.answerGrid}>
                    <div className={styles.answerRow}>
                      <span className={styles.answerLabel}>Your Answer:</span>{' '}
                      <span className={response.correctAnswer ? (response.isCorrect ? styles.correct : styles.incorrect) : styles.pending}>
                        {response.answer}
                      </span>
                    </div>
                    <div className={styles.answerRow}>
                      <span className={styles.answerLabel}>Correct Answer:</span>{' '}
                      <span className={response.correctAnswer ? styles.correct : styles.pending}>
                        {response.correctAnswer || 'Pending...'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;