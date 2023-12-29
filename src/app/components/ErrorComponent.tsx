import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ErrorComponentState {
    showModal: boolean;
}

class ErrorComponent extends React.Component<{}, ErrorComponentState> {
    constructor(props: {}) {
        super(props);
        this.state = { showModal: true };
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose(): void {
        this.setState({ showModal: false });
        // Optionally, add logic to handle what happens when the modal is closed
    }

    render() {
        return (
            <Modal show={this.state.showModal} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Server Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Sorry, there was a problem with the server. Please try again later.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ErrorComponent;
