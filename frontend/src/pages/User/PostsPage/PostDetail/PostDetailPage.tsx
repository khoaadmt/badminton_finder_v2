import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Carousel, message } from "antd";

import { Post } from "../../../../interface";
import PostService from "../../../../services/post/PostService";
import { memberLevels } from "../../../../utils/Constant";
import "./PostDetailPage.css";
const map_icon = require("../../../../assets/images/map.png");
const support_icon = require("../../../../assets/images/support.png");

export const PostDetailPage = () => {
  const postService = new PostService();
  const { postId } = useParams();
  const [postDetail, setPostDetail] = useState<Post | null>();

  useEffect(() => {
    if (postId) {
      postService.getPostById(postId).then((res) => {
        setPostDetail(res.data[0]);
      });
    }
  }, []);

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
  const handleConcat = (str1: number | undefined, str2: number | undefined) => {
    return " " + str1 + "🍀 - " + str2 + "🍀";
  };
  const handleBtnFindAddressClick = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${postDetail?.location.latitude},${postDetail?.location.longitude}`,
      "_blank",
    );
  };
  return (
    <div>
      <div className="mx-auto mb-5 max-w-[884px] sm:mt-5 sm:px-3">
        <div className="grid grid-cols-1 md:grid-cols-6 md:gap-6">
          <div className="col-span-4 flex flex-col space-y-8">
            <div className=" ">
              <Carousel
                className="slide-image bg-gray-500"
                arrows
                infinite={false}
              >
                {postDetail &&
                  postDetail.images?.map((imgUrl) => {
                    return (
                      <div key={imgUrl}>
                        <img
                          alt="Description image"
                          loading="lazy"
                          src={imgUrl}
                        />
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
                <img
                  className="ml-1 h-[16px] w-[16px]"
                  src={support_icon}
                  alt=""
                />
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
                            <a
                              href={`tel:${phone}`}
                              className="ml-1 text-sky-500"
                            >
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
            <div className="px-3 sm:px-0">
              <div className="flex w-full items-center justify-center overflow-hidden rounded-xl" />
            </div>
            <div className="flex flex-row items-center gap-2 px-3 text-xl font-semibold sm:px-0">
              Mô tả thêm
            </div>
            <div className="text-black-ish-100 !mt-4 whitespace-pre-line px-3 text-sm sm:px-0 sm:text-base">
              {postDetail?.description}
            </div>
            <hr className="mx-3 sm:mx-0" />
            <hr className="mx-3 sm:mx-0" />
          </div>
          <div className="fixed bottom-0 left-0 z-20 w-full rounded-xl bg-white pb-4 shadow-[rgba(0,0,0,0.2)_0px_2px_20px_0px] sm:z-0 md:static md:col-span-2 md:pb-10 md:shadow-none">
            <div className="sticky top-[102px] space-y-4">
              <div className="flex flex-col gap-2 overflow-hidden rounded-xl border-[1px] border-neutral-200 bg-white p-4">
                <div className="text-xl font-semibold">Người đăng tin</div>
                <div className="flex flex-col gap-2">
                  <div className="flex h-full flex-1 items-center gap-2 py-2 pr-4">
                    <img
                      alt="Avatar"
                      loading="lazy"
                      width={30}
                      height={30}
                      decoding="async"
                      data-nimg={1}
                      className="aspect-square rounded-full object-cover"
                      style={{ color: "transparent" }}
                      src={postDetail?.user.avaUrl}
                    />
                    <span className="text-black-ish-200">
                      {" "}
                      {postDetail?.user.displayName}{" "}
                    </span>
                  </div>
                  <hr />
                  <div className="flex h-full flex-1 items-center gap-2">
                    <p className="text-nowrap">Liên hệ:</p>
                    <div>
                      <span>
                        <p className="hidden truncate whitespace-pre-line pb-2 text-neutral-600 sm:block">
                          <Button
                            onClick={() =>
                              handleBtnZaloCick(postDetail?.user.contactPhone)
                            }
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
                      </span>
                      <span>
                        <p className="hidden truncate whitespace-pre-line pb-2 text-neutral-600 sm:block">
                          <Button
                            onClick={() =>
                              handleBtnFacebookCick(postDetail?.user.facebookId)
                            }
                            className="btn-zalo"
                            type="primary"
                          >
                            Facebook
                          </Button>
                        </p>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex w-full items-center justify-center gap-2 px-4">
                <div className="flex flex-wrap gap-4">
                  <div className="group flex cursor-pointer items-center gap-2">
                    <div className="relative cursor-pointer transition hover:opacity-80 group-hover:opacity-80">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth={0}
                        viewBox="0 0 16 16"
                        className="fill-neutral-500/70"
                        height={16}
                        width={16}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z" />
                      </svg>
                    </div>
                    <span className="text-black-ish-100 whitespace-nowrap underline">
                      Chia sẻ
                    </span>
                  </div>
                  <button className="group flex cursor-pointer items-center gap-2">
                    <div className="relative cursor-pointer transition hover:opacity-80 group-hover:opacity-80">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth={0}
                        viewBox="0 0 16 16"
                        className="fill-neutral-500/70"
                        height={16}
                        width={16}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001" />
                      </svg>
                    </div>
                    <span className="text-black-ish-100 whitespace-nowrap underline">
                      Báo vi phạm
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
