"use client"
import React from 'react';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const imageStyle = {
  borderRadius: '8px',
  border: '2px solid #fff',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  transition: 'transform 0.3s ease',
}

const HomePage: React.FC = () => {
  const { data: session } = useSession();

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section text-center pb-5 pt-5" style={{ backgroundColor: '#004864' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <div className="text-white">
                <h1 className="display-4 fw-bold mb-4">Super Bowl LIX Prop Tracker</h1>
                <p className="lead mb-4">
                  Join the ultimate Super Bowl experience! Create groups, make predictions, and compete with friends in real-time during the big game.
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <Link href={session ? "/profile" : "/signup"}>
                    <Button variant="light" size="lg" className="fw-bold">
                      {session ? "View Your Groups" : "Get Started"}
                    </Button>
                  </Link>
                  <Link href="/global-leaderboard">
                    <Button variant="outline-light" size="lg">
                      View Leaderboard
                    </Button>
                  </Link>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="image-wrapper">
                <Image
                  src="/images/SuperBowlLogo.png"
                  height={500}
                  width={500}
                  alt="Super Bowl Prop Bet Tracker Logo"
                  style={imageStyle}
                  className="img-fluid hover-scale"
                  priority
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <div className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <Container>
          <h2 className="text-center mb-5 display-5">How It Works</h2>
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="mb-4">
                    <Image
                      src="/images/SubmitYourAnswers.png"
                      height={200}
                      width={200}
                      alt="Submit Predictions"
                      style={imageStyle}
                      className="img-fluid"
                    />
                  </div>
                  <h3 className="h4 mb-3">Make Predictions</h3>
                  <p className="text-muted">
                    Answer exciting prop questions about every aspect of the Super Bowl, from coin toss to final score.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="mb-4">
                    <Image
                      src="/images/LiveTracking.png"
                      height={200}
                      width={200}
                      alt="Live Tracking"
                      style={imageStyle}
                      className="img-fluid"
                    />
                  </div>
                  <h3 className="h4 mb-3">Track Live</h3>
                  <p className="text-muted">
                    Watch your predictions unfold in real-time during the game with our live tracking system.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="mb-4">
                    <Image
                      src="/images/Compete.png"
                      height={200}
                      width={200}
                      alt="Compete"
                      style={imageStyle}
                      className="img-fluid"
                    />
                  </div>
                  <h3 className="h4 mb-3">Compete & Win</h3>
                  <p className="text-muted">
                    Compete with friends in private groups or aim for the top spot on our global leaderboard.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* CTA Section */}
      <div className="py-5" style={{ backgroundColor: '#004864' }}>
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h2 className="text-white mb-4">Ready to Join the Fun?</h2>
              <p className="lead text-white mb-4">
                {session ? "Create a group and start making your Super Bowl predictions!" : "Create your account now and start making your Super Bowl predictions!"}
              </p>
              <Link href={session ? "/create-group" : "/signup"}>
                <Button variant="light" size="lg" className="fw-bold px-5">
                  {session ? "Create Group" : "Sign Up Now"}
                </Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Additional CSS */}
      <style jsx global>{`
        .hover-scale:hover {
          transform: scale(1.02);
        }
        
        .hero-section {
          background-image: linear-gradient(45deg, #003854, #004864);
        }
        
        .display-4 {
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        
        .lead {
          font-size: 1.25rem;
          font-weight: 400;
        }
        
        .card {
          transition: transform 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </>
  );
};

export default HomePage;