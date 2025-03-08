import {configureStore} from "@reduxjs/toolkit";
import helloReducer from "../Lab4/ReduxExamples/HelloRedux/helloReducer";
import counterReducer from "../Lab4/ReduxExamples/CounterRedux/counterReducer.tsx";
import addReducer from "../Lab4/ReduxExamples/AddRedux/addReducer.tsx";
import todosReducer from "../Lab4/ReduxExamples/todos/todosReducer.ts";

const store = configureStore({
    reducer: {
        helloReducer,
        counterReducer,
        addReducer,
        todosReducer
    }
});
export default store;