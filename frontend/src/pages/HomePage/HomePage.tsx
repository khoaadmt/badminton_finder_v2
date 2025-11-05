import React from "react";
import { InputSearch } from "../../components/InputSearch/InputSearch";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../interface";
import { setSuccessState } from "../../redux/authSlice";
import { createAxios } from "../../utils/api/createInstance";
import "./HomePage.css";
import { IMAGES } from "../../utils/Constant";

export const HomePage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, setSuccessState);
  // useEffect(() => {
  //     const getData = async () => {
  //         const res = await axiosJWT.post(
  //             "http://localhost:5000/api/auth/logout",
  //             {},
  //             {
  //                 headers: { Authorization: `Bearer ${user?.accessToken}` },
  //             }
  //         );
  //         return res;
  //     };
  //     getData().then((data) => {
  //         console.log(data);
  //     });
  // });
  return (
    <>
      <div
        className="home-page-content"
        style={{
          backgroundImage: `url(${IMAGES.background_image_home})`,
        }}
      >
        <div className="title-container">
          <p className="title-home-page">Giao Luu Cau Long .com</p>
          <p className="description-home-page">
            tìm kiếm cơ hội giao lưu gần bạn
          </p>
        </div>
        <div className="input-search-home-page">
          <InputSearch />
        </div>
      </div>
    </>
  );
};
