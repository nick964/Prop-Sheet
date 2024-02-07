"use client";

import React, {useEffect} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Container, Col, Row, Button, Modal} from "react-bootstrap";
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { BasicGroupDetails} from '../models/tracking-response';
import styles from './SignUpForm.module.css';

interface SignUpFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  groupId: string;
  profilePicture?: File | null;
}

interface GroupFormProps {
  groupId: string;
}

const SignUpForm: React.FC<GroupFormProps> = ({ groupId }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [showModal, setShowModal] = React.useState(false);
  const [showAlreadyInModal, setshowAlreadyInModal] = React.useState(false);
  const [groupDetails, setGroupDetails] = React.useState<BasicGroupDetails | null>(null);
  const [profilePicture, setProfilePicture] = React.useState<File | null>(null);
  const accessToken: string | undefined = session?.user?.accessToken;
  const initialValues: SignUpFormValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    groupId: groupId,
    profilePicture: null,
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().min(6, 'Username must be at least 6 characters').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
    setProfilePicture(file); // Update the state with the new file
  };

  const handleSignIn = async (provider: string, groupId: string) => {
    console.log('logging groupId handle sign in');
    console.log(groupId);
    var myCallbackUrl = `/signedup`;
    if(groupId) {
      myCallbackUrl = myCallbackUrl + '?groupid=' + groupId;
    }
    await signIn(provider, { callbackUrl: myCallbackUrl });
  }

  const fetchGroupDetails = async () => {
    console.log('fetching group details if user is already signed in');
    try {
      if (accessToken && groupId) {
        const requestOptions = {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${accessToken}` }
        };
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}groups/details?groupId=${groupId}`, requestOptions);

        if (response.ok) {
          const result: BasicGroupDetails = await response.json();
          console.log('group details');
          console.log(result);
          setGroupDetails(result);
          setshowAlreadyInModal(true);
        } 
      }
    } catch (error) {
      console.error('Error fetching group data:', error);
    }
  };

  const addToGroup = async () => {
    console.log('adding user to group if already signed in');
    try {
      if (accessToken && groupId) {
        const requestOptions = {
          method: 'POST',
          headers: { 
                      'Authorization': `Bearer ${accessToken}`, 
                      'Content-Type': 'application/json'
                   }
          };
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}groups/addUser?groupId=${groupId}`, requestOptions);
        if (response.ok) {
          router.push('/profile');
        } 
      }
    } catch (error) {
      console.error('Error adding user to group', error);
    }
  };

  useEffect(() => {
    if (session && accessToken && groupId) {
      fetchGroupDetails();
    }
    }, []);


  const handleSubmit = async (values: SignUpFormValues, { resetForm }: { resetForm: () => void }) => {
    // Handle form submission here (e.g., send data to a server)
    const formData = new FormData();

     // Append all form fields to the formData object
     Object.keys(values).forEach(key => {
      const value = values[key as keyof typeof values];
      if (key !== 'picture' && value !== undefined && value !== null) {
        // Append only if value is not undefined and not null
        formData.append(key, value.toString()); // Convert value to string
      }
    });

    if (profilePicture) {
      formData.append('picture', profilePicture, profilePicture.name); // Append the file to the formData
    }

    const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/auth/signup`, {
      method: 'POST',
      body: formData,
    }).then((res) => {
      console.log(res);
      if (res.ok) {
        console.log('success');
        setShowModal(true);
       
      } else {
        console.log('error');
      }
    });
    console.log(result);
    resetForm();

  };

  const handleClose = () => {
    setShowModal(false);
    router.push('/api/auth/signin/credentials');
  };

  const handleAlreadyInModal = () => {
    setshowAlreadyInModal(false);
  };

  return (
    <>
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={6}>
          <h1>Sign Up</h1>
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
            Username
          </label>
          <Field type="text" className="form-control" id="email" name="email" />
          <ErrorMessage name="email" component="div" className="text-danger" />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <Field type="password" className="form-control" id="password" name="password" />
          <ErrorMessage name="password" component="div" className="text-danger" />
        </div>

        <div className="mb-3">
            <label htmlFor="picture" className="form-label">
              Picture
            </label>
            <input id="picture" name="picture" type="file" onChange={handleFileChange} className="form-control" />
            <ErrorMessage name="picture" component="div" className="text-danger" />
        </div>

          <Field type="hidden" className="form-control" id="groupId" name="groupId" value={groupId} />

        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </Form>
    </Formik>

          <div id="OauthSigninOptions"className={`mt-4 ${styles.OauthSigninOptions}`}>
            <h2>Or sign up with</h2>
            <Button variant="outline-primary" onClick={() => handleSignIn('facebook', groupId)}  className={`oauth-button ${styles.oauthButton}`}>
              Sign up with Facebook
            </Button>
            <Button variant="outline-info" onClick={() => handleSignIn('twitter', groupId)}  className={`oauth-button ${styles.oauthButton}`}>
              Sign up with Twitter
            </Button>
            <Button variant="outline-danger" onClick={() => handleSignIn('google', groupId)}  className={`oauth-button ${styles.oauthButton}`}>
              Sign up with Google
            </Button>
          </div>
        </Col>
      </Row>
    </Container>

    <Modal show={showAlreadyInModal} onHide={handleAlreadyInModal}>
      <Modal.Header closeButton>
        <Modal.Title>Join Existing Group?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <p>You are already signed in. Do you want to join the group?</p>
          <div>
            <p>Group Name: {groupDetails?.name}</p>
            <p>Group Admin: {groupDetails?.admin?.name}</p>
          </div>  
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={addToGroup}>
          Join Group
        </Button>
      </Modal.Footer>
    </Modal>

    <Modal 
      show={showModal} 
      onHide={handleClose} 
      backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Sign Up Successful</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='text-center mb-5'>
          <h5>Woohoo, you are successfully signed up!</h5>
        </div>
        
        <h5 className='text-center'>You will now be redirected to the login page to login.</h5>
        
        </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
    </>

    

  );
};

export default SignUpForm;
