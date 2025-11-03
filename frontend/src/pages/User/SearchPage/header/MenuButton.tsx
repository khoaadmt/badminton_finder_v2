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
        navigate(
          `/search/sessions?location=${"Hà Nội"}&type=${"Giao lưu"}&page=${1}`,
        );
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
        className="menu-search-page-header w-full"
        mode="horizontal"
        defaultSelectedKeys={[defaultSelectedKeys]}
        items={menuItems}
        onClick={handleClickHeaderMenu}
        style={{ color: "black" }}
      />
      {/* Nút hamburger cho màn hình nhỏ */}
      <div className="flex items-center sm:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="cursor-pointer rounded-full border border-neutral-200 p-2 transition hover:shadow-md"
        >
          <MenuOutlined className="text-xl" />
        </button>
      </div>

      {/* Menu dropdown cho màn hình nhỏ */}
      {isMenuOpen && (
        <div className="absolute right-0 top-16 z-50 rounded-lg bg-white p-4 shadow-lg sm:hidden">
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
