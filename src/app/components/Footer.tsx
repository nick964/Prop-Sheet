// Footer.tsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-3 bg-light">
      <Container>
        <Row>
          <Col className="text-center">
            <span>Created by Protect PA Plants LLC - 2024 - info@superbowlproptracker.com</span>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
