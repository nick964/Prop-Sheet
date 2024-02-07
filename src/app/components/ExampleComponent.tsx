// components/ExampleComponent.tsx

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { AnswerDto } from '../models/answer';
import { Spinner } from 'react-bootstrap';
import { QuestionSection } from '../models/question-section';
import { useRouter } from 'next/navigation';
import SubmitForm from './SubmitForm';

interface ExampleComponentProps {
  groupId: string;
}

const ExampleComponent: React.FC<ExampleComponentProps> = ({ groupId }) => {
  const { data: session, status } = useSession();
  const accessToken = session?.user?.accessToken;
  const router = useRouter();

  const [questions, setQuestions] = useState<QuestionSection[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (accessToken) {
          const requestOptions = {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${accessToken}` }
          };
          console.log('calling this url for question data');
          console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}questions/all`);
          console.log(requestOptions);
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}questions/all`, requestOptions);

          if (response.ok) {
            const result: QuestionSection[] = await response.json();
            console.log('logging result for questions');
            console.log(result);
            setQuestions(result);
          } else {
            console.error('Failed to fetch data from the API');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const submitCurrentSelections = async (submissions: any) => {
    console.log('Submitting current selections in ExampleComponent', submissions);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}members/submit`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( submissions ),
      });

      if (response.ok) {
        console.log('Submission successful!');
        router.push('/track/' + groupId);
      } else {
        console.error('Submission failed:', response.statusText);
        // Handle failure, e.g., show an error message
      }
    } catch (error) {
      console.error('Error during submission:', error);
      // Handle error, e.g., show an error message
    } 
  };




  
  if (status === 'loading' || questions == null) {
    return (
      <div className="text-center mt-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
    );
  }

  return <SubmitForm data={questions} onSubmit={submitCurrentSelections} groupId={groupId}  />;
};

export default ExampleComponent;
