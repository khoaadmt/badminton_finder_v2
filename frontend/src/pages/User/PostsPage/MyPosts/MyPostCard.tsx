import React from "react";
import {
  Button,
  Card,
  Carousel,
  message,
  Popconfirm,
  Radio,
  Space,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { Post, RootState } from "../../../../interface";
import PostService from "../../../../services/post/PostService";
import { memberLevels } from "../../../../utils/Constant";
// import "./UserProfile.css";
const map_icon = require("../../../../assets/images/map.png");
const support_icon = require("../../../../assets/images/support.png");

interface Props {
  postDetail: Post;
  onDelete?: (postId: number) => void;
}
export const MyPostCard: React.FC<Props> = ({ postDetail, onDelete }) => {
  const postService = new PostService();
  const user = useSelector((state: RootState) => state.auth.login.currentUser);
  const getLabel = (value: number | undefined) => {
    const level = memberLevels.find((level) => level.value === value);
    return level ? level.label : "Unknown";
  };

  const handleBtnZaloCick = (phone: string | undefined) => {
    if (phone) {
      window.open(`https://zalo.me/${phone}`, "_blank");
    } else {
      message.info("Người dùng này không có sđt");
    }
  };

  const handleBtnFacebookCick = (facebookId: string | undefined) => {
    if (facebookId) {
      window.open(`https://www.facebook.com/${facebookId}`, "_blank");
    } else {
      message.info("Người dùng này không có Facebook");
    }
  };

  const handleBtnFindAddressClick = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${postDetail?.location.latitude},${postDetail?.location.longitude}`,
      "_blank",
    );
  };

  const handleConcat = (str1: number | undefined, str2: number | undefined) => {
    return " " + str1 + "🍀 - " + str2 + "🍀";
  };

  const confirm = async (post: Post) => {
    try {
      await postService.delete(post.id.toString(), user?.accessToken);
      message.success("Xóa bài viết thành công");

      onDelete?.(post.id);
    } catch (err) {
      message.error("Có lỗi khi thực hiện chức năng này. 304");
    }
  };

  return (
    <div className="post-container grid grid-cols-1 pb-20 md:grid-cols-6 md:gap-6">
      <div className="col-span-4 flex flex-col space-y-8">
        <div className="w-full">
          <Space>
            <Button.Group>
              {postDetail?.status == "checked" && (
                <Button className="btn-action" type="primary" ghost>
                  Bài viết đã được duyệt <CheckCircleOutlined />
                </Button>
              )}
              {postDetail?.status == "pending" && (
                <Button
                  className="btn-action"
                  type="primary"
                  ghost
                  style={{ borderColor: "#F29F05", color: "#F29F05" }}
                >
                  Bài viết chờ duyệt <ExclamationCircleOutlined />
                </Button>
              )}
              {postDetail?.status == "reject" && (
                <Button className="btn-action" danger>
                  Bài viết đã bị từ chối <CloseCircleOutlined />
                </Button>
              )}
              <Popconfirm
                title="Xóa bài viết"
                description="Bạn có chắc muốn xóa bài viết này không?"
                onConfirm={() => confirm(postDetail)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" danger className="btn-action">
                  Xóa <DeleteOutlined />
                </Button>
              </Popconfirm>
            </Button.Group>
          </Space>

          <Carousel className="slide-image bg-gray-500" arrows infinite={false}>
            {postDetail &&
              postDetail.images?.map((imgUrl) => {
                return (
                  <div key={imgUrl}>
                    <img alt="Description image" loading="lazy" src={imgUrl} />
                  </div>
                );
              })}
          </Carousel>
        </div>

        <div className="!mt-6 space-y-2 px-3 text-sm sm:px-0 sm:text-base">
          <div className="w-full pb-2">
            <h2 className="text-black-ish-200 text-2xl font-bold leading-none sm:leading-normal">
              {postDetail?.title}
            </h2>
          </div>
          <address className="flex items-start gap-2 sm:pl-1">
            <img className="ml-1 h-[16px] w-[16px]" src={map_icon} alt="" />
            <span className="text-black-ish-100 flex">
              Địa chỉ:
              {postDetail?.location.address}
              <button
                onClick={handleBtnFindAddressClick}
                className="btn_find_address border-primary flex items-center gap-2 whitespace-nowrap rounded-full border bg-white px-2 py-[1px] font-semibold transition hover:shadow-md"
              >
                <span>Tìm đường</span>
                <svg
                  stroke="currentColor"
                  fill="none"
                  stroke-width="0"
                  viewBox="0 0 15 15"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12 13C12.5523 13 13 12.5523 13 12V3C13 2.44771 12.5523 2 12 2H3C2.44771 2 2 2.44771 2 3V6.5C2 6.77614 2.22386 7 2.5 7C2.77614 7 3 6.77614 3 6.5V3H12V12H8.5C8.22386 12 8 12.2239 8 12.5C8 12.7761 8.22386 13 8.5 13H12ZM9 6.5C9 6.5001 9 6.50021 9 6.50031V6.50035V9.5C9 9.77614 8.77614 10 8.5 10C8.22386 10 8 9.77614 8 9.5V7.70711L2.85355 12.8536C2.65829 13.0488 2.34171 13.0488 2.14645 12.8536C1.95118 12.6583 1.95118 12.3417 2.14645 12.1464L7.29289 7H5.5C5.22386 7 5 6.77614 5 6.5C5 6.22386 5.22386 6 5.5 6H8.5C8.56779 6 8.63244 6.01349 8.69139 6.03794C8.74949 6.06198 8.80398 6.09744 8.85143 6.14433C8.94251 6.23434 8.9992 6.35909 8.99999 6.49708L8.99999 6.49738"
                    fill="currentColor"
                  ></path>
                </svg>
              </button>
            </span>
          </address>
          <div className="flex items-center gap-2 sm:pl-1">
            <span className="text-black-ish-100 truncate">
              🏟️ Sân cầu: VNBC
            </span>
          </div>
          <div className="flex items-center gap-2 sm:pl-1">
            <img className="ml-1 h-[16px] w-[16px]" src={support_icon} alt="" />
            <span className="text-black-ish-100 truncate">
              Cần tuyển:
              {" " + postDetail?.memberCount}
              (Nam/Nữ)
            </span>
          </div>
          <div className="flex items-center gap-2 sm:pl-1">
            <span className="text-black-ish-100 truncate">
              {`💪 Trình độ: ${getLabel(postDetail?.levelMemberMin)} - ${getLabel(
                postDetail?.levelMemberMax,
              )}`}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:pl-1">
            <span className="text-black-ish-100 truncate">
              💵 Phí giao lưu:
              {postDetail?.agreement
                ? "Thỏa thuận"
                : handleConcat(postDetail?.priceMin, postDetail?.priceMax)}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:pl-1">
            <div className="flex h-full flex-1 items-center gap-2">
              <p className="text-nowrap">📞 Liên hệ:</p>
              <div>
                {postDetail?.phones.map((phone) => {
                  return (
                    <span key={phone}>
                      <p className="whitespace-pre-line pb-2 text-neutral-600 sm:block">
                        <Button
                          onClick={() => handleBtnZaloCick(phone)}
                          className="btn-zalo"
                          type="primary"
                        >
                          zalo
                        </Button>
                        <a href={`tel:${phone}`} className="ml-1 text-sky-500">
                          {phone}
                        </a>
                      </p>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <hr className="mx-3 sm:mx-0" />
        <div className="flex flex-row items-center gap-2 px-3 text-xl font-semibold sm:px-0">
          Mô tả thêm
        </div>
        <div className="text-black-ish-100 !mt-4 whitespace-pre-line px-3 text-sm sm:px-0 sm:text-base">
          {postDetail?.description}
        </div>
        <hr className="mx-3 sm:mx-0" />
      </div>
      <div className="col-span-2 mt-[32px]">
        <Card title="Người đăng" bordered={false} style={{ width: 300 }}>
          <p>user: {postDetail.user.displayName}</p>
          <p className="hidden truncate whitespace-pre-line pb-2 text-neutral-600 sm:block">
            <Button
              onClick={() => handleBtnZaloCick(postDetail?.user.contactPhone)}
              className="btn-zalo"
              type="primary"
            >
              zalo
            </Button>
            <a
              href={`tel:${postDetail?.user.contactPhone}`}
              className="ml-1 text-sky-500"
            >
              {postDetail?.user.contactPhone}
            </a>
          </p>
          <p className="hidden truncate whitespace-pre-line pb-2 text-neutral-600 sm:block">
            <Button
              onClick={() => handleBtnFacebookCick(postDetail?.user.facebookId)}
              className="btn-zalo"
              type="primary"
            >
              Facebook
            </Button>
          </p>
        </Card>
      </div>
    </div>
  );
};
