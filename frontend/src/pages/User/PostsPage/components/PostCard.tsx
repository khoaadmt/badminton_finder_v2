import React from "react";

import {
  FieldTimeOutlined,
  ForwardFilled,
  InfoCircleFilled,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { Post } from "../../../../interface";
import { Level_value } from "../../../../utils/Constant";

interface Props {
  post: Post;
}
export const PostCard: React.FC<Props> = (props) => {
  const { post } = props;

  const imageStyle: React.CSSProperties = {
    position: "absolute",
    height: "100%",
    width: "100%",
    inset: "0px",
    color: "transparent",
  };

  const dateTimeConvert = new Date(post.startTime);
  const date = dayjs(dateTimeConvert).format("DD-MM-YYYY");
  const startTime = dayjs(dateTimeConvert).format("HH:mm");
  const endTime = dayjs(dateTimeConvert).add(2, "hour").format("HH:mm");

  return (
    <Link to={`/posts/${post.id}`}>
      <div className="flex rounded-xl p-2 shadow-[rgba(0,0,0,0.1)_0px_2px_20px_0px]">
        <div className="relative mr-3 min-h-[150px] min-w-[120px] flex-shrink-0 overflow-hidden rounded-lg sm:mr-4 sm:min-h-[166px] sm:min-w-[200px]">
          <img
            alt="Listing"
            loading="lazy"
            decoding="async"
            data-nimg="fill"
            className="h-full w-full object-cover"
            sizes="100vw"
            src={post.images[0]}
            style={imageStyle}
          />
          <div className="bg-primary absolute right-[6px] top-[6px] rounded-full px-[8px] pb-[5px] pt-[2px] leading-[10px] text-white sm:px-[12px] sm:py-1 sm:leading-[14px]">
            <span className="text-[10px] font-semibold sm:text-sm">
              {post.agreement
                ? "Thỏa thuận"
                : `${post.priceMin} - ${post.priceMax}`}
            </span>
          </div>
        </div>
        <div className="text-black-ish-100 w-full truncate whitespace-nowrap text-xs sm:py-2 sm:text-sm">
          <div className="flex justify-between sm:mb-1 sm:mt-[2px]">
            <span className="text-[10px] sm:text-sm">
              Cách bạn ~ {post.distance.text}
            </span>
            <div className="mr-2 flex items-center gap-2"></div>
          </div>
          <div className="sm:mb-1">
            <h3 className="text-black-ish-200 truncate text-base font-bold sm:text-xl">
              {post.title}
            </h3>
          </div>
          <div className="flex items-start gap-2 pl-1 sm:mb-1">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              className="stroke-primary flex-shrink-0"
              height="20"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
                d="M256 48c-79.5 0-144 61.39-144 137 0 87 96 224.87 131.25 272.49a15.77 15.77 0 0 0 25.5 0C304 409.89 400 272.07 400 185c0-75.61-64.5-137-144-137z"
              ></path>
              <circle
                cx="256"
                cy="192"
                r="48"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
              ></circle>
            </svg>
            <span className="line-clamp-2 text-wrap sm:truncate sm:text-nowrap">
              {post.location.address}
            </span>
          </div>
          <div className="flex items-center gap-2 pl-1 sm:mb-1">
            <FieldTimeOutlined
              className="stroke-primary"
              style={{ fontSize: "18px", marginLeft: "2px" }}
            />
            <span>
              {" "}
              Khung giờ: {startTime} - {endTime}
            </span>
          </div>
          <div className="flex items-center gap-2 pl-1 sm:mb-1">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              className="fill-primary stroke-primary flex-shrink-0"
              height="20"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="416"
                height="384"
                x="48"
                y="80"
                fill="none"
                strokeLinejoin="round"
                strokeWidth="32"
                rx="48"
              ></rect>
              <circle cx="296" cy="232" r="24"></circle>
              <circle cx="376" cy="232" r="24"></circle>
              <circle cx="296" cy="312" r="24"></circle>
              <circle cx="376" cy="312" r="24"></circle>
              <circle cx="136" cy="312" r="24"></circle>
              <circle cx="216" cy="312" r="24"></circle>
              <circle cx="136" cy="392" r="24"></circle>
              <circle cx="216" cy="392" r="24"></circle>
              <circle cx="296" cy="392" r="24"></circle>
              <path
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
                d="M128 48v32m256-32v32"
              ></path>
              <path
                fill="none"
                strokeLinejoin="round"
                strokeWidth="32"
                d="M464 160H48"
              ></path>
            </svg>
            <span className="">Ngày: {date}</span>
          </div>
          <div className="flex items-center gap-2 pl-1 sm:mb-1">
            <InfoCircleFilled
              style={{ fontSize: "16px", marginLeft: "2px" }}
              className="stroke-primary"
            />
            <span>
              Trình độ: {Level_value[post.levelMemberMin - 1].label} đến
              {Level_value[post.levelMemberMax - 1].label}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
