import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Space,
  TimePicker,
  UploadFile,
} from "antd";
import React, { useEffect, useState } from "react";
import { MyFormItem } from "../../../components/common/InputFIeld/MyFormItem";
import { PicturesWall } from "../../User/PostsPage/PictureWall/PicturesWall";
import { AutoCompleteLocation } from "./AutoCompleteLocation";
import { Coordinates, formItemLayout } from "./Add";
import dayjs from "dayjs";
import { Facility, RootState } from "../../../interface";
import LocationService from "../../../services/location/LocationService";
import { useSelector } from "react-redux";
import UploadService from "../../../services/uploads/UploadService";
import { RcFile } from "antd/es/upload";

interface Prop {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: Facility | undefined;
}

export const EditLocationModal: React.FC<Prop> = (prop) => {
  const { isModalOpen, setIsModalOpen, data } = prop;
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const timeFormat = "HH:mm";
  const [coordinates, setCoordinates] = useState<Coordinates>(null);
  const [address, setAddress] = useState("");
  const [form] = Form.useForm();
  const locationService = new LocationService();
  const user = useSelector((state: RootState) => state.auth.login.currentUser);

  const onFinish = async (values: any) => {
    console.log("values :", values);
    if (coordinates?.lat != null && coordinates?.lng != null) {
      values.latitude = Number(coordinates.lat);
      values.longitude = Number(coordinates.lng);
    } else {
      values.latitude = Number(data?.latitude);
      values.longitude = Number(data?.longitude);
    }

    values.address = address;
    values.openHours = {
      start: dayjs(values.openHours[0]).format("HH:mm"),
      end: dayjs(values.openHours[1]).format("HH:mm"),
    };

    const files: RcFile[] = fileList
      .map((f) => f.originFileObj)
      .filter((f): f is RcFile => !!f);

    const imgUrl = await UploadService.uploadImages(files);

    values.img = imgUrl;
    if (data?.id) {
      locationService
        .updateLocation(data.id, values, user?.accessToken)
        .then(() => {
          message.success("Cập nhật thông tin thành công");
          setIsModalOpen(false);
        })
        .catch((error) => {
          message.error("Có lỗi khi updated thông tin sân");
        });
    }
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };
  useEffect(() => {
    if (data) {
      setAddress(data.address || "");
      setFileList(
        data.img?.map((url, index) => ({
          uid: String(index),
          name: `image-${index}`,
          status: "done",
          url,
          key: index,
        })) || [],
      );

      form.setFieldsValue({
        name: data.name,
        city: data.city,
        address: data.address,
        contactPhone: data.contactPhone,
        description: data.description,
        numberOfCourts: data.numberOfCourts,
        priceMin: data.priceMin,
        priceMax: data.priceMax,
        openHours: [
          dayjs(data?.openHours?.start, timeFormat),
          dayjs(data?.openHours?.end, timeFormat),
        ],
        img: fileList,
      });
    }
  }, [data]);

  return (
    <Modal
      className="add-location-modal"
      title="Chỉnh sửa thông tin sân cầu"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
      ]}
    >
      <Form
        form={form}
        onFinish={onFinish}
        className="add-location-form w-full pb-10 pt-8"
        {...formItemLayout}
        initialValues={{
          name: data?.name,
          city: data?.city,
          address: data?.address,
          contactPhone: data?.contact_phone,
          description: data?.description,
          numberOfCourts: data?.numberOfCourts,
          priceMin: data?.priceMin,
          priceMax: data?.priceMax,
          openHours: [
            dayjs(data?.openHours.start, timeFormat),
            dayjs(data?.openHours.end, timeFormat),
          ],
          img: fileList,
        }}
      >
        <div className="grid w-full grid-cols-1 md:grid-cols-2 md:gap-6">
          <div className="md:col-span-1">
            <MyFormItem
              key={"name"}
              label="Tên"
              name="name"
              rules={[{ required: true, message: "Please input!" }]}
              children={<Input />}
            />

            <MyFormItem
              key={"city"}
              label="Thành phố:"
              name="city"
              rules={[{ required: true, message: "Please input!" }]}
              children={<Input />}
            />

            <MyFormItem
              key={"address"}
              label="Địa chỉ:"
              children={
                <AutoCompleteLocation
                  setCoordinates={setCoordinates}
                  setAddress={setAddress}
                  defaultvalue={data?.address}
                />
              }
            />

            <MyFormItem
              key={"contactPhone"}
              label="SĐT liên hệ:"
              name="contactPhone"
              rules={[{ required: true, message: "Please input!" }]}
              children={<Input />}
            />

            <MyFormItem
              key={"description"}
              label="Mô tả về sân:"
              name="description"
              rules={[{ required: true, message: "Please input!" }]}
              children={
                <Input.TextArea autoSize={{ minRows: 4, maxRows: 12 }} />
              }
            />
          </div>
          <div className="md:col-span-1">
            <MyFormItem
              key={"numberOfCourts"}
              label="Số sân:"
              name="numberOfCourts"
              rules={[{ required: true, message: "Please input!" }]}
              children={<InputNumber style={{ width: "100%" }} />}
            />

            <MyFormItem key={"price"} label="Giá thuê:">
              <Space>
                <MyFormItem
                  key={"priceMin"}
                  name="priceMin"
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: "Giá thuê tối thiểu là bắt buộc",
                    },
                  ]}
                >
                  <InputNumber placeholder="Từ" style={{ width: "100%" }} />
                </MyFormItem>
                <MyFormItem
                  key={"priceMax"}
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
              key={"openHours"}
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
              key={"img"}
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
          </div>
        </div>
      </Form>
    </Modal>
  );
};
