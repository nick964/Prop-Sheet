"use client";

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Container, Row, Col, Alert } from "react-bootstrap";
import * as Yup from 'yup';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './LoginForm.module.css';
import { FaTwitter, FaGoogle } from 'react-icons/fa';
import Link from 'next/link';

interface LoginFormValues {
  username: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState('');

  const initialValues: LoginFormValues = {
    username: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required('Email is required')
      .email('Invalid email format'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
  });

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const result = await signIn('credentials', {
        username: values.username,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/profile');
      }
    } catch (error) {
      setError('An error occurred during login');
    }
  };

  const handleSocialSignIn = async (provider: string) => {
    await signIn(provider, { callbackUrl: '/profile' });
  };

  return (
    <div className={styles.pageContainer}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Welcome Back</h1>
              <p className={styles.pageSubtitle}>
                Sign in to continue tracking your Super Bowl props
              </p>
            </div>

            <div className={styles.formCard}>
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                <Form>
                  <div className={styles.formGroup}>
                    <label htmlFor="username" className={styles.formLabel}>Email</label>
                    <Field
                      type="email"
                      name="username"
                      className={styles.formInput}
                      placeholder="Enter your email"
                    />
                    <ErrorMessage name="username" component="div" className={styles.errorMessage} />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="password" className={styles.formLabel}>Password</label>
                    <Field
                      type="password"
                      name="password"
                      className={styles.formInput}
                      placeholder="Enter your password"
                    />
                    <ErrorMessage name="password" component="div" className={styles.errorMessage} />
                  </div>

                  <button type="submit" className={styles.submitButton}>
                    Sign In
                  </button>
                </Form>
              </Formik>

              <div className={styles.divider}>
                <span className={styles.dividerText}>or continue with</span>
              </div>

              <div className={styles.socialButtons}>
                <button
                  onClick={() => handleSocialSignIn('twitter')}
                  className={`${styles.socialButton} ${styles.twitter}`}
                >
                  <FaTwitter /> Continue with Twitter
                </button>
                <button
                  onClick={() => handleSocialSignIn('google')}
                  className={`${styles.socialButton} ${styles.google}`}
                >
                  <FaGoogle /> Continue with Google
                </button>
              </div>

              <div className={styles.signupLink}>
                Don&apos;t have an account? <Link href="/signup">Sign up</Link>
              </div>
              <div className={styles.signupLink}>
                <Link href="/forgot-password">Forgot Password?</Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginForm;