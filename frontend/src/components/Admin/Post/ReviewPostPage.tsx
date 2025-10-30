import { useEffect, useState } from "react";
import { PostCard } from "./PostCard";
import { Post } from "../../../interface";
import PostService from "../../../services/post/PostService";
import { message } from "antd";

export const ReviewPostPage = () => {
    const [posts, setPosts] = useState<Post[] | null>();
    const postService = new PostService();
    const [changeStatusPost, setChangeStatusPost] = useState(0);

    useEffect(() => {
        postService
            .getPostByStatus("pending")
            .then((res) => {
                setPosts(res.data.posts);
            })
            .catch((err) => {
                console.log(err);
                message.error("Có lỗi khi lấy dữ liệu bài viết đã duyệt từ server");
            });
    }, [changeStatusPost]);
    return (
        <div className="max-w-[884px] sm:px-3 mx-auto mb-5 sm:mt-5">
            {posts?.map((post) => (
                <PostCard
                    key={post.id}
                    postDetail={post}
                    status={"pending"}
                    setChangeStatusPost={setChangeStatusPost}
                />
            ))}
        </div>
    );
};
