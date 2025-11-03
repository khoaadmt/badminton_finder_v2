import React, { useEffect, useState } from "react";
import { DesktopOutlined, FileOutlined, PieChartOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Card, Layout, Menu, theme } from "antd";
import { MyFooter } from "../Layout/Footer";
import { Overview } from "./Overview";
import "./index.css";
import TimeLine from "./TimeLine";

const { Header, Content, Footer, Sider } = Layout;

export const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(undefined as any);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
        <div>
            <Overview loading={loading} />
            <TimeLine loading={loading} />
            <MyFooter />
        </div>
    );
};
