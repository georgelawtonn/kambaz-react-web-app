import {MdOutlineAnnouncement, MdDoNotDisturbAlt, MdOutlineAnalytics} from "react-icons/md";
import {FaCheckCircle} from "react-icons/fa";
import {BiImport} from "react-icons/bi";
import {LiaDiscourse, LiaFileImportSolid} from "react-icons/lia";
import {Button} from "react-bootstrap";
import {CiLocationArrow1} from "react-icons/ci";
import {IoIosNotificationsOutline} from "react-icons/io";
import FacultyProtected from "../../Account/FacultyProtected.tsx";

{/* Find more icons */
}
export default function CourseStatus() {
    return (
        <div id="wd-course-status" style={{width: "350px"}}>
            <FacultyProtected>
                <h2>Course Status</h2>
                <div className="d-flex">
                    <div className="w-50 pe-1">
                        <Button variant="secondary" size="lg" className="w-100 text-nowrap ">
                            <MdDoNotDisturbAlt className="me-2 fs-5"/> Unpublish </Button></div>
                    <div className="w-50">
                        <Button variant="success" size="lg" className="w-100">
                            <FaCheckCircle className="me-2 fs-5"/> Publish </Button></div>
                </div>
                <br/>
                <Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
                    <BiImport className="me-2 fs-5"/> Import Existing Content </Button>
                <Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
                    <LiaFileImportSolid className="me-2 fs-5"/> Import from Commons </Button>
                <Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
                    <CiLocationArrow1 className="me-2 fs-5"/> Choose Home Page </Button>
            </FacultyProtected>
            <Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
                <LiaDiscourse className="me-2 fs-5"/> View Course Stream </Button>
            <Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
                <MdOutlineAnnouncement className="me-2 fs-5"/> View Announcement </Button>
            <Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
                <MdOutlineAnalytics className="me-2 fs-5"/> New Analytics </Button>
            <Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
                <IoIosNotificationsOutline className="me-2 fs-5"/> View Course Notifications </Button>
        </div>);
}