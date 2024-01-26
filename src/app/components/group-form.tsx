"use client"

import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Button, Form as BootstrapForm, Spinner, Alert} from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import NotLoggedInComponent from './NotLoggedInComponent';
import styles from './GroupForm.module.css';


export default function GroupForm() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [selectedImage, setSelectedImage] = useState(null);
    const [notLoggedIn, setNotLoggedIn] = useState(false);
    const [groupIcon, setGroupIcon] = React.useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    console.log('in group form');

    console.log(JSON.stringify(session));

    if(session?.user?.accessToken == null) {
        return (
            <NotLoggedInComponent />
        )
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('A group name is required'),
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
        setGroupIcon(file); // Update the state with the new file
      };


    const handleFormSubmit = async (values: any) => {
        setIsLoading(true);
        setError('');
        // Do something with the form values and the selected image
        console.log('Form values:', values);
        console.log('Selected image:', selectedImage);

        const formData = new FormData();

        // Append all form fields to the formData object
        Object.keys(values).forEach(key => {
         const value = values[key as keyof typeof values];
         if (key !== 'groupIcon' && value !== undefined && value !== null) {
           // Append only if value is not undefined and not null
           formData.append(key, value.toString()); // Convert value to string
         }
       });
   
       if (groupIcon) {
         formData.append('groupIcon', groupIcon, groupIcon.name); // Append the file to the formData
       }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}groups/create`, {
                method: 'POST',
                headers: {
                'Authorization': 'Bearer ' + session?.user?.accessToken
                },
                body: formData,
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
                    description: '',
                    groupIcon: null,
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    handleFormSubmit(values);
                }}
            >
                <Form>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Group Name
                    </label>
                    <Field type="text" className="form-control" id="name" name="name" />
                    <ErrorMessage name="name" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                        Group Description
                    </label>
                    <Field type="text" className="form-control" id="description" name="description" />
                    <ErrorMessage name="description" component="div" className="text-danger" />
                </div>
                
                <div className="mb-3">
                    <label htmlFor="groupIcon" className="form-label">
                    Group Icon
                    </label>
                    <input id="groupIcon" name="groupIcon" type="file" onChange={handleFileChange} className="form-control" />
                    <ErrorMessage name="groupIcon" component="div" className="text-danger" />
                </div>

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