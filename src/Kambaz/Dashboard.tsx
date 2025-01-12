import {Link} from "react-router-dom";

export default function Dashboard() {
    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard</h1>
            <hr/>
            <h2 id="wd-dashboard-published">Published Courses (8)</h2>
            <hr/>
            <div id="wd-dashboard-courses">
                <div className="wd-dashboard-course">
                    <Link to="/Kambaz/Courses/1234/Home"
                          className="wd-dashboard-course-link">
                        <img src="/images/reactjs.jpg" width={200}/>
                        <div>
                            <h5> CS1234 React JS </h5>
                            <p className="wd-dashboard-course-title">
                                Full Stack software developer </p>
                            <button> Go</button>
                        </div>
                    </Link>
                </div>
                <div className="wd-dashboard-course">
                    <Link to="/Kambaz/Courses/4400/Home"
                          className="wd-dashboard-course-link">
                        <img src="/images/languages.png" width={200}/>
                        <div>
                            <h5> CS4400 Programming Languages </h5>
                            <p className="wd-dashboard-course-title">
                                Programming language developer </p>
                            <button> Go</button>
                        </div>
                    </Link>
                </div>
                <div className="wd-dashboard-course">
                    <Link to="/Kambaz/Courses/2361/Home"
                          className="wd-dashboard-course-link">
                        <img src="/images/tool.jpg" width={200}/>
                        <div>
                            <h5> ARTD2361 Photo Tools </h5>
                            <p className="wd-dashboard-course-title">
                                Photographer </p>
                            <button> Go</button>
                        </div>
                    </Link>
                </div>
                <div className="wd-dashboard-course">
                    <Link to="/Kambaz/Courses/2360/Home"
                          className="wd-dashboard-course-link">
                        <img src="/images/photo.jpg" width={200}/>
                        <div>
                            <h5> ARTD2360 Introduction to Photography </h5>
                            <p className="wd-dashboard-course-title">
                                Photographer </p>
                            <button> Go</button>
                        </div>
                    </Link>
                </div>
                <div className="wd-dashboard-course">
                    <Link to="/Kambaz/Courses/4700/Home"
                          className="wd-dashboard-course-link">
                        <img src="/images/network.jpg" width={200}/>
                        <div>
                            <h5> CS4700 Network Fundamentals</h5>
                            <p className="wd-dashboard-course-title">
                                Network developer </p>
                            <button> Go</button>
                        </div>
                    </Link>
                </div>
                <div className="wd-dashboard-course">
                    <Link to="/Kambaz/Courses/1800/Home"
                          className="wd-dashboard-course-link">
                        <img src="/images/discrete.jpg" width={200}/>
                        <div>
                            <h5> CS1800 Discrete Structures </h5>
                            <p className="wd-dashboard-course-title">
                                Student </p>
                            <button> Go</button>
                        </div>
                    </Link>
                </div>
                <div className="wd-dashboard-course">
                    <Link to="/Kambaz/Courses/3945/Home"
                          className="wd-dashboard-course-link">
                        <img src="/images/work.jpg" width={200}/>
                        <div>
                            <h5> COOP3945 Co-op Work Experience </h5>
                            <p className="wd-dashboard-course-title">
                                Employee </p>
                            <button> Go</button>
                        </div>
                    </Link>
                </div>
                <div className="wd-dashboard-course">
                    <Link to="/Kambaz/Courses/1210/Home"
                          className="wd-dashboard-course-link">
                        <img src="/images/professional.jpg" width={200}/>
                        <div>
                            <h5> CS1210 Professional Development </h5>
                            <p className="wd-dashboard-course-title">
                                Professional </p>
                            <button> Go</button>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
