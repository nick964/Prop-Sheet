"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Container, Col, Row, Button} from "react-bootstrap";

interface SignUpFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  groupId: string;
}

const SignedUpForm: React.FC = (props) => {
  console.log('in signed up form');
  console.log(props);
  const groupId = props.groupId;

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
        console.log('calling this url to add user to group');
        console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}groups/addUser`);
        console.log(requestOptions);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}groups/addUser?groupId=` + groupId, requestOptions);

          if (response.ok) {
            console.log('your are added to the group');
            console.log(response);
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
