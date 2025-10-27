import React from "react";

import { FieldTimeOutlined, ForwardFilled, InfoCircleFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { Post } from "../../../interface";
import { Level_value } from "../../../utils/Constant";

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
        <Link to={`/post/${post._id}`}>
            <div className="flex p-2 rounded-xl shadow-[rgba(0,0,0,0.1)_0px_2px_20px_0px]">
                <div className="relative rounded-lg overflow-hidden flex-shrink-0 mr-3 sm:mr-4 min-w-[120px] sm:min-w-[200px] min-h-[150px] sm:min-h-[166px]">
                    <img
                        alt="Listing"
                        loading="lazy"
                        decoding="async"
                        data-nimg="fill"
                        className="object-cover w-full h-full"
                        sizes="100vw"
                        src={post.images[0]}
                        style={imageStyle}
                    />
                    <div className="absolute top-[6px] right-[6px] bg-primary text-white rounded-full pb-[5px] pt-[2px] px-[8px] sm:py-1 sm:px-[12px] leading-[10px] sm:leading-[14px]">
                        <span className="text-[10px] sm:text-sm font-semibold">
                            {post.agreement ? "Thỏa thuận" : `${post.priceMin} - ${post.priceMax}`}
                        </span>
                    </div>
                </div>
                <div className="w-full truncate sm:py-2 text-black-ish-100 text-xs sm:text-sm whitespace-nowrap">
                    <div className="sm:mt-[2px] sm:mb-1 flex justify-between">
                        <span className="text-[10px] sm:text-sm">Cách bạn ~ {post.distance.text}</span>
                        <div className="flex items-center gap-2 mr-2"></div>
                    </div>
                    <div className="sm:mb-1">
                        <h3 className="text-black-ish-200 font-bold text-base sm:text-xl truncate">{post.title}</h3>
                    </div>
                    <div className="flex gap-2 items-start pl-1 sm:mb-1">
                        <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 512 512"
                            className="flex-shrink-0 stroke-primary"
                            height="20"
                            width="20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="32"
                                d="M256 48c-79.5 0-144 61.39-144 137 0 87 96 224.87 131.25 272.49a15.77 15.77 0 0 0 25.5 0C304 409.89 400 272.07 400 185c0-75.61-64.5-137-144-137z"></path>
                            <circle
                                cx="256"
                                cy="192"
                                r="48"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="32"></circle>
                        </svg>
                        <span className="text-wrap line-clamp-2 sm:text-nowrap sm:truncate">
                            {post.location.address}
                        </span>
                    </div>
                    <div className="flex gap-2 items-center pl-1 sm:mb-1">
                        <FieldTimeOutlined className="stroke-primary" style={{ fontSize: "18px", marginLeft: "2px" }} />
                        <span>
                            {" "}
                            Khung giờ: {startTime} - {endTime}
                        </span>
                    </div>
                    <div className="flex pl-1 gap-2 items-center sm:mb-1">
                        <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 512 512"
                            className="flex-shrink-0 fill-primary stroke-primary"
                            height="20"
                            width="20"
                            xmlns="http://www.w3.org/2000/svg">
                            <rect
                                width="416"
                                height="384"
                                x="48"
                                y="80"
                                fill="none"
                                strokeLinejoin="round"
                                strokeWidth="32"
                                rx="48"></rect>
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
                                d="M128 48v32m256-32v32"></path>
                            <path fill="none" strokeLinejoin="round" strokeWidth="32" d="M464 160H48"></path>
                        </svg>
                        <span className="">Ngày: {date}</span>
                    </div>
                    <div className="flex pl-1 gap-2 items-center sm:mb-1">
                        <InfoCircleFilled style={{ fontSize: "16px", marginLeft: "2px" }} className="stroke-primary" />
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
