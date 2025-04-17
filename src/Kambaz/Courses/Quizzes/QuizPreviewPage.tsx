import { useParams, useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { Alert, Button } from 'react-bootstrap';
import QuizPreview from './QuizPreview';
import * as coursesClient from "../client.ts";
import {setQuizzes} from "./reducer.ts";
import {useEffect} from "react";

// This is a simple wrapper component for the QuizPreview
export default function QuizPreviewPage() {
    const { cid, qid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchQuiz = async () => {
        const quizzes = await coursesClient.findQuizzesForCourse(cid as string);
        dispatch(setQuizzes(quizzes));
        const quiz = useSelector((state: any) =>
            state.quizzesReducer.quizzes.find((q: any) => q._id === qid)
        );
        if (!quiz) {
            return (
                <div className="container mt-4">
                    <Alert variant="danger">
                        <Alert.Heading>Quiz Not Found</Alert.Heading>
                        <p>The quiz you're looking for doesn't exist or you don't have permission to view it.</p>
                        <hr />
                        <div className="d-flex justify-content-end">
                            <Button
                                onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
                                variant="outline-danger"
                            >
                                Back to Quizzes
                            </Button>
                        </div>
                    </Alert>
                </div>
            );
        }
    };
    useEffect(() => {
        fetchQuiz();
    }, []);

    return <QuizPreview />;
}