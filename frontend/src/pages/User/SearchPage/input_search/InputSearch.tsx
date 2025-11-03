import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import TypeDialog from "./TypeDialog";
import LocationDialog from "./LocationDialog";
import "../search.css";

export const InputSearch: React.FC = () => {
    const [location, setLocation] = useState<string>("");
    const [type, setType] = useState<string>("");
    const [isShowDialog, setIsShowDialog] = useState(false);
    const [dialogActive, setdialogActive] = useState("");
    const [btnClicked, setbtnClicked] = useState(false);
    const [url, setUrl] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const locationDefaults = searchParams.get("location");
    const typeDefaults = searchParams.get("type");

    useEffect(() => {
        if (locationDefaults) {
            setLocation(locationDefaults);
        } else {
            setLocation("Hà Nội");
        }

        if (typeDefaults) {
            setType(typeDefaults);
        } else {
            setType("Giao lưu");
        }
    }, []);

    useEffect(() => {
        if (type === "Giao lưu") {
            setUrl(`/search/sessions?location=${location}&type=${type}`);
        } else {
            setUrl(`/search/facilities?location=${location}&type=${type}`);
        }
    }, [type, location]);

    const handleClickBtnType = () => {
        setIsShowDialog(!isShowDialog);
        setdialogActive("type");
    };

    const handleClickBtnLocation = () => {
        setLocation("");
        setdialogActive("location");
        setIsShowDialog(!isShowDialog);
        setbtnClicked(false);
    };

    const handleOnBlur = () => {
        if (!btnClicked) {
            setLocation("Hà Nội");
        }
        setIsShowDialog(!isShowDialog);
    };

    return (
        <div className="input-search-container">
            <div className="flex flex-[2] items-center gap-2 w-full md:w-auto">
                <div>
                    <div className="input-search-content shadow-[0_2px_20px_0_rgba(0,0,0,.1)] py-[3px] px-[6px] sm:py-[7px] sm:px-[10px] bg-white rounded-full">
                        <div className="h-[36px] w-full xl:w-[400px] flex justify-between items-center">
                            <div className="h-full flex-1 flex text-[16px] font-semibold">
                                <div className="px-2 sm:pl-[17px] sm:pr-[10px] h-[36px] w-3/5 sm:w-1/2">
                                    <input
                                        placeholder="Nhập địa điểm"
                                        className="search-location-input w-full h-full border-none outline-none"
                                        type="text"
                                        id="inputsss"
                                        value={location}
                                        onClick={handleClickBtnLocation}
                                        onBlur={handleOnBlur}
                                        onChange={() => {}}
                                    />
                                </div>
                                <div className="px-2 sm:pl-[17px] sm:pr-[10px] h-full sm:flex-1 w-2/5 sm:w-1/2 truncate ">
                                    <button
                                        onClick={handleClickBtnType}
                                        onBlur={handleOnBlur}
                                        className="h-full flex items-center justify-start">
                                        {type}
                                    </button>
                                </div>
                            </div>
                            <Link to={url}>
                                <button
                                    aria-label="Tìm kiếm"
                                    title="Tìm kiếm"
                                    className="ml-1 w-[32px] h-[32px] flex-shrink-0 flex justify-center items-center bg-primary rounded-full text-white">
                                    <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        viewBox="0 0 512 512"
                                        className="stroke-white stroke-[16px]"
                                        height="20"
                                        width="20"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path d="M443.5 420.2L336.7 312.4c20.9-26.2 33.5-59.4 33.5-95.5 0-84.5-68.5-153-153.1-153S64 132.5 64 217s68.5 153 153.1 153c36.6 0 70.1-12.8 96.5-34.2l106.1 107.1c3.2 3.4 7.6 5.1 11.9 5.1 4.1 0 8.2-1.5 11.3-4.5 6.6-6.3 6.8-16.7.6-23.3zm-226.4-83.1c-32.1 0-62.3-12.5-85-35.2-22.7-22.7-35.2-52.9-35.2-84.9 0-32.1 12.5-62.3 35.2-84.9 22.7-22.7 52.9-35.2 85-35.2s62.3 12.5 85 35.2c22.7 22.7 35.2 52.9 35.2 84.9 0 32.1-12.5 62.3-35.2 84.9-22.7 22.7-52.9 35.2-85 35.2z"></path>
                                    </svg>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {isShowDialog && (
                <div className="dialog w-full relative pt-2">
                    {dialogActive === "type" ? (
                        <TypeDialog setType={setType} setbtnClicked={setbtnClicked} />
                    ) : (
                        <LocationDialog setLocation={setLocation} setbtnClicked={setbtnClicked} />
                    )}
                </div>
            )}
        </div>
    );
};
