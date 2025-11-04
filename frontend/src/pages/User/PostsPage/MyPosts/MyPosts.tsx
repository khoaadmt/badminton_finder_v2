import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CarryOutOutlined } from "@ant-design/icons";
import { MyPostCard } from "./MyPostCard";
import { Post, RootState } from "../../../../interface";
import PostService from "../../../../services/post/PostService";

export const MyPosts = () => {
  const [posts, setPosts] = useState<Post[] | undefined>();
  const postService = new PostService();
  const user = useSelector((state: RootState) => state.auth.login.currentUser);

  useEffect(() => {
    if (user) {
      postService.getPostByUserName(user?.username).then((res) => {
        setPosts(res.data.posts);
      });
    }
  }, []);

  return (
    <div className="bg-gray-100">
      <div className="booked-court-title">
        <CarryOutOutlined /> Bài viết đã đăng
      </div>

      <div className="mx-auto mb-5 max-w-[884px] sm:mt-5 sm:px-3">
        {posts?.map((post) => {
          return <MyPostCard postDetail={post} />;
        })}
      </div>
    </div>
  );
};
