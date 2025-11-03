import { MenuOutlined } from "@ant-design/icons";
import { Menu, message } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { number } from "yup";
interface Props {
    hasUser: any;
    defaultSelectedKeys: string;
}
export const MenuButton: React.FC<Props> = (props) => {
    const { hasUser, defaultSelectedKeys } = props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const menuItems = [
        { key: "1", label: "Home" },
        { key: "2", label: "Tìm kiếm" },
        { key: "3", label: "Đặt sân" },
        { key: "4", label: "Đăng tin" },
    ];

    const handleClickHeaderMenu = (e: any) => {
        switch (e.key) {
            case "1":
                navigate("/");
                break;
            case "2":
                navigate(`/search/sessions?location=${"Hà Nội"}&type=${"Giao lưu"}&page=${1}`);
                break;
            case "3":
                if (!hasUser) {
                    message.error("Bạn cần đăng nhập để có thể đăng tin.");
                    setTimeout(() => {
                        navigate("/login");
                    }, 1500);
                }
                break;
            case "4":
                if (!hasUser) {
                    message.error("Bạn cần đăng nhập để có thể đặt sân.");
                    setTimeout(() => {
                        navigate("/login");
                    }, 1500);
                } else {
                    navigate("/post/create");
                }
                break;
            default:
                break;
        }
    };
    return (
        <>
            <Menu
                className="w-full menu-search-page-header"
                mode="horizontal"
                defaultSelectedKeys={[defaultSelectedKeys]}
                items={menuItems}
                onClick={handleClickHeaderMenu}
                style={{ color: "black" }}
            />
            {/* Nút hamburger cho màn hình nhỏ */}
            <div className="sm:hidden flex items-center">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 border border-neutral-200 rounded-full cursor-pointer hover:shadow-md transition">
                    <MenuOutlined className="text-xl" />
                </button>
            </div>

            {/* Menu dropdown cho màn hình nhỏ */}
            {isMenuOpen && (
                <div className="absolute top-16 right-0 bg-white shadow-lg rounded-lg p-4 sm:hidden z-50">
                    <Menu
                        className="menu-search-page-header"
                        mode="vertical"
                        defaultSelectedKeys={[defaultSelectedKeys]}
                        items={menuItems}
                        onClick={handleClickHeaderMenu}
                        style={{ color: "black" }}
                    />
                </div>
            )}
        </>
    );
};
