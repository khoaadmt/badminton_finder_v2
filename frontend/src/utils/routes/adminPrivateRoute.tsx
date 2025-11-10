import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../../interface";
import { message } from "antd";

const PrivateRoute = () => {
  const user = useSelector((state: RootState) => state.auth.login.currentUser);

  if (!user || user.role !== "admin") {
    message.warning("Chỉ có admin mới truy cập được trang này! ");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
