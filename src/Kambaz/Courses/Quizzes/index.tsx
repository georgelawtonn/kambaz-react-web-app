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
import * as userClient from "../../Account/client.ts"

import {useEffect, useState} from "react";
import FacultyProtected from "../../Account/FacultyProtected.tsx";
import StudentProtected from "../../Account/StudentProtected.tsx";

export default function Quizzes() {
    const {cid} = useParams();
    const {currentUser} = useSelector((state: any) => state.accountReducer);
    const isStudent = currentUser?.role === "STUDENT";

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

    const [attempts, setAttempts] = useState<Record<string, any>>({});


    const getAvailability = (quiz: any) => {
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

    const displayQuizzes = isStudent
        ? quizzes.filter((quiz: any) => quiz.published)
        : quizzes;


    const fetchAttempts = async() => {
        const attemptsMap: Record<string, any> = {};
        for (const quiz of displayQuizzes) {
            const attempt = await userClient.findAttemptForUserAndQuiz(currentUser._id, quiz._id);
            if (attempt) {
                attemptsMap[quiz._id] = attempt;
            }
        }
        setAttempts(attemptsMap);
    }
    const fetchQuizzes = async () => {
        const quizzes = await coursesClient.findQuizzesForCourse(cid as string);
        dispatch(setQuizzes(quizzes));
    };
    useEffect(() => {
        fetchQuizzes();
    }, []);
    useEffect(() => {
        fetchAttempts()
    }, [displayQuizzes])

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
                        {displayQuizzes.map((quiz: any) => (
                            <ListGroup.Item
                                className="wd-lesson p-3 ps-1"
                                key={quiz._id}>
                                <div>
                                    <QuizPredescription/>
                                    <div>
                                        <FacultyProtected>
                                            <Link
                                                to={`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/view`}
                                                className="wd-assignment-link"
                                                style={{fontSize: '16px', fontWeight: '500'}}>
                                                {quiz.title}
                                            </Link>
                                        </FacultyProtected>
                                        <StudentProtected>
                                            {(() => {
                                                const availability = getAvailability(quiz);
                                                return (availability && (availability === "Closed" || availability.includes("Not available until"))) ? (
                                                    <span className="wd-assignment-link" style={{fontSize: '16px', fontWeight: '500', color: 'gray'}}>
                                                        {quiz.title}
                                                    </span>
                                                ) : (
                                                    <Link to={`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/preview`} className="wd-assignment-link" style={{fontSize: '16px', fontWeight: '500'}}>
                                                        {quiz.title}
                                                    </Link>
                                                );
                                            })()}
                                        </StudentProtected>
                                        <div>
                                            <span>{getAvailability(quiz)} | </span>
                                            <strong>Due</strong> {formatDueDate(quiz.due)} | {quiz.points} pts
                                            | {quiz.questions?.length || 0} Questions
                                            <StudentProtected>
                                                <span>
                                                    {attempts[quiz._id]
                                                    ? ` | Score: ${attempts[quiz._id].score}/${quiz.points}`
                                                    : " | Not Attempted"}
                                                </span>
                                            </StudentProtected>
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
