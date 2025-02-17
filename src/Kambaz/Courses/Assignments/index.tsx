import AssignmentsControls from "./AssignmentsControls.tsx";
import {ListGroup} from "react-bootstrap";
import {BsGripVertical} from "react-icons/bs";
import LessonControlButtons from "../Modules/LessonControlButtons.tsx";
import AssignmentControlButtons from "./AssignmentControlButtons.tsx";
import {FaCaretDown} from "react-icons/fa";
import AssignmentPredescription from "./AssignmentPredescription.tsx";
import {Link, useParams} from "react-router-dom";
import * as db from "../../Database";

export default function Assignments() {
    const { cid } = useParams();
    const assignments = db.assignments.filter(
        (assignment) => assignment.course === cid
    );

    return (
        <div>
            <AssignmentsControls/><br/><br/><br/><br/>
            <ListGroup className="rounded-0" id="wd-modules">
                <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2 bg-secondary">
                        <BsGripVertical className="me-2 fs-3"/><FaCaretDown className="me-2 fs-4"/>
                        <strong>ASSIGNMENTS</strong> <AssignmentControlButtons/>
                    </div>
                    <ListGroup className="wd-lessons rounded-0">
                        {assignments.map((assignment) => (
                            <ListGroup.Item
                                as={Link}
                                to={`/Kambaz/Courses/${cid}/Assignments/${assignment._id}`}
                                className="wd-lesson p-3 ps-1">
                                <div>
                                    <AssignmentPredescription/>
                                    <div>
                                        <a href="/Kambaz/Courses/${cid}/Assignments/${assignment._id}"
                                           className="wd-assignment-link"
                                           style={{fontSize: '16px', fontWeight: '500'}}>
                                           {assignment.title}
                                        </a>
                                        <div>Multiple Modules | <strong> Not available until </strong> {assignment.available} | <strong> Due </strong> {assignment.due}  | {assignment.pts} pts</div>
                                    </div>
                                    <LessonControlButtons/>
                                </div>
                            </ListGroup.Item>
                            ))}
                    </ListGroup>
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
}
