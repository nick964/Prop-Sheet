"use client";

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Container, Row, Col, Alert } from "react-bootstrap";
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import styles from './LoginForm.module.css';
import Link from 'next/link';
import { OperationResponse } from '../models/operation-response';

interface ResetPasswordValues {
  password: string;
  confirmPassword: string;
}

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token }) => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const initialValues: ResetPasswordValues = {
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
  });

  const handleSubmit = async (values: ResetPasswordValues) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: values.password,
        }),
      });

      if (response.ok) {
        const resetResponse: OperationResponse = await response.json();
        if(resetResponse.status == "SUCCESS") {
          setSuccess(true);
          setError('');
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          setError('Failed to reset password: ' + resetResponse.message);
        }
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to reset password');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Set New Password</h1>
              <p className={styles.pageSubtitle}>
                Choose a new password for your account
              </p>
            </div>

            <div className={styles.formCard}>
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              {success ? (
                <Alert variant="success">
                  <h4>Password Reset Successful!</h4>
                  <p>Your password has been updated. Redirecting to login page...</p>
                </Alert>
              ) : (
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  <Form>
                    <div className={styles.formGroup}>
                      <label htmlFor="password" className={styles.formLabel}>New Password</label>
                      <Field
                        type="password"
                        name="password"
                        className={styles.formInput}
                        placeholder="Enter new password"
                      />
                      <ErrorMessage name="password" component="div" className={styles.errorMessage} />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="confirmPassword" className={styles.formLabel}>Confirm Password</label>
                      <Field
                        type="password"
                        name="confirmPassword"
                        className={styles.formInput}
                        placeholder="Confirm new password"
                      />
                      <ErrorMessage name="confirmPassword" component="div" className={styles.errorMessage} />
                    </div>

                    <button type="submit" className={styles.submitButton}>
                      Reset Password
                    </button>
                  </Form>
                </Formik>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ResetPasswordForm;