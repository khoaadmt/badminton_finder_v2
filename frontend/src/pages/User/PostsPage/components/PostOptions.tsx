import React, { useEffect, useState } from "react";
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import { OptionButtons } from "./OptionButtons";
import { FilterOptions } from "../../../../interface";
import "./index.css";
import {
  Distance_value,
  Level_value,
  Price_value,
  MemberCount_value,
  Gender_value,
} from "../../../../utils/Constant";

interface Props {
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions | null>>;
}
export const PostOptions: React.FC<Props> = (props) => {
  const { setFilterOptions } = props;

  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState("Giờ bắt đầu");
  const [valueDateOption, setValueDateOption] = useState("");

  useEffect(() => {
    setValueDateOption(time);
  }, [time]);

  const handleBtnOptionSelected = (key: string, value: any) => {
    setFilterOptions((prev) => {
      return {
        ...prev,
        [key]: value,
      } as FilterOptions;
    });
  };
  const handleSortBtnClick = (key: string, value: any) => {
    setIsActive(!isActive);
    if (!isActive) {
      handleBtnOptionSelected(key, value);
    } else {
      handleBtnOptionSelected(key, "");
    }
  };
  const HandleDatePickerOnChange = (date: any, dateString: any) => {
    const dateFormat = dayjs(date).format("YYYY-MM-DD");
    handleBtnOptionSelected("date", dateFormat);
  };
  const disabledDate = (current: any) => {
    const today = new Date();
    return current && current < today.setHours(0, 0, 0, 0);
  };
  const handleChangeTime = (time: any, timeString: any) => {
    setTime(timeString);
    handleBtnOptionSelected("time", timeString);
  };
  const handleDeleFilter = () => {
    window.location.reload();
  };

  return (
    <div className="option-button-container flex overflow-x-scroll pb-4 pt-4 font-normal sm:px-5 sm:pt-4 lg:mx-[36px] lg:overflow-visible xl:mx-[48px]">
      <div className="flex gap-2 sm:gap-[15px]">
        <div>
          <button
            onClick={() => handleSortBtnClick("sortBy", "upcoming")}
            className={`${
              isActive ? "btn-active" : "hover:border-[#232323]"
            } rounded-full border border-[#dfdfdf] px-[14px] py-[5px] transition sm:px-[17px] sm:py-[12px] xl:px-[24px]`}
          >
            <div className="text-nowrap text-sm font-semibold">
              <span className="">Sắp diễn ra</span>
            </div>
          </button>
        </div>
        <OptionButtons
          defaultValue="Khoảng cách"
          items_value={Distance_value}
          setFilterOptions={setFilterOptions}
        />
        <OptionButtons
          defaultValue="Trình độ"
          items_value={Level_value}
          setFilterOptions={setFilterOptions}
        />

        <DatePicker
          className="custom-datepicker sm:px-[17px] sm:py-[11px] xl:px-[8px]"
          style={{ width: "120px", borderRadius: "25px" }}
          format={{
            format: "DD-MM-YYYY",
          }}
          placeholder="Ngày"
          disabledDate={disabledDate}
          onChange={HandleDatePickerOnChange}
        />

        <TimePicker
          className="custom-timepicker lg:py-[11px]"
          onChange={handleChangeTime}
          minuteStep={15}
          style={{ width: "100px", borderRadius: "25px" }}
          placeholder="Giờ"
          format={"HH:mm"}
        />

        <OptionButtons
          defaultValue="Giá"
          items_value={Price_value}
          setFilterOptions={setFilterOptions}
        />
        <OptionButtons
          defaultValue="Số người"
          items_value={MemberCount_value}
          setFilterOptions={setFilterOptions}
        />
        <OptionButtons
          defaultValue="Giới tính"
          items_value={Gender_value}
          setFilterOptions={setFilterOptions}
        />
        <button className="mx-2 pr-8 sm:pr-0" onClick={handleDeleFilter}>
          <span className="whitespace-nowrap text-sm font-semibold underline">
            Xóa lọc
          </span>
        </button>
      </div>
    </div>
  );
};
