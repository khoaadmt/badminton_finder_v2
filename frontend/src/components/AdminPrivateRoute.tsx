import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../interface";

const PrivateRoute = () => {
    const user = useSelector((state: RootState) => state.auth.login.currentUser);

    if (!user || user.role !== "admin") {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
