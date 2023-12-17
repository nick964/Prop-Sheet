"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Field, Form } from 'formik';
import { Button, Form as BootstrapForm, Spinner } from 'react-bootstrap';
import { useSession } from 'next-auth/react';

export default function GroupForm() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    console.log('in group form');
    console.log(JSON.stringify(session));

    if(session?.user?.accessToken == null) {
        router.push('/api/auth/signin/credentials');
    }


    const handleImageChange = (e) => {
        console.log(JSON.stringify(session));
        console.log(e.target.files[0]);
        const file = e.target.files[0];
        setSelectedImage(file);
    };

    const handleFormSubmit = async (values: any, selectedImage: File | null) => {
        setIsLoading(true);
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


        // Assuming you have an endpoint to handle the user's responses
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}groups/create`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + session?.user?.accessToken
            },
            body: JSON.stringify({ name: values.name }),
        });

        //if succesful, redirect to the profile page
        if (response.ok) {
            router.push('/profile');
        } else {
            console.error('Failed to fetch data from the API');
        }
        console.log(JSON.stringify(response));

        try {

        } catch (error) {
            console.log(error);

        } finally {
            setIsLoading(false);
        }


        // Call any other function or update state in the parent component
    };


    return (
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
                <BootstrapForm.Group controlId="groupName">
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
                        <BootstrapForm.Label>Default file input example</BootstrapForm.Label>
                        <BootstrapForm.Control type="file" name='image' onChange={handleImageChange} />
                    </BootstrapForm.Group>
                </BootstrapForm.Group>

                 {/* Display loader while the form is submitting */}
                 {isLoading && (
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                )}

                <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating Group...' : 'Create Group'}
                </Button>
            </Form>
        </Formik>
    )
}