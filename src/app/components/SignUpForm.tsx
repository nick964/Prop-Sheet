"use client";

import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Container, Row, Col, Button, Modal, Image } from "react-bootstrap";
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { BasicGroupDetails } from '../models/tracking-response';
import styles from './SignUpForm.module.css';
import { FaFacebook, FaTwitter, FaGoogle } from 'react-icons/fa';

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
  const { data: session } = useSession();
  const [showModal, setShowModal] = React.useState(false);
  const [showAlreadyInModal, setShowAlreadyInModal] = React.useState(false);
  const [groupDetails, setGroupDetails] = React.useState<BasicGroupDetails | null>(null);
  const [profilePicture, setProfilePicture] = React.useState<File | null>(null);
  const accessToken = session?.user?.accessToken;

  const initialValues: SignUpFormValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    groupId: groupId,
    profilePicture: null,
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required('First name is required')
      .min(2, 'First name must be at least 2 characters'),
    lastName: Yup.string()
      .required('Last name is required')
      .min(2, 'Last name must be at least 2 characters'),
    email: Yup.string()
      .required('Email is required')
      .min(6, 'Email must be at least 6 characters'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      setProfilePicture(file);
    }
  };

  const handleSignIn = async (provider: string) => {
    const callbackUrl = groupId ? `/signedup?groupid=${groupId}` : '/signedup';
    await signIn(provider, { callbackUrl });
  };

  const fetchGroupDetails = async () => {
    if (accessToken && groupId) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}groups/details?groupId=${groupId}`,
          { headers: { 'Authorization': `Bearer ${accessToken}` } }
        );
        if (response.ok) {
          const result = await response.json();
          setGroupDetails(result);
          setShowAlreadyInModal(true);
        }
      } catch (error) {
        console.error('Error fetching group data:', error);
      }
    }
  };

  const addToGroup = async () => {
    if (accessToken && groupId) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}groups/addUser?groupId=${groupId}`,
          {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}` }
          }
        );
        if (response.ok) {
          router.push('/profile');
        }
      } catch (error) {
        console.error('Error adding user to group:', error);
      }
    }
  };

  useEffect(() => {
    if (session && accessToken && groupId) {
      fetchGroupDetails();
    }
  }, [session, accessToken, groupId]);

  const handleSubmit = async (values: SignUpFormValues, { resetForm }: { resetForm: () => void }) => { 
    const formData = new FormData();
    console.log('values:', values);
    console.log('starting submit');
    Object.entries(values).forEach(([key, value]) => {
      if (key !== 'picture' && value) {
        formData.append(key, value.toString());
      }
    });

    if (profilePicture) {
      console.log('Profile picture:', profilePicture);
      console.log('Type:', profilePicture.type);
      console.log('Size:', profilePicture.size);
      formData.append('picture', profilePicture);
    }
    

    try {
      console.log('attempting fetch call')
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/auth/signup`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setShowModal(true);
        resetForm();
      } else {
        const error = await response.json();
        console.error('Error during signup:', error);
        alert(error.message || 'An error occurred during signup');
      }
    } catch (error) {
      console.log('Unhandeled Error during signup:', error);
      alert('Unhandled error occurred during signup');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Create Your Account</h1>
              <p className={styles.pageSubtitle}>
                Join the ultimate Super Bowl experience
              </p>
            </div>

            <div className={styles.formCard}>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                <Form>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>First Name</label>
                    <Field
                      type="text"
                      name="firstName"
                      className={styles.formInput}
                      placeholder="Enter your first name"
                    />
                    <ErrorMessage name="firstName" component="div" className={styles.errorMessage} />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Last Name</label>
                    <Field
                      type="text"
                      name="lastName"
                      className={styles.formInput}
                      placeholder="Enter your last name"
                    />
                    <ErrorMessage name="lastName" component="div" className={styles.errorMessage} />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email</label>
                    <Field
                      type="email"
                      name="email"
                      className={styles.formInput}
                      placeholder="Enter your email"
                    />
                    <ErrorMessage name="email" component="div" className={styles.errorMessage} />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Password</label>
                    <Field
                      type="password"
                      name="password"
                      className={styles.formInput}
                      placeholder="Create a password"
                    />
                    <ErrorMessage name="password" component="div" className={styles.errorMessage} />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Profile Picture</label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className={styles.fileInput}
                      accept="image/*"
                    />
                    <small className="text-muted d-block mt-1">
                      Optional. Maximum file size: 5MB
                    </small>
                  </div>

                  <button type="submit" className={styles.submitButton}>
                    Create Account
                  </button>
                </Form>
              </Formik>

              <div className={styles.divider}>
                <span className={styles.dividerText}>or continue with</span>
              </div>

              <div className={styles.socialButtons}>
                <button
                  onClick={() => handleSignIn('twitter')}
                  className={`${styles.socialButton} ${styles.twitter}`}
                >
                  <FaTwitter /> Continue with Twitter
                </button>
                <button
                  onClick={() => handleSignIn('google')}
                  className={`${styles.socialButton} ${styles.google}`}
                >
                  <FaGoogle /> Continue with Google
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <Modal show={showAlreadyInModal} onHide={() => setShowAlreadyInModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Join Existing Group?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You are already signed in. Would you like to join this group?</p>
          {groupDetails && (
            <div>
              <p><strong>Group Name:</strong> {groupDetails.name}</p>
              <p><strong>Group Admin:</strong> {groupDetails.admin?.name}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={addToGroup}>
            Join Group
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModal} onHide={() => {
        setShowModal(false);
        router.push('/api/auth/signin/credentials');
      }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Sign Up Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <h5 className="mb-4">Welcome to Super Bowl Prop Tracker!</h5>
          <p>You can now sign in with your credentials.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => {
            setShowModal(false);
            router.push('/api/auth/signin/credentials');
          }}>
            Continue to Sign In
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SignUpForm;