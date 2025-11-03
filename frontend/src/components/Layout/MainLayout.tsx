import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Steps } from "antd";
import MyHeader from "../Header/Header";

const MainLayout: React.FC = () => {
    return (
        <div className="">
            <MyHeader />

            <main className="">
                <Outlet />
            </main>

            {/* <MyFooter /> */}
        </div>
    );
};

export default MainLayout;
