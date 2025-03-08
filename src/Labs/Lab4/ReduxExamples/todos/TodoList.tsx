import {ListGroup} from "react-bootstrap";
import TodoItem from "./TodoItem.tsx";
import TodoForm from "./TodoForm.tsx";
import { useSelector } from "react-redux";

export default function TodoList() {
    const { todos } = useSelector((state: any) => state.todosReducer);

    return (
        <div id="wd-todo-list-redux">
            <h2><strong>Todo List</strong></h2>
            <ListGroup className="border rounded">
                <TodoForm />
                {todos.map((todo: any) => (
                    <TodoItem todo={todo} />
                ))}
            </ListGroup>
            <hr/>
        </div>);
}