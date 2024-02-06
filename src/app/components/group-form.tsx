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

        //validate that the file is an image
        const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
        if(file) {
            if(file.type.split('/')[0] !== 'image') {
                setError('Invalid file type. Please select an image');
                return;
            }
            else {
                setGroupIcon(file); // Update the state with the new file
                setError('');
            }
        }
      };

    const handleFormSubmit = async (values: any) => {
        setIsLoading(true);
        setError('');
        // Do something with the form values and the selected image
        console.log('Form values:', values);
        const formData = new FormData();

        // Append all form fields to the formData object
        Object.keys(values).forEach(key => {
         const value = values[key as keyof typeof values];
         if (key !== 'groupIcon' && value !== undefined && value !== null) {
           // Append only if value is not undefined and not null
           formData.append(key, value.toString()); // Convert value to string
           console.log('Appending ' + key + ' with value ' + value.toString());
         }
       });
   
       if (groupIcon) {
         formData.append('groupIcon', groupIcon, groupIcon.name); // Append the file to the formData
       }

        try {
            console.log('Calling API to create group');
            console.log('Form data: ' + JSON.stringify(formData));
            console.log('Group Icon: ' + groupIcon);
            const options = {
                method: 'POST',
                headers: {
                'Authorization': 'Bearer ' + session?.user?.accessToken
                },
                body: formData,
            };
            console.log(JSON.stringify(options));
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}groups/create`, options);
            console.log('Response from API');
            console.log(response);
            const data = await response.json();
            if (response.ok) {
                router.push('/profile');
            } else {
                setError(data.message || 'Failed to create group');
                console.error('Failed to fetch data from the API');
            }
        } catch (error) {
            console.log(JSON.stringify(error));
            console.error('Failed to fetch data from the API - group creation', error);
            setError('Error calling API' + JSON.stringify(error));
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