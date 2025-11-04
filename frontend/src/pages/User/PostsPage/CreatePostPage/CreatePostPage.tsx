import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  TimePicker,
  Select,
  DatePicker,
  UploadFile,
  message,
  Form,
} from "antd";
import { PicturesWall } from "../components/PictureWall/PicturesWall";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Dayjs } from "dayjs";
import {
  disabledDate,
  filterOption,
} from "../../../../utils/helper/FunctionHandler";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../interface";
import LocationService from "../../../../services/location/LocationService";
import PostService from "../../../../services/post/PostService";
import { genderOptions, memberLevels } from "../../../../utils/Constant";
import { notJustNumber } from "../../../Auth/validationSchema";
import { CustomDynamicForm } from "../components/Form/CustomDynamicForm";
import "./CreatePostPage.css";
import { useNavigate } from "react-router-dom";
import UploadService from "../../../../services/uploads/UploadService";
import { RcFile } from "antd/es/upload";
import { TagRender } from "../components/TagRender";

type LocationOption = { value: string; label: string };

export const CreatePostPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.login.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const postService = useMemo(() => new PostService(), []);
  const locationService = useMemo(() => new LocationService(), []);

  const [phones, setPhones] = useState<string[]>([""]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [locationOptions, setLocationOptions] = useState<LocationOption[]>([]);
  const [disablePriceInput, setDisablePriceInput] = useState(false);

  const createPostForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: "Tuyển giao lưu & cố định",
      description: "Hôm nay đội mình cần vài bạn đến giao lưu ",
      memberCount: 1,
      date: "",
      time: "",
      gender: 1,
      phones: [] as string[],
      levelMemberMin: 2,
      levelMemberMax: 4,
      priceMin: 50000,
      priceMax: 70000,
      agreement: false,
      location_id: null as number | null,
      username: user?.username ?? "",
    },
    validationSchema: Yup.object({
      title: notJustNumber,
      description: notJustNumber,
      memberCount: Yup.number().required("Required"),
      date: Yup.string().required("Required"),
      time: Yup.string().required("Required"),
      gender: Yup.number().required("Required"),
      phones: Yup.array().min(1, "Required"),
      levelMemberMin: Yup.number().required("Required"),
      levelMemberMax: Yup.number().required("Required"),
      location_id: Yup.number().required("Required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const files: RcFile[] = fileList
          .map((f) => f.originFileObj)
          .filter((f): f is RcFile => !!f);

        if (values.agreement) {
          values.priceMin = 0;
          values.priceMax = 0;
        }

        const payload = { ...values, user_id: user?.user_id };

        const resPost = await postService.createPost(
          payload,
          user?.accessToken,
        );
        const postId = resPost?.data?.post;
        if (files.length > 0) {
          await UploadService.uploadImages(files);
        }

        message.success("Tin của bạn đã được tải lên !");
        setTimeout(() => navigate("/user/my-post"), 1000);
      } catch (err) {
        console.error("Error creating post:", err);
        message.error("Có lỗi xảy ra, vui lòng thử lại.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    createPostForm.setFieldValue("phones", phones);
  }, [phones]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await locationService.getLocationKeyLabels();
        if (!mounted) return;
        const opts: LocationOption[] = (res?.data ?? []).map((item: any) => ({
          value: item.key ?? item.value ?? item.id,
          label: item.label ?? item.name,
        }));
        setLocationOptions(opts);
      } catch (err) {
        console.error("Error fetching locations:", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [locationService]);

  const handleLocationChange = useCallback((value: string | number) => {
    createPostForm.setFieldValue("location_id", value);
  }, []);

  const handleGenderChange = useCallback((values: number[]) => {
    const total = values.reduce((acc, v) => acc + Number(v), 0);
    createPostForm.setFieldValue("gender", total);
  }, []);

  const handleDateChange = useCallback((date: Dayjs | null) => {
    if (date) createPostForm.setFieldValue("date", date.format("YYYY-MM-DD"));
  }, []);

  const handleStartTimeChange = useCallback(
    (time: Dayjs, timeString: string | string[]) => {
      if (time) createPostForm.setFieldValue("time", timeString);
    },
    [],
  );

  const handleLevelMemberMinChange = useCallback(
    (value: number) => {
      const max = createPostForm.values.levelMemberMax;
      if (max !== null && value > max) {
        message.error(
          "Trình độ tối thiểu phải nhỏ hơn hoặc bằng trình độ tối đa",
        );
        return;
      }
      createPostForm.setFieldValue("levelMemberMin", value);
    },
    [createPostForm.values.levelMemberMax],
  );

  const handleLevelMemberMaxChange = useCallback(
    (value: number) => {
      const min = createPostForm.values.levelMemberMin;
      if (min !== null && value < min) {
        message.error(
          "Trình độ tối thiểu phải nhỏ hơn hoặc bằng trình độ tối đa",
        );
        return;
      }
      createPostForm.setFieldValue("levelMemberMax", value);
    },
    [createPostForm.values.levelMemberMin],
  );

  const handleAgreementChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      createPostForm.setFieldValue("agreement", checked);
      if (checked) {
        createPostForm.setFieldValue("priceMin", 0);
        createPostForm.setFieldValue("priceMax", 0);
      }
      setDisablePriceInput(checked);
    },
    [],
  );

  const autoGrow = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, []);

  return (
    <div className="create-post-form mx-auto max-w-[2520px]">
      <form
        onSubmit={createPostForm.handleSubmit}
        className="flex flex-col gap-6 rounded-2xl border-2 p-4 sm:mt-[-60px] sm:p-6 md:mt-[-20px] md:flex-row xl:mt-[-30px]"
      >
        <div className="flex flex-1 flex-col gap-4 pb-[18px] md:w-3/5">
          <div className="text-black-ish-200 text-lg font-semibold">
            Thông tin chung
          </div>

          <div className="relative w-full">
            <input
              className="peer w-full rounded-md border-2 bg-white p-4 pl-4 pt-6 outline-none transition disabled:cursor-not-allowed disabled:opacity-70"
              type="text"
              {...createPostForm.getFieldProps("title")}
            />
            <label className="text-md text-black-ish-100 absolute left-4 top-5 origin-[0] -translate-y-3 transform whitespace-nowrap duration-150 hover:cursor-text peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75">
              Tiêu đề
            </label>
            {createPostForm.touched.title && createPostForm.errors.title && (
              <small className="text-danger">{`*${createPostForm.errors.title}`}</small>
            )}
          </div>

          <div className="relative w-full">
            <textarea
              className="textarea peer w-full rounded-md border-2 bg-white p-4 pl-4 pt-6 outline-none transition disabled:cursor-not-allowed disabled:opacity-70"
              {...createPostForm.getFieldProps("description")}
              id="input-post-description"
              placeholder=" "
              onChange={(e) => {
                createPostForm.handleChange(e);
                autoGrow(e);
              }}
              onInput={autoGrow as any}
              onBlur={createPostForm.handleBlur}
            />
            <label className="text-md text-black-ish-100 absolute left-4 top-5 origin-[0] -translate-y-3 transform whitespace-nowrap duration-150 hover:cursor-text peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75">
              Mô tả chi tiết
            </label>
            {createPostForm.touched.description &&
              createPostForm.errors.description && (
                <small className="text-danger">{`*${createPostForm.errors.description}`}</small>
              )}
          </div>

          <div className="text-md text-black-ish-200 font-semibold">
            Sân đấu:
          </div>
          <div className="relative w-full">
            <Form.Item>
              <Select
                className="input-location"
                placeholder="Tìm kiếm sân đấu"
                optionFilterProp="children"
                onChange={handleLocationChange}
                onBlur={() =>
                  createPostForm.setFieldTouched("location_id", true)
                }
                filterOption={filterOption}
                dropdownRender={(menu) => (
                  <div className="custom-dropdown">{menu}</div>
                )}
                options={locationOptions}
                showSearch
                value={createPostForm.values.location_id ?? undefined}
              />
            </Form.Item>
            {createPostForm.touched.location_id &&
              createPostForm.errors.location_id && (
                <small className="text-danger">*Required</small>
              )}
          </div>

          <div className="text-md text-black-ish-200 font-semibold">
            Yêu cầu về thành viên:
          </div>
          <div className="flex grid-cols-2 flex-col gap-4 sm:grid">
            <div className="relative w-full">
              <input
                className="peer w-full rounded-md border-2 bg-white p-4 pl-4 pt-6 outline-none transition disabled:cursor-not-allowed disabled:opacity-70"
                type="number"
                min={1}
                {...createPostForm.getFieldProps("memberCount")}
              />
              <label className="text-md text-black-ish-100 absolute left-4 top-5 origin-[0] -translate-y-3 transform whitespace-nowrap duration-150 hover:cursor-text peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75">
                Số người cần tuyển
              </label>
              {createPostForm.touched.memberCount &&
                createPostForm.errors.memberCount && (
                  <small className="text-danger">{`*${createPostForm.errors.memberCount}`}</small>
                )}
            </div>

            <div className="relative w-full">
              <Select
                defaultValue={[1]}
                placeholder="Giới tính"
                className="input-post w-full"
                mode="multiple"
                tagRender={TagRender}
                style={{ border: "2px solid #e5e7eb", width: "100%" }}
                options={genderOptions}
                onChange={handleGenderChange}
              />
            </div>
          </div>

          <div className="text-md text-black-ish-200 font-semibold">
            Trình độ:
          </div>
          <div className="flex grid-cols-2 flex-col gap-4 sm:grid">
            <div className="relative w-full">
              <Select
                value={createPostForm.values.levelMemberMin}
                placeholder="Trình độ tối thiểu"
                className="input-post w-full"
                onChange={handleLevelMemberMinChange}
                options={memberLevels.filter((memberLevel) => {
                  const max = createPostForm.values.levelMemberMax;
                  return max ? memberLevel.value <= max : true;
                })}
                style={{ border: "2px solid #e5e7eb" }}
              />
            </div>
            <div className="relative w-full">
              <Select
                value={createPostForm.values.levelMemberMax}
                placeholder="Trình độ tối đa"
                className="input-post w-full"
                onChange={handleLevelMemberMaxChange}
                options={memberLevels.filter((memberLevel) => {
                  const min = createPostForm.values.levelMemberMin;
                  return min ? memberLevel.value >= min : true;
                })}
              />
            </div>
          </div>

          <div className="text-md text-black-ish-200 font-semibold">
            Thời gian:
          </div>
          <div className="flex grid-cols-2 flex-col gap-4 sm:grid">
            <div className="relative w-full">
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
            <div className="relative w-full">
              <DatePicker
                className="custom-date-picker"
                format={{ format: "DD-MM-YYYY" } as any}
                disabledDate={disabledDate}
                placeholder="Ngày diễn ra"
                inputReadOnly
                style={{ width: "100%", height: "65px" }}
                onChange={(d, s) => handleDateChange(d as Dayjs)}
              />
              {createPostForm.touched.date && createPostForm.errors.date && (
                <small className="text-danger">{`*${createPostForm.errors.date}`}</small>
              )}
            </div>
          </div>

          <div className="text-md text-black-ish-200 font-semibold">
            Phí giao lưu:
          </div>
          <div className="flex grid-cols-3 flex-col gap-4 sm:grid">
            <div className="relative w-full">
              <input
                placeholder="Từ"
                className="peer w-full rounded-md border-2 bg-white p-4 pl-4 pt-6 outline-none transition disabled:cursor-not-allowed disabled:opacity-70"
                type="number"
                min={1}
                name="priceMin"
                value={createPostForm.values.priceMin}
                onChange={createPostForm.handleChange}
                disabled={disablePriceInput}
              />
            </div>
            <div className="relative w-full">
              <input
                placeholder="Đến"
                className="peer w-full rounded-md border-2 bg-white p-4 pl-4 pt-6 outline-none transition disabled:cursor-not-allowed disabled:opacity-70"
                type="number"
                min={1}
                name="priceMax"
                value={createPostForm.values.priceMax}
                onChange={createPostForm.handleChange}
                disabled={disablePriceInput}
              />
            </div>
            <div className="agreed-checkbox-container relative w-full">
              <p className="text-[14px]">Or</p>
              <input
                className="agreed-checkbox"
                type="checkbox"
                checked={createPostForm.values.agreement}
                onChange={handleAgreementChange}
              />
              <div className="text-md">Thỏa thuận</div>
            </div>
          </div>
        </div>

        <div className="relative flex w-full flex-col gap-4 md:w-2/5">
          <div className="text-black-ish-200 text-lg font-semibold">
            Thông tin liên hệ
          </div>
          <div className="relative w-full">
            <CustomDynamicForm values={phones} setValues={setPhones} />
          </div>

          <div className="text-black-ish-200 mt-2 text-lg font-semibold">
            Hình ảnh mô tả
          </div>
          <div className="flex flex-wrap gap-3">
            <PicturesWall
              fileList={fileList}
              setFileList={setFileList}
              maxCount={10}
            />
          </div>

          <div className="mt-2 justify-center md:flex">
            <div className="flex w-full justify-end gap-4 sm:w-1/2 lg:w-2/3">
              <button
                id="cancel-post"
                type="button"
                className="bg-primary text-md relative w-full rounded-lg border-2 border-black bg-white py-3 font-semibold text-black transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-70"
                onClick={() => navigate(-1)}
              >
                Hủy
              </button>
              <button
                id="submit-post"
                type="submit"
                disabled={createPostForm.isSubmitting}
                className="ant-btn-primary border-primary text-md relative w-full rounded-lg border-2 py-3 font-semibold text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {createPostForm.isSubmitting ? "Đang gửi..." : "Đăng tin"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
