"use client";

import { Alert, ProgressBar, Modal, Button, Stack, Form} from "react-bootstrap";

// export const metadata = {
//     title: 'Submit Your Prop Sheet',
//   }
export default function Page() {

  const questions = [{"id":1,"text":"1st Quarter","section":"Game Points","question_type":1,"line_value":9.5,"questionOptions":[{"id":1,"option":"O,U","input_type":"radio"}],"masterAnswer":null,"options":[{"id":1,"option":"O,U","input_type":"radio"}]},{"id":2,"text":"2nd Quarter","section":"Game Points","question_type":1,"line_value":13.5,"questionOptions":[{"id":1,"option":"O,U","input_type":"radio"}],"masterAnswer":null,"options":[{"id":1,"option":"O,U","input_type":"radio"}]},{"id":3,"text":"3rd Quarter","section":"Game Points","question_type":1,"line_value":13.5,"questionOptions":[{"id":1,"option":"O,U","input_type":"radio"}],"masterAnswer":null,"options":[{"id":1,"option":"O,U","input_type":"radio"}]},{"id":4,"text":"4th Quarter","section":"Game Points","question_type":1,"line_value":13.5,"questionOptions":[{"id":1,"option":"O,U","input_type":"radio"}],"masterAnswer":null,"options":[{"id":1,"option":"O,U","input_type":"radio"}]},{"id":5,"text":"Heads or Tails","section":"National Anthem","question_type":1,"line_value":13.5,"questionOptions":[{"id":2,"option":"Y,N","input_type":"radio"}],"masterAnswer":null,"options":[{"id":2,"option":"Y,N","input_type":"radio"}]},{"id":6,"text":"Winner of Coin Toss","section":"National Anthem","question_type":1,"line_value":13.5,"questionOptions":[{"id":2,"option":"Y,N","input_type":"radio"}],"masterAnswer":null,"options":[{"id":2,"option":"Y,N","input_type":"radio"}]},{"id":15,"text":"First Song \"Umbrella\"","section":"Halftime","question_type":2,"line_value":null,"questionOptions":[{"id":2,"option":"Y,N","input_type":"radio"}],"masterAnswer":null,"options":[{"id":2,"option":"Y,N","input_type":"radio"}]},{"id":16,"text":"Last Song Diamonds","section":"Halftime","question_type":2,"line_value":null,"questionOptions":[{"id":2,"option":"Y,N","input_type":"radio"}],"masterAnswer":null,"options":[{"id":2,"option":"Y,N","input_type":"radio"}]}];



    return (
        <div
      className="modal show"
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal.Dialog>
            <Modal.Header>
            <Stack gap={1}>
                <div><h4>Question 4</h4></div>
                <div><h4>Section: Game Points</h4></div>
            </Stack>
            </Modal.Header>


        <Modal.Body>
          {questions.map((question) => (
            <div key={question.id}>
                <div style={{ display: 'flex' }}>
               <h4>{question.text}: </h4><h5>{question.line_value}</h5>
              </div>
              
              <Form>
                <Form.Check 
                  inline
                  type="radio"
                  name="group1"
                  id={`default-radio`}
                  label={question.questionOptions[0].option}
                />
                <Form.Check 
                  inline
                  type="radio"
                  name="group1"
                  id={`default-radio`}
                  label={question.questionOptions[0].option}
                  />
              </Form>
            </div>
          ))}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary">Close</Button>
          <Button variant="primary">Save changes</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
    )
}