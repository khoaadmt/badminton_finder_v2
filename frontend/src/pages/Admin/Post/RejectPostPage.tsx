import { useEffect, useState } from "react";
import { PostCard } from "./PostCard";
import { Post } from "../../../interface";
import PostService from "../../../services/post/PostService";
import { message } from "antd";

export const RejectPostPage = () => {
  const [posts, setPosts] = useState<Post[] | null>();
  const postService = new PostService();
  const [changeStatusPost, setChangeStatusPost] = useState(0);
  useEffect(() => {
    postService
      .getPostByStatus("reject")
      .then((res) => {
        setPosts(res.data.posts);
      })
      .catch((err) => {
        console.log(err);
        message.error("Có lỗi khi lấy dữ liệu bài viết đã từ chối từ server");
      });
  }, [changeStatusPost]);
  return (
    <div className="mx-auto mb-5 max-w-[884px] sm:mt-5 sm:px-3">
      {posts?.map((post) => (
        <PostCard
          postDetail={post}
          status={"reject"}
          setChangeStatusPost={setChangeStatusPost}
        />
      ))}
    </div>
  );
};
