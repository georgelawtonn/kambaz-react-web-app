import {IoEllipsisVertical} from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";
import FacultyProtected from "../../Account/FacultyProtected.tsx";
import RedCheckmark from "./RedCheckmark.tsx";
import * as quizzesClient from "../Quizzes/client.ts";
import {useDispatch} from "react-redux";
import {deleteQuiz, publishQuiz} from "./reducer.ts";
import {useState} from "react";
import {Button, Modal} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

export default function LessonControlButtons({quiz}: {
    quiz: any;
}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showOptionsModal, setShowOptionsModal] = useState(false);

    const handlePublishToggle = async () => {
        const newPublishState = !quiz.published;
        await quizzesClient.publishQuiz(quiz._id, newPublishState);
        dispatch(publishQuiz({quizId: quiz._id, publishState: newPublishState}));
    };

    const handleEdit = async () => {
        navigate(`/Kambaz/Courses/${quiz.course}/Quizzes/${quiz._id}/edit`);
        setShowOptionsModal(false);
    };

    const handleDelete = async () => {
        await quizzesClient.deleteQuiz(quiz._id);
        dispatch(deleteQuiz(quiz._id));
        setShowOptionsModal(false);
    }

    return (
        <FacultyProtected>
            <div className="float-end">
                {quiz.published ? (
                    <GreenCheckmark/>
                ) : (
                    <span
                        onClick={handlePublishToggle}
                    >
                        <RedCheckmark/>
                    </span>
                )}
                <span
                    onClick={() => setShowOptionsModal(true)}
                >
                    <IoEllipsisVertical className="fs-4"/>
                </span>
                <Modal show={showOptionsModal} onHide={() => setShowOptionsModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Quiz Options: {quiz.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="d-grid gap-2">
                            <Button variant="primary" onClick={handleEdit}>
                                Edit Quiz
                            </Button>
                            <Button variant="danger" onClick={handleDelete}>
                                Delete Quiz
                            </Button>
                            {quiz.published ? (
                                <Button variant="warning" onClick={() => handlePublishToggle()}>
                                    Unpublish Quiz
                                </Button>
                            ) : (
                                <Button variant="success" onClick={() => handlePublishToggle()}>
                                    Publish Quiz
                                </Button>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowOptionsModal(false)}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </FacultyProtected>);
}
