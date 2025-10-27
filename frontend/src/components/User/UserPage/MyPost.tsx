import { useEffect, useState } from "react";
import { SearchPageHeader } from "../SearchPage/header/SearchPageHeader";

import { useSelector } from "react-redux";

import { MyFooter } from "../../Footer/Footer";
import { CarryOutOutlined } from "@ant-design/icons";
import PostService from "../../../services/post/PostService";
import { Facility, Post, RootState } from "../../../interface";
import { MyPostCard } from "./MyPostCard";

export const MyPost = () => {
    const [posts, setPosts] = useState<Post[] | undefined>();
    const postService = new PostService();
    const user = useSelector((state: RootState) => state.auth.login.currentUser);

    useEffect(() => {
        if (user) {
            postService.getPostByUserName(user?.username).then((res) => {
                setPosts(res.data);
            });
        }
    }, []);
    return (
        <div className="bg-gray-100">
            <SearchPageHeader defaultSelectedKeys="" />
            <div className="booked-court-title">
                <CarryOutOutlined /> Bài viết đã đăng
            </div>

            <div className="max-w-[884px] sm:px-3 mx-auto mb-5 sm:mt-5">
                {posts?.map((post) => {
                    return <MyPostCard postDetail={post} />;
                })}
            </div>
        </div>
    );
};
