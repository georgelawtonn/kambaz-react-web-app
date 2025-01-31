import {Link} from "react-router-dom";
import {Button, Card, Col, Row} from "react-bootstrap";

export default function Dashboard() {
    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard</h1>
            <hr/>
            <h2 id="wd-dashboard-published">Published Courses (12)</h2>
            <hr/>
            <div id="wd-dashboard-courses">
                <Row xs={1} md={5} className="g-4">
                    <Col className="wd-dashboard-course" style={{width: "300px"}}>
                        <Card>
                            <Link to="/Kambaz/Courses/1234/Home"
                                  className="wd-dashboard-course-link text-decoration-none text-dark">
                                <Card.Img variant="top" src="/images/reactjs.jpg" width="100%" height={160}/>
                                <Card.Body>
                                    <Card.Title className="wd-dashboard-course-title">CS1234 React JS</Card.Title>
                                    <Card.Text className="wd-dashboard-course-description">Full Stack software developer<br/><br/></Card.Text>
                                    <Button variant="primary">Go</Button>
                                </Card.Body>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{width: "300px"}}>
                        <Card>
                            <Link to="/Kambaz/Courses/1234/Home"
                                  className="wd-dashboard-course-link text-decoration-none text-dark">
                                <Card.Img variant="top" src="/images/languages.png" width="100%" height={160}/>
                                <Card.Body>
                                    <Card.Title className="wd-dashboard-course-title">CS4400 Programming
                                        Languages</Card.Title>
                                    <Card.Text className="wd-dashboard-course-description">Programming
                                        languages</Card.Text>
                                    <Button variant="primary">Go</Button>
                                </Card.Body>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{width: "300px"}}>
                        <Card>
                            <Link to="/Kambaz/Courses/1234/Home"
                                  className="wd-dashboard-course-link text-decoration-none text-dark">
                                <Card.Img variant="top" src="/images/professional.jpg" width="100%" height={160}/>
                                <Card.Body>
                                    <Card.Title className="wd-dashboard-course-title">CS1210 Professional
                                        Development</Card.Title>
                                    <Card.Text className="wd-dashboard-course-description">Developing professional
                                        skills</Card.Text>
                                    <Button variant="primary">Go</Button>
                                </Card.Body>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{width: "300px"}}>
                        <Card>
                            <Link to="/Kambaz/Courses/1234/Home"
                                  className="wd-dashboard-course-link text-decoration-none text-dark">
                                <Card.Img variant="top" src="/images/tool.jpg" width="100%" height={160}/>
                                <Card.Body>
                                    <Card.Title className="wd-dashboard-course-title">ARTD2361 Photo Tools</Card.Title>
                                    <Card.Text className="wd-dashboard-course-description">Photography
                                        tools<br/><br/></Card.Text>
                                    <Button variant="primary">Go</Button>
                                </Card.Body>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{width: "300px"}}>
                        <Card>
                            <Link to="/Kambaz/Courses/1234/Home"
                                  className="wd-dashboard-course-link text-decoration-none text-dark">
                                <Card.Img variant="top" src="/images/photo.jpg" width="100%" height={160}/>
                                <Card.Body>
                                    <Card.Title className="wd-dashboard-course-title">ARTD2360 Introduction to
                                        Photography</Card.Title>
                                    <Card.Text className="wd-dashboard-course-description">Making
                                        photographs</Card.Text>
                                    <Button variant="primary">Go</Button>
                                </Card.Body>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{width: "300px"}}>
                        <Card>
                            <Link to="/Kambaz/Courses/1234/Home"
                                  className="wd-dashboard-course-link text-decoration-none text-dark">
                                <Card.Img variant="top" src="/images/network.jpg" width="100%" height={160}/>
                                <Card.Body>
                                    <Card.Title className="wd-dashboard-course-title">CS4700 Network
                                        Fundamentals</Card.Title>
                                    <Card.Text className="wd-dashboard-course-description">Learning about
                                        Networks</Card.Text>
                                    <Button variant="primary">Go</Button>
                                </Card.Body>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{width: "300px"}}>
                        <Card>
                            <Link to="/Kambaz/Courses/1234/Home"
                                  className="wd-dashboard-course-link text-decoration-none text-dark">
                                <Card.Img variant="top" src="/images/discrete.jpg" width="100%" height={160}/>
                                <Card.Body>
                                    <Card.Title className="wd-dashboard-course-title">CS1800 Discrete
                                        Structures</Card.Title>
                                    <Card.Text className="wd-dashboard-course-description">Learning logic</Card.Text>
                                    <Button variant="primary">Go</Button>
                                </Card.Body>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{width: "300px"}}>
                        <Card>
                            <Link to="/Kambaz/Courses/1234/Home"
                                  className="wd-dashboard-course-link text-decoration-none text-dark">
                                <Card.Img variant="top" src="/images/work.jpg" width="100%" height={160}/>
                                <Card.Body>
                                    <Card.Title className="wd-dashboard-course-title">COOP3945 Co-op Work
                                        Experience</Card.Title>
                                    <Card.Text className="wd-dashboard-course-description">Working</Card.Text>
                                    <Button variant="primary">Go</Button>
                                </Card.Body>
                            </Link>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
