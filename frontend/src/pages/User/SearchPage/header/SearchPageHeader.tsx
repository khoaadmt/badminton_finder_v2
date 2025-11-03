import React, { useEffect, useState } from "react";
import { InputSearch } from "../input_search/InputSearch";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Dropdown, Menu, message } from "antd";
import { useDispatch, useSelector } from "react-redux";

import "./search-page-header.css";
import {
  CarryOutOutlined,
  FormOutlined,
  LogoutOutlined,
  MenuOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { RootState } from "../../../../interface";
import { logOutSuccess } from "../../../../redux/authSlice";

interface Props {
  defaultSelectedKeys: string;
}
export const SearchPageHeader: React.FC<Props> = (props) => {
  const { defaultSelectedKeys } = props;
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useSelector((state: RootState) => state.auth.login.currentUser);
  const location = searchParams.get("location");
  const type = searchParams.get("type");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const ProfileItems = [
    { key: "1", label: "Trang cá nhân", icon: <UserOutlined /> },
    { key: "2", label: "Logout", icon: <LogoutOutlined /> },
    { key: "3", label: "Bài viết của tôi", icon: <FormOutlined /> },
    { key: "4", label: "Sân đã đặt", icon: <CarryOutOutlined /> },
  ];

  const handleLogOut = () => {
    dispatch(logOutSuccess());
    navigate("/");
  };
  const handleDropdownItemClick = (e: any) => {
    if (e.key == 1) {
      navigate("/user/update-profile");
    }
    if (e.key == 2) {
      handleLogOut();
    }
    if (e.key == 3) {
      navigate("/user/my-post");
    }
    if (e.key == 4) {
      navigate("/user/my-booked-courts");
    }
  };
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
        if (!user) {
          message.error("Bạn cần đăng nhập để có thể đăng tin.");
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        }
        navigate("/search/facilities?location=Hà+Nội&type=Sân+đấu&page=1");
        break;
      case "4":
        if (!user) {
          message.error("Bạn cần đăng nhập để có thể đặt sân.");
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        }
        navigate("/post/create");

        break;
      default:
        break;
    }
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 bg-white pt-2 shadow-[rgba(0,0,0,0.1)_0px_10px_20px_-8px]">
      <nav className="sticky top-0 z-10 w-full bg-white py-3 sm:py-4">
        <div className="mx-auto max-w-[2520px] px-[15px] sm:px-2 md:px-5 xl:px-6">
          <div className="flex flex-row items-center justify-between gap-2 sm:gap-3 md:gap-6">
            <div className="hidden flex-[4] sm:flex">
              <Menu
                className="menu-search-page-header w-full"
                mode="horizontal"
                defaultSelectedKeys={[defaultSelectedKeys]}
                items={menuItems}
                onClick={handleClickHeaderMenu}
                style={{ color: "black" }}
              />
            </div>

            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="cursor-pointer rounded-full border border-neutral-200 p-2 transition hover:shadow-md"
              >
                <MenuOutlined className="text-xl" />
              </button>
            </div>

            <div className="flex items-center justify-end gap-2 sm:gap-4">
              <div className="relative flex flex-shrink-0 justify-end">
                <div className="flex flex-row items-center gap-3">
                  {user ? (
                    <Dropdown
                      menu={{
                        items: ProfileItems,
                        onClick: handleDropdownItemClick,
                      }}
                      placement="bottom"
                      trigger={["click"]}
                    >
                      <button className="flex cursor-pointer flex-row items-center gap-2 rounded-full border border-neutral-200 p-1 transition hover:shadow-md sm:p-2 md:py-2 md:pl-4 md:pr-3">
                        <div className="hidden truncate whitespace-nowrap font-semibold lg:block">
                          {user ? (
                            user.displayName
                          ) : (
                            <Link to="/login">Login</Link>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          {user && (
                            <img
                              alt="Avatar"
                              loading="lazy"
                              width="30"
                              height="30"
                              decoding="async"
                              data-nimg="1"
                              className="aspect-square rounded-full object-cover"
                              src={user.avaUrl}
                              style={{ color: "transparent" }}
                            />
                          )}
                        </div>
                      </button>
                    </Dropdown>
                  ) : (
                    <button className="flex cursor-pointer flex-row items-center gap-2 rounded-full border border-neutral-200 p-1 transition hover:shadow-md sm:p-2 md:py-2 md:pl-4 md:pr-3">
                      <div className="hidden truncate whitespace-nowrap font-semibold lg:block">
                        <Link to="/login">Login</Link>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Menu dropdown cho màn hình nhỏ */}
          {isMenuOpen && (
            <div className="absolute left-0 top-16 z-50 rounded-lg bg-white p-4 shadow-lg sm:hidden">
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
        </div>
      </nav>
    </header>
  );
};
