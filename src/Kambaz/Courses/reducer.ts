import {createSlice} from "@reduxjs/toolkit";
import {v4 as uuidv4} from "uuid";
import {courses, enrollments} from "../Database";

const initialState = {
    courses: courses,
    enrollments: enrollments
};

const coursesSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {
        addCourse: (state, {payload: course}) => {
            const newCourse = {
                _id: course._id,
                name: course.name,
                number: "New Number",
                startDate: "2023-09-10",
                endDate: "2023-12-15",
                image: "/images/reactjs.jpg",
                description: course.description,
            };
            state.courses = [...state.courses, newCourse] as any;
        },
        deleteCourse: (state, {payload: courseId}) => {
            state.courses = state.courses.filter(
                (c) => c._id !== courseId
            );

            state.enrollments = state.enrollments.filter(
                (e) => e.course !== courseId
            );
        },
        updateCourse: (state, {payload: course}) => {
            state.courses = state.courses.map((c) =>
                c._id === course._id ? course : c
            );
        },
        addEnrollment: (state, {payload: enrollment}) => {
            const newEnrollment = {
                _id: uuidv4(),
                user: enrollment.user,
                course: enrollment.course
            }
            state.enrollments = [...state.enrollments, newEnrollment]
        },
        deleteEnrollment(state, {payload: {userId, courseId}}) {
            state.enrollments = state.enrollments.filter(
                (enrollment) => !(enrollment.user === userId && enrollment.course === courseId)
            );
        }
    },
});
export const {addCourse, deleteCourse, updateCourse, addEnrollment, deleteEnrollment} =
    coursesSlice.actions;
export default coursesSlice.reducer;