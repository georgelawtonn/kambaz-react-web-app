import {ListGroup, Button, FormControl} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {addTodo, setTodo, updateTodo} from "./todosReducer.ts";

export default function TodoForm() {
    const {todo} = useSelector((state: any) => state.todosReducer);
    const dispatch = useDispatch();
    return (
        <ListGroup.Item className="d-flex">
            <FormControl
                className="me-1"
                defaultValue={todo.title}
                onChange={(e) => dispatch(setTodo({...todo, title: e.target.value}))}/>
            <Button className="btn btn-warning me-1" onClick={() => dispatch(updateTodo(todo))}
                    id="wd-update-todo-click"> Update </Button>
            <Button className="btn btn-success" onClick={() => dispatch(addTodo(todo))}
                    id="wd-add-todo-click"> Add </Button>
        </ListGroup.Item>
    );
}
