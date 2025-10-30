import { CaretDownOutlined, CaretUpOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Badge, Card, Col, Progress, Tooltip, message, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { FC, useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip as RTooltip, XAxis } from "recharts";
import dayjs from "dayjs";
import BookingService from "../../../services/booking/BookingService";
import numeral from "numeral";

interface ColCardProps {
    metaName: string;
    metaCount: string;
    body: React.ReactNode;
    footer: React.ReactNode;
    loading: boolean;
}

const ColCard: React.FC<ColCardProps> = (props) => {
    const { metaName, metaCount, body, footer, loading } = props;
    return (
        <Card loading={loading} className="overview" bordered={false}>
            <div className="overview-header">
                <div className="overview-header-meta">{metaName}</div>
                <div className="overview-header-count">{metaCount}</div>
                <Tooltip title="Introduce">
                    <InfoCircleOutlined className="overview-header-action" />
                </Tooltip>
            </div>
            <div className="overview-body">{body}</div>
            <div className="overview-footer">{footer}</div>
        </Card>
    );
};

interface TrendProps {
    totalSalesToDay: number;
    totalSalesYesterday: number;
    style?: React.CSSProperties;
}

const Trend: FC<TrendProps> = ({ totalSalesToDay, totalSalesYesterday, style = {} }) => {
    let percent;

    if (totalSalesYesterday == 1) {
        percent = 200;
    } else {
        percent = (totalSalesToDay / totalSalesYesterday) * 100;
    }
    if (percent >= 100) {
        return (
            <div className="trend" style={style}>
                <div className="trend-item">
                    <span className="trend-item-label">Tăng</span>
                    <span className="trend-item-text">{`${percent - 100}%`}</span>
                    <CaretUpOutlined style={{ color: "#52c41a" }} />
                </div>
            </div>
        );
    }
    return (
        <div className="trend" style={style}>
            <div className="trend-item">
                <span className="trend-item-label">Giảm</span>
                <span className="trend-item-text">{`${100 - percent}%`}</span>
                <CaretDownOutlined style={{ color: "#F5222D" }} />
            </div>
        </div>
    );
};

interface FieldProps {
    name: string;
    number: string;
}

const Field: FC<FieldProps> = ({ name, number }) => (
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

export const Overview: FC<{ loading: boolean }> = ({ loading }) => {
    const bookingService = new BookingService();
    const [totalSalesToDay, setTotalSalesToDay] = useState();
    const [totalSalesYesterday, setTotalSalesYesterday] = useState();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const data = new Array(14).fill(null).map((_, index) => ({
        name: dayjs().add(index, "day").format("YYYY-MM-DD"),
        number: Math.floor(Math.random() * 8 + 1),
    }));

    useEffect(() => {
        const toDay = dayjs().format("YYYY-MM-DD");
        const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

        bookingService
            .getTransactionInDay(toDay, "all")
            .then((response) => {
                if (response.data) {
                    const totalSales = response.data.reduce((acc: number, trans: any) => {
                        return acc + trans.price;
                    }, 0);
                    setTotalSalesToDay(totalSales);
                }
            })
            .catch((err) => {
                message.error("Có lỗi khi lấy dữ liệu giao dịch hôm nay từ server");
            });

        bookingService
            .getTransactionInDay(yesterday, "all")
            .then((response) => {
                if (response.data) {
                    const totalSales = response.data.reduce((acc: number, trans: any) => {
                        return acc + trans.price;
                    }, 0);
                    setTotalSalesYesterday(totalSales);
                }
            })
            .catch((err) => {
                console.log(err);
                message.error("Có lỗi khi lấy dữ liệu giao dịch hôm qua từ server");
            });
    }, []);

    return (
        <Content className="dashboard-content">
            <div className="container-card grid grid-cols-1  gap-4">
                <ColCard
                    loading={loading}
                    metaName={"Doanh số hôm nay"}
                    metaCount={numeral(totalSalesToDay).format("0.0a")}
                    body={
                        <Trend
                            totalSalesToDay={totalSalesToDay ? totalSalesToDay : 0}
                            totalSalesYesterday={totalSalesYesterday ? totalSalesYesterday : 1}
                        />
                    }
                    footer={<Field name={"Doanh số hôm qua"} number={numeral(totalSalesYesterday).format("0.0a")} />}
                />
                {/* <ColCard
                    loading={loading}
                    metaName={"visits"}
                    metaCount="8846"
                    body={
                        <ResponsiveContainer>
                            <AreaChart data={data}>
                                <XAxis dataKey="name" hide />
                                <RTooltip content={<CustomTooltip />} />
                                <Area strokeOpacity={0} type="monotone" dataKey="number" fill="#8E65D3" />
                            </AreaChart>
                        </ResponsiveContainer>
                    }
                    footer={<Field name={"dailySales"} number="1234" />}
                /> */}
                {/* <ColCard
                    loading={loading}
                    metaName={"operationalEffect"}
                    metaCount="8846"
                    body={<Progress strokeColor="#58BFC1" percent={85} />}
                    footer={<Trend style={{ position: "inherit" }} wow="12%" dod="12%" />}
                /> */}
            </div>
        </Content>
    );
};
