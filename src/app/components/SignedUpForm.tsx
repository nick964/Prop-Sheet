"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Container, Col, Row, Button} from "react-bootstrap";

interface SignedUpFormProps {
  groupId: string;
}

const SignedUpForm: React.FC<SignedUpFormProps> = ({ groupId }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  console.log('loggin session details in signed up form');
  console.log(JSON.stringify(session));

  const accessToken = session?.user?.accessToken;
  
  useEffect(() => {
    const assignToGroup = async () => {
      try {
        if (accessToken && groupId) {
          // Assuming you have an API endpoint that requires authentication
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}`}
        };
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}groups/addUser?groupId=` + groupId, requestOptions);

          if (response.ok) {
            console.log('your are added to the group');
            router.push('/profile');
          } else {
            console.error('Failed to fetch data from the API');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    console.log('why cant this work');
    assignToGroup();
    }, []);

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={6}>
          <h1>You are now signed up </h1>
        </Col>
      </Row>
    </Container>

  );
};

export default SignedUpForm;
