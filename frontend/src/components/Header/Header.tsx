import React, { useEffect, useState } from "react";
import { Menu, message, Dropdown } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { RootState } from "../../interface";
import {
  UserOutlined,
  LogoutOutlined,
  FormOutlined,
  CarryOutOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { logOutSuccess } from "../../redux/authSlice";

const MyHeader: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.login.currentUser);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isHomePage, setIsHomePage] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(["1"]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathToKey: Record<string, string> = {
    "/": "1",
    "/posts": "2",
    "/locations": "3",
    "/posts/create": "4",
  };

  const menuItems = [
    { key: "1", label: "Home", path: "/" },
    { key: "2", label: "Giao lưu", path: "/posts?location=Hà+Nội&page=1" },
    { key: "3", label: "Đặt sân", path: "/locations?location=Hà+Nội&page=1" },
    { key: "4", label: "Đăng tin", path: "/posts/create" },
  ];

  const handleMenuClick = (e: any) => {
    const item = menuItems.find((m) => m.key === e.key);
    if (!item) return;

    if (e.key === "3" && !user) {
      message.warning("Bạn cần đăng nhập để đặt sân.");
      return setTimeout(() => navigate("/login"), 1200);
    }

    if (e.key === "4" && !user) {
      message.warning("Bạn cần đăng nhập để đăng tin.");
      return setTimeout(() => navigate("/login"), 1200);
    }

    navigate(item.path);
  };

  useEffect(() => {
    const key = pathToKey[location.pathname] || "1";
    setSelectedKeys([key]);
    setIsHomePage(location.pathname === "/");
  }, [location.pathname]);

  const profileMenuItems = [
    {
      key: "1",
      label: "Trang cá nhân",
      icon: <UserOutlined />,
      path: "/user/update-profile",
    },
    {
      key: "2",
      label: "Bài viết của tôi",
      icon: <FormOutlined />,
      path: "/user/my-post",
    },
    {
      key: "3",
      label: "Sân đã đặt",
      icon: <CarryOutOutlined />,
      path: "/user/my-booked-courts",
    },
    { key: "4", label: "Đăng xuất", icon: <LogoutOutlined /> },
  ];

  const handleProfileClick = (e: any) => {
    const item = profileMenuItems.find((i) => i.key === e.key);
    if (!item) return;

    if (e.key === "4") {
      dispatch(logOutSuccess());
      message.success("Đã đăng xuất.");
      navigate("/");
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const loginMenu = [{ key: "login", label: "Login" }];

  return (
    <>
      {isHomePage ? (
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
          }}
        >
          <Menu
            className="menu-header-left-home-page"
            theme="dark"
            mode="horizontal"
            selectedKeys={selectedKeys}
            items={menuItems}
            onClick={handleMenuClick}
          />

          {!user ? (
            <Menu
              className="menu-header-right-home-page"
              theme="dark"
              mode="horizontal"
              items={loginMenu}
              onClick={() => navigate("/login")}
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
              }}
            >
              <div
                style={{
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                {user.displayName || user.username}
              </div>
            </Dropdown>
          )}
        </div>
      ) : (
        <header className="sticky top-0 z-10 bg-white pt-2 shadow-[rgba(0,0,0,0.1)_0px_10px_20px_-8px]">
          <nav className="sticky top-0 z-10 w-full bg-white py-3 sm:py-4">
            <div className="mx-auto max-w-[2520px] px-[15px] sm:px-2 md:px-5 xl:px-6">
              <div className="flex flex-row items-center justify-between gap-2 sm:gap-3 md:gap-6">
                <div className="flex-[4] sm:flex">
                  <Menu
                    className="menu-search-page-header w-full"
                    mode="horizontal"
                    selectedKeys={selectedKeys}
                    items={menuItems}
                    onClick={handleMenuClick}
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
                            items: profileMenuItems,
                            onClick: handleProfileClick,
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
                    selectedKeys={selectedKeys}
                    items={menuItems}
                    onClick={handleMenuClick}
                    style={{ color: "black" }}
                  />
                </div>
              )}
            </div>
          </nav>
        </header>
      )}
    </>
  );
};

export default MyHeader;
