import { useEffect, useState } from "react";
import { PostCard } from "./PostCard";
import { Post } from "../../../interface";
import PostService from "../../../services/post/PostService";

export const CheckedPostPage = () => {
    const [posts, setPosts] = useState<Post[] | null>();
    const postService = new PostService();
    const [changeStatusPost, setChangeStatusPost] = useState(0);
    useEffect(() => {
        postService.getPostByStatus("checked").then((res) => {
            setPosts(res.data.posts);
        });
    }, [changeStatusPost]);
    return (
        <div className="max-w-[884px] sm:px-3 mx-auto mb-5 sm:mt-5">
            {posts?.map((post) => (
                <PostCard postDetail={post} status={"checked"} setChangeStatusPost={setChangeStatusPost} />
            ))}
        </div>
    );
};
