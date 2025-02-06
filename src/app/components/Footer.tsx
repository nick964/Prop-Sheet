// Footer.tsx
import Link from 'next/link';
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-3 bg-light">
      <Container>
        <Row>
          <Col className="text-center">
            <span>Created by Nick Robinson - 2025 - nickr964@gmail.com</span><br />
              <div className='termsCondish'>
                <Link href="/terms-and-conditions"> Terms and Conditions</Link> | <Link href="/privacy-policy">Privacy Policy</Link>
              </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
