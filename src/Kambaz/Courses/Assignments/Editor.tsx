import {Button, Form, FormControl, FormGroup, FormLabel, FormSelect, InputGroup} from "react-bootstrap";
import {useParams} from "react-router-dom";
import * as db from "../../Database";

export default function AssignmentEditor() {
    const {aid} = useParams();
    const assignment = db.assignments.find(
        (assignment) => assignment._id === aid
    );

    return (
        <div>
            <FormGroup className="mb-3">
                <FormLabel>Assignment Name</FormLabel>
                <FormControl placeholder={assignment?.title}/>
            </FormGroup>
            <FormGroup className="mb-3">
                <FormControl as="textarea" rows={3}
                             placeholder={assignment?.description}/>
            </FormGroup>
            <FormGroup className="mb-3 d-flex align-items-center">
                <div className="wd-grid-col-third-page text-end pe-2">
                    Points
                </div>
                <div className="wd-grid-col-two-thirds-page">
                    <FormControl type="number"
                                 value={assignment?.pts}/>
                </div>
            </FormGroup>
            <FormGroup className="mb-3 d-flex align-items-center">
                <div className="wd-grid-col-third-page text-end pe-2">
                    Assignment Group
                </div>
                <div className="wd-grid-col-two-thirds-page">
                    <FormSelect>
                        <option value="1">ASSIGNMENTS</option>
                    </FormSelect>
                </div>
            </FormGroup>

            <FormGroup className="mb-3 d-flex align-items-center">
                <div className="wd-grid-col-third-page text-end pe-2">
                    Display Grade as
                </div>
                <div className="wd-grid-col-two-thirds-page">
                    <FormSelect>
                        <option value="1">Percentage</option>
                    </FormSelect>
                </div>
            </FormGroup>

            <FormGroup className="mb-3 d-flex">
                <div className="wd-grid-col-third-page text-end pe-2">
                    Submission Type
                </div>
                <div className="wd-grid-col-two-thirds-page">
                    <div className="border-grey">
                        <FormSelect>
                            <option value="1">Online</option>
                        </FormSelect><br/>
                        <div className="p-2">
                            <strong>Online Entry Options</strong><br/><br/>
                            <Form.Check label="Text Entry"/><br/>
                            <Form.Check label="Website URL"/><br/>
                            <Form.Check label="Media Recordings"/><br/>
                            <Form.Check label="Student Annotation"/><br/>
                            <Form.Check label="File Uploads"/><br/>
                        </div>
                    </div>
                </div>
            </FormGroup>

            <FormGroup className="mb-3 d-flex">
                <div className="wd-grid-col-third-page text-end pe-2">
                    Assign
                </div>
                <div className="wd-grid-col-two-thirds-page">
                    <div className="border-grey">
                        <div className="pe-2">
                            <FormGroup><Form.Label> <strong>Assign to</strong> </Form.Label>
                                <FormControl placeholder="Everyone"/></FormGroup>
                            <br/>
                            <FormGroup>
                                <Form.Label> Due </Form.Label>
                                <InputGroup>
                                    <FormControl type="date"/>
                                </InputGroup>
                            </FormGroup>

                            <div className="wd-grid-col-half-page pe-2">
                                <FormGroup>
                                    <Form.Label> Available from </Form.Label>
                                    <InputGroup>
                                        <FormControl type="date"/>
                                    </InputGroup>
                                </FormGroup>
                            </div>

                            <div className="wd-grid-col-half-page pe-2">
                                <FormGroup>
                                    <Form.Label> Until </Form.Label>
                                    <InputGroup>
                                        <FormControl type="date"/>
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
                <Button variant="danger" size="lg" className="me-1 float-end" id="wd-add-module-btn">
                    Save
                </Button>
                <Button variant="secondary" size="lg" className="me-1 float-end" id="wd-view-progress">
                    Cancel
                </Button>
            </div>
        </div>
    );
}
