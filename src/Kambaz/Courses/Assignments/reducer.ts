import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
    assignments: [] as any[],
};

const assignmentsSlice = createSlice({
    name: "assignments",
    initialState,
    reducers: {
        setAssignments: (state, action) => {
            state.assignments = action.payload;
        },
        addAssignment: (state, { payload: assignment }) => {
            const newAssignment = {
                _id: uuidv4(),
                title: assignment.title,
                course: assignment.course,
                description: assignment.description,
                available_from: assignment.available_from,
                available_until: assignment.available_until,
                due: assignment.due,
                pts: assignment.pts
            };
            state.assignments = [...state.assignments, newAssignment] as any;
        },
        deleteAssignment: (state, { payload: assignmentId }) => {
            state.assignments = state.assignments.filter(
                (a : any) => a._id !== assignmentId
            );
        },
        updateAssignment: (state, { payload: assignment }) => {
            state.assignments = state.assignments.map((a : any) =>
                a._id === assignment._id ? assignment : a
            );
        }
    },
});
export const { setAssignments, addAssignment, deleteAssignment, updateAssignment} =
    assignmentsSlice.actions;
export default assignmentsSlice.reducer;