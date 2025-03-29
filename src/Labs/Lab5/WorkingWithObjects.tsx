import {FormControl, Form} from "react-bootstrap";
import {useState} from "react";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
export default function WorkingWithObjects() {
    const [assignment, setAssignment] = useState({
        id: 1, title: "NodeJS Assignment",
        description: "Create a NodeJS server with ExpressJS",
        due: "2021-10-10", completed: false, score: 0,
    });
    const [module, setModule] = useState({
        _id: "M101",
        name: "Introduction to Rocket Propulsion",
        description: "Basic principles of rocket propulsion and rocket engines.",
        course: "RS101",
        lessons: [
            {
                _id: "L101",
                name: "History of Rocketry",
                description: "A brief history of rocketry and space exploration.",
                module: "M101"
            },
            {
                _id: "L102",
                name: "Rocket Propulsion Fundamentals",
                description: "Basic principles of rocket propulsion.",
                module: "M101"
            },
            {
                _id: "L103",
                name: "Rocket Engine Types",
                description: "Overview of different types of rocket engines.",
                module: "M101"
            }
        ]
    });
    const ASSIGNMENT_API_URL = `${REMOTE_SERVER}/lab5/assignment`
    const MODULE_API_URL = `${REMOTE_SERVER}/lab5/module`
    return (
        <div id="wd-working-with-objects">
            <h3>Working With Objects</h3>
            <h4>Modifying Properties</h4>
            <div className="my-3">
                <a id="wd-update-assignment-title"
                   className="btn btn-primary float-end"
                   href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}>
                    Update Title
                </a>
                <FormControl className="w-75" id="wd-assignment-title"
                             defaultValue={assignment.title} onChange={(e) =>
                    setAssignment({...assignment, title: e.target.value})}/>
            </div>
            <div className="my-3">
                <a id="wd-update-assignment-title"
                   className="btn btn-primary float-end"
                   href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}>
                    Update Score
                </a>
                <FormControl className="w-75" id="wd-assignment-score" type="number"
                             defaultValue={assignment.score} onChange={(e) =>
                    setAssignment({...assignment, score: Number(e.target.value)})}/>
            </div>

            <div className="my-3">
                <a id="wd-update-assignment-completed"
                   className="btn btn-primary float-end"
                   href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}>
                    Update Completed
                </a>
                <Form.Check
                    id="wd-assignment-completed"
                    type="checkbox"
                    checked={assignment.completed}
                    onChange={(e) => setAssignment({...assignment, completed: e.target.checked})}
                />
            </div>

            <div className="my-3">
                <a id="wd-update-module-name"
                   className="btn btn-primary float-end"
                   href={`${MODULE_API_URL}/name/${module.name}`}>
                    Update Name
                </a>
                <FormControl className="w-75" id="wd-module-name"
                             defaultValue={module.name} onChange={(e) =>
                    setModule({...module, name: e.target.value})}/>
            </div>

            <div className="my-3">
                <a id="wd-update-module-description"
                   className="btn btn-primary float-end"
                   href={`${MODULE_API_URL}/description/${module.description}`}>
                    Update Description
                </a>
                <FormControl className="w-75" id="wd-module-description"
                             defaultValue={module.description} onChange={(e) =>
                    setModule({...module, description: e.target.value})}/>
            </div>
            <hr/>
            <h4>Retrieving Objects</h4>
            <a id="wd-retrieve-assignments" className="btn btn-primary me-2"
               href={`${REMOTE_SERVER}/lab5/assignment`}>
                Get Assignment
            </a>
            <a id="wd-retrieve-modules" className="btn btn-primary"
               href={`${REMOTE_SERVER}/lab5/module`}>
                Get Module
            </a>
            <hr/>
            <h4>Retrieving Properties</h4>
            <a id="wd-retrieve-assignment-title" className="btn btn-primary me-2"
               href={`${REMOTE_SERVER}/lab5/assignment/title`}>
                Get Title
            </a>
            <a id="wd-retrieve-module-name" className="btn btn-primary"
               href={`${REMOTE_SERVER}/lab5/module/name`}>
                Get Name
            </a>

            <hr/>
        </div>
    );
}
