import { Footer } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const MyFooter = () => {
  const location = useLocation();
  const [isShowFooter, setIsShowFooter] = useState(true);
  useEffect(() => {
    if (location.pathname === "/posts/create") {
      setIsShowFooter(false);
    } else {
      setIsShowFooter(true);
    }
  }, [location.pathname]);

  return (
    <>
      {isShowFooter && (
        <Footer className="fixed bottom-0 left-0 w-full border-t bg-white py-3 text-center shadow-sm">
          <h1>Giao luu cau long .com</h1>
          Tìm kiếm cơ hội giao lưu gần bạn
        </Footer>
      )}
    </>
  );
};
