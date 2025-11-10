import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Space,
  TimePicker,
  UploadFile,
} from "antd";
import { PicturesWall } from "../../User/PostsPage/components/PictureWall/PicturesWall";
import { useState } from "react";
import { MyFormItem } from "../../../components/common/InputFIeld/MyFormItem";
import { AutoCompleteLocation } from "./AutoCompleteLocation";
import LocationService from "../../../services/location/LocationService";
import { useSelector } from "react-redux";
import { RootState } from "../../../interface";
import dayjs, { Dayjs } from "dayjs";
import "./index.css";
import { useNavigate } from "react-router-dom";
import UploadService from "../../../services/uploads/UploadService";
import { RcFile } from "antd/es/upload";
export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

export type Coordinates = {
  lat: string;
  lng: string;
} | null;
export const AddLocationPage = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const timeFormat = "HH:mm";
  const [coordinates, setCoordinates] = useState<Coordinates>(null);
  const [address, setAddress] = useState("");
  const locationService = new LocationService();
  const user = useSelector((state: RootState) => state.auth.login.currentUser);
  const navigate = useNavigate();

  const formatTime = (value: Dayjs[]) => {
    if (value && value.length > 0) {
      return value.map((time) => dayjs(time).format("HH:mm"));
    }
    return [];
  };
  const onFinish = async (values: any) => {
    values.address = address;
    values.latitude = coordinates?.lat;
    values.longitude = coordinates?.lng;

    values.openHours = {
      start: dayjs(values.openHours[0]).format("HH:mm"),
      end: dayjs(values.openHours[1]).format("HH:mm"),
    };

    const files: RcFile[] = fileList
      .map((f) => f.originFileObj)
      .filter((f): f is RcFile => !!f);
    const imgurl = await UploadService.uploadImages(files);
    values.img = imgurl;

    locationService
      .createLocation(values, user?.accessToken)
      .then(() => {
        message.success("Thêm sân cầu thành công.");
        setTimeout(() => {
          navigate("/admin/location/overview");
        }, 2000);
      })
      .catch((err) => {
        message.error("Thêm sân cầu thất bại.");
      });
  };

  return (
    <Form
      onFinish={onFinish}
      className="add-location-form w-full pb-10 pt-8"
      {...formItemLayout}
    >
      <div className="grid w-full grid-cols-1 md:grid-cols-2 md:gap-6">
        <div className="md:col-span-1">
          <MyFormItem
            label="Tên"
            name="name"
            rules={[{ required: true, message: "Please input!" }]}
            children={<Input />}
          />

          <MyFormItem
            label="Thành phố:"
            name="city"
            rules={[{ required: true, message: "Please input!" }]}
            children={<Input />}
          />

          <MyFormItem
            label="Địa chỉ:"
            children={
              <AutoCompleteLocation
                setCoordinates={setCoordinates}
                setAddress={setAddress}
                defaultvalue=""
              />
            }
          />

          <MyFormItem
            label="SĐT liên hệ:"
            name="contactPhone"
            rules={[{ required: true, message: "Please input!" }]}
            children={<Input />}
          />

          <MyFormItem
            label="Mô tả về sân:"
            name="description"
            rules={[{ required: true, message: "Please input!" }]}
            children={<Input.TextArea autoSize={{ minRows: 4, maxRows: 12 }} />}
          />
        </div>
        <div className="md:col-span-1">
          <MyFormItem
            label="Số sân:"
            name="numberOfCourts"
            rules={[{ required: true, message: "Please input!" }]}
            children={<InputNumber style={{ width: "100%" }} />}
          />

          <MyFormItem label="Giá thuê:">
            <Space>
              <MyFormItem
                name="priceMin"
                noStyle
                rules={[
                  { required: true, message: "Giá thuê tối thiểu là bắt buộc" },
                ]}
              >
                <InputNumber placeholder="Từ" style={{ width: "100%" }} />
              </MyFormItem>
              <MyFormItem
                name="priceMax"
                noStyle
                rules={[
                  { required: true, message: "Giá thuê tối đa là bắt buộc" },
                ]}
              >
                <InputNumber placeholder="Đến" style={{ width: "100%" }} />
              </MyFormItem>
            </Space>
          </MyFormItem>

          <MyFormItem
            label="thời gian mở cửa:"
            name="openHours"
            rules={[{ required: true, message: "Please input!" }]}
            children={
              <TimePicker.RangePicker
                format={timeFormat}
                className="time-picker"
                minuteStep={30}
              />
            }
          />

          <MyFormItem
            label="Hình ảnh:"
            name="img"
            children={
              <PicturesWall
                setFileList={setFileList}
                fileList={fileList}
                maxCount={8}
              />
            }
          />
        </div>
      </div>
      <div className="flex w-full justify-center pt-8">
        <div className="flex w-1/4 justify-around">
          <Button className="btn-submit" htmlType="submit">
            Lưu
          </Button>
          <Button className="btn-cancel">Hủy</Button>
        </div>
      </div>
    </Form>
  );
};
