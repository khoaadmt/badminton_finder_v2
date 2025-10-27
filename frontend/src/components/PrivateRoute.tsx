import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../interface";

const PrivateRoute = () => {
    const user = useSelector((state: RootState) => state.auth.login.currentUser);

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
