import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';

const imageStyle = {
  borderRadius: '5px',
  border: '3px solid #fff',
  boxShadow: '0 0 10px rgba(0,0,0,0.5)'
}


const HomePage: React.FC = () => {
    return (
        <>
          <div className="hero-section text-center bg-hero-1 pb-5 pt-5" style={{backgroundColor: '#004864'}}>
            <Container style={{ maxWidth: '500px' }}>
              <div className="image-wrapper">
                  <Image
                  src="/images/SuperBowlLogo.png" // Route of the image file
                  height={500} // Desired size with correct aspect ratio
                  width={500} // Desired size with correct aspect ratio
                  alt="Logo for super bowl prop bet tracker"
                  style={imageStyle}
                  layout="responsive"
                  className="img-fluid"
                  
                />
              </div>
                <p className="lead pt-5">
                  The ultimate destination for Super Bowl prop betting fun. Predict, compete, and enjoy the game like never before.
                </p>
                <Link href="/signup">
                  <Button variant="outline-light" size="lg" className="cta-button">
                    Get Started
                  </Button>
                </Link>

            </Container>
          </div>
    
          <div className="hero-section text-center bg-hero-2 pb-5 pt-5">
            <Container>
              <h2>Make Your Predictions</h2>
              <p className="lead">
                Answer exciting prop questions about the Super Bowl.
              </p>
              <Container style={{ maxWidth: '900px' }}>
                <Row className='pb-5'>
                  <Col>
                    <div className="image-wrapper">
                      <Image
                      src="/images/SubmitYourAnswers.png" // Route of the image file
                      height={500} // Desired size with correct aspect ratio
                      width={500} // Desired size with correct aspect ratio
                      alt="Logo for super bowl prop bet tracker"
                      style={imageStyle}
                      layout="responsive"
                      className="img-fluid"
                      
                    />
                  </div>
                  </Col>
                  <Col>
                    <div className="image-wrapper">
                      <Image
                      src="/images/LiveTracking.png" // Route of the image file
                      height={500} // Desired size with correct aspect ratio
                      width={500} // Desired size with correct aspect ratio
                      alt="Logo for super bowl prop bet tracker"
                      style={imageStyle}
                      layout="responsive"
                      className="img-fluid"
                      
                    />
                  </div>
                  </Col>
                  <Col>
                    <div className="image-wrapper">
                      <Image
                      src="/images/Compete.png" // Route of the image file
                      height={500} // Desired size with correct aspect ratio
                      width={500} // Desired size with correct aspect ratio
                      alt="Logo for super bowl prop bet tracker"
                      style={imageStyle}
                      layout="responsive"
                      className="img-fluid"
                      
                    />
                  </div>
                  </Col>
                </Row>
              </Container>
              <Link href="/signup">
                <Button variant="outline-dark" size="lg" className="cta-button">
                  Start Predicting
                </Button>
              </Link>
            </Container>
          </div>
    
          <div className="hero-section text-center bg-hero-3 pb-5 pt-5" style={{backgroundColor: '#004864'}}>
            <Container style={{ maxWidth: '500px' }}>
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
