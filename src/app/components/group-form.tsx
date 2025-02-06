"use client"

import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Button, Form as BootstrapForm, Spinner, Alert, Card, Row, Col } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import NotLoggedInComponent from './NotLoggedInComponent';
import styles from './GroupForm.module.css';

export default function GroupForm() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [notLoggedIn, setNotLoggedIn] = useState(false);
    const [groupIcon, setGroupIcon] = React.useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if(session?.user?.accessToken == null) {
        return (
            <NotLoggedInComponent />
        )
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('A group name is required')
            .min(3, 'Group name must be at least 3 characters')
            .max(50, 'Group name must not exceed 50 characters')
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
        if(file) {
            if(file.size > (5 * 1024 * 1024)) {
                setError('File size must be less than 5MB');
                return;
            }
            if(file.type.split('/')[0] !== 'image') {
                setError('Invalid file type. Please select an image');
                return;
            }
            else {
                setGroupIcon(file);
                setError('');
            }
        }
    };

    const handleFormSubmit = async (values: any) => {
        setIsLoading(true);
        setError('');
        const formData = new FormData();

        Object.keys(values).forEach(key => {
            const value = values[key as keyof typeof values];
            if (key !== 'groupIcon' && value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });
   
        if (groupIcon) {
            formData.append('groupIcon', groupIcon, groupIcon.name);
        }

        try {
            const options = {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + session?.user?.accessToken
                },
                body: formData,
            };
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}groups/create`, options);
            const data = await response.json();
            if (response.ok) {
                router.push('/profile');
            } else {
                setError(data.message || 'Failed to create group');
            }
        } catch (error) {
            setError('Error creating group. Please try again.');
        }
        setIsLoading(false);
    };

    return (
        <Row className="justify-content-center">
            <Col md={8} lg={6}>
                <Card className={styles.formCard}>
                    <Card.Body className="p-4">
                        {error && 
                            <Alert variant="danger" className="mb-4">
                                {error}
                            </Alert>
                        }
                        
                        <Formik
                            initialValues={{
                                name: '',
                                description: '',
                                groupIcon: null,
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
                                        <label htmlFor="groupIcon" className={styles.formLabel}>
                                            Group Icon
                                        </label>
                                        <div className={styles.fileInputWrapper}>
                                            <input
                                                id="groupIcon"
                                                name="groupIcon"
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

                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={isLoading}
                                        className={styles.submitButton}
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
                                                Creating Group...
                                            </>
                                        ) : (
                                            'Create Group'
                                        )}
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}