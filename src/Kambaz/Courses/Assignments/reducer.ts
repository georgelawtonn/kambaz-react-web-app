// import { createSlice } from "@reduxjs/toolkit";
// import { assignments } from "../../Database";
// import { v4 as uuidv4 } from "uuid";
// const initialState = {
//     assignments: assignments,
// };
// const assignmentsSlice = createSlice({
//     name: "assignments",
//     initialState,
//     reducers: {
//         addAssignment: (state, { payload: assignment }) => {
//             const newModule: any = {
//                 _id: uuidv4(),
//                 lessons: [],
//                 name: module.name,
//                 course: module.course,
//             };
//             state.assignments = [...state.assignments, newModule] as any;
//         },
//         deleteAssignment: (state, { payload: assignmentId }) => {
//             state.assignments = state.assignments.filter(
//                 (m: any) => m._id !== moduleId);
//         },
//         updateAssignment: (state, { payload: assignment }) => {
//             state.assignments = state.assignments.map((m: any) =>
//                 m._id === module._id ? module : m
//             ) as any;
//         },
//         editAssignment: (state, { payload: assignmentId }) => {
//             state.assignments = state.assignments.map((m: any) =>
//                 m._id === moduleId ? { ...m, editing: true } : m
//             ) as any;
//         },
//     },
// });
// export const { addAssignment, deleteAssignment, updateAssignment, editAssignment } =
//     assignmentsSlice.actions;
// export default assignmentsSlice.reducer;