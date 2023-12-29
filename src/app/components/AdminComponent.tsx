// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Col, Row } from 'react-bootstrap';
import { useSession } from 'next-auth/react';

interface Question {
  id: number;
  text: string;
  questionType: string;
  lineValue: number | null;
  options: string[];
  answer: string | null;
}

interface Category {
  id: number;
  name: string;
  questions: Question[];
}

interface ConfigRule {
  rule: string;
  description: string;
  enabled: boolean;
}

interface MasterAnswer {
  questionId: number;
  answer: string;
}



const AdminPage: React.FC = () => { 
  const { data: session, status } = useSession();
  const accessToken = session?.user?.accessToken;
  const [categories, setCategories] = useState<Category[]>([]);
  const [configRules, setConfigRules] = useState<ConfigRule[]>([]);
  const [toggleState, setToggleState] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggle = async (config: ConfigRule, newToggleState: boolean) => {
    setIsSubmitting(true);
    console.log('Toggle state changed:', newToggleState);
    // Replace with actual request logic
    try {
      const req = {
        rule: config.rule,
        enabled: newToggleState,
        description: config.description
      };
      const requestOptions = {
        method: 'POST', // or 'GET', depending on your backend requirements
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req)
      };
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}config/update`, requestOptions);
      if (response.ok) {
        console.log('Toggle state updated successfully');
      } else {
        console.error('Failed to update toggle state');
      }
    } catch (error) {
      console.error('Error updating toggle state:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulate fetching data from an API
  useEffect(() => {
    // Replace this with actual API call to fetch data
    const fetchData = async () => {
      try {
        if (accessToken) {
          const requestOptions = {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${accessToken}` }
          };
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}questions/all`, requestOptions);
          if (response.ok) {
            const data = await response.json();
            setCategories(data);
          } else {
            console.error('Failed to fetch data from the API');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      
    };

    const fetchConfigRules = async () => {
      try {
        if (accessToken) {
          const requestOptions = {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${accessToken}` }
          };
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}config/all`, requestOptions);
          if (response.ok) {
            const data = await response.json();
            setConfigRules(data);
          } else {
            console.error('Failed to fetch data from the API');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      
    };
    fetchData();
    fetchConfigRules();
  }, []);

  const handleAnswerChange = (categoryId: number, questionId: number, newAnswer: string) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              questions: category.questions.map((question) =>
                question.id === questionId ? { ...question, answer: newAnswer } : question
              ),
            }
          : category
      )
    );
  };

  const handleSubmit = async () => {
    // Implement logic to submit updated master answers to the backend
    console.log('Updated master answers:', categories);
    const masterAnswers = categories.flatMap(mapToMasterAnswer);
    console.log('Master answers to submit:', masterAnswers);
    const requestOptions = {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json', },
      body: JSON.stringify( masterAnswers )
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}master/add`, requestOptions);
    if (response.ok) {
      console.log('Master answers submitted successfully');
    } else {
      console.error('Failed to submit master answers');
    }
  };

  const mapToMasterAnswer = (category: Category): MasterAnswer[] => {
    return category.questions
      .filter((question) => question.answer !== null && question.answer !== '') // Filter out questions with empty or null answers
      .map((question) => ({
        questionId: question.id,
        answer: question.answer || '',
      }));
  };

  return (
    <Container className="mt-4">
      <h2>Admin Page - Update Master Answers</h2>
      <hr />
      {configRules.map((config) => (
        <Form.Switch
          key={config.rule}
          type="switch"
          id={config.rule}
          label={config.description}
          checked={config.enabled}
          onChange={(e) => handleToggle(config, e.target.checked)}
          disabled={isSubmitting}
        />
      ))}
      <hr />

      {categories.map((category) => (
        <Card key={category.id} className="mb-4">
          <Card.Header>{category.name}</Card.Header>
          <Card.Body>
            <Form>
              {category.questions.map((question) => (
                <Form.Group key={question.id} as={Row} className="mb-3">
                  <Form.Label column sm="6">
                    {question.text} {question.lineValue && <span>({question.lineValue})</span>}
                  </Form.Label>
                  <Col sm="6">
                    {question.options.length > 0 ? (
                      <Form.Select
                        onChange={(e) => handleAnswerChange(category.id, question.id, e.target.value)}
                        value={question.answer || ''}
                      >
                        <option value="" disabled>
                          Select an option
                        </option>
                        {question.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Form.Select>
                    ) : (
                      <Form.Control
                        type={question.questionType === 'radio' ? 'text' : 'number'}
                        placeholder="Enter Master Answer"
                        value={question.answer || ''}
                        onChange={(e) => handleAnswerChange(category.id, question.id, e.target.value)}
                      />
                    )}
                  </Col>
                </Form.Group>
              ))}
            </Form>
          </Card.Body>
        </Card>
      ))}

      <Button variant="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </Container>
  );
};

export default AdminPage;
