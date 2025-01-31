import {Table} from "react-bootstrap";
import {FaUserCircle} from "react-icons/fa";

export default function PeopleTable() {
    return (
        <div id="wd-people-table">
            <Table striped>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Login ID</th>
                    <th>Section</th>
                    <th>Role</th>
                    <th>Last Activity</th>
                    <th>Total Activity</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="wd-full-name text-nowrap">
                        <FaUserCircle className="me-2 fs-1 text-secondary"/>
                        <span className="wd-first-name">Tony</span>{" "}
                        <span className="wd-last-name">Stark</span></td>
                    <td className="wd-login-id">001234561S</td>
                    <td className="wd-section">S101</td>
                    <td className="wd-role">STUDENT</td>
                    <td className="wd-last-activity">2020-10-01</td>
                    <td className="wd-total-activity">10:21:32</td>
                </tr>
                <tr>
                    <td className="wd-full-name text-nowrap">
                        <FaUserCircle className="me-2 fs-1 text-secondary"/>
                        <span className="wd-first-name">Thomas</span>{" "}
                        <span className="wd-last-name">Horak</span></td>
                    <td className="wd-login-id">004134561S</td>
                    <td className="wd-section">S101</td>
                    <td className="wd-role">STUDENT</td>
                    <td className="wd-last-activity">2020-09-01</td>
                    <td className="wd-total-activity">10:22:32</td>
                </tr>
                <tr>
                    <td className="wd-full-name text-nowrap">
                        <FaUserCircle className="me-2 fs-1 text-secondary"/>
                        <span className="wd-first-name">Daniel</span>{" "}
                        <span className="wd-last-name">Moss</span></td>
                    <td className="wd-login-id">001634561S</td>
                    <td className="wd-section">S101</td>
                    <td className="wd-role">STUDENT</td>
                    <td className="wd-last-activity">2020-12-01</td>
                    <td className="wd-total-activity">11:11:32</td>
                </tr>
                <tr>
                    <td className="wd-full-name text-nowrap">
                        <FaUserCircle className="me-2 fs-1 text-secondary"/>
                        <span className="wd-first-name">Anne</span>{" "}
                        <span className="wd-last-name">Curley</span></td>
                    <td className="wd-login-id">005134561S</td>
                    <td className="wd-section">S101</td>
                    <td className="wd-role">STUDENT</td>
                    <td className="wd-last-activity">2020-11-01</td>
                    <td className="wd-total-activity">4:21:31</td>
                </tr>
                </tbody>
            </Table>
        </div>);
}