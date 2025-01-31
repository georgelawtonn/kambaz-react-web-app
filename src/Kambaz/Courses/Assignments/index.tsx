import AssignmentsControls from "./AssignmentsControls.tsx";
import {ListGroup} from "react-bootstrap";
import {BsGripVertical} from "react-icons/bs";
import LessonControlButtons from "../Modules/LessonControlButtons.tsx";
import AssignmentControlButtons from "./AssignmentControlButtons.tsx";
import {FaCaretDown} from "react-icons/fa";
import AssignmentPredescription from "./AssignmentPredescription.tsx";

export default function Assignments() {
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
                        <ListGroup.Item className="wd-lesson p-3 ps-1">
                            <div>
                                <AssignmentPredescription/>
                                    <div>
                                        <a href="#/Kambaz/Courses/1234/Assignments/123"
                                            className="wd-assignment-link"
                                            style={{fontSize: '16px', fontWeight: '500'}}>
                                            A1 - ENV + HTML
                                        </a>
                                        <div>Multiple Modules | <strong> Not available until </strong> May 6 at 12:00am | <strong> Due </strong> May 13 at 11:59pm | 100 pts</div>
                                    </div>
                                <LessonControlButtons/>
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item className="wd-lesson p-3 ps-1">
                            <div>
                                <AssignmentPredescription/>
                                <div>
                                    <a href="#/Kambaz/Courses/1234/Assignments/123"
                                       className="wd-assignment-link"
                                       style={{fontSize: '16px', fontWeight: '500'}}>
                                        A2 - CSS + BOOTSTRAP
                                    </a>
                                    <div>Multiple Modules | <strong> Not available until </strong> May 13 at 12:00am | <strong> Due </strong> May 20 at 11:59pm | 100 pts</div>
                                </div>
                                <LessonControlButtons/>
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item className="wd-lesson p-3 ps-1">
                            <div>
                                <AssignmentPredescription/>
                                <div>
                                    <a href="#/Kambaz/Courses/1234/Assignments/123"
                                       className="wd-assignment-link"
                                       style={{fontSize: '16px', fontWeight: '500'}}>
                                        A3 - JAVASCRIPT + REACT
                                    </a>
                                    <div>Multiple Modules | <strong> Not available until </strong> May 20 at 12:00am | <strong> Due </strong> May 27 at 11:59pm | 100 pts</div>
                                </div>
                                <LessonControlButtons/>
                            </div>
                        </ListGroup.Item>
                    </ListGroup>
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
}
