import {Link} from "react-router-dom";
import {Form, FormControl, FormGroup, FormSelect, InputGroup} from "react-bootstrap";

export default function Profile() {
    return (


        <div>
            <FormGroup><Form.Label><h3>Profile</h3></Form.Label>
                <FormControl className="mb-2" placeholder="alice"/></FormGroup>
            <FormControl className="mb-2" placeholder="123" type="password"/>
            <FormControl className="mb-2" placeholder="Alice"/>
            <FormControl className="mb-2" placeholder="Wonderland"/>
            <FormGroup className="mb-2">
                <InputGroup>
                    <FormControl type="date" placeholder="mm/dd/yyyy"/>
                </InputGroup>
            </FormGroup>
            <FormControl type="email" className="mb-2" placeholder="alice@wonderland.com"/>
            <FormSelect className="mb-2">
                <option value="1">User</option>
                <option value="2">Admin</option>
                <option value="3">Faculty</option>
                <option value="4">Student</option>
            </FormSelect>

            <Link id="wd-signin-btn"
                  to="/Kambaz/Account/signin"
                  className="btn btn-danger w-100 mb-2"
            >
                Signout </Link>
        </div>
    );
}
