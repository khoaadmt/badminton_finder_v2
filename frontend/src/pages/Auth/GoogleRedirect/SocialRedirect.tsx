import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginWithSocial } from "../../../redux/apiRequest";
import { useDispatch } from "react-redux";

export const SocialRedirect: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        const token = {
            accessToken: accessToken || "",
            refreshToken: refreshToken || "",
        };
        loginWithSocial(token, dispatch, navigate);
    }, []);
    return <div>Hello window!</div>;
};
