import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import MyHeader from "../Header/Header";
import { MyFooter } from "../Footer/Footer";

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
