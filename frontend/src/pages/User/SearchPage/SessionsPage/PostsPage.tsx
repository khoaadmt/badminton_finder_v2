import { useEffect, useState } from "react";
import { PaginationComponent } from "../../LocationsPage/components/Pagination";
import { useSearchParams } from "react-router-dom";
import { Post_options } from "../header/PostOptions";
import { PostCard } from "../../PostsPage/PostCard";
import { message } from "antd";
import { useSelector } from "react-redux";
import { Post, FilterOptions, RootState } from "../../../../interface";
import PostService from "../../../../services/post/PostService";
import { getLocation } from "../../../../utils/location";

export const SessionsPage = () => {
  const [latitude, setLat] = useState<number | null>(null);
  const [longitude, setLong] = useState<number | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPosts, setTotalPosts] = useState(5);
  const [data, setData] = useState<Post[] | null>();
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(
    null,
  );
  const location = searchParams.get("location");
  const user = useSelector((state: RootState) => state.auth.login.currentUser);

  const postService = new PostService();

  useEffect(() => {
    const getLocation = () => {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      });
    };

    getLocation();
  }, []);

  useEffect(() => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set("page", pageNumber.toString());
      return newParams;
    });
  }, [pageNumber]);

  useEffect(() => {
    getLocation()
      .then((res) => {
        postService
          .getPostByFilter(
            filterOptions,
            pageNumber,
            location,
            "",
            res.latitude,
            res.longitude,
          )
          .then((res) => {
            if (!res.data) {
              message.info("không có bài viết nào !");
            } else {
              setData(res.data.rows);

              setTotalPosts(res.data.totalPosts);
            }
          })
          .catch((error) => {
            console.log("Có lỗi khi lấy dữ liệu từ server.");
          });
      })
      .catch((error) => {
        console.log("Có lỗi khi lấy dữ liệu từ server.");
      });
  }, [filterOptions, pageNumber, searchParams]);

  useEffect(() => {
    setPageNumber(1);
  }, [filterOptions]);

  return (
    <div className="sessions-content-page flex min-h-screen gap-4">
      <div className="relative w-full">
        <Post_options setFilterOptions={setFilterOptions} />
        <div className="top-[calc(100vh - 192px)] relative z-[9] min-h-screen w-screen rounded-xl bg-white transition-all sm:static sm:min-h-full sm:w-full">
          <div className="py-[15px] pl-[42px]">
            <span className="text-lg font-semibold sm:text-xl">
              {data
                ? `Tìm thấy ${totalPosts} bài viết`
                : "Không tìm thấy sân đấu nào"}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2 px-[40px] md:grid-cols-2">
            {data &&
              data?.map((post) => {
                return <PostCard key={post.id} post={post} />;
              })}
          </div>

          <PaginationComponent
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            totalFacility={totalPosts}
          />
        </div>
      </div>
    </div>
  );
};
