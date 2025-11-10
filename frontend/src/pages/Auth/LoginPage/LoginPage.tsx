import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { passwordSchema, usernameSchema } from "../validationSchema";
import { loginUser, registerUser } from "../../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../interface";
import { DoubleLeftOutlined } from "@ant-design/icons";
import "./login-page.css";
var facebook_logo = require("../../../assets/images/facebook-logo.png");
var google_logo = require("../../../assets/images/google-logo.png");

export const LoginPage = () => {
  const [isSwitch, setIsSwitch] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isFetching = useSelector(
    (state: RootState) => state.auth.login.isFetching,
  );

  const singInForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      username: "khoaadmt",
      password: "khoaAa@123",
    },
    validationSchema: Yup.object({
      username: usernameSchema,
      password: passwordSchema,
    }),
    onSubmit: async (values) => {
      await loginUser(values, dispatch, navigate);
    },
  });

  const singUpForm = useFormik({
    initialValues: {
      username: "",
      displayName: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      username: usernameSchema,
      displayName: Yup.string()
        .required("Required")
        .min(4, "Must be 4 characters or more"),
      password: passwordSchema,
      confirmPassword: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("password"), ""], "passwords must match"),
    }),
    onSubmit: async (values) => {
      await registerUser(values, dispatch, navigate);
    },
  });

  // useEffect(() => {
  //   singInForm.setFieldValue("username", "khoaadmt123");
  //   singInForm.setFieldValue("password", "khoaAa@123");
  // }, []);

  const changeForm = (e: any) => {
    e.preventDefault();
    setIsSwitch(!isSwitch);
  };

  const HandleLoginWithFacebook = () => {
    console.log(
      "url:",
      `${process.env.REACT_APP_SERVER_URL}/api/auth/facebook/login`,
    );
    window.location.href = `${process.env.REACT_APP_SERVER_URL}/api/auth/facebook/login`;
  };

  const HandleLoginWithGoogle = () => {
    window.location.href = `${process.env.REACT_APP_SERVER_URL}/api/auth/google/login`;
    console.log(
      "url: ",
      `${process.env.REACT_APP_SERVER_URL}/api/auth/google/login`,
    );
  };
  const handleBtnHomeClick = () => {
    navigate("/");
  };

  return (
    <div className="login-page">
      <button
        onClick={handleBtnHomeClick}
        className="btn_home xl:w-[100px]"
        type="button"
      >
        <span>
          <DoubleLeftOutlined />
          Home
        </span>
      </button>
      <div className="main-login-page">
        <div className={`a-container ${isSwitch && "is-txl is-z200"} `}>
          <form className="form" onSubmit={singUpForm.handleSubmit}>
            <h2 className="form_title title">Create Account</h2>
            <input
              className="form__input"
              name="username"
              type="text"
              placeholder="user name"
              value={singUpForm.values.username}
              onChange={singUpForm.handleChange}
            />
            {singUpForm.errors.username && (
              <p className="text-danger">{`*${singUpForm.errors.username}`}</p>
            )}
            <div className="py-1"></div>
            <input
              className="form__input email"
              name="displayName"
              type="text"
              placeholder="display name"
              value={singUpForm.values.displayName}
              onChange={singUpForm.handleChange}
            />
            {singUpForm.errors.displayName && (
              <p className="text-danger">{`*${singUpForm.errors.displayName}`}</p>
            )}
            <div className="py-1"></div>
            <input
              className="form__input password"
              name="password"
              type="password"
              placeholder="password"
              value={singUpForm.values.password}
              onChange={singUpForm.handleChange}
            />
            {singUpForm.errors.password && (
              <p className="text-danger">{`*${singUpForm.errors.password}`}</p>
            )}
            <div className="py-1"></div>
            <input
              className="form__input password"
              name="confirmPassword"
              type="password"
              placeholder="confirm password"
              value={singUpForm.values.confirmPassword}
              onChange={singUpForm.handleChange}
            />
            {singUpForm.errors.confirmPassword && (
              <p className="text-danger">{`*${singUpForm.errors.confirmPassword}`}</p>
            )}

            <button className="form__button button submit" type="submit">
              SIGN UP
            </button>
          </form>
        </div>
        <div className={`b-container ${isSwitch && "is-txl"}`}>
          <form className="form" onSubmit={singInForm.handleSubmit}>
            <h2 className="title">Sign in to Website</h2>
            <p>or use your social account</p>
            <div className="form__icons">
              <div className="form__icon">
                <img
                  onClick={HandleLoginWithFacebook}
                  className="poiter"
                  alt="img"
                  src={facebook_logo}
                />
              </div>
              <div className="form__icon">
                <img
                  onClick={HandleLoginWithGoogle}
                  className="poiter"
                  alt="img"
                  src={google_logo}
                />
              </div>
            </div>

            <input
              className="form__input"
              name="username"
              type="text"
              placeholder="user name"
              value={singInForm.values.username}
              onChange={singInForm.handleChange}
            />
            {singInForm.errors.username && (
              <p className="text-danger">{`*${singInForm.errors.username}`}</p>
            )}
            <div className="py-1"></div>
            <input
              className="form__input"
              name="password"
              type="password"
              placeholder="Password"
              value={singInForm.values.password}
              onChange={singInForm.handleChange}
            />
            {singInForm.errors.password && (
              <p className="text-danger">{`*${singInForm.errors.password}`}</p>
            )}

            <button className="form__button button submit" type="submit">
              {isFetching && <i className="fas fa-spinner fa-pulse"></i>} SIGN
              IN
            </button>
          </form>
        </div>

        <div
          className={isSwitch ? "switch is-gx is-txr" : "switch"}
          id="switch-cnt"
        >
          <div className={`switch__circle ${isSwitch && "is-txr"}`}></div>
          <div
            className={`switch__circle switch__circle--t ${isSwitch && "is-txr"}`}
          ></div>
          <div
            className={`switch__container ${isSwitch && "is-hidden"}`}
            id="switch-c1"
          >
            <h2 className="switch__title title">Welcome Back !</h2>
            <p className="switch__description description">
              To keep connected with us please login with your personal info
            </p>
            <button
              onClick={changeForm}
              className="switch__button button switch-btn"
            >
              SIGN UP
            </button>
          </div>
          <div
            className={`switch__container ${!isSwitch && "is-hidden"}`}
            id="switch-c2"
          >
            <h2 className="switch__title title">Hello Friend !</h2>
            <p className="switch__description description">
              Enter your personal details and start journey with us
            </p>
            <button
              onClick={changeForm}
              className="switch__button button switch-btn"
            >
              SIGN IN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
