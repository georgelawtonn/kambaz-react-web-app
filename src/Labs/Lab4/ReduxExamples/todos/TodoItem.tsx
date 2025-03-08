import {ListGroup, Button} from "react-bootstrap";
import {useDispatch} from "react-redux";
import {deleteTodo, setTodo} from "./todosReducer.ts";

export default function TodoItem({todo}: {
    todo: { id: string; title: string };
}) {
    const dispatch = useDispatch();
    return (
        <ListGroup.Item key={todo.id} className="d-flex justify-content-between align-items-center">
            {todo.title}
            <span>
            <Button className="me-1" onClick={() => dispatch(setTodo(todo))}
                    id="wd-set-todo-click"> Edit </Button>
            <Button className="btn btn-danger" onClick={() => dispatch(deleteTodo(todo.id))}
                    id="wd-delete-todo-click"> Delete </Button>
            </span>
        </ListGroup.Item>
    );
}

