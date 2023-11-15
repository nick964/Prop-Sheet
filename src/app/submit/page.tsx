"use client";

import { Alert, ProgressBar, Modal, Button, Stack, Form} from "react-bootstrap";

// export const metadata = {
//     title: 'Submit Your Prop Sheet',
//   }
export default function Page() {

  const questions = [{"id":2,"name":"Game Points","questions":[{"id":1,"text":"1st Quarter","questionType":"radio","lineValue":null,"options":["O","U"]},{"id":2,"text":"2nd Quarter","questionType":"radio","lineValue":null,"options":["O","U"]},{"id":3,"text":"3rd Quarter","questionType":"radio","lineValue":null,"options":["O","U"]},{"id":4,"text":"4th Quarter","questionType":"radio","lineValue":null,"options":["O","U"]}]},{"id":3,"name":"National Anthem","questions":[{"id":5,"text":"Heads or Tails","questionType":"radio","lineValue":null,"options":["Y","N"]},{"id":6,"text":"Winner of Coin Toss","questionType":"radio","lineValue":null,"options":["Y","N"]}]},{"id":4,"name":"Halftime","questions":[{"id":7,"text":"First Song \"Umbrella\"","questionType":"radio","lineValue":null,"options":["Y","N"]},{"id":8,"text":"Last Song Diamonds","questionType":"radio","lineValue":null,"options":["Y","N"]}]},{"id":5,"name":"Yes or No Propositions","questions":[{"id":9,"text":"Will Mary J. Blige Perform First?","questionType":"radio","lineValue":null,"options":["Y","N"]},{"id":10,"text":"Will Eminem Sing “Lose Yourself”?","questionType":"radio","lineValue":null,"options":["Y","N"]},{"id":11,"text":"Will Snoop Dogg Smoke and Sing “The Next Episode”?","questionType":"radio","lineValue":null,"options":["Y","N"]},{"id":12,"text":"Will Kendrick Lamar Sing “HUMBLE”?","questionType":"radio","lineValue":null,"options":["Y","N"]},{"id":13,"text":"Will Dr. Dre Sing “California Love”?","questionType":"radio","lineValue":null,"options":["Y","N"]},{"id":14,"text":"Will the First Commercial Break Contain a Car Commercial?","questionType":"radio","lineValue":null,"options":["Y","N"]},{"id":15,"text":"Will a Cheetos Commercial Appear Before a Pringles Commercial?","questionType":"radio","lineValue":null,"options":["Y","N"]},{"id":16,"text":"Will a Captain Morgan Commercial Appear Before a BMW Commercial?","questionType":"radio","lineValue":null,"options":["Y","N"]}]}];



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