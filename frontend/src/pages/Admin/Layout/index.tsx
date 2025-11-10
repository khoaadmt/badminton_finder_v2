import { Layout, Menu, MenuProps, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  PieChartOutlined,
  FileOutlined,
  GroupOutlined,
  ScheduleOutlined,
  HomeOutlined,
} from "@ant-design/icons";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Dashboard", "1", <PieChartOutlined />),
  getItem("Sân cầu", "sub1", <GroupOutlined />, [
    getItem("Danh sách", "2"),
    getItem("Thêm mới", "3"),
  ]),
  getItem("Bài viết", "sub2", <ScheduleOutlined />, [
    getItem("Bài viết cần duyệt", "4"),
    getItem("Bài viết đã duyệt", "5"),
    getItem("Bài viết đã từ chối", "6"),
  ]),
  getItem("Giao dịch", "7", <FileOutlined />),
  getItem("Home page", "8", <HomeOutlined />),
];

export const LayoutPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const handleMenuOnChange = (e: any) => {
    const key = e.key;
    switch (key) {
      case "1":
        navigate("dashboard");
        break;
      case "2":
        navigate("location");
        break;
      case "3":
        navigate("location/add");
        break;
      case "4":
        navigate("post/review");
        break;
      case "5":
        navigate("post/checked");
        break;
      case "6":
        navigate("post/reject");
        break;
      case "7":
        navigate("statistics");
        break;
      case "8":
        navigate("/");
        break;
    }
  };
  const getSelectedKey = () => {
    const path = window.location.pathname;

    if (path.includes("dashboard")) return "1";
    if (path.includes("location/add")) return "3";
    if (path.includes("location")) return "2";
    if (path.includes("post/review")) return "4";
    if (path.includes("post/checked")) return "5";
    if (path.includes("post/reject")) return "6";
    if (path.includes("statistics")) return "7";

    return "1"; // Mặc định là "Dashboard"
  };

  return (
    <Layout hasSider>
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ overflow: "auto", height: "100vh", position: "fixed" }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          onSelect={handleMenuOnChange}
          className="sider"
          theme="light"
          selectedKeys={[getSelectedKey()]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "8px 12px 0", overflow: "initial" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
