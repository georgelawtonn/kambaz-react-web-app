import {useSelector} from "react-redux";

export default function StudentProtected({children}: { children: any }) {
    const {currentUser} = useSelector((state: any) => state.accountReducer);
    if (currentUser && currentUser.role === "STUDENT") {
        return children;
    } else {
        return null;
    }
}
