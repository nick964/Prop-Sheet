"use client";

import React from 'react';
import { signIn } from 'next-auth/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface SignUpFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function Component(props: any) {
 
  const groupId = props.groupId ?? '';
  console.log('logging groupId from signup-form.tsx');
  console.log(groupId);
  
  const handleSignIn = async (provider: string, groupId: string) => {
    console.log('logging groupId handle sign in');
    console.log(groupId);
    await signIn(provider,  { groupId: groupId });
  }


  const sanityCheck = () => {
    console.log('what is going on');
  }

  console.log(groupId);
  const initialValues: SignUpFormValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const handleSubmit = (values: SignUpFormValues, { resetForm }: { resetForm: () => void }) => {
    // Handle form submission here (e.g., send data to a server)
    console.log(values);
    resetForm();
  };

  return (
    <div>
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      <Form>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <Field type="text" className="form-control" id="firstName" name="firstName" />
          <ErrorMessage name="firstName" component="div" className="text-danger" />
        </div>

        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <Field type="text" className="form-control" id="lastName" name="lastName" />
          <ErrorMessage name="lastName" component="div" className="text-danger" />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <Field type="email" className="form-control" id="email" name="email" />
          <ErrorMessage name="email" component="div" className="text-danger" />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <Field type="password" className="form-control" id="password" name="password" />
          <ErrorMessage name="password" component="div" className="text-danger" />
        </div>

        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </Form>
    </Formik>
    
         <button onClick={() => handleSignIn('facebook', groupId)}>
            Sign up with Facebook
          </button>
          <button onClick={() => handleSignIn('twitter', groupId)}>
            Sign up with Twitter
          </button>
          <button onClick={() => sanityCheck()}>
            Sign up with Google
          </button>


    </div>
  );
};