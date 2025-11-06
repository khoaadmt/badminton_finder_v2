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
    const username = user?.username;

    let data = {
      locationId,
      shiftId,
      username,
      courtId,
      date: dateSelected,
    };

    bookingService
      .createBooking(data)
      .then((resUrl) => {
        console.log("resUrl :", resUrl);
        setPaymentUrl(resUrl.data.url);
      })
      .catch((err) => {
        message.error("Đã có lỗi khi thực hiện chức năng này.");
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
      <div className="px-4 py-5 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-8">
          <div className="col-span-3 flex flex-col space-y-4">
            <Carousel
              className="w-full rounded-lg bg-gray-200"
              arrows
              infinite={false}
            >
              {locationDetail?.img?.map((imgUrl) => (
                <div key={imgUrl} className="flex items-center justify-center">
                  <img
                    alt="Description image"
                    loading="lazy"
                    src={imgUrl}
                    className="h-auto w-full rounded-lg object-cover"
                  />
                </div>
              ))}
            </Carousel>

            <div className="space-y-2 px-1 text-sm sm:text-base">
              <h2 className="text-2xl font-bold text-gray-800">
                {locationDetail?.name}
              </h2>

              <address className="flex items-start not-italic text-gray-600">
                <div className="flex flex-shrink-0 items-center gap-1">
                  <img
                    src={map_icon}
                    alt="Địa chỉ"
                    className="h-4 w-4 flex-shrink-0"
                  />
                  <strong>Địa chỉ:</strong>
                </div>

                <span className="break-words">
                  {locationDetail?.address}{" "}
                  <Button
                    size="small"
                    type="link"
                    danger
                    className="flex-shrink-0"
                    onClick={handleBtnFindAddressClick}
                  >
                    Tìm đường <RiseOutlined />
                  </Button>
                </span>
              </address>

              <p className="text-gray-600">
                🏟️ Sân cầu: {locationDetail?.name}
              </p>
            </div>

            <hr />

            <div className="space-y-2 px-1">
              <h3 className="text-lg font-semibold text-gray-800">
                Mô tả thêm
              </h3>
              <p className="whitespace-pre-line text-gray-600">
                {locationDetail?.description || locationDetail?.name}
              </p>
            </div>
          </div>

          {/* ==== Cột phải: Đặt sân ==== */}
          <div className="col-span-5 flex flex-col space-y-4">
            <div className="flex items-center text-lg font-medium text-gray-700">
              Giá thuê:&nbsp;
              <p className="font-semibold text-green-700">
                {locationDetail?.shifts?.[
                  options[shiftSelected]?.index
                ]?.price?.toLocaleString("vi-VN")}
                ₫
              </p>
            </div>

            {/* ==== Danh sách sân + Lịch & Ca (ngang hàng) ==== */}
            <div className="flex flex-col gap-4 lg:flex-row">
              {/* --- Danh sách sân (bên trái) --- */}
              <div className="flex-1 rounded-lg bg-gray-100 p-3">
                <Flex
                  className="rounded-lg bg-gray-100 p-2"
                  justify="space-between"
                  wrap="wrap"
                  gap="middle"
                >
                  {locationDetail?.courts?.map((court) => {
                    const isDisabled = bookedCourts?.includes(court.id);
                    return (
                      <div
                        key={court.id}
                        className={`badminton-yard-container ${
                          isDisabled ? "pointer-events-none opacity-50" : ""
                        }`}
                      >
                        <img
                          src={Badminton_yard}
                          alt=""
                          className={`badminton-yard-img mb-3 ${
                            imgBlur === court.courtNumber ? "blur" : ""
                          }`}
                        />
                        <p className="badminton-yard-number text-center">
                          Sân {court.courtNumber}
                        </p>
                        <Button
                          onMouseEnter={() =>
                            handleMouseEndter(court.courtNumber)
                          }
                          onMouseLeave={handleMouseLeave}
                          onClick={() => handleBooking(court.id)}
                          className="btn-book-court mt-2 w-full"
                        >
                          Đặt sân
                        </Button>
                      </div>
                    );
                  })}
                </Flex>
              </div>

              {/* --- Lịch & ca (bên phải) --- */}
              <div className="flex w-full flex-col lg:w-1/3">
                <div className="calendar" style={wrapperStyle}>
                  <Calendar
                    fullscreen={false}
                    onChange={HandleDateOnChange}
                    disabledDate={disabledDate}
                  />
                </div>

                <Select
                  className="mt-3 w-full"
                  value={options && options[shiftSelected]}
                  onChange={handleOnChangeShift}
                  options={options}
                />

                <Flex
                  justify="space-between"
                  align="center"
                  className="group-btn mt-3 flex-wrap gap-2"
                >
                  {["Sáng", "Chiều", "Tối"].map((label, index) => (
                    <Button
                      key={label}
                      className={`btn-shift ${
                        activeButtonName === index ? "active-button" : ""
                      } ${
                        disableBtttons.includes(index) ? "btn-disabled" : ""
                      }`}
                      onClick={() => handleClick(index)}
                    >
                      {label}
                    </Button>
                  ))}
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
