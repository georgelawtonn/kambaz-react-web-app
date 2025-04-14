import {BsGripVertical} from "react-icons/bs";
import { FaRocket } from "react-icons/fa";

export default function QuizPredescription() {
    return (
        <div className="float-start">
            <BsGripVertical className="me-2 fs-3"/><FaRocket className="me-2 fs-3 text-success"/>
        </div>
    );
}
