import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, message, Modal, Popconfirm, Space, Table, Tag } from "antd";
import type { PopconfirmProps, TableProps } from "antd";
import { useEffect, useState } from "react";
import { EditLocationModal } from "./EditLocationModal";
import LocationService from "../../../services/location/LocationService";
import { Facility, RootState } from "../../../interface";
import { useSelector } from "react-redux";

export const OverviewLocationPage = () => {
    const locationService = new LocationService();
    const [locations, setLocations] = useState<Facility[]>([]);
    const [curentLocation, setCurentLocation] = useState<Facility>();
    const [reload, setReload] = useState(0);
    const user = useSelector((state: RootState) => state.auth.login.currentUser);
    const columns: TableProps<Facility>["columns"] = [
        {
            title: "Tên",
            dataIndex: "name",
            key: "name",
            render: (text) => <a>{text}</a>,
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Khu vực",
            dataIndex: "city",
            key: "address",
        },
        {
            title: "số sân",
            dataIndex: "numberOfCourts",
            key: "numberOfCourts",
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => handleBtnEdit(record)}>
                        Sửa <EditOutlined />
                    </Button>
                    <Popconfirm
                        title="Xóa sân cầu"
                        description="Bạn có chắc muốn xóa sân cầu này không?"
                        onConfirm={() => confirm(record)}
                        okText="Yes"
                        cancelText="No">
                        <Button type="primary" danger>
                            Xóa <DeleteOutlined />
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleBtnEdit = (record: any) => {
        setCurentLocation(record);
    };

    const confirm = (record: any) => {
        if (!record) {
            console.error("Record is undefined");
            return;
        }
        console.log("record :", record);
        locationService.deleteLocation(record._id, user?.accessToken).then(() => {
            message.success("Xóa sân cầu thành công");
            setReload((prev) => prev + 1);
        });
    };

    useEffect(() => {
        locationService
            .getAllLocation()
            .then((res) => {
                setLocations(res.data);
            })
            .catch((err) => {
                console.log("err :", err);
                message.error(err.message);
            });
    }, [reload]);

    useEffect(() => {
        if (curentLocation) {
            setIsModalOpen(true);
        }
    }, [curentLocation]);

    return (
        <div>
            <Table
                columns={columns}
                dataSource={locations}
                pagination={{
                    pageSize: 5,
                    showSizeChanger: true,
                    pageSizeOptions: ["5", "10", "20"],
                }}
            />
            <EditLocationModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} data={curentLocation} />
        </div>
    );
};
