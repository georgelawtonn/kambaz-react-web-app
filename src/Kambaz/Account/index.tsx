import {Routes, Route, Navigate} from "react-router";
import Signin from "./Signin.tsx";
import Profile from "./Profile.tsx";
import Signup from "./Singup.tsx";
import AccountNavigation from "./Navigation.tsx";
import {useSelector} from "react-redux";
import Users from "./Users.tsx";


export default function Account() {
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    return (
        <div id="wd-account-screen">
            <div className="d-flex">
                <div className="d-none d-md-block">
                    <AccountNavigation />
                </div>
                <div className="flex-fill">
                    <Routes>
                        <Route path="/" element={<Navigate to={ currentUser ? "/Kambaz/Account/Profile" : "/Kambaz/Account/Signin" }/>}/>
                        <Route path="/Signin" element={<Signin/>}/>
                        <Route path="/Profile" element={<Profile/>}/>
                        <Route path="/Signup" element={<Signup/>}/>
                        <Route path="/Users" element={<Users />} />
                        <Route path="/Users/:uid" element={<Users />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}


