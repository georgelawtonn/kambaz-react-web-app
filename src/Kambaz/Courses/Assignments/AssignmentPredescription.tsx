import {BsGripVertical} from "react-icons/bs";
import {MdAssignment} from "react-icons/md";

export default function AssignmentPredescription() {
    return (
        <div className="float-start">
            <BsGripVertical className="me-2 fs-3"/><MdAssignment className="me-2 fs-3 text-success"/>
        </div>
    );
}
