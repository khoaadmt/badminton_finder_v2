import { useEffect, useState, type FC } from "react";
import { Badge, Card, message } from "antd";
import {
  Brush,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import BookingService from "../../../services/booking/BookingService";
import { ChartLineData } from "../../../interface";

const CustomTooltip: FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length > 0) {
    const { value: value1, stroke: stroke1 } = payload[0] || {};
    const { value: value2, stroke: stroke2 } = payload[1] || {};

    return (
      <div className="customTooltip">
        <span className="customTooltip-title">{label}</span>
        <ul className="customTooltip-content">
          <li key="HN">
            <Badge color={stroke1} />
            Hà Nội {value1}
          </li>
          <li key="HCM">
            <Badge color={stroke2} />
            Hồ Chí Minh {value2}
          </li>
        </ul>
      </div>
    );
  }

  return null;
};

const TimeLine: FC<{ loading: boolean }> = ({ loading }) => {
  const bookingService = new BookingService();
  const [totalSalesHN, setTotalSalesHN] = useState<number[]>([]);
  const [totalSalesHCM, setTotalSalesHCM] = useState<number[]>([]);
  const [data, setData] = useState<ChartLineData[] | undefined>([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const salesPromisesHN = [];
        const salesPromisesHCM = [];
        for (let i = 1; i <= 12; i++) {
          salesPromisesHN.push(bookingService.getTotalSales(i, "Hà Nội"));
          salesPromisesHCM.push(bookingService.getTotalSales(i, "Hồ Chí Minh"));
        }
        const salesResultsHN = await Promise.all(salesPromisesHN);
        setTotalSalesHN(salesResultsHN.map((sale) => sale.data));
        const salesResultsHCM = await Promise.all(salesPromisesHCM);
        setTotalSalesHCM(salesResultsHCM.map((sale) => sale.data));
      } catch (error) {
        message.error("Có lỗi khi lấy dữ liệu từ server");
        console.error("Lỗi khi lấy dữ liệu bán hàng:", error);
      }
    };
    fetchSales();
  }, []);

  useEffect(() => {
    if (totalSalesHN.length > 0 && totalSalesHCM.length > 0) {
      const chartData = new Array(12).fill(null).map((_, index) => ({
        name: `Tháng ${index + 1}`,
        HN: totalSalesHN[index] || 0,
        HCM: totalSalesHCM[index] || 0,
      }));
      setData(chartData);
    }
  }, [totalSalesHN, totalSalesHCM]);

  return (
    <Card loading={loading} style={{ marginTop: 12 }}>
      <ResponsiveContainer height={400}>
        <LineChart data={data} syncId="anyId">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="HN" stroke="#3F90F7" />
          <Line type="monotone" dataKey="HCM" stroke="#61BE82" />
          <Brush dataKey="name" fill="#13c2c2" />
          <Legend verticalAlign="top" height={40} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default TimeLine;
