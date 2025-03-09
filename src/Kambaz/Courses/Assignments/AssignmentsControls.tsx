import {FaPlus} from "react-icons/fa6";
import {Button, FormControl, FormGroup, InputGroup} from "react-bootstrap";
import {CiSearch} from "react-icons/ci";
import FacultyProtected from "../../Account/FacultyProtected.tsx";

export default function AssignmentsControls() {
    return (
        <div className="text-nowrap">
            <FacultyProtected>
                <Button variant="danger" size="lg" className="me-1 float-end" id="wd-add-module-btn">
                    <FaPlus className="position-relative me-2" style={{bottom: "1px"}}/>
                    Assignment
                </Button>
                <Button variant="secondary" size="lg" className="me-1 float-end" id="wd-view-progress">
                    <FaPlus className="position-relative me-2" style={{bottom: "1px"}}/>
                    Group
                </Button>
            </FacultyProtected>
            <FormGroup className="me-1 float-start" style={{width: "auto"}}>
                <InputGroup size="lg">
                    <InputGroup.Text style={{
                        background: 'white',
                        borderRight: 'none'
                    }}>
                        <CiSearch className="fs-4"/>
                    </InputGroup.Text>
                    <FormControl placeholder="Search..."
                                 style={{
                                     borderLeft: 'none',
                                     paddingLeft: '0'
                                 }}/>
                </InputGroup>
            </FormGroup>

        </div>
    );
}
