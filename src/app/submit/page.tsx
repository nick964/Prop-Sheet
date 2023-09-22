"use client";

import { Alert, ProgressBar, Modal, Button, Stack, Form} from "react-bootstrap";

export const metadata = {
    title: 'Submit Your Prop Sheet',
  }
export default function Page() {


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
          <p>1st Quarter <b>9.5 Seconds</b></p>
        <Form>
          <Form.Check 
            inline
            type="radio"
            name="group1"
            id={`default-radio`}
            label={`Over`}
          />
          <Form.Check 
            inline
            type="radio"
            name="group1"
            id={`default-radio`}
            label={`Under`}
            />
        </Form>
        <p>2nd Quarter <b>13.5 Seconds</b></p>
        <Form>
          <Form.Check 
            inline
            type="radio"
            name="group1"
            id={`default-radio`}
            label={`Over`}
          />
          <Form.Check 
            inline
            type="radio"
            name="group1"
            id={`default-radio`}
            label={`Under`}
            />
        </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary">Close</Button>
          <Button variant="primary">Save changes</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
    )
}