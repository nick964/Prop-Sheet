"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Button, Spinner, Alert, Card, Row, Col } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import NotLoggedInComponent from './NotLoggedInComponent';
import styles from './GroupForm.module.css';
import Image from 'next/image';

interface GroupDetails {
  id: number;
  name: string;
  description: string;
  venmoLink: string | null;
  groupCost: number | null;
  icon: string | null;
}

interface FormValues {
  name: string;
  description: string;
  venmoLink: string;
  groupCost: string | number;
}

export default function UpdateGroupForm({ groupId }: { groupId: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [groupIcon, setGroupIcon] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [groupDetails, setGroupDetails] = useState<GroupDetails | null>(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (session?.user?.accessToken) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}groups/details?groupId=${groupId}`,
            {
              headers: { 'Authorization': `Bearer ${session.user.accessToken}` }
            }
          );
          if (response.ok) {
            const data = await response.json();
            setGroupDetails(data);
          } else {
            setError('Failed to fetch group details');
          }
        } catch (error) {
          setError('Error fetching group details');
        }
      }
    };

    fetchGroupDetails();
  }, [groupId, session?.user?.accessToken]);

  if (session?.user?.accessToken == null) {
    return <NotLoggedInComponent />;
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('A group name is required')
      .min(3, 'Group name must be at least 3 characters')
      .max(50, 'Group name must not exceed 50 characters'),
    description: Yup.string()
      .required('A group description is required')
      .min(10, 'Description must be at least 10 characters')
      .max(500, 'Description must not exceed 500 characters'),
    venmoLink: Yup.string()
      .matches(/^@?[\w-]+$/, 'Invalid Venmo username format')
      .transform(value => value ? (value.startsWith('@') ? value : `@${value}`) : '')
      .nullable(),
    groupCost: Yup.number()
      .min(0, 'Group cost cannot be negative')
      .nullable()
      .transform((value) => (isNaN(value) ? null : value))
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
    if (file) {
      if (file.size > (5 * 1024 * 1024)) {
        setError('File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Invalid file type. Please select an image');
        return;
      }
      setGroupIcon(file);
      setError('');
    }
  };

  const handleFormSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('id', groupId);

    // Add all form values to FormData
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value.toString());
      }
    });

    // Add the new icon if one was selected
    if (groupIcon) {
      formData.append('groupIcon', groupIcon);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}groups/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.user.accessToken}`
        },
        body: formData,
      });

      if (response.ok) {
        router.push('/profile');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update group');
      }
    } catch (error) {
      setError('Error updating group. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!groupDetails) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Row className="justify-content-center">
      <Col md={8} lg={6}>
        <Card className={styles.formCard}>
          <Card.Body className="p-4">
            <h2 className="text-center mb-4">Update Group</h2>
            
            {error && 
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            }

            <div className="text-center mb-4">
              <Image
                src={groupDetails.icon || "/images/DefaultGroupIcon.png"}
                alt="Current Group Icon"
                width={100}
                height={100}
                className="rounded-circle"
              />
              <p className="mt-2 text-muted">Current Group Icon</p>
            </div>
            
            <Formik
              initialValues={{
                name: groupDetails.name,
                description: groupDetails.description,
                venmoLink: groupDetails.venmoLink || '',
                groupCost: groupDetails.groupCost || '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleFormSubmit}
            >
              {({ errors, touched }) => (
                <Form>
                  <div className="mb-4">
                    <label htmlFor="name" className={styles.formLabel}>
                      Group Name
                    </label>
                    <Field
                      type="text"
                      className={`form-control ${styles.formInput} ${errors.name && touched.name ? 'is-invalid' : ''}`}
                      id="name"
                      name="name"
                      placeholder="Enter your group name"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="description" className={styles.formLabel}>
                      Group Description
                    </label>
                    <Field
                      as="textarea"
                      className={`form-control ${styles.formInput} ${errors.description && touched.description ? 'is-invalid' : ''}`}
                      id="description"
                      name="description"
                      rows="3"
                      placeholder="Describe your group"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="venmoLink" className={styles.formLabel}>
                      Venmo Username (Optional)
                    </label>
                    <Field
                      type="text"
                      className={`form-control ${styles.formInput} ${errors.venmoLink && touched.venmoLink ? 'is-invalid' : ''}`}
                      id="venmoLink"
                      name="venmoLink"
                      placeholder="@username"
                    />
                    <small className="text-muted">
                      Enter your Venmo username if you want to collect payments from group members
                    </small>
                    <ErrorMessage
                      name="venmoLink"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="groupCost" className={styles.formLabel}>
                      Entry Fee (Optional)
                    </label>
                    <Field
                      type="number"
                      className={`form-control ${styles.formInput} ${errors.groupCost && touched.groupCost ? 'is-invalid' : ''}`}
                      id="groupCost"
                      name="groupCost"
                      placeholder="Enter amount in dollars"
                      min="0"
                      step="1"
                    />
                    <small className="text-muted">
                      Enter the amount each member should pay to join
                    </small>
                    <ErrorMessage
                      name="groupCost"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="icon" className={styles.formLabel}>
                      Update Group Icon
                    </label>
                    <div className={styles.fileInputWrapper}>
                      <input
                        id="icon"
                        name="icon"
                        type="file"
                        onChange={handleFileChange}
                        className={`form-control ${styles.formInput}`}
                        accept="image/*"
                      />
                    </div>
                    <small className="text-muted">
                      Optional. Maximum file size: 5MB
                    </small>
                  </div>

                  <div className="d-flex gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => router.push('/profile')}
                      className="w-100"
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Updating Group...
                        </>
                      ) : (
                        'Update Group'
                      )}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    

);
}