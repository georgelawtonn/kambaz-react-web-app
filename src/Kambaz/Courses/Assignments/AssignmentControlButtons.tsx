import {IoEllipsisVertical} from "react-icons/io5";

import {BsPlus} from "react-icons/bs";
import {InputGroup} from "react-bootstrap";
import FacultyProtected from "../../Account/FacultyProtected.tsx";

export default function AssignmentControlButtons() {
    return (
        <FacultyProtected>
            <div className="float-end">
                <InputGroup>
                    <div>
                        <span className="border-round"> 40% of Total</span>
                        <BsPlus className="fs-2"/>
                        <IoEllipsisVertical className="fs-5"/>
                    </div>
                </InputGroup>
            </div>
        </FacultyProtected>);
}
