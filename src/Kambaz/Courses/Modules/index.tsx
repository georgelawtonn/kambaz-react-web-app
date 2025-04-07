import {useParams} from "react-router";
import LessonControlButtons from "./LessonControlButtons.tsx";
import ModuleControlButtons from "./ModuleControlButtons.tsx";
import {BsGripVertical} from "react-icons/bs";
import {useEffect, useState} from "react";
import ModulesControls from "./ModulesControls.tsx";
import {FormControl} from "react-bootstrap";
import {setModules, addModule, editModule, updateModule, deleteModule}
    from "./reducer";
import {useSelector, useDispatch} from "react-redux";
import * as coursesClient from "../client";
import * as modulesClient from "./client";

export default function Modules() {
    const {cid} = useParams();
    const [moduleName, setModuleName] = useState("");
    const {modules} = useSelector((state: any) => state.modulesReducer);
    const dispatch = useDispatch();


    const addModuleHandler = async () => {
        const newModule = await coursesClient.createModuleForCourse(cid!, {
            name: moduleName,
            course: cid,
        });
        dispatch(addModule(newModule));
        setModuleName("");
    };


    const deleteModuleHandler = async (moduleId: string) => {
        await modulesClient.deleteModule(moduleId);
        dispatch(deleteModule(moduleId));
    };

    const updateModuleHandler = async (module: any) => {
        await modulesClient.updateModule(module);
        dispatch(updateModule(module));
    };

    const fetchModules = async () => {
        const modules = await coursesClient.findModulesForCourse(cid!);
        dispatch(setModules(modules));
    };
    useEffect(() => {
        fetchModules();
    }, [cid]);

    return (
        <ul id="wd-modules" className="list-group rounded-0">
            <ModulesControls setModuleName={setModuleName} moduleName={moduleName} addModule={addModuleHandler}/>
            <br/>
            {modules
                .map((module: any) => (
                    <li className="wd-module list-group-item p-0 mb-5 fs-5 border-gray">
                        <div className="wd-title p-3 ps-2 bg-secondary">
                            <BsGripVertical className="me-2 fs-3"/>
                            {!module.editing && module.name}
                            {module.editing && (
                                <FormControl className="w-50 d-inline-block"
                                             onChange={(e) =>
                                                 updateModuleHandler({...module, name: e.target.value})
                                             }
                                             onKeyDown={(e) => {
                                                 if (e.key === "Enter") {
                                                     updateModuleHandler({...module, editing: false});
                                                 }
                                             }}
                                             defaultValue={module.name}/>
                            )}
                            <ModuleControlButtons
                                moduleId={module._id}
                                deleteModule={(moduleId) => deleteModuleHandler(moduleId)}
                                editModule={(moduleId) => dispatch(editModule(moduleId))}/>
                        </div>
                        {module.lessons && (
                            <ul className="wd-lessons list-group rounded-0">
                                {module.lessons.map((lesson: any) => (
                                    <li className="wd-lesson list-group-item p-3 ps-1">
                                        <BsGripVertical className="me-2 fs-3"/> {lesson.name}
                                        <LessonControlButtons/>
                                    </li>
                                ))}</ul>)}</li>))}</ul>
    );
}