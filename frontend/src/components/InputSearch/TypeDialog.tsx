import React, { useState } from "react";
import "./InputSearch.css";
interface Props {
  setType: React.Dispatch<React.SetStateAction<string>>;
  setbtnClicked: React.Dispatch<React.SetStateAction<boolean>>;
}
const TypeDialog: React.FC<Props> = (props) => {
  const { setType, setbtnClicked } = props;
  const handleMouseDown = (type: string) => {
    setType(type);
    setbtnClicked(true);
  };

  return (
    <div className="menu left-0 top-3 z-10 w-full rounded-3xl bg-white px-4 py-4 text-sm shadow-md sm:px-6">
      <div className="mb-[10px]">
        <strong className="text-black-ish-200 text-[14px]">Loại</strong>
      </div>
      <div className="space-y-[14px]">
        <button
          onMouseDown={() => handleMouseDown("Giao lưu")}
          className="menu-btn w-full rounded-2xl border p-2 py-2 sm:p-2 sm:pt-5"
        >
          <div className="space-y-2 sm:flex sm:space-y-0">
            <div className="px-[10px]">
              <svg
                stroke="currentColor"
                fill="currentColor"
                viewBox="0 0 512 512"
                className="stroke-primary flex-shrink-0"
                height="24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="32"
                  d="M256 48c-79.5 0-144 61.39-144 137 0 87 96 224.87 131.25 272.49a15.77 15.77 0 0 0 25.5 0C304 409.89 400 272.07 400 185c0-75.61-64.5-137-144-137z"
                ></path>
                <circle
                  cx="256"
                  cy="192"
                  r="48"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="32"
                ></circle>
              </svg>
            </div>
            <div className="text-black-ish-200 px-[10px] text-left">
              <p className="pb-[5px] text-[14px] font-medium">Giao lưu</p>
              <p className="text-[12px] font-semibold">
                Tìm ca giao lưu (vãng lai) cầu lông gần bạn
              </p>
            </div>
          </div>
        </button>
        <button
          onMouseDown={() => handleMouseDown("Sân đấu")}
          className="menu-btn w-full rounded-2xl border p-2 py-3 sm:p-2 sm:pt-5"
        >
          <div className="space-y-2 sm:flex sm:space-y-0">
            <div className="px-[10px]">
              <svg
                stroke="currentColor"
                fill="currentColor"
                // strokeWidth="0"
                viewBox="0 0 512 512"
                className="stroke-primary flex-shrink-0"
                height="24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M120.8 55L87.58 199h18.52l29.1-126h18.2l-20.6 126h18.3l10.1-62H247v62h18v-62h85.8l10.1 62h18.3L358.6 73h18.2l29.1 126h18.5L391.2 55H120.8zm50.9 18h168.6l7.6 46H164.1l7.6-46zM73 217v30h366v-30H73zm-.64 48L20.69 489H491.3l-51.7-224h-18.5l47.6 206h-45L390 265h-18.3l14.2 87H265v-87h-18v87H126.1l14.2-87H122L88.35 471H43.31l47.56-206H72.36zm50.74 105h265.8l16.5 101H106.6l16.5-101z"></path>
              </svg>
            </div>
            <div className="text-black-ish-200 px-[10px] text-left">
              <p className="pb-[5px] text-[14px] font-medium">Sân đấu</p>
              <p className="text-[12px] font-semibold">
                Tìm sân cầu lông gần bạn
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default TypeDialog;
