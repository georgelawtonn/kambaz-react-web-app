import {Link} from "react-router-dom";
import {Button, Card, FormControl} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import FacultyProtected from "./Account/FacultyProtected.tsx";
import {useState} from "react";
import {v4 as uuidv4} from "uuid";
import {addCourse, addEnrollment, deleteCourse, deleteEnrollment, updateCourse} from "./Courses/reducer.ts";
import StudentProtected from "./Account/StudentProtected.tsx";

export default function Dashboard() {
    const {currentUser} = useSelector((state: any) => state.accountReducer);
    const enrollments = useSelector((state: any) => state.courseReducer.enrollments);
    const courses = useSelector((state: any) => state.courseReducer.courses);
    const [showEnrolled, setShowEnrolled] = useState(true);


    const [course, setCourse] = useState<any>({
        _id: "placeholderID", name: "New Course", number: "New Number",
        startDate: "2023-09-10", endDate: "2023-12-15",
        image: "/images/reactjs.jpg", description: "New Description"
    });

    const handleNewCourse = () => {
        const newCourseId = uuidv4();
        dispatch(addCourse({...course, _id: newCourseId}));
        dispatch(addEnrollment({
            user: currentUser._id,
            course: newCourseId
        }));
    }

    const handleUpdateCourse = () => {
        dispatch(updateCourse(course));
    }

    const dispatch = useDispatch();


    return (
        <div className="p-4" id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard</h1>
            <hr/>
            <FacultyProtected>
                <h5>New Course
                    <button className="btn btn-primary float-end"
                            id="wd-add-new-course-click"
                            onClick={handleNewCourse}> Add </button>
                    <button className="btn btn-warning float-end me-2"
                            onClick={handleUpdateCourse} id="wd-update-course-click">
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
            <div className="d-flex justify-content-between align-items-center">
                <h2 id="wd-dashboard-published">Published Courses ({courses.filter((course: any) => !showEnrolled ||
                    enrollments.some(
                        (enrollment: any) =>
                            enrollment.user === currentUser._id &&
                            enrollment.course === course._id
                    )).length})</h2>
                <StudentProtected>
                    <Button variant="primary" onClick={() => {
                        setShowEnrolled(!showEnrolled);
                    }}>
                        Enrollments
                    </Button>
                </StudentProtected>
            </div>
            <hr/>
            <div className="row" id="wd-dashboard-courses">
                <div className="row row-cols-1 row-cols-md-5 g-4">
                    {courses.filter((course: any) =>
                        enrollments.some(
                            (enrollment: any) =>
                                enrollment.user === currentUser._id &&
                                enrollment.course === course._id
                        ))
                        .map((course: any) => (
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
                                                        dispatch(deleteCourse(course._id));
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

                                                <StudentProtected>
                                                    <button id="wd-delete-enrollment-click"
                                                            onClick={(event) => {
                                                                event.preventDefault();
                                                                dispatch(deleteEnrollment({
                                                                    userId: currentUser._id,
                                                                    courseId: course._id
                                                                }));
                                                            }}
                                                            className="btn btn-danger me-2 float-end">
                                                        Unenroll
                                                    </button>
                                                </StudentProtected>
                                            </Card.Body>
                                        </Link>
                                    </Card>
                                </div>
                            </div>
                        ))}
                    {courses.filter((course: any) => !showEnrolled &&
                        !enrollments.some(
                            (enrollment: any) =>
                                enrollment.user === currentUser._id &&
                                enrollment.course === course._id
                        ))
                        .map((course: any) => (
                            <div key={course._id} className="col" style={{width: "300px"}}>
                                <div className="card">
                                    <Card>
                                        <Card.Img src="/images/reactjs.jpg" variant="top" width="100%"
                                                  height={160}/>
                                        <Card.Body className="card-body">
                                            <Card.Title
                                                className="wd-dashboard-course-title text-nowrap overflow-hidden">
                                                {course.name} </Card.Title>
                                            <Card.Text className="wd-dashboard-course-description overflow-hidden"
                                                       style={{height: "100px"}}>
                                                {course.description} </Card.Text>
                                            <FacultyProtected>
                                                <button onClick={(event) => {
                                                    event.preventDefault();
                                                    dispatch(deleteCourse(course._id));
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
                                            <StudentProtected>
                                                <button id="wd-add-enrollment-click"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            dispatch(addEnrollment({
                                                                user: currentUser._id,
                                                                course: course._id
                                                            }));
                                                        }} className="btn btn-success float-end">
                                                    Enroll
                                                </button>
                                            </StudentProtected>
                                        </Card.Body>
                                    </Card>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}



