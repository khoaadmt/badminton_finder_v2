import { TimePicker, Select, DatePicker, UploadFile, message, Form } from "antd";
import React, { useEffect, useState } from "react";
import { PicturesWall } from "../PictureWall/PicturesWall";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Dayjs } from "dayjs";
import { disabledDate, filterOption } from "../FunctionHandler";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../../../interface";
import LocationService from "../../../../services/location/LocationService";
import PostService from "../../../../services/post/PostService";
import { genderOptions, memberLevels } from "../../../../utils/Constant";
import { notJustNumber } from "../../../Auth/validationSchema";
import { CustomDynamicForm } from "../Form/CustomDynamicForm";
import "./CreatePostPage.css";
import { useNavigate } from "react-router-dom";
import UploadService from "../../../../services/uploads/UploadService";
import { RcFile } from "antd/es/upload";
import { TagRender } from "../TagRender";

export const CreatePostContent: React.FC = () => {
    const [phones, setPhones] = useState([""]);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [locationOptions, setLocationOptions] = useState();
    const user = useSelector((state: RootState) => state.auth.login.currentUser);
    const dispatch = useDispatch();
    const postService = new PostService();
    const locationService = new LocationService();
    const [disablePriceInput, setDisablePriceInput] = useState(false);
    const navigate = useNavigate();

    const createPostForm = useFormik({
        initialValues: {
            title: "Tuyển giao lưu & cố định",
            description: "Hôm nay đội mình cần vài bạn đến giao lưu ",
            memberCount: 1,
            date: "",
            time: "",
            gender: "",
            phones: [],
            levelMemberMin: null,
            levelMemberMax: null,
            priceMin: 50000,
            priceMax: 50000,
            agreement: false,
            location_id: null,
            username: user?.username,
        },
        validationSchema: Yup.object({
            title: notJustNumber,
            description: notJustNumber,
            memberCount: Yup.number().required("Required"),
            date: Yup.string().required("Required"),
            time: Yup.string().required("Required"),
            gender: Yup.number().required("Required"),
            phones: Yup.array().required("Required"),
            levelMemberMin: Yup.number().required("Required"),
            levelMemberMax: Yup.number().required("Required"),
            location_id: Yup.number().required("Required"),
        }),
        onSubmit: async (values) => {
            const files: RcFile[] = fileList.map((f) => f.originFileObj).filter((f): f is RcFile => !!f);

            try {
                let resPostId;

                if (values.agreement == true) {
                    values.priceMin = 0;
                    values.priceMax = 0;
                }
                const createPostPayload = { ...values, user_id: user?.user_id };
                console.log("user?.userId :", typeof user?.user_id);

                resPostId = await postService.createPost(createPostPayload, user?.accessToken);
                const postId = resPostId.data.post;

                if (files.length > 0) {
                    const imgUrl = await UploadService.uploadImages(files);
                }
                message.success("Tin của bạn đã được tải lên !");
                setTimeout(() => {
                    navigate("/user/my-post");
                }, 2000);
            } catch (error) {
                console.log(error);
            }
        },
    });

    const HandleLocationOnChange = (value: string) => {
        createPostForm.setFieldValue("location_id", value);
    };

    const handleGenderChange = (values: number[]) => {
        let total = 0;
        values.forEach((value: number) => {
            total += value;
        });
        createPostForm.setFieldValue("gender", total);
    };

    const handleDateChange = (date: Dayjs, dateString: string | string[]) => {
        console.log(date.format("YYYY-MM-DD"));
        createPostForm.setFieldValue("date", date.format("YYYY-MM-DD"));
    };
    const handleStartTimeChange = (time: Dayjs, timeString: string | string[]) => {
        createPostForm.setFieldValue("time", timeString);
    };
    const handleLevelMemberMinChange = (value: any) => {
        console.log("on change");
        if (createPostForm.values.levelMemberMax) {
            if (value > createPostForm.values.levelMemberMax) {
                message.error("Trình độ tối thiểu phải nhỏ hơn hoặc bằng trình độ tối đa");
                return;
            }
        }
        createPostForm.setFieldValue("levelMemberMin", value);
    };
    const handleLevelMemberMaxChange = (value: any) => {
        if (createPostForm.values.levelMemberMin) {
            if (value < createPostForm.values.levelMemberMin) {
                message.error("Trình độ tối thiểu phải nhỏ hơn hoặc bằng trình độ tối đa");
                return;
            }
        }

        createPostForm.setFieldValue("levelMemberMax", value);
    };

    const handleSelect = () => {
        console.log("select");
    };
    const handleAgreementChange = (e: any) => {
        createPostForm.setFieldValue("agreement", e.target.checked);
        if (e.target.checked) {
            createPostForm.setFieldValue("priceMin", 0);
            createPostForm.setFieldValue("priceMax", 0);
        }
        setDisablePriceInput((prev) => {
            return !prev;
        });
    };

    useEffect(() => {
        createPostForm.setFieldValue("phones", phones);
    }, [phones]);

    useEffect(() => {
        locationService.getLocationKeyLabels().then((res) => {
            setLocationOptions(res.data);
        });
    }, []);

    const autoGrow = (e: any) => {
        const textarea = e.target;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

    return (
        <div className="create-post-form max-w-[2520px] mx-auto">
            <form
                onSubmit={createPostForm.handleSubmit}
                className="rounded-2xl border-2 flex flex-col md:flex-row gap-6 p-4 sm:p-6 xl:mt-[-30px] md:mt-[-20px] sm:mt-[-60px]">
                <div className="flex-1 flex flex-col gap-4 md:w-3/5 pb-[18px]">
                    <div className="font-semibold text-lg text-black-ish-200">Thông tin chung</div>

                    <div className="w-full relative">
                        <input
                            className="peer w-full p-4 pt-6 bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed pl-4"
                            type="text"
                            value={createPostForm.values.title}
                            name="title"
                            onChange={createPostForm.handleChange}
                            onBlur={createPostForm.handleBlur}
                        />
                        <label className="absolute text-md duration-150 transform -translate-y-3 top-5 origin-[0] whitespace-nowrap left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 hover:cursor-text text-black-ish-100">
                            Tiêu đề
                        </label>
                        {createPostForm.touched.title && createPostForm.errors.title && (
                            <small className="text-danger">{`*${createPostForm.errors.title}`}</small>
                        )}
                    </div>
                    <div className="w-full relative">
                        <textarea
                            className="textarea peer w-full p-4 pt-6 bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed pl-4"
                            value={createPostForm.values.description}
                            name="description"
                            id="input-post-description"
                            placeholder=" "
                            onChange={(e) => {
                                createPostForm.handleChange(e);
                                autoGrow(e);
                            }}
                            onInput={autoGrow}
                            onBlur={createPostForm.handleBlur}></textarea>

                        <label className="absolute text-md duration-150 transform -translate-y-3 top-5 origin-[0] whitespace-nowrap left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 hover:cursor-text text-black-ish-100">
                            Mô tả chi tiết
                        </label>
                        {createPostForm.touched.description && createPostForm.errors.description && (
                            <small className="text-danger">{`*${createPostForm.errors.description}`}</small>
                        )}
                    </div>

                    <div className="font-semibold text-md text-black-ish-200">Sân đấu:</div>
                    <div className=" w-full relative">
                        <Form.Item>
                            <Select
                                className="input-location"
                                placeholder="Tìm kiếm sân đấu"
                                optionFilterProp="children"
                                onChange={HandleLocationOnChange}
                                onBlur={createPostForm.handleBlur}
                                filterOption={filterOption}
                                dropdownRender={(menu) => <div className="custom-dropdown">{menu}</div>}
                                options={locationOptions}
                                showSearch
                            />
                        </Form.Item>
                        {createPostForm.touched.location_id && createPostForm.errors.location_id && (
                            <small className="text-danger">*Required</small>
                        )}
                    </div>
                    <div className="font-semibold text-md text-black-ish-200">Yêu cầu về thành viên:</div>
                    <div className="flex flex-col sm:grid grid-cols-2 gap-4">
                        <div className="w-full relative">
                            <input
                                className="peer w-full p-4 pt-6 bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed pl-4"
                                type="number"
                                name="memberCount"
                                value={createPostForm.values.memberCount}
                                onChange={createPostForm.handleChange}
                                onBlur={createPostForm.handleBlur}
                                min="1"
                            />
                            <label className="absolute text-md duration-150 transform -translate-y-3 top-5 origin-[0] whitespace-nowrap left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 hover:cursor-text text-black-ish-100">
                                Số người cần tuyển
                            </label>
                            {createPostForm.touched.memberCount && createPostForm.errors.memberCount && (
                                <small className="text-danger">{`*${createPostForm.errors.memberCount}`}</small>
                            )}
                        </div>
                        <div className="w-full relative">
                            <Select
                                placeholder="Giới tính"
                                className="input-post w-full"
                                mode="multiple"
                                tagRender={TagRender}
                                style={{ border: "2px solid #e5e7eb", width: "100%" }}
                                defaultValue={[1]}
                                options={genderOptions}
                                onChange={handleGenderChange}
                            />
                        </div>
                    </div>
                    <div className="font-semibold text-md text-black-ish-200">Trình độ:</div>
                    <div className="flex flex-col sm:grid grid-cols-2 gap-4">
                        <div className="w-full relative">
                            <Select
                                placeholder="Trình độ tối thiểu"
                                className="input-post w-full"
                                onChange={handleLevelMemberMinChange}
                                defaultValue={2}
                                options={memberLevels.filter((memberLevel) => {
                                    if (createPostForm.values.levelMemberMax) {
                                        return memberLevel.value <= createPostForm.values.levelMemberMax;
                                    }
                                    return true;
                                })}
                                style={{ border: "2px solid #e5e7eb" }}
                            />
                        </div>
                        <div className="w-full relative">
                            <Select
                                placeholder="Trình độ tối đa"
                                className="input-post  w-full"
                                onChange={handleLevelMemberMaxChange}
                                defaultValue={4}
                                options={memberLevels.filter((memberLevel) => {
                                    if (createPostForm.values.levelMemberMin) {
                                        return memberLevel.value >= createPostForm.values.levelMemberMin;
                                    }
                                    return true;
                                })}
                            />
                        </div>
                    </div>
                    <div className="font-semibold text-md text-black-ish-200">Thời gian:</div>
                    <div className="flex flex-col sm:grid grid-cols-2 gap-4">
                        <div className="w-full relative">
                            <TimePicker
                                className="custom-time-picker"
                                placeholder="Giờ bắt đầu"
                                minuteStep={30}
                                style={{ width: "100%", height: "65px" }}
                                format={"HH:mm"}
                                inputReadOnly
                                onChange={handleStartTimeChange}
                            />
                            {createPostForm.touched.time && createPostForm.errors.time && (
                                <small className="text-danger">{`*${createPostForm.errors.time}`}</small>
                            )}
                        </div>
                        <div className="w-full relative">
                            <DatePicker
                                className="custom-date-picker"
                                format={{
                                    format: "DD-MM-YYYY",
                                }}
                                disabledDate={disabledDate}
                                placeholder="Ngày diễn ra"
                                inputReadOnly
                                style={{ width: "100%", height: "65px" }}
                                onChange={handleDateChange}
                            />
                            {createPostForm.touched.date && createPostForm.errors.date && (
                                <small className="text-danger">{`*${createPostForm.errors.date}`}</small>
                            )}
                        </div>
                    </div>
                    <div className="font-semibold text-md text-black-ish-200">Phí giao lưu:</div>
                    <div className="flex flex-col sm:grid grid-cols-3 gap-4">
                        <div className="w-full relative">
                            <input
                                placeholder="Từ"
                                className="peer w-full p-4 pt-6 bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed pl-4"
                                type="number"
                                name="priceMin"
                                min={1}
                                value={createPostForm.values.priceMin}
                                onChange={createPostForm.handleChange}
                                disabled={disablePriceInput}
                            />
                        </div>
                        <div className="w-full relative">
                            <input
                                placeholder="Đến"
                                className="peer w-full p-4 pt-6 bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed pl-4"
                                type="number"
                                name="priceMax"
                                min={1}
                                value={createPostForm.values.priceMax}
                                onChange={createPostForm.handleChange}
                                disabled={disablePriceInput}
                            />
                        </div>
                        <div className="w-full relative agreed-checkbox-container">
                            <p className="text-[14px]">Or</p>
                            <input
                                className="agreed-checkbox"
                                type="checkbox"
                                value="thỏa thuận"
                                onChange={handleAgreementChange}
                            />
                            <div className="text-md ">Thỏa thuận</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4 md:w-2/5 w-full relative">
                    <div className="font-semibold text-lg text-black-ish-200">Thông tin liên hệ</div>
                    <div className="w-full relative">
                        <CustomDynamicForm values={phones} setValues={setPhones} />
                    </div>
                    <div className="font-semibold text-lg text-black-ish-200 mt-2">Hình ảnh mô tả</div>
                    <div className="flex flex-wrap gap-3">
                        <PicturesWall fileList={fileList} setFileList={setFileList} maxCount={10} />
                    </div>
                    <div className=" md:flex justify-center mt-2">
                        <div className="w-full sm:w-1/2 lg:w-2/3 flex gap-4 justify-end">
                            <button
                                id="cancel-post"
                                type="button"
                                className="relative bg-primary  disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-full bg-white border-black text-black text-md py-3 font-semibold border-2">
                                Hủy
                            </button>
                            <button
                                id="submit-post"
                                type="submit"
                                className="relative ant-btn-primary disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-full  border-primary text-white text-md py-3 font-semibold border-2">
                                Đăng tin
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};
