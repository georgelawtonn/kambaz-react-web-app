import {IoEllipsisVertical} from "react-icons/io5";
import GreenCheckmark from "../Modules/GreenCheckmark";
import FacultyProtected from "../../Account/FacultyProtected.tsx";
import {FaTrash} from "react-icons/fa";
import {useState} from "react";
import AssignmentDeleter from "./AssignmentDeleter.tsx";

export default function ControlButtons(
    {assignmentId, assignmentTitle, deleteAssignment}: {
        assignmentId: string; assignmentTitle: string, deleteAssignment: (assignmentId: string) => void;
    }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleDelete = () => {
        deleteAssignment(assignmentId);
    };
    return (
        <FacultyProtected>
            <div className="float-end">
                <FaTrash className="text-danger me-2 mb-1" onClick={handleShow}/>
                <GreenCheckmark/>
                <IoEllipsisVertical className="fs-4"/>

                <AssignmentDeleter
                    show={show}
                    handleClose={handleClose}
                    assignmentTitle={assignmentTitle}
                    confirmDelete={handleDelete}
                />
            </div>
        </FacultyProtected>);
}
