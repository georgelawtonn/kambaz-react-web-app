import {Button, Form, FormCheck, FormControl, FormGroup, FormLabel, FormSelect, InputGroup} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import Editor from 'react-simple-wysiwyg';
import * as coursesClient from "../client.ts";
import * as quizzesClient from "../Quizzes/client.ts";
import {addQuiz, updateQuiz} from "./reducer.ts";

export default function QuizDetailEditor({quizData, setQuizData}:
                                             {
                                                 quizData: any;
                                                 setQuizData: (quiz: any) => void;
                                             }) {
    const {cid, qid} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSaveAndPublish = async () => {
        if (!cid) return;
        const publishedQuizData = {
            ...quizData,
            published: true
        };

        if (qid === 'new') {
            const newQuiz = await coursesClient.createQuizForCourse(cid, publishedQuizData);
            dispatch(addQuiz(newQuiz));
        } else {
            await quizzesClient.updateQuiz(publishedQuizData);
            dispatch(updateQuiz(publishedQuizData));
        }

        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    };

    const handleSave = async () => {
        if (!cid) return;
        if (qid === 'new') {
            const newQuiz = await coursesClient.createQuizForCourse(cid, quizData);
            dispatch(addQuiz(newQuiz));
        } else {
            await quizzesClient.updateQuiz(quizData);
            dispatch(updateQuiz(quizData));
        }
        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    }

    const handleCancel = () => {
        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    }

    return (
        <div>
            <FormGroup className="mb-3">
                <FormLabel><strong>Quiz Name</strong></FormLabel>
                <FormControl value={quizData.title}
                             onChange={(e) => setQuizData({...quizData, title: e.target.value})}/>
            </FormGroup>
            <strong>Quiz Instructions:</strong>
            <Editor value={quizData.description}
                    onChange={(e) => setQuizData({...quizData, description: e.target.value})}/>
            <br/>
            <FormGroup className="mb-3 d-flex align-items-center">
                <div className="wd-grid-col-third-page text-end pe-2">
                    Quiz Type
                </div>
                <div className="wd-grid-col-two-thirds-page">
                    <FormSelect
                        value={quizData.quiz_type}
                        onChange={(e) => setQuizData({...quizData, quiz_type: e.target.value})}>
                        <option value="GRADED_QUIZ">Graded Quiz</option>
                        <option value="PRACTICE_QUIZ">Practice Quiz</option>
                        <option value="GRADED_SURVEY">Graded Survey</option>
                        <option value="UNGRADED_SURVEY">Ungraded Survey</option>
                    </FormSelect>
                </div>
            </FormGroup>

            <FormGroup className="mb-3 d-flex align-items-center">
                <div className="wd-grid-col-third-page text-end pe-2">
                    Assignment Group
                </div>
                <div className="wd-grid-col-two-thirds-page">
                    <FormSelect value={quizData.assignment_group}
                                onChange={(e) => setQuizData({...quizData, assignment_group: e.target.value})}>
                        <option value="QUIZZES">Quizzes</option>
                        <option value="EXAMS">Exams</option>
                        <option value="ASSIGNMENTS">Assignments</option>
                        <option value="PROJECT">Project</option>
                    </FormSelect>
                </div>
            </FormGroup>

            <FormGroup className="mb-3 d-flex align-items-center">
                <div className="wd-grid-col-third-page text-end pe-2">
                </div>
                <div className="wd-grid-col-two-thirds-page">
                    <div className="mb-2"><strong>Options</strong></div>
                    <FormCheck className="mb-3" label="Shuffle Answers" checked={quizData.shuffle_answers}
                               onChange={(e) => setQuizData({...quizData, shuffle_answers: e.target.checked})}/>
                    <div className="d-flex me-3 align-items-center">
                        <FormCheck
                            label="Time Limit"
                            className="me-3"
                            checked={quizData.has_time_limit}
                            onChange={(e) => setQuizData({...quizData, has_time_limit: e.target.checked})}
                        />
                        <FormControl
                            type="number"
                            className="me-2"
                            style={{width: 'auto'}}
                            value={quizData.time_limit}
                            onChange={(e) => setQuizData({...quizData, time_limit: parseInt(e.target.value)})}
                        /> Minutes
                    </div>
                    <br/>
                    <div className="me-3  d-flex align-items-center">
                        <FormCheck
                            label="Allow Multiple Attempts"
                            className="me-3"
                            checked={quizData.multiple_attempts}
                            onChange={(e) => setQuizData({...quizData, multiple_attempts: e.target.checked})}
                        />
                        <FormControl
                            type="number"
                            className="me-2"
                            style={{width: 'auto'}}
                            value={quizData.attempts_allowed}
                            onChange={(e) => setQuizData({...quizData, attempts_allowed: parseInt(e.target.value)})}
                        /> Attempts
                    </div>
                    <br/>
                    <div className="me-3 d-flex align-items-center">
                        <FormCheck
                            label="Show Correct Answers"
                            className="me-3"
                            checked={quizData.show_correct_answers}
                            onChange={(e) => setQuizData({...quizData, show_correct_answers: e.target.checked})}
                        />
                        <FormControl
                            type="datetime-local"
                            className="me-2"
                            style={{width: 'auto'}}
                            value={quizData.show_correct_answers_date}
                            onChange={(e) => setQuizData({...quizData, show_correct_answers_date: e.target.value})}
                        />
                    </div>
                    <br/>
                    <div className="me-3 d-flex align-items-center">
                        <FormCheck
                            label="One Question at a Time?"
                            checked={quizData.one_question_at_a_time}
                            onChange={(e) => setQuizData({...quizData, one_question_at_a_time: e.target.checked})}
                            className="me-3"
                        />
                    </div>
                    <br/>
                    <div className="me-3 d-flex align-items-center">
                        <FormCheck
                            label="Webcam Required?"
                            checked={quizData.webcam_required}
                            onChange={(e) => setQuizData({...quizData, webcam_required: e.target.checked})}
                            className="me-3"
                        />
                    </div>
                    <br/>
                    <div className="me-3 d-flex align-items-center">
                        <FormCheck
                            label="Lock Questions After Answering?"
                            checked={quizData.lock_questions_after_answering}
                            onChange={(e) => setQuizData({
                                ...quizData,
                                lock_questions_after_answering: e.target.checked
                            })}
                            className="me-3"
                        />
                    </div>
                </div>
            </FormGroup>

            <FormGroup className="mb-3 d-flex align-items-center">
                <div className="wd-grid-col-third-page text-end pe-2">
                    Access Code
                </div>
                <div className="wd-grid-col-two-thirds-page">
                    <FormControl
                        className="me-2"
                        value={quizData.access_code}
                        onChange={(e) => setQuizData({...quizData, access_code: e.target.value})}
                    />
                </div>
            </FormGroup>


            <FormGroup className="mb-3 d-flex">
                <div className="wd-grid-col-third-page text-end pe-2">
                    Assign
                </div>
                <div className="wd-grid-col-two-thirds-page">
                    <div className="border-grey">
                        <div className="pe-2">
                            <FormGroup>
                                <Form.Label><strong> Assign to </strong></Form.Label>
                                <InputGroup>
                                    <FormControl value="Everyone" disabled={true}/>
                                </InputGroup>
                            </FormGroup>
                            < br/>
                            <FormGroup>
                                <Form.Label><strong> Due </strong></Form.Label>
                                <InputGroup>
                                    <FormControl type="datetime-local"
                                                 value={quizData.due}
                                                 onChange={(e) => setQuizData({...quizData, due: e.target.value})}
                                    />
                                </InputGroup>
                            </FormGroup>
                            < br/>
                            <div className="wd-grid-col-half-page pe-2">
                                <FormGroup>
                                    <Form.Label><strong> Available from </strong></Form.Label>
                                    <InputGroup>
                                        <FormControl type="datetime-local"
                                                     value={quizData.available_from}
                                                     onChange={(e) => setQuizData({
                                                         ...quizData,
                                                         available_from: e.target.value
                                                     })}
                                        />
                                    </InputGroup>
                                </FormGroup>
                            </div>

                            <div className="wd-grid-col-half-page pe-2">
                                <FormGroup>
                                    <Form.Label><strong> Until </strong></Form.Label>
                                    <InputGroup>
                                        <FormControl type="datetime-local"
                                                     value={quizData.available_until}
                                                     onChange={(e) => setQuizData({
                                                         ...quizData,
                                                         available_until: e.target.value
                                                     })}
                                        />
                                    </InputGroup>
                                </FormGroup>
                            </div>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                        </div>
                    </div>
                </div>
            </FormGroup>

            <hr/>
            <div className="text-nowrap">
                <Button variant="success" size="lg" className="me-1 float-end" id="wd-add-module-btn"
                        onClick={handleSaveAndPublish}>
                    Save & Publish
                </Button>
                <Button variant="danger" size="lg" className="me-1 float-end" id="wd-add-module-btn"
                        onClick={handleSave}>
                    Save
                </Button>
                <Button variant="secondary" size="lg" className="me-1 float-end" id="wd-view-progress"
                        onClick={handleCancel}>
                    Cancel
                </Button>
            </div>
        </div>
    );
}
