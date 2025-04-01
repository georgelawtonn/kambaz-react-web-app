import AssignmentsControls from "./AssignmentsControls.tsx";
import {ListGroup} from "react-bootstrap";
import {BsGripVertical} from "react-icons/bs";
import AssignmentControlButtons from "./AssignmentControlButtons.tsx";
import {FaCaretDown} from "react-icons/fa";
import AssignmentPredescription from "./AssignmentPredescription.tsx";
import {Link, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import ControlButtons from "./ControlButtons.tsx";
import {deleteAssignment, setAssignments} from "./reducer.ts";
import * as coursesClient from "../client";
import * as assignmentsClient from "./client";
import {useEffect} from "react";

export default function Assignments() {
    const {cid} = useParams();

    const assignments = useSelector((state: any) => state.assignmentsReducer.assignments);

    const formatDueDate = (dateTime: string) => {
        if (!dateTime) return '';
        const date = new Date(dateTime);
        const month = date.toLocaleString('default', {month: 'short'});
        const day = date.getDate();
        const time = date.toLocaleString('default', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }).toLowerCase();
        return `${month} ${day} at ${time}`
    }

    const dispatch = useDispatch();

    const removeAssignment = async (assignmentId: string) => {
        await assignmentsClient.deleteAssignment(assignmentId);
        dispatch(deleteAssignment(assignmentId));
    };

    const fetchAssignments = async () => {
        const assignments = await coursesClient.findAssignmentsForCourse(cid as string);
        dispatch(setAssignments(assignments));
    };
    useEffect(() => {
        fetchAssignments();
    }, []);

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
                        {assignments.map((assignment: any) => (
                            <ListGroup.Item
                                className="wd-lesson p-3 ps-1"
                                key={assignment._id}>
                                <div>
                                    <AssignmentPredescription/>
                                    <div>
                                        <Link
                                            to={`/Kambaz/Courses/${cid}/Assignments/${assignment._id}`}
                                            className="wd-assignment-link"
                                            style={{fontSize: '16px', fontWeight: '500'}}>
                                            {assignment.title}
                                        </Link>
                                        <div>Multiple Modules
                                            | <strong> Due </strong> {formatDueDate(assignment.due)} | {assignment.pts} pts
                                        </div>
                                    </div>
                                    <ControlButtons assignmentId={assignment._id}
                                                    assignmentTitle={assignment.title}
                                                    deleteAssignment={removeAssignment}/>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
}
