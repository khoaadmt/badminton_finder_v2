import React from "react";
import { Menu, message, Dropdown } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../interface";
import { setSuccessState } from "../../redux/authSlice";
import { createAxios } from "../../utils/api/createInstance";

const MyHeader: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.login.currentUser);
    const navigate = useNavigate();

    const mainMenuItems = [
        { key: "1", label: "Home" },
        { key: "2", label: "Tìm kiếm" },
        { key: "3", label: "Đặt sân" },
        { key: "4", label: "Đăng tin" },
    ];

    const loginMenuItems = [{ key: "login", label: "Login" }];

    const handleMenuLeftClick = (e: any) => {
        switch (e.key) {
            case "1":
                navigate("/");
                break;
            case "2":
                navigate(`/search/sessions?location=Hà+Nội&type=Giao+lưu`);
                break;
            case "3":
                if (!user) {
                    message.warning("Bạn cần đăng nhập để đặt sân.");
                    setTimeout(() => navigate("/login"), 1200);
                } else {
                    navigate("/search/facilities?location=Hà+Nội&type=Sân+đấu");
                }
                break;
            case "4":
                if (!user) {
                    message.warning("Bạn cần đăng nhập để đăng tin.");
                    setTimeout(() => navigate("/login"), 1200);
                } else {
                    navigate("/post/create");
                }
                break;
            default:
                break;
        }
    };

    const handleMenuRightClick = (e: any) => {
        if (e.key === "login") navigate("/login");
    };

    return (
        <div
            style={{
                position: "absolute",
                top: 0,
                zIndex: 10,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "rgba(255, 255, 255, 0)",
                padding: "0 24px",
            }}>
            {/* <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                <h2 style={{ color: "white", margin: 0 }}>Badminton Finder</h2>
            </div> */}

            <Menu
                className="menu-header-left-home-page"
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={["1"]}
                items={mainMenuItems}
                onClick={handleMenuLeftClick}
            />

            {!user ? (
                <Menu
                    className="menu-header-right-home-page"
                    theme="dark"
                    mode="horizontal"
                    items={loginMenuItems}
                    onClick={handleMenuRightClick}
                />
            ) : (
                <Dropdown
                    menu={{
                        items: [
                            { key: "profile", label: "Thông tin cá nhân" },
                            { key: "logout", label: "Đăng xuất" },
                        ],
                        onClick: (e) => {
                            if (e.key === "logout") {
                                localStorage.clear();
                                message.success("Đã đăng xuất.");
                                navigate("/login");
                            }
                        },
                    }}>
                    <div
                        style={{
                            color: "white",
                            cursor: "pointer",
                            fontWeight: 500,
                        }}>
                        {user.displayName || user.username}
                    </div>
                </Dropdown>
            )}
        </div>
    );
};

export default MyHeader;
