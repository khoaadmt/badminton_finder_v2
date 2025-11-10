import React, { useEffect, useState } from "react";
import Layout, { Content, Header } from "antd/es/layout/layout";
import { Button, message, Select } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import "./index.css";

import BookingService from "../../../services/booking/BookingService";
import dayjs, { Dayjs } from "dayjs";
import { BadmintonVenue, BookedCourts } from "../../../interface";
import LocationService from "../../../services/location/LocationService";
import { MyBarChart } from "./BarChart";
import { TransactionTable } from "./TransactionTable";

export const StatisticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [transactionTime, setTranSactionTime] = useState("day");
  const bookingService = new BookingService();
  const [data, setData] = useState<BookedCourts[] | undefined>();
  const monthOptions = [
    {
      value: "1",
      label: "Tháng 1",
    },
    {
      value: "2",
      label: "Tháng 2",
    },
    {
      value: "3",
      label: "Tháng 3",
    },
    {
      value: "4",
      label: "Tháng 4",
    },
    {
      value: "5",
      label: "Tháng 5",
    },
    {
      value: "6",
      label: "Tháng 6",
    },
    {
      value: "7",
      label: "Tháng 7",
    },
    {
      value: "8",
      label: "Tháng 8",
    },
    {
      value: "9",
      label: "Tháng 9",
    },
    {
      value: "10",
      label: "Tháng 10",
    },
    {
      value: "11",
      label: "Tháng 11",
    },
    {
      value: "12",
      label: "Tháng 12",
    },
  ];
  const [monthSelected, setMonthSelected] = useState<number>();
  const locationService = new LocationService();
  const [locationOptions, setLocationOptions] = useState<BadmintonVenue[]>();
  const [locationSelected, setLocationSelected] = useState("all");

  const processData = (data: any[]) => {
    return data.map((item) => ({
      "Người thuê": item.username,
      "Địa điểm": item.location.name,
      "Sân số": item.court.courtNumber,
      "Thời gian": `${item.shift.startTime} - ${item.shift.endTime}`,
      "Giá thuê": item.price,
      "Ngày thuê": item.date,
      "Ngày thanh toán": item.createdAt,
    }));
  };
  const convertToCSV = (array: any) => {
    const header = Object.keys(array[0]).join(",") + "\n";
    const rows = array
      .map((obj: any) => Object.values(obj).join(","))
      .join("\n");
    return header + rows;
  };

  const downloadCSV = () => {
    if (data) {
      const csv = convertToCSV(processData(data));
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("download", "data.csv");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(undefined as any);
    }, 700);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const date = dayjs();
    if (transactionTime === "day") {
      const day = date.format("YYYY-MM-DD");
      bookingService
        .getTransactionInDay(day, locationSelected)
        .then((res) => {
          const converted = res.data.map((item: any) => ({
            ...item,
            createdAt: dayjs(item.createdAt)
              .add(7, "hour")
              .format("YYYY-MM-DD"),
            date: dayjs(item.date).add(7, "hour").format("YYYY-MM-DD"),
          }));
          setData(converted);
        })
        .catch((err) => {
          message.error("Có lỗi khi lấy dữ liệu giao dịch từ server");
        });
    }
    if (transactionTime === "month" && monthSelected != undefined) {
      bookingService
        .getTransactionInMonth(monthSelected, locationSelected)
        .then((res) => {
          const converted = res.data.map((item: any) => ({
            ...item,
            createdAt: dayjs(item.createdAt)
              .add(7, "hour")
              .format("YYYY-MM-DD"),
            date: dayjs(item.date).add(7, "hour").format("YYYY-MM-DD"),
          }));
          setData(converted);
        })
        .catch((err) => {
          message.error("Có lỗi khi lấy dữ liệu giao dịch từ server");
        });
    }
    if (transactionTime === "all") {
      bookingService
        .getAllTransaction(locationSelected)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          message.error("Có lỗi khi lấy dữ liệu giao dịch từ server");
        });
    }
  }, [transactionTime, monthSelected, locationSelected]);

  const handleChange = (value: string) => {
    setTranSactionTime(value);
  };
  const handleMonthSelectedChange = (value: string) => {
    setMonthSelected(parseInt(value));
  };

  const handleLocationSelectedChange = (value: string) => {
    setLocationSelected(value);
  };

  useEffect(() => {
    const date = dayjs();
    setMonthSelected(date.month() + 1);
    locationService.getAllLocation().then((res) => {
      if (res.data.locations) {
        const locationOptions = res.data.locations.map((location: any) => {
          return {
            value: location.id,
            label: location.name,
          };
        });

        locationOptions.unshift({
          value: "all",
          label: "Tất cả",
        });
        setLocationOptions(locationOptions);
      }
    });
  }, []);

  return (
    <Layout>
      <Content className="dashboard-content">
        <div>
          <MyBarChart loading={loading} />
        </div>

        <div>
          <Button onClick={downloadCSV} className="download-btn2">
            Download CSV <DownloadOutlined />
          </Button>

          <div className="flex items-center gap-2 pb-2">
            <div className="flex items-center gap-2">
              <p className="title-table">Các giao dịch: </p>
              <Select
                defaultValue="day"
                style={{ width: 120 }}
                onChange={handleChange}
                options={[
                  { value: "day", label: "hôm nay" },
                  { value: "month", label: "theo tháng" },
                  { value: "all", label: "toàn bộ" },
                ]}
              />
            </div>
            {monthSelected && transactionTime == "month" && (
              <div className="ml-4 flex items-center gap-2">
                <p className="title-table">Tháng: </p>
                <Select
                  defaultValue={monthSelected.toString()}
                  style={{ width: 120 }}
                  listHeight={130}
                  onChange={handleMonthSelectedChange}
                  options={monthOptions}
                />
              </div>
            )}

            <div className="ml-4 flex items-center gap-2">
              <p className="title-table">Sân cầu: </p>
              <Select
                defaultValue="Tất cả"
                style={{ width: 150 }}
                listHeight={130}
                onChange={handleLocationSelectedChange}
                options={locationOptions}
              />
            </div>
          </div>
          {data && <TransactionTable data={data} />}
        </div>
      </Content>
    </Layout>
  );
};
