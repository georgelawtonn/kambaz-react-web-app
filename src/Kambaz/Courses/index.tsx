import {Route, Routes, useLocation} from "react-router";

import CourseNavigation from "./Navigation.tsx";
import Modules from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor.tsx";
import {FaAlignJustify} from "react-icons/fa";
import PeopleTable from "./People/Table.tsx";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import * as courseClient from "./client.ts";
import Quizzes from "./Quizzes";
import QuizEditor from "./Quizzes/QuizEditor.tsx";
import QuizDetail from "./Quizzes/QuizDetail.tsx";
import QuizPreviewPage from "./Quizzes/QuizPreviewPage.tsx";

export default function Courses() {
    const {cid} = useParams();
    const courses = useSelector((state: any) => state.courseReducer.courses);
    let course = courses.find((course: any) => course._id === cid);
    const { pathname } = useLocation();
    const [users, setUsers] = useState<any[]>([]);

    const fetchUsers = async () => {
        if (cid) {
            const users = await courseClient.findUsersForCourse(cid);
            setUsers(users);
        }
    };
    const fetchCourse = async () => {
        if (cid) {
            course = await courseClient.fetchCourseById(cid);
            setUsers(users);
        }
    }
    useEffect(() => {
        fetchUsers();
        fetchCourse();
    }, [cid]);

    return (
        <div id="wd-courses">
            <h2 className="text-danger">
                <FaAlignJustify className="me-4 fs-4 mb-1"/>
                {course && course.name} &gt; {pathname.split("/")[4]}
            </h2>
            <hr/>
            <div className="d-flex">
                <div className="d-none d-md-block">
                    <CourseNavigation/>
                </div>
                <div className="flex-fill">
                    <Routes>
                        <Route path="Home" element={<Home/>}/>
                        <Route path="Modules" element={<Modules/>}/>
                        <Route path="Assignments" element={<Assignments/>}/>
                        <Route path="Assignments/:aid" element={<AssignmentEditor/>}/>
                        <Route path="Quizzes" element={<Quizzes/>}/>
                        <Route path="Quizzes/:qid/edit" element={<QuizEditor/>}/>
                        <Route path="Quizzes/:qid/view" element={<QuizDetail/>}/>
                        <Route path="Quizzes/:qid/preview" element={<QuizPreviewPage />} />
                        <Route path="People" element={<PeopleTable users={users}/>}/>
                    </Routes>
                </div>
            </div>
        </div>
    );
}
