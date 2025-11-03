import React from "react";
import "../search.css";
interface Props {
    setLocation: React.Dispatch<React.SetStateAction<string>>;
    setbtnClicked: React.Dispatch<React.SetStateAction<boolean>>;
}
const LocationDialog: React.FC<Props> = (props) => {
    const { setLocation, setbtnClicked } = props;
    const handleClick = (location: string) => {
        setLocation(location);
        setbtnClicked(true);
    };

    return (
        <div className="shadow-md rounded-3xl w-full bg-white text-sm z-10 absolute left-0 top-3 px-4 py-6 sm:px-6">
            <button className="w-full mb-[28px] rounded-full hover:bg-neutral-200 transition flex items-center">
                <div className="mr-[15px] p-[10px] rounded-full bg-primary">
                    <svg
                        stroke="currentColor"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="flex-shrink-0 stroke-white fill-white"
                        height="22"
                        width="22"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill="none" d="M0 0h24v24H0z"></path>
                        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"></path>
                    </svg>
                </div>
                <div onMouseDown={() => handleClick("Vị trí hiện tại")} className="">
                    <span className="text-black-ish-200 text-[16px] font-bold">Dùng vị trí hiện tại</span>
                </div>
            </button>
            <div className="mb-[19px]">
                <strong className="text-black-ish-200 text-[16px]">Địa chỉ phổ biến</strong>
            </div>
            <div className=" flex flex-wrap gap-2">
                <button
                    onMouseDown={() => handleClick("Hà Nội")}
                    className="location-option-btn py-[10px] px-[20px] rounded-full border border-[#c9c9c9]  transition">
                    <span className="text-black-ish-200 font-semibold">Hà Nội</span>
                </button>
                <button
                    onMouseDown={() => handleClick("Hồ Chí Minh")}
                    className="location-option-btn py-[10px] px-[20px] rounded-full border border-[#c9c9c9]  transition">
                    <span className="text-black-ish-200 font-semibold">Hồ Chí Minh</span>
                </button>
            </div>
        </div>
    );
};

export default LocationDialog;
