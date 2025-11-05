import React, { useEffect, useState } from "react";
import {
  Button,
  Calendar,
  CalendarProps,
  Carousel,
  Flex,
  Modal,
  Select,
  message,
  theme,
} from "antd";
import { useParams } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import "./LocationDetail.css";
import { useSelector } from "react-redux";
import { RootState, Optional, BadmintonVenue } from "../../../../interface";
import BookingService from "../../../../services/booking/BookingService";
import LocationService from "../../../../services/location/LocationService";
import { RiseOutlined } from "@ant-design/icons";
const map_icon = require("../../../../assets/images/map.png");
const support_icon = require("../../../../assets/images/support.png");
const Badminton_yard = require("../../../../assets/images/san-cau-long.png");

const createInitDate = () => {
  const timeStamp = dayjs(Date.now());
  const date = timeStamp.format("YYYY-MM-D");
  return date;
};

export const LocationDetail: React.FC = () => {
  const [locationDetail, setLocationDetail] = useState<BadmintonVenue | null>();
  const locationService = new LocationService();
  const { locationId } = useParams();
  const [activeButtonName, setActiveButtonName] = useState(0);
  const [imgBlur, setImageBlur] = useState<number>();
  const [dateSelected, setDateSelected] = useState(createInitDate());
  const [shiftSelected, setShiftSelected] = useState<number>(0);
  const [bookedCourts, setBookedCourts] = useState<number[]>();
  const [paymentUrl, setPaymentUrl] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cancelCount, setCancelCount] = useState(0);
  const [disableBtttons, setDisableBtttons] = useState<number[]>([]);
  const user = useSelector((state: RootState) => state.auth.login.currentUser);
  const bookingService = new BookingService();
  const [options, setOptions] = useState<any>("");
  const { token } = theme.useToken();

  const wrapperStyle: React.CSSProperties = {
    width: "100%",
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
    overflow: "hidden",
  };

  const btnOptions = [
    {
      label: "Ca sáng",
      value: 0,
    },
    {
      label: "Ca chiều",
      value: 1,
    },
    {
      label: "Ca tối",
      value: 2,
    },
  ];

  useEffect(() => {
    if (locationId) {
      locationService
        .getLocationById(locationId)
        .then((response) => {
          setLocationDetail(response.data.location);
        })
        .catch((error) => {});
    }
  }, []);

  useEffect(() => {
    if (locationDetail && options[shiftSelected]) {
      {
        console.log("options[shiftSelected] :", options[shiftSelected].index);
      }
      const params = {
        params: {
          locationId: locationDetail.id,
          shiftId: locationDetail.shifts[options[shiftSelected].index].id,
          date: dateSelected,
        },
      };
      bookingService
        .getBookedCourts(params)
        .then((bookedCourts) => {
          setBookedCourts(bookedCourts.data);
        })
        .catch((error) => {
          message.error(error.message);
        });
    }
  }, [options, shiftSelected, dateSelected, locationDetail, cancelCount]);

  const handleBtnFindAddressClick = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${locationDetail?.latitude},${locationDetail?.longitude}`,
      "_blank",
    );
  };

  const HandleDateOnChange = (value: Dayjs) => {
    setActiveButtonName(0);
    setDisableBtttons([]);
    setDateSelected(value.format("YYYY-MM-DD"));
  };
  const disabledDate = (current: any) => {
    const today = new Date();
    return current && current < today.setHours(0, 0, 0, 0);
  };

  const convertTimeToNumber = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);

    if (minutes >= 30) {
      return hours + 0.5;
    } else {
      return hours;
    }
  };

  const handleClick = (buttonValue: number) => {
    setActiveButtonName(buttonValue);
  };

  const handleMouseEndter = (i: number) => {
    setImageBlur(i);
  };

  const handleMouseLeave = () => {
    setImageBlur(-1);
  };

  const handleOnChangeShift = (value: any) => {
    setShiftSelected(value);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCancelCount((prevCount) => prevCount + 1);
  };

  const handleBooking = (courtId: number) => {
    const shiftId = locationDetail?.shifts[options[shiftSelected]?.index].id;
    const userName = user?.username;

    let data = {
      locationId,
      shiftId,
      userName,
      courtId,
      date: dateSelected,
    };

    bookingService
      .createBooking(data)
      .then((resUrl) => {
        setPaymentUrl(resUrl.data);
      })
      .catch((err) => {
        if (err.response && err.response.status === 409) {
          message.error("Rất tiếc, sân này vừa được người khác đặt rồi !");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      });
  };

  useEffect(() => {
    if (paymentUrl) {
      setIsModalVisible(true);
    }
  }, [paymentUrl]);

  useEffect(() => {
    setShiftSelected(0);
    if (locationDetail?.shifts) {
      const date = new Date(Date.now());
      let hoursNow = date.getHours();
      if (date.getMinutes() > 30) {
        hoursNow += 0.5;
      }

      const dateNow = dayjs(date).format("YYYY-MM-D");
      const optionsTmp: Optional[] = locationDetail.shifts
        .filter((shift) => {
          const option = btnOptions[activeButtonName];
          return option && option.label === shift.period;
        })
        .filter((shift) => {
          if (dateNow == dateSelected) {
            return convertTimeToNumber(shift.startTime) > hoursNow;
          }
          return true;
        })
        .map((shift, index) => {
          return {
            index: shift.shiftNumber - 1,
            value: index,
            label: `Ca ${shift.shiftNumber} - ${shift.startTime} : ${shift.endTime}`,
          };
        });

      if (optionsTmp.length === 0) {
        setDisableBtttons((prev) => {
          return [...prev, activeButtonName];
        });
        setActiveButtonName((prev) => {
          return prev + 1;
        });
      }
      setOptions(optionsTmp);
    }
  }, [locationDetail, activeButtonName, dateSelected]);

  return (
    <div>
      <div className="mb-5 sm:mt-5 lg:mx-8">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:grid-cols-8">
          <div className="col-span-3 flex flex-col">
            <div className=" ">
              <Carousel
                className="h[400px] slide-image w-[400px] bg-gray-500"
                arrows
                infinite={false}
              >
                {locationDetail &&
                  locationDetail.img?.map((imgUrl) => {
                    return (
                      <div key={imgUrl}>
                        <img
                          alt="Description image"
                          loading="lazy"
                          src={imgUrl}
                        />
                      </div>
                    );
                  })}
              </Carousel>
            </div>

            <div className="!mt-6 space-y-2 px-3 text-sm sm:px-0 sm:text-base">
              <div className="w-full pb-2">
                <h2 className="text-black-ish-200 text-2xl font-bold leading-none sm:leading-normal">
                  {locationDetail?.name}
                </h2>
              </div>
              <address className="flex items-start gap-2 sm:pl-1">
                <img className="ml-1 h-[16px] w-[16px]" src={map_icon} alt="" />
                <span className="text-black-ish-100 flex">
                  Địa chỉ:
                  {locationDetail?.address}
                  <Button
                    className="px-2"
                    onClick={handleBtnFindAddressClick}
                    danger
                  >
                    Tìm đường <RiseOutlined />
                  </Button>
                </span>
              </address>
              <div className="flex items-center gap-2 sm:pl-1">
                <span className="text-black-ish-100 truncate">
                  🏟️ Sân cầu: {locationDetail?.name}
                </span>
              </div>
            </div>

            <hr className="mx-3 sm:mx-0" />
            <div className="px-3 sm:px-0">
              <div className="flex w-full items-center justify-center overflow-hidden rounded-xl" />
            </div>
            <div className="flex flex-row items-center gap-2 px-3 text-xl font-semibold sm:px-0">
              Mô tả thêm
            </div>
            <div className="text-black-ish-100 !mt-4 whitespace-pre-line px-3 text-sm sm:px-0 sm:text-base">
              {locationDetail?.name}
            </div>
            <hr className="mx-3 sm:mx-0" />
            <hr className="mx-3 sm:mx-0" />
          </div>
          <div className="col-span-5 flex flex-col">
            <div className="grid-cols-8 gap-4 sm:grid">
              <div className="col-span-5">
                <div className="flex">
                  Giá thuê:
                  <p className="shift-price">
                    {locationDetail &&
                      locationDetail?.shifts[
                        options[shiftSelected]?.index
                      ]?.price.toLocaleString("vi-VN")}
                  </p>
                </div>
                <Flex
                  className="bg-gray-100 p-1"
                  justify={"space-between"}
                  wrap="wrap"
                >
                  {locationDetail?.courts &&
                    locationDetail.courts.map((court) => {
                      let isDisable = "";
                      if (bookedCourts) {
                        if (bookedCourts.indexOf(court.id) != -1)
                          isDisable = "disabled";
                      }
                      return (
                        <div
                          key={court.id}
                          className={`badminton-yard-container ${isDisable}`}
                        >
                          <img
                            className={`badminton-yard-img mb-4 ${
                              imgBlur == court.courtNumber ? "blur" : ""
                            }`}
                            src={Badminton_yard}
                            alt=""
                          />
                          <p className="badminton-yard-number">
                            Sân {court.courtNumber}
                          </p>
                          <Button
                            onMouseEnter={() =>
                              handleMouseEndter(court.courtNumber)
                            }
                            onMouseLeave={handleMouseLeave}
                            onClick={() => handleBooking(court.id)}
                            className="btn-book-court"
                          >
                            Đặt sân
                          </Button>
                        </div>
                      );
                    })}
                </Flex>
              </div>

              <div className="col-span-3 flex flex-col">
                <div className="calendar" style={wrapperStyle}>
                  <Calendar
                    fullscreen={false}
                    onChange={HandleDateOnChange}
                    disabledDate={disabledDate}
                  />
                </div>
                <Select
                  className="mt-1"
                  value={options && options[shiftSelected]}
                  onChange={handleOnChangeShift}
                  style={{ width: "100% " }}
                  options={options}
                />
                <Flex
                  justify={"space-between"}
                  align={"center"}
                  className="group-btn mt-2"
                >
                  <Button
                    className={`btn-shift ${activeButtonName === 0 ? "active-button" : ""} ${
                      disableBtttons.indexOf(0) !== -1 ? "btn-disabled" : ""
                    }`}
                    onClick={() => handleClick(0)}
                  >
                    Sáng
                  </Button>
                  <Button
                    className={`btn-shift ${activeButtonName === 1 ? "active-button" : ""}${
                      disableBtttons.indexOf(1) !== -1 ? "btn-disabled" : ""
                    }`}
                    onClick={() => handleClick(1)}
                  >
                    Chiều
                  </Button>
                  <Button
                    className={`btn-shift ${activeButtonName === 2 ? "active-button" : ""}${
                      disableBtttons.indexOf(2) !== -1 ? "btn-disabled" : ""
                    }`}
                    onClick={() => handleClick(2)}
                  >
                    Tối
                  </Button>
                </Flex>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        visible={isModalVisible}
        footer={false}
        onOk={handleOk}
        onCancel={handleCancel}
        width="80%"
        style={{ top: 20 }}
      >
        <iframe
          src={paymentUrl}
          title="Popup Content"
          style={{ width: "100%", height: "450px", border: "none" }}
        ></iframe>
      </Modal>
    </div>
  );
};
