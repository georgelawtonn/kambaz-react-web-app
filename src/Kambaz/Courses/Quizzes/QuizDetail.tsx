import {Button, Col, Row, Table} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {v4 as uuidv4} from "uuid";
import {FaPencil} from "react-icons/fa6";
import {useSelector} from "react-redux";

export default function QuizDetail() {
    const {cid, qid} = useParams();
    const navigate = useNavigate();
    const now = new Date().toISOString().slice(0, 16);

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

    const [quizData] = useState({
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
        <div className="m-4">
            <div className="mb-3 d-flex justify-content-center">
                <Button variant="secondary" size="lg" className="me-1" onClick={() => {
                    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`)
                //     THIS NEEDS CHANGES
                }}>
                    Preview
                </Button>
                <Button variant="secondary" size="lg" className="me-1" onClick={() => {
                    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`)
                }}>
                    <FaPencil/> Edit
                </Button>
            </div>

            <div className="border rounded p-3 mb-4">
                <h3><strong>{quizData.title}</strong></h3>
                <Row className="mb-3">
                    <Col sm={4} className="text-end fw-bold">Quiz Type:</Col>
                    <Col sm={8}>{quizData.quiz_type === "GRADED_QUIZ" ? "Graded Quiz" : quizData.quiz_type}</Col>
                </Row>

                <Row className="mb-3">
                    <Col sm={4} className="text-end fw-bold">Points:</Col>
                    <Col sm={8}>{quizData.points}</Col>
                </Row>

                <Row className="mb-3">
                    <Col sm={4} className="text-end fw-bold">Assignment Group:</Col>
                    <Col sm={8}>{quizData.assignment_group}</Col>
                </Row>

                <Row className="mb-3">
                    <Col sm={4} className="text-end fw-bold">Shuffle Answers:</Col>
                    <Col sm={8}>{quizData.shuffle_answers ? "Yes" : "No"}</Col>
                </Row>

                <Row className="mb-3">
                    <Col sm={4} className="text-end fw-bold">Time Limit:</Col>
                    <Col sm={8}>{quizData.time_limit} Minutes</Col>
                </Row>

                <Row className="mb-3">
                    <Col sm={4} className="text-end fw-bold">Multiple Attempts:</Col>
                    <Col sm={8}>{quizData.multiple_attempts ? "Yes" : "No"}</Col>
                </Row>

                <Row className="mb-3">
                    <Col sm={4} className="text-end fw-bold">Attempt Count:</Col>
                    <Col sm={8}>{quizData.attempts_allowed}</Col>
                </Row>

                <Row className="mb-3">
                    <Col sm={4} className="text-end fw-bold">Access Code:</Col>
                    <Col sm={8}>{quizData.access_code}</Col>
                </Row>

                <Row className="mb-3">
                    <Col sm={4} className="text-end fw-bold">Show Correct Answers:</Col>
                    <Col sm={8}>{quizData.show_correct_answers ? "Yes" : "No"}</Col>
                </Row>

                <Row className="mb-3">
                    <Col sm={4} className="text-end fw-bold">One Question at a Time:</Col>
                    <Col sm={8}>{quizData.one_question_at_a_time ? "Yes" : "No"}</Col>
                </Row>

                <Row className="mb-3">
                    <Col sm={4} className="text-end fw-bold">Webcam Required:</Col>
                    <Col sm={8}>{quizData.webcam_required ? "Yes" : "No"}</Col>
                </Row>

                <Row className="mb-3">
                    <Col sm={4} className="text-end fw-bold">Lock Questions After Answering:</Col>
                    <Col sm={8}>{quizData.lock_questions_after_answering ? "Yes" : "No"}</Col>
                </Row>

                <Table>
                    <thead>
                    <tr>
                        <th>Due</th>
                        <th>For</th>
                        <th>Available from</th>
                        <th>Until</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{formatDueDate(quizData.due)}</td>
                        <td>Everyone</td>
                        <td>{formatDueDate(quizData.available_from)}</td>
                        <td>{formatDueDate(quizData.available_until)}</td>
                    </tr>
                    </tbody>
                </Table>
            </div>
        </div>
    );
}
