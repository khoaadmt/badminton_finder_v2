import { Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { FC } from "react";
import { BookedCourts } from "../../../interface";

const columns: TableProps<any>["columns"] = [
  {
    title: "Người thuê",
    dataIndex: "username",
    key: "username",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Địa điểm",
    dataIndex: ["location", "name"],
    key: "location.name",
  },
  {
    title: "Sân số",
    dataIndex: ["court", "courtNumber"],
    key: "court.courtNumber",
  },
  {
    title: "Giờ",
    key: "tags",
    render: (_, record) =>
      `${record.shift.startTime} - ${record.shift.endTime}`,
  },
  {
    title: "Giá",
    key: "price",
    dataIndex: ["shift", "price"],
  },
  {
    title: "Ngày thuê",
    key: "date",
    dataIndex: "date",
  },
  {
    title: "Ngày thanh toán",
    key: "createdAt",
    dataIndex: "createdAt",
  },
];

interface Props {
  data: BookedCourts[];
}

export const TransactionTable: React.FC<Props> = (props) => {
  const { data } = props;
  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20"],
        }}
      />
    </div>
  );
};
