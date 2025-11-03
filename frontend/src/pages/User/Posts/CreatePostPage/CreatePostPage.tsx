import React from "react";
import { CreatePostContent } from "./CreatePostContent";
import { SearchPageHeader } from "../../SearchPage/header/SearchPageHeader";
import { Footer } from "antd/es/layout/layout";

export const CreatePostPage = () => {
    return (
        <>
            <SearchPageHeader defaultSelectedKeys={"4"} />
            <CreatePostContent />
            <Footer style={{ textAlign: "center" }}>
                <h1>Giao luu cau long .com</h1>
                Tìm kiếm cơ hội giao lưu gần bạn
            </Footer>
        </>
    );
};
