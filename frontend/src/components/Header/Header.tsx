import React, { useEffect, useState } from "react";
import { Menu, message, Dropdown, Button, Drawer, MenuProps } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../../interface";
import {
  UserOutlined,
  LogoutOutlined,
  FormOutlined,
  CarryOutOutlined,
  MenuOutlined,
  HomeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { logOutSuccess } from "../../redux/authSlice";
import "./Header.css";

const MyHeader: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.login.currentUser);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isHomePage, setIsHomePage] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(["1"]);
  const [open, setOpen] = useState(false);

  const pathToKey: Record<string, string> = {
    "/": "1",
    "/posts": "2",
    "/locations": "3",
    "/posts/create": "4",
    "/admin": "5",
  };

  const menuItems = [
    { key: "1", label: "Home", path: "/" },
    { key: "2", label: "Giao lưu", path: "/posts?location=Hà+Nội&page=1" },
    { key: "3", label: "Đặt sân", path: "/locations?location=Hà+Nội&page=1" },
    { key: "4", label: "Đăng tin", path: "/posts/create" },
    { key: "5", label: "Admin", path: "/admin" },
  ];

  const profileMenuItems = [
    {
      key: "p1",
      label: "Trang cá nhân",
      icon: <UserOutlined />,
      path: "/user/update-profile",
    },
    {
      key: "p2",
      label: "Bài viết của tôi",
      icon: <FormOutlined />,
      path: "/user/my-post",
    },
    {
      key: "p3",
      label: "Sân đã đặt",
      icon: <CarryOutOutlined />,
      path: "/user/my-booked-courts",
    },
    { key: "p4", label: "Đăng xuất", icon: <LogoutOutlined /> },
  ];

  const handleMenuClick = (e: any) => {
    const item = menuItems.find((m) => m.key === e.key);
    if (!item) return;

    if ((e.key === "3" || e.key === "4") && !user) {
      message.warning("Bạn cần đăng nhập để thực hiện chức năng này.");
      return setTimeout(() => navigate("/login"), 1000);
    }

    if (e.key === "5" && user?.role !== "admin") {
      message.warning("Chỉ có admin mới truy cập được trang này.");
      return;
    }

    navigate(item.path);
  };

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

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const mobileItems = [
    ...(user?.role === "admin"
      ? [
          {
            key: "admin",
            label: "Admin Page",
            icon: <HomeOutlined />,
            path: "/admin",
          },
          { type: "divider" },
        ]
      : []),
    {
      key: "1",
      label: "Đăng tin",
      icon: <EditOutlined />,
      path: "/posts/create",
    },
    {
      key: "2",
      label: "Đặt sân",
      icon: <CarryOutOutlined />,
      path: "/locations?location=Hà+Nội&page=1",
    },
    { type: "divider" },
    ...profileMenuItems,
  ];

  const mobileMenuData = [
    {
      key: "1",
      label: "Đăng tin",
      icon: <EditOutlined />,
      path: "/posts/create",
    },
    {
      key: "2",
      label: "Đặt sân",
      icon: <CarryOutOutlined />,
      path: "/locations?location=Hà+Nội&page=1",
    },
    { type: "divider" },
    {
      key: "3",
      label: "Trang cá nhân",
      icon: <UserOutlined />,
      path: "/user/update-profile",
    },
    {
      key: "4",
      label: "Bài viết của tôi",
      icon: <FormOutlined />,
      path: "/user/my-post",
    },
    {
      key: "5",
      label: "Sân đã đặt",
      icon: <CarryOutOutlined />,
      path: "/user/my-booked-courts",
    },
    { key: "6", label: "Đăng xuất", icon: <LogoutOutlined /> },
  ];

  const onMobileMenuClick = (e: any) => {
    const item = mobileItems.find(
      (m) => "key" in m && m.key === e.key, // ✅ chỉ tìm item có key
    ) as { key: string; path?: string };

    if (!item) return;

    if (item.key === "p4") {
      dispatch(logOutSuccess());
      message.success("Đã đăng xuất.");
      navigate("/");
      return;
    }

    if (item.path) navigate(item.path);
    onClose();
  };

  useEffect(() => {
    const key = pathToKey[location.pathname] || "1";
    setSelectedKeys([key]);
    setIsHomePage(location.pathname === "/");
  }, [location.pathname]);

  const loginMenu = [{ key: "login", label: "Login" }];
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
              menu={{ items: profileMenuItems, onClick: handleProfileClick }}
              className="mr-4 lg:mr-8"
            >
              <div
                style={{ color: "white", cursor: "pointer", fontWeight: 500 }}
              >
                {user.displayName || user.username}
              </div>
            </Dropdown>
          )}
        </div>
      ) : (
        <header className="sticky top-0 z-10 bg-white shadow-md">
          <div className="flex items-center justify-between px-4 py-2">
            {isMobile ? (
              <div className="flex w-[100%] items-center justify-between gap-3">
                <Menu
                  mode="horizontal"
                  selectedKeys={selectedKeys}
                  items={menuItems.slice(0, 3)}
                  onClick={handleMenuClick}
                />
                <div>
                  <Button
                    type="text"
                    icon={<MenuOutlined style={{ fontSize: 24 }} />}
                    onClick={showDrawer}
                  />
                  <Drawer
                    title="Menu"
                    placement="right"
                    closable
                    onClose={onClose}
                    open={open}
                  >
                    <Menu
                      mode="inline"
                      onClick={onMobileMenuClick}
                      items={mobileItems as MenuProps["items"]}
                    />
                  </Drawer>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-visible">
                  <Menu
                    className="w-auto"
                    key={isMobile ? "mobile" : "desktop"}
                    mode="horizontal"
                    selectedKeys={selectedKeys}
                    items={menuItems}
                    onClick={handleMenuClick}
                  />
                </div>
                <div className="flex items-center">
                  {user ? (
                    <Dropdown
                      menu={{
                        items: profileMenuItems,
                        onClick: handleProfileClick,
                      }}
                      trigger={["click"]}
                    >
                      <button className="flex items-center gap-2 rounded-full border px-3 py-1 hover:shadow-md">
                        <span>{user.displayName}</span>
                        <img
                          src={user.avaUrl}
                          alt="avatar"
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      </button>
                    </Dropdown>
                  ) : (
                    <Button type="primary" onClick={() => navigate("/login")}>
                      Login
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </header>
      )}
    </>
  );
};

export default MyHeader;
