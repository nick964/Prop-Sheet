"use client";

import { Alert, ProgressBar, Modal, Button, Stack} from "react-bootstrap";

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
                <div><h4>Section: National Anthem Time</h4></div>
            </Stack>
            </Modal.Header>


        <Modal.Body>
          <p>Modal body text goes here.</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary">Close</Button>
          <Button variant="primary">Save changes</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
    )
}