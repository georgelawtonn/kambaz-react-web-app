import {FaCircle} from "react-icons/fa";
import { RiProhibitedFill } from "react-icons/ri";

export default function RedCheckmark() {
    return (
        <span className="me-1 position-relative">
      <RiProhibitedFill style={{top: "5px", right: "2px"}} className="text-white me-1 position-absolute fs-6"/>
      <FaCircle className="text-danger me-1 fs-5"/>
    </span>);
}