import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import MyHeader from "../Header/Header";
import { MyFooter } from "../Footer/Footer";

const MainLayout: React.FC = () => {
  const location = useLocation();
  const [isHomePage, setIsHomePage] = useState(false);
  useEffect(() => {
    setIsHomePage(location.pathname === "/");
  }, [location.pathname]);

  return (
    <>
      <MyHeader />
      <div className={`${!isHomePage ? "px-2 sm:px-3 lg:px-4 xl:px-8" : ""}`}>
        <main className={`${!isHomePage ? "mt-6" : ""}`}>
          <Outlet />
        </main>

        {/* <MyFooter /> */}
      </div>
    </>
  );
};

export default MainLayout;
