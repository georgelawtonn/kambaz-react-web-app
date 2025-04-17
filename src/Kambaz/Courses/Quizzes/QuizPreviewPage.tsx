import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Alert, Button } from 'react-bootstrap';
import QuizPreview from './QuizPreview';

// This is a simple wrapper component for the QuizPreview
export default function QuizPreviewPage() {
    const { cid, qid } = useParams();
    const navigate = useNavigate();

    // Get the quiz from Redux store
    const quiz = useSelector((state: any) =>
        state.quizzesReducer.quizzes.find((q: any) => q._id === qid)
    );

    // Get current user from auth state
    // const { currentUser } = useSelector((state: any) => state.accountReducer);

    // If quiz doesn't exist, show an error
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

    // If user is not faculty, show an error
    // if (!currentUser || currentUser.role !== 'FACULTY') {
    //     return (
    //         <div className="container mt-4">
    //             <Alert variant="warning">
    //                 <Alert.Heading>Access Denied</Alert.Heading>
    //                 <p>You need to be a faculty member to preview quizzes.</p>
    //                 <hr />
    //                 <div className="d-flex justify-content-end">
    //                     <Button
    //                         onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
    //                         variant="outline-warning"
    //                     >
    //                         Back to Quizzes
    //                     </Button>
    //                 </div>
    //             </Alert>
    //         </div>
    //     );
    // }

    // Everything is good, render the quiz preview
    return <QuizPreview />;
}