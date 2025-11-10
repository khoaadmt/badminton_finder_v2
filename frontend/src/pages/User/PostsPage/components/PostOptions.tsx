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
    <div className="option-button-container flex overflow-x-scroll pb-2 md:pb-4 lg:overflow-visible">
      <div className="flex flex-wrap items-center justify-start gap-2 sm:gap-4">
        <div>
          <button
            onClick={() => handleSortBtnClick("sortBy", "upcoming")}
            className={`${
              isActive ? "btn-active" : "hover:border-[#232323]"
            } rounded-full border border-[#dfdfdf] px-3 py-1 transition lg:px-4 lg:py-2`}
          >
            <div className="text-nowrap text-sm font-[500] md:font-semibold">
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
          className="custom-datepicker w-20 px-3 lg:w-24 lg:px-4 lg:py-2"
          style={{ borderRadius: "25px" }}
          format={{
            format: "DD-MM-YYYY",
          }}
          placeholder={"Ngày"}
          disabledDate={disabledDate}
          onChange={HandleDatePickerOnChange}
        />

        <TimePicker
          className="custom-timepicker w-20 px-3 lg:px-4 lg:py-2"
          onChange={handleChangeTime}
          minuteStep={15}
          style={{ borderRadius: "25px" }}
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
          <span className="whitespace-nowrap text-sm font-[500] underline">
            Xóa lọc
          </span>
        </button>
      </div>
    </div>
  );
};
