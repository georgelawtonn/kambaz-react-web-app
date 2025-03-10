import {Button, Modal} from "react-bootstrap";

export default function AssignmentDeleter({show, handleClose, assignmentTitle, confirmDelete}: {
    show: boolean;
    handleClose: () => void;
    assignmentTitle: string;
    confirmDelete: () => void;
}) {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Assignment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you to remove {assignmentTitle}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}> Cancel </Button>
                <Button variant="danger"
                        onClick={() => {
                            confirmDelete();
                            handleClose();
                        }}> Delete </Button>
            </Modal.Footer>
        </Modal>
    );
}
