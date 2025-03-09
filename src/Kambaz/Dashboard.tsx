import {Link} from "react-router-dom";
import {Button, Card, FormControl} from "react-bootstrap";
import {useSelector} from "react-redux";
import * as db from "./Database";
import FacultyProtected from "./Account/FacultyProtected.tsx";

export default function Dashboard(
    {
        courses, course, setCourse, addNewCourse,
        deleteCourse, updateCourse
    }: {
        courses: any[]; course: any; setCourse: (course: any) => void;
        addNewCourse: () => void; deleteCourse: (course: any) => void;
        updateCourse: () => void;
    }) {
    const {currentUser} = useSelector((state: any) => state.accountReducer);
    const {enrollments} = db;
    return (
        <div className="p-4" id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard</h1>
            <hr/>
            <FacultyProtected>
                <h5>New Course
                    <button className="btn btn-primary float-end"
                            id="wd-add-new-course-click"
                            onClick={addNewCourse}> Add </button>
                    <button className="btn btn-warning float-end me-2"
                            onClick={updateCourse} id="wd-update-course-click">
                        Update
                    </button>
                </h5>
                <br/>
                <FormControl value={course.name} className="mb-2"
                             onChange={(e) => setCourse({...course, name: e.target.value})}/>
                <FormControl value={course.description}
                             onChange={(e) => setCourse({...course, description: e.target.value})}/>
                <hr/>
            </FacultyProtected>
            <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2>
            <hr/>
            <div className="row" id="wd-dashboard-courses">
                <div className="row row-cols-1 row-cols-md-5 g-4">
                    {courses.filter((course) =>
                        enrollments.some(
                            (enrollment) =>
                                enrollment.user === currentUser._id &&
                                enrollment.course === course._id
                        ))
                        .map((course) => (
                            <div key={course._id} className="col" style={{width: "300px"}}>
                                <div className="card">
                                    <Card>
                                        <Link to={`/Kambaz/Courses/${course._id}/Home`}
                                              className="wd-dashboard-course-link text-decoration-none text-dark">
                                            <Card.Img src="/images/reactjs.jpg" variant="top" width="100%"
                                                      height={160}/>
                                            <Card.Body className="card-body">
                                                <Card.Title
                                                    className="wd-dashboard-course-title text-nowrap overflow-hidden">
                                                    {course.name} </Card.Title>
                                                <Card.Text className="wd-dashboard-course-description overflow-hidden"
                                                           style={{height: "100px"}}>
                                                    {course.description} </Card.Text>
                                                <Button variant="primary"> Go </Button>

                                                <FacultyProtected>
                                                    <button onClick={(event) => {
                                                        event.preventDefault();
                                                        deleteCourse(course._id);
                                                    }} className="btn btn-danger float-end"
                                                            id="wd-delete-course-click">
                                                        Delete
                                                    </button>
                                                    <button id="wd-edit-course-click"
                                                            onClick={(event) => {
                                                                event.preventDefault();
                                                                setCourse(course);
                                                            }}
                                                            className="btn btn-warning me-2 float-end">
                                                        Edit
                                                    </button>
                                                </FacultyProtected>
                                            </Card.Body>
                                        </Link>
                                    </Card>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}



