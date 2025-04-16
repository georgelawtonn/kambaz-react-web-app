import {useState} from 'react';
import {Nav} from 'react-bootstrap';
import QuizDetailEditor from './QuizDetailEditor';
import {useSelector} from "react-redux";
import {v4 as uuidv4} from "uuid";
import {useParams} from "react-router-dom";
import QuizQuestionsEditor from "./Questions/QuizQuestionsEditor.tsx";

export default function QuizEditor() {
    const [activeTab, setActiveTab] = useState('details');
    const {cid, qid} = useParams();

    const now = new Date().toISOString().slice(0, 16);


    const formatDateForInput = (dateTime: string) => {
        try {
            const date = new Date(dateTime);
            if (isNaN(date.getTime())) {
                return new Date().toISOString().slice(0, 16);
            }
            return date.toISOString().slice(0, 16);
        } catch (error) {
            console.error('Error formatting date for input:', error);
            return new Date().toISOString().slice(0, 16);
        }
    };

    const quiz = useSelector((state: any) => state.quizzesReducer.quizzes)
        .find((quiz: any) => quiz._id === qid);

    const [quizData, setQuizData] = useState({
        _id: quiz?._id || uuidv4(),
        title: quiz?.title || "New Quiz",
        course: quiz?.course || cid,
        description: quiz?.description || "Quiz description",
        points: quiz?.points || 100,
        quiz_type: quiz?.quiz_type || "GRADED_QUIZ",
        assignment_group: quiz?.assignment_group || "QUIZZES",
        shuffle_answers: quiz?.shuffle_answers || true,
        has_time_limit: quiz?.has_time_limit || true,
        time_limit: quiz?.time_limit || 20,
        multiple_attempts: quiz?.multiple_attempts || false,
        attempts_allowed: quiz?.attempts_allowed || 1,
        show_correct_answers: quiz?.show_correct_answers || false,
        show_correct_answers_date: formatDateForInput(quiz?.show_correct_answers_date || now),
        access_code: quiz?.access_code || "",
        one_question_at_a_time: quiz?.one_question_at_a_time || true,
        webcam_required: quiz?.webcam_required || false,
        lock_questions_after_answering: quiz?.lock_questions_after_answering || false,
        due: formatDateForInput(quiz?.due || now),
        available_from: formatDateForInput(quiz?.available_from || now),
        available_until: formatDateForInput(quiz?.available_until || now),
    });

    return (
        <div>
            <Nav variant="tabs" className="mb-3">
                <Nav.Item>
                    <Nav.Link
                        active={activeTab === 'details'}
                        onClick={() => setActiveTab('details')}
                    >
                        Details
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link
                        active={activeTab === 'questions'}
                        onClick={() => setActiveTab('questions')}
                    >
                        Questions
                    </Nav.Link>
                </Nav.Item>
            </Nav>
            {activeTab === 'details' && <QuizDetailEditor quizData={quizData} setQuizData={setQuizData}/>}
            {activeTab === 'questions' && <QuizQuestionsEditor quizData={quizData}/>}
        </div>
    );
}