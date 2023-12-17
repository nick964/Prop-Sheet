import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import Link from 'next/link';


const HomePage: React.FC = () => {
    return (
        <>
          <div className="hero-section text-center bg-hero-1">
            <Container>
              <h1>Welcome to PropBetPal!</h1>
              <p className="lead">
                The ultimate destination for Super Bowl prop betting fun. Predict, compete, and enjoy the game like never before.
              </p>
              <Link href="/signup">
                <Button variant="outline-light" size="lg" className="cta-button">
                  Get Started
                </Button>
              </Link>
            </Container>
          </div>
    
          <div className="hero-section text-center bg-hero-2">
            <Container>
              <h2>Make Your Predictions</h2>
              <p className="lead">
                Answer exciting prop questions about the Super Bowl.
              </p>
              <Link href="/signup">
                <Button variant="outline-dark" size="lg" className="cta-button">
                  Start Predicting
                </Button>
              </Link>
            </Container>
          </div>
    
          <div className="hero-section text-center bg-hero-3">
            <Container>
              <h2>Real-time Tracking</h2>
              <p className="lead">
                Watch your predictions unfold live during the Super Bowl.
              </p>
              <Link href="/signup">
                <Button variant="outline-light" size="lg" className="cta-button">
                  Join the Fun
                </Button>
              </Link>
            </Container>
          </div>

          {/* Additional Sections */}
        </>
      );
};

export default HomePage;
