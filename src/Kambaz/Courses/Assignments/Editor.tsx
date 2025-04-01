import {Button, Form, FormControl, FormGroup, FormLabel, InputGroup} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import {v4 as uuidv4} from "uuid";
import {addAssignment, updateAssignment} from "./reducer.ts";
import * as coursesClient from "../client";
import * as assignmentsClient from "./client";

export default function AssignmentEditor() {
    const {cid, aid} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const assignment = useSelector((state: any) => state.assignmentsReducer.assignments)
        .find((assignment: any) => assignment._id === aid);

    const now = new Date().toISOString().slice(0, 16);

    const [assignmentData, setAssignment] = useState({
        _id: assignment?._id || uuidv4(),
        title: assignment?.title || "New Assignment",
        course: assignment?.course || cid,
        description: assignment?.description || "Assignment description",
        pts: assignment?.pts || 100,
        due: assignment?.due || now,
        available_from: assignment?.available_from || now,
        available_until: assignment?.available_until || now
    });

    const handleSave = async () => {
        if (!cid) return;
        if (aid === 'new') {
            const newAssignment = await coursesClient.createAssignmentForCourse(cid, assignmentData);
            dispatch(addAssignment(newAssignment));
        } else {
            await assignmentsClient.updateAssignment(assignmentData);
            dispatch(updateAssignment(assignmentData));
        }
        navigate(`/Kambaz/Courses/${cid}/Assignments`);
    }

    const handleCancel = () => {
        navigate(`/Kambaz/Courses/${cid}/Assignments`);
    }

    return (
        <div>
            <FormGroup className="mb-3">
                <FormLabel>Assignment Name</FormLabel>
                <FormControl defaultValue={assignmentData.title}
                             onChange={(e) => setAssignment({...assignmentData, title: e.target.value})}/>
            </FormGroup>
            <FormGroup className="mb-3">
                <FormControl as="textarea" rows={3} defaultValue={assignmentData.description}
                             onChange={(e) => setAssignment({...assignmentData, description: e.target.value})}/>
            </FormGroup>
            <FormGroup className="mb-3 d-flex align-items-center">
                <div className="wd-grid-col-third-page text-end pe-2">
                    Points
                </div>
                <div className="wd-grid-col-two-thirds-page">
                    <FormControl type="number"
                                 defaultValue={assignmentData.pts}
                                 onChange={(e) => setAssignment({
                                     ...assignmentData,
                                     pts: (parseInt(e.target.value, 10))
                                 })}/>
                </div>
            </FormGroup>
            <FormGroup className="mb-3 d-flex">
                <div className="wd-grid-col-third-page text-end pe-2">
                    Assign
                </div>
                <div className="wd-grid-col-two-thirds-page">
                    <div className="border-grey">
                        <div className="pe-2">
                            <FormGroup>
                                <Form.Label> Due </Form.Label>
                                <InputGroup>
                                    <FormControl type="datetime-local" defaultValue={assignmentData.due}
                                                 onChange={(e) => setAssignment({
                                                     ...assignmentData,
                                                     due: e.target.value
                                                 })}/>
                                </InputGroup>
                            </FormGroup>

                            <div className="wd-grid-col-half-page pe-2">
                                <FormGroup>
                                    <Form.Label> Available from </Form.Label>
                                    <InputGroup>
                                        <FormControl type="datetime-local"
                                                     defaultValue={assignmentData.available_from}
                                                     onChange={(e) => setAssignment({
                                                         ...assignmentData,
                                                         available_from: e.target.value
                                                     })}/>
                                    </InputGroup>
                                </FormGroup>
                            </div>

                            <div className="wd-grid-col-half-page pe-2">
                                <FormGroup>
                                    <Form.Label> Until </Form.Label>
                                    <InputGroup>
                                        <FormControl type="datetime-local"
                                                     defaultValue={assignmentData.available_until}
                                                     onChange={(e) => setAssignment({
                                                         ...assignmentData,
                                                         available_until: e.target.value
                                                     })}/>
                                    </InputGroup>
                                </FormGroup>
                            </div>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                        </div>
                    </div>
                </div>
            </FormGroup>
            <hr/>
            <div className="text-nowrap">
                <Button variant="danger" size="lg" className="me-1 float-end" id="wd-add-module-btn"
                        onClick={handleSave}>
                    Save
                </Button>
                <Button variant="secondary" size="lg" className="me-1 float-end" id="wd-view-progress"
                        onClick={handleCancel}>
                    Cancel
                </Button>
            </div>
        </div>
    );
}
