// Import necessary libraries and components

import React from 'react';
import { Container, Button } from 'react-bootstrap';
import Link from 'next/link';

const HomePage: React.FC = () => {
    return (
        <>
          {/* Hero Section 1 */}
          <div  className="hero-section text-center">
            <Container>
              <h1>Welcome to PropBetPal!</h1>
              <p className="lead">
                The ultimate destination for Super Bowl prop betting fun. Predict, compete, and enjoy the game like never before.
              </p>
              <Link href="/signup">
                <Button variant="primary" size="lg">
                  Get Started
                </Button>
              </Link>
            </Container>
          </div>
    
          {/* Hero Section 2 */}
          <div  className="hero-section text-center bg-light">
            <Container>
              <h2>Make Your Predictions</h2>
              <p className="lead">
                Answer exciting prop questions about the Super Bowl. Will your predictions come true? Lock in your bets now!
              </p>
              <Link href="/signup">
                <Button variant="dark" size="lg">
                  Start Predicting
                </Button>
              </Link>
            </Container>
          </div>
    
          {/* Hero Section 3 */}
          <div  className="hero-section text-center">
            <Container>
              <h2>Real-time Tracking</h2>
              <p className="lead">
                Watch your predictions unfold live during the Super Bowl. Compete against friends and see who comes out on top!
              </p>
              <Link href="/signup">
                <Button variant="primary" size="lg">
                  Join the Fun
                </Button>
              </Link>
            </Container>
          </div>
    
          {/* Additional Sections, Features, or Testimonials can be added here */}
        </>
      );
};

export default HomePage;
