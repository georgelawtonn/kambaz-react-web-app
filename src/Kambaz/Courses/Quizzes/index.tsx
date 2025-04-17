import {ListGroup} from "react-bootstrap";
import {BsGripVertical} from "react-icons/bs";

import {FaCaretDown} from "react-icons/fa";

import {Link, useParams} from "react-router-dom";
import QuizzesControls from "./QuizzesControls.tsx";
import QuizPredescription from "./QuizPredescription.tsx";
import LessonControlButtons from "./LessonControlButtons.tsx";
import {useDispatch, useSelector} from "react-redux";

import {setQuizzes} from "./reducer.ts";
import * as coursesClient from "../client";

import {useEffect} from "react";

export default function Quizzes() {
    const {cid} = useParams();

    const formatDueDate = (dateTime: string) => {
        if (!dateTime) return '';
        const date = new Date(dateTime);
        const month = date.toLocaleString('default', {month: 'short'});
        const day = date.getDate();
        const time = date.toLocaleString('default', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }).toLowerCase();
        return `${month} ${day} at ${time}`
    }

    const getAvailability = (quiz : any) => {
        const now = new Date();
        const availableFrom = quiz.available_from ? new Date(quiz.available_from) : null;
        const availableUntil = quiz.available_until ? new Date(quiz.available_until) : null;

        if (!availableUntil || !availableFrom) return '';

        if (now > availableUntil) {
            return "Closed";
        } else if (now >= availableFrom && now <= availableUntil) {
            return "Available";
        } else if (now < availableFrom) {
            return `Not available until ${formatDueDate(quiz.available_from)}`;
        }
    };

    const dispatch = useDispatch();
    const quizzes = useSelector((state: any) => state.quizzesReducer.quizzes);

    const fetchQuizzes = async () => {
        const quizzes = await coursesClient.findQuizzesForCourse(cid as string);
        dispatch(setQuizzes(quizzes));
    };
    useEffect(() => {
        fetchQuizzes();
    }, []);

    return (
        <div>
            <QuizzesControls/><br/><br/><br/><br/>
            <ListGroup className="rounded-0" id="wd-modules">
                <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2 bg-secondary">
                        <BsGripVertical className="me-2 fs-3"/><FaCaretDown className="me-2 fs-4"/>
                        <strong>Assignment Quizzes</strong>
                    </div>
                    <ListGroup className="wd-lessons rounded-0">
                        {quizzes.map((quiz: any) => (
                            <ListGroup.Item
                                className="wd-lesson p-3 ps-1"
                                key={quiz._id}>
                                <div>
                                    <QuizPredescription />
                                    <div>
                                        <Link
                                            to={`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/view`}
                                            className="wd-assignment-link"
                                            style={{fontSize: '16px', fontWeight: '500'}}>
                                            {quiz.title}
                                        </Link>
                                        <div>
                                            <span>{getAvailability(quiz)} | </span>
                                            <strong>Due</strong> {formatDueDate(quiz.due)} | {quiz.points} pts | {quiz.questions?.length || 0} Questions ****NEEDS SCORE*****
                                        </div>
                                    </div>
                                    <LessonControlButtons quiz={quiz}/>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
}
