// NotLoggedInComponent.tsx
import React from 'react';
import { Modal, Button, Container, Alert} from 'react-bootstrap';
import { useRouter } from 'next/navigation';


const NotLoggedInComponent: React.FC = () => {
    const router = useRouter();
  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
    <Alert variant="info" className="text-center d-flex flex-column align-items-center">
      <p>You need to sign in to access this page.</p>
      <Button variant="primary" onClick={() => router.push('/login')} className="mb-2 w-50">
        Sign In
      </Button>
      <Button variant="primary" onClick={() => router.push('/signup')}  className="w-50">
        Register
      </Button>
    </Alert>
  </Container>
  );
};

export default NotLoggedInComponent;
