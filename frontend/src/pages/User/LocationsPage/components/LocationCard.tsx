import React from "react";
import { Link } from "react-router-dom";
import { BadmintonVenue } from "../../../../interface";
interface Props {
  badmintonVenue: BadmintonVenue;
}
export const LocationCard: React.FC<Props> = (props) => {
  const { badmintonVenue } = props;
  const imageStyle: React.CSSProperties = {
    position: "absolute",
    height: "100%",
    width: "100%",
    inset: "0px",
    color: "transparent",
  };
  return (
    <Link to={`/locations/${badmintonVenue.id}`}>
      <div className="flex rounded-xl p-2 shadow-[rgba(0,0,0,0.1)_0px_2px_20px_0px]">
        <div className="relative mr-3 min-h-[100px] min-w-[120px] flex-shrink-0 overflow-hidden rounded-lg sm:mr-4 sm:min-h-[166px] sm:min-w-[200px]">
          <img
            alt="Listing"
            loading="lazy"
            decoding="async"
            data-nimg="fill"
            className="h-full w-full object-cover"
            sizes="100vw"
            src={badmintonVenue.img[0]}
            style={imageStyle}
          />
          <div className="bg-primary absolute right-[6px] top-[6px] rounded-full px-[8px] pb-[5px] pt-[2px] leading-[10px] text-white sm:px-[12px] sm:py-1 sm:leading-[14px]">
            <span className="text-[10px] font-semibold sm:text-sm">
              {badmintonVenue.priceMin} - {badmintonVenue.priceMax}
            </span>
          </div>
        </div>
        <div className="text-black-ish-100 w-full truncate whitespace-nowrap text-xs sm:py-2 sm:text-sm">
          <div className="flex justify-between sm:mb-1 sm:mt-[2px]">
            <span className="text-[10px] sm:text-sm">
              Cách bạn ~ {badmintonVenue.distance.text}
            </span>
            <div className="mr-2 flex items-center gap-2"></div>
          </div>
          <div className="sm:mb-1">
            <h3 className="text-black-ish-200 truncate text-base font-bold sm:text-xl">
              {badmintonVenue.name}
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
              {badmintonVenue.address}
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
            <span>
              {" "}
              giờ mở: {badmintonVenue.openHours?.start.toString()} -{" "}
              {badmintonVenue.openHours?.end.toString()}
            </span>
          </div>

          <div className="flex items-start gap-2 pl-1 sm:mb-1">
            <svg
              stroke="currentColor"
              fill="currentColor"
              // strokeWidth="0"
              viewBox="0 0 512 512"
              className="stroke-primary flex-shrink-0"
              height="24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M120.8 55L87.58 199h18.52l29.1-126h18.2l-20.6 126h18.3l10.1-62H247v62h18v-62h85.8l10.1 62h18.3L358.6 73h18.2l29.1 126h18.5L391.2 55H120.8zm50.9 18h168.6l7.6 46H164.1l7.6-46zM73 217v30h366v-30H73zm-.64 48L20.69 489H491.3l-51.7-224h-18.5l47.6 206h-45L390 265h-18.3l14.2 87H265v-87h-18v87H126.1l14.2-87H122L88.35 471H43.31l47.56-206H72.36zm50.74 105h265.8l16.5 101H106.6l16.5-101z"></path>
            </svg>
            <span className="line-clamp-2 text-wrap sm:truncate sm:text-nowrap">
              {badmintonVenue.numberOfCourts}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
