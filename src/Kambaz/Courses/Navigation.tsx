import {Link, useParams} from "react-router-dom";
import {useLocation} from "react-router";

export default function CourseNavigation() {
    const {cid} = useParams();
    const {pathname} = useLocation();
    const links = [
        {label: "Home", path: `/Kambaz/Courses/${cid}/Home`},
        {label: "Modules", path: `/Kambaz/Courses/${cid}/Modules`},
        {label: "Piazza", path: `/Kambaz/Courses/${cid}/Piazza`},
        {label: "Zoom", path: `/Kambaz/Courses/${cid}/Zoom`},
        {label: "Assignments", path: `/Kambaz/Courses/${cid}/Assignments`},
        {label: "Quizzes", path: `/Kambaz/Courses/${cid}/Quizzes`},
        {label: "Grades", path: `/Kambaz/Courses/${cid}/Grades`},
        {label: "People", path: `/Kambaz/Courses/${cid}/People`}];
    return (
        <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
            {links.map((link) => {
                return (
                    <Link
                        key={link.path}
                        to={link.path}
                        id={`wd-course-${link.label.toLowerCase()}-link`}
                        className={`list-group-item border border-0 ${
                            pathname.includes(link.path) ? "active" : "text-danger"
                        }`}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </div>
    );
}
