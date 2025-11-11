import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../interface";
import { message } from "antd";

export default function ServerWakeupOverlay() {
  const { show, message } = useSelector((state: RootState) => state.loading);
  //   const show = true;
  //   const message = "Máy chủ đang khởi động, vui lòng chờ...";

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
      <div className="rounded-lg bg-white p-6 text-center shadow-lg">
        <p className="text-lg font-medium text-gray-800">{message}</p>
        <p className="mt-2 text-sm text-gray-500">
          Thao tác này có thể mất 10-30 giây...
        </p>
      </div>
    </div>
  );
}
