import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
    const navigate = useNavigate();
    const handleBtnBackHomeClick = () => {
        navigate("/");
    };
    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={
                <Button onClick={handleBtnBackHomeClick} type="primary">
                    Back Home
                </Button>
            }
        />
    );
};
