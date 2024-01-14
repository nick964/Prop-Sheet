"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Field, Form } from 'formik';
import { Button, Form as BootstrapForm, Spinner, Alert} from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import NotLoggedInComponent from './NotLoggedInComponent';
import styles from './GroupForm.module.css';


export default function GroupForm() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [selectedImage, setSelectedImage] = useState(null);
    const [notLoggedIn, setNotLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    console.log('in group form');

    console.log(JSON.stringify(session));

    if(session?.user?.accessToken == null) {
        return (
            <NotLoggedInComponent />
        )
    }


    const handleFormSubmit = async (values: any, selectedImage: File | null) => {
        setIsLoading(true);
        setError('');
        // Do something with the form values and the selected image
        console.log('Form values:', values);
        console.log('Selected image:', selectedImage);

        const createGroupRequ = {
            name: values.name
        };
        const headerTest =  {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + session?.user?.accessToken
            };
        console.log(JSON.stringify(headerTest));


        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}groups/create`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.user?.accessToken
                },
                body: JSON.stringify({ name: values.name }),
            });
            console.log(JSON.stringify(response));
            const data = await response.json();
            console.log(JSON.stringify(data));
            if (response.ok) {
                router.push('/profile');
            } else {
                setError(data.message || 'Failed to create group');
                console.error('Failed to fetch data from the API');
            }
        } catch (error) {
            setError('Error calling API');
        }
        setIsLoading(false);
    };


    return (
        <div className={styles.formContainer}>
            <h3 className={styles.formHeading}>Create a new group</h3>
            {error && 
            <Alert key="danger" variant="danger">
                 {error}
             </Alert>         
            } {/* Display error message */}
            <Formik
                initialValues={{
                    name: '',
                    password: '',
                    image: null,
                }}
                onSubmit={(values) => {
                    handleFormSubmit(values, selectedImage);
                }}
            >
                <Form>
                    <BootstrapForm.Group controlId="groupName" className={styles.formGroup}>
                        <BootstrapForm.Label>Group Name</BootstrapForm.Label>
                        <Field
                            type="text"
                            id="name"
                            name="name"
                            className="form-control"
                            placeholder="Enter Group Name"
                        />
                    </BootstrapForm.Group>

                    <BootstrapForm.Group controlId="groupImage">
                        <BootstrapForm.Label>Group Image</BootstrapForm.Label>
                        <BootstrapForm.Group controlId="formFile" className="mb-3">
                            <BootstrapForm.Label>Default file input example</BootstrapForm.Label>∂
                        </BootstrapForm.Group>
                    </BootstrapForm.Group>

                    {/* Display loader while the form is submitting */}
                    {isLoading && (
                        <div className={styles.loadingSpinner}>
                            <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    )}

                    <Button variant="primary" type="submit" disabled={isLoading}>
                        {isLoading ? 'Creating Group...' : 'Create Group'}
                    </Button>
                </Form>
            </Formik>
        </div>
    )
}