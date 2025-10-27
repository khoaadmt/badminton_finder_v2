import { InfoCircleOutlined } from "@ant-design/icons";
import { Badge, Card, Tooltip } from "antd";
import React, { FC, useEffect, useState } from "react";
import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip as RTooltip, XAxis } from "recharts";
import numeral from "numeral";
import BookingService from "../../../services/booking/BookingService";
interface ColCardProps {
    metaName: string;
    metaCount: string;
    body: React.ReactNode;
    footer: React.ReactNode;
    loading: boolean;
}

export const ColCard: React.FC<ColCardProps> = (props) => {
    const { metaName, metaCount, body, footer, loading } = props;
    const metaCountFormat = numeral(metaCount).format("0.0a");
    return (
        <Card loading={loading} className="overview" bordered={false}>
            <div className="overview-header">
                <div className="overview-header-meta">{metaName}</div>
                <div className="overview-header-count">{metaCountFormat}</div>
                <Tooltip title="Introduce">
                    <InfoCircleOutlined className="overview-header-action" />
                </Tooltip>
            </div>
            <div className="overview-body" style={{ height: "300px" }}>
                {body}
            </div>
            <div className="overview-footer">{footer}</div>
        </Card>
    );
};

interface FieldProps {
    name: string;
    number: string;
}

export const Field: FC<FieldProps> = ({ name, number }) => (
    <div className="field">
        <span className="field-label">{name}</span>
        <span className="field-number">{number} </span>
    </div>
);

const CustomTooltip: FC<any> = ({ active, payload, label }) =>
    active && (
        <div className="customTooltip">
            <span className="customTooltip-title">
                <Badge color={payload[0].fill} /> {label} : {payload[0].value}
            </span>
        </div>
    );

export const MyBarChart: FC<{ loading: boolean }> = ({ loading }) => {
    const bookingService = new BookingService();
    const [sales, setSales] = useState<number[]>([]);
    const [totalSales, setTotalSales] = useState<number>(0);
    const data = new Array(12).fill(null).map((_, index) => ({
        name: index + 1,
        number: sales[index],
    }));
    useEffect(() => {
        const fetchSales = async () => {
            try {
                const salesPromises = [];
                for (let i = 1; i <= 12; i++) {
                    salesPromises.push(bookingService.getTotalSales(i, ""));
                }
                const salesResults = await Promise.all(salesPromises);
                const total = salesResults.reduce((acc, sale) => acc + sale.data, 0);
                setSales(salesResults.map((sale) => sale.data));
                setTotalSales(total);
            } catch (error) {
                console.error("Error fetching sales data:", error);
            }
        };

        fetchSales();
    }, []);

    return (
        <ColCard
            loading={loading}
            metaName={"Doanh số"}
            metaCount={totalSales.toString()}
            body={
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <XAxis dataKey="name" />
                        <RTooltip content={<CustomTooltip />} />
                        <Bar strokeOpacity={0} barSize={50} dataKey="number" stroke="#3B80D9" fill="#3B80D9" />
                        <LabelList dataKey="number" position="top" />
                    </BarChart>
                </ResponsiveContainer>
            }
            footer={<Field name={"Doanh thu trung bình:"} number={numeral(totalSales / 12).format("0,0a")} />}
        />
    );
};
