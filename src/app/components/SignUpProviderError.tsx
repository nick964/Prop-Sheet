"use client";

import React from 'react';
import { Container, Col, Row, Button, Modal} from "react-bootstrap";

interface ProviderErrorProps {
  errorMessage: string;
}

const SignUpProviderError: React.FC<ProviderErrorProps> = ({ errorMessage }) => {
  return (
  <>
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={6}>
          <h1>Sign Up Error</h1>
          <p>{errorMessage}</p>
        </Col>
      </Row>
    </Container>
  </>
  
  );
};

export default SignUpProviderError;
