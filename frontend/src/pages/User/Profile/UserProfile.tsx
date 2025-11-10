import { Avatar, Button, Form, Space, Input, Row, Col, UploadFile } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PicturesWall } from "../PostsPage/components/PictureWall/PicturesWall";
import { RootState } from "../../../interface";
import { updateUserInfo } from "../../../redux/apiRequest";
import "./UserProfile.css";
import UploadService from "../../../services/uploads/UploadService";
import { RcFile } from "antd/es/upload";

export const UserProfile = () => {
  const user = useSelector((state: RootState) => state.auth.login.currentUser);
  const initInputState = {
    displaynameInput: true,
    contactPhoneInput: true,
    facebookId: true,
  };
  const [isChangeAvatar, setIsChangeAvatar] = useState(true);
  const [isEditable, setIsEditable] = useState(initInputState);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const dispatch = useDispatch();

  const rules = {
    displayName: [
      {
        required: !isEditable.displaynameInput,
        message: "Display name is require!",
      },
      {
        min: 4,
        message: "Display name require min 4 characters!",
      },
      {
        max: 16,
        message: "Display name max 12 characters!",
      },
    ],
    contactPhone: [
      {
        required: !isEditable.contactPhoneInput,
        message: "Please input value for contact phone!",
      },
      {
        pattern: /^[0-9]+$/,
        message: "Contact phone must contain only digits!",
      },
    ],
    facebookId: [
      {
        required: !isEditable.facebookId,
        message: "Please input value for Facebook ID!",
      },
      {
        pattern: /^[0-9]+$/,
        message: "Contact phone must contain only digits!",
      },
    ],
  };
  const handleEditClick = (inputName: string) => {
    setIsEditable((prev) => ({
      ...prev,
      [inputName]: false,
    }));
  };

  const handleFormFinish = async (values: any) => {
    const files: RcFile[] = fileList
      .map((f) => f.originFileObj)
      .filter((f): f is RcFile => !!f);

    const avaUrlResponse = await UploadService.uploadImages(files);

    values.avaUrl = avaUrlResponse[0];

    updateUserInfo(dispatch, values, user);
    setIsEditable(initInputState);
    setFileList([]);
  };

  useEffect(() => {
    if (fileList.length > 0) {
      setIsChangeAvatar(false);
    } else {
      setIsChangeAvatar(true);
    }
  }, [fileList]);

  return (
    <div className="user-profile">
      <div className="user-profile-content">
        <div className="overlap-group">
          <div className="image-wrapper"></div>
          <Avatar className="ellipse" src={user?.avaUrl} />
          <div className="group">
            <div className="user-name-wrapper">{user?.username}</div>
            <div className="display-name-wrapper">{user?.displayName}</div>
          </div>
        </div>
        <div className="user-profile-form">
          <Form
            onFinish={handleFormFinish}
            layout="vertical"
            style={{ padding: "20px" }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="displayName"
                  label="Display Name"
                  rules={rules.displayName}
                >
                  <Space.Compact>
                    <Input
                      className="input-form-item"
                      defaultValue={user?.displayName}
                      disabled={isEditable.displaynameInput}
                    />
                    <div
                      className="icon-input-form-item"
                      onClick={() => handleEditClick("displaynameInput")}
                    >
                      <EditOutlined style={{ fontSize: "18px" }} />
                    </div>
                  </Space.Compact>
                </Form.Item>
                <Form.Item
                  name="contactPhone"
                  label="Contact Phone"
                  rules={rules.contactPhone}
                >
                  <Space.Compact>
                    <Input
                      className="input-form-item"
                      defaultValue={user?.contactPhone}
                      disabled={isEditable.contactPhoneInput}
                    />
                    <div
                      className="icon-input-form-item"
                      onClick={() => handleEditClick("contactPhoneInput")}
                    >
                      <EditOutlined style={{ fontSize: "18px" }} />
                    </div>
                  </Space.Compact>
                </Form.Item>
                <Form.Item
                  name="facebookId"
                  label="Facebook ID"
                  rules={rules.facebookId}
                >
                  <Space.Compact>
                    <Input
                      className="input-form-item"
                      defaultValue={user?.facebookId}
                      disabled={isEditable.facebookId}
                    />
                    <div
                      className="icon-input-form-item"
                      onClick={() => handleEditClick("facebookId")}
                    >
                      <EditOutlined style={{ fontSize: "18px" }} />
                    </div>
                  </Space.Compact>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="facebookId"
                  label="Avatar"
                  rules={rules.facebookId}
                >
                  <PicturesWall
                    setFileList={setFileList}
                    fileList={fileList}
                    maxCount={1}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginTop: "18px" }}
                disabled={
                  isEditable.contactPhoneInput &&
                  isEditable.displaynameInput &&
                  isEditable.facebookId &&
                  isChangeAvatar
                }
              >
                Change
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};
