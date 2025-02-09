"use client";

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Container, Row, Col, Alert } from "react-bootstrap";
import * as Yup from 'yup';
import styles from './LoginForm.module.css';
import Link from 'next/link';
import { OperationResponse } from '../models/operation-response';

interface ForgotPasswordValues {
  email: string;
}

const ForgotPasswordForm: React.FC = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const initialValues: ForgotPasswordValues = {
    email: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email format'),
  });

  const handleSubmit = async (values: ForgotPasswordValues) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}reset-password/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email }),
      });

      if (response.ok) {
        const resetResponse: OperationResponse = await response.json();
        if(resetResponse.status == "SUCCESS") {
            setSuccess(true);
            setError('');
        } else {
            setError(resetResponse.message || 'Failed to process request');
        }
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to process request');
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
              <h1 className={styles.pageTitle}>Reset Password</h1>
              <p className={styles.pageSubtitle}>
                Enter your email to receive password reset instructions
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
                  <h4>Check your email</h4>
                  <p>We&apos;ve sent you instructions to reset your password.</p>
                  <div className={styles.signupLink}>
                    <Link href="/login">Return to login</Link>
                  </div>
                </Alert>
              ) : (
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  <Form>
                    <div className={styles.formGroup}>
                      <label htmlFor="email" className={styles.formLabel}>Email</label>
                      <Field
                        type="email"
                        name="email"
                        className={styles.formInput}
                        placeholder="Enter your email"
                      />
                      <ErrorMessage name="email" component="div" className={styles.errorMessage} />
                    </div>

                    <button type="submit" className={styles.submitButton}>
                      Send Reset Link
                    </button>
                  </Form>
                </Formik>
              )}

              <div className={styles.signupLink}>
                Remember your password? <Link href="/login">Sign in</Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPasswordForm;