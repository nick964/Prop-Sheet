"use client";

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Container, Col, Row, Button, Modal} from "react-bootstrap";
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import styles from './SignUpForm.module.css';

interface SignUpFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  groupId: string;
  profilePicture?: File | null;
}

interface GroupFormProps {
  groupId: string;
}

const SignUpForm: React.FC<GroupFormProps> = ({ groupId }) => {
  const router = useRouter();
  const [showModal, setShowModal] = React.useState(false);
  const [profilePicture, setProfilePicture] = React.useState<File | null>(null);

  const initialValues: SignUpFormValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    groupId: groupId,
    profilePicture: null,
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
    setProfilePicture(file); // Update the state with the new file
  };

  const handleSignIn = async (provider: string, groupId: string) => {
    console.log('logging groupId handle sign in');
    console.log(groupId);
    var myCallbackUrl = `/signedup`;
    if(groupId) {
      myCallbackUrl = myCallbackUrl + '?groupid=' + groupId;
    }
    await signIn(provider, { callbackUrl: myCallbackUrl });
  }

  const handleSubmit = async (values: SignUpFormValues, { resetForm }: { resetForm: () => void }) => {
    // Handle form submission here (e.g., send data to a server)
    const formData = new FormData();

     // Append all form fields to the formData object
     Object.keys(values).forEach(key => {
      const value = values[key as keyof typeof values];
      if (key !== 'picture' && value !== undefined && value !== null) {
        // Append only if value is not undefined and not null
        formData.append(key, value.toString()); // Convert value to string
      }
    });

    if (profilePicture) {
      formData.append('picture', profilePicture, profilePicture.name); // Append the file to the formData
    }

    const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/auth/signup`, {
      method: 'POST',
      body: formData,
    }).then((res) => {
      console.log(res);
      if (res.ok) {
        console.log('success');
        setShowModal(true);
       
      } else {
        console.log('error');
      }
    });
    console.log(result);
    resetForm();

  };

  const handleClose = () => {
    setShowModal(false);
    router.push('/api/auth/signin/credentials');
  };

  return (
    <>
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={6}>
          <h1>Sign Up</h1>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      <Form>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <Field type="text" className="form-control" id="firstName" name="firstName" />
          <ErrorMessage name="firstName" component="div" className="text-danger" />
        </div>

        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <Field type="text" className="form-control" id="lastName" name="lastName" />
          <ErrorMessage name="lastName" component="div" className="text-danger" />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <Field type="email" className="form-control" id="email" name="email" />
          <ErrorMessage name="email" component="div" className="text-danger" />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <Field type="password" className="form-control" id="password" name="password" />
          <ErrorMessage name="password" component="div" className="text-danger" />
        </div>

        <div className="mb-3">
            <label htmlFor="picture" className="form-label">
              Picture
            </label>
            <input id="picture" name="picture" type="file" onChange={handleFileChange} className="form-control" />
            <ErrorMessage name="picture" component="div" className="text-danger" />
        </div>

          <Field type="hidden" className="form-control" id="groupId" name="groupId" value={groupId} />

        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </Form>
    </Formik>

          <div id="OauthSigninOptions"className={`mt-4 ${styles.OauthSigninOptions}`}>
            <h2>Or sign up with</h2>
            <Button variant="outline-primary" onClick={() => handleSignIn('facebook', groupId)}  className={`oauth-button ${styles.oauthButton}`}>
              Sign up with Facebook
            </Button>
            <Button variant="outline-info" onClick={() => handleSignIn('twitter', groupId)}  className={`oauth-button ${styles.oauthButton}`}>
              Sign up with Twitter
            </Button>
            <Button variant="outline-danger" onClick={() => handleSignIn('google', groupId)}  className={`oauth-button ${styles.oauthButton}`}>
              Sign up with Google
            </Button>
          </div>
        </Col>
      </Row>
    </Container>

    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Sign Up Successful</Modal.Title>
      </Modal.Header>
      <Modal.Body>Woohoo, you are successfully signed up! Please go to the sign up page to login.</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
    </>

    

  );
};

export default SignUpForm;
