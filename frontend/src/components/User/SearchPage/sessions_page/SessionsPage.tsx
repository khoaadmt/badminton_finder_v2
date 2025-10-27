import { useEffect, useState } from "react";
import { PaginationComponent } from "../pagination/Pagination";
import { useSearchParams } from "react-router-dom";
import { Post_options } from "../header/PostOptions";
import { PostCard } from "../../Posts/PostCard";
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
    const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
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
        console.log("filterOptions :", filterOptions);
        getLocation().then((res) => {
            postService
                .getPostByFilter(filterOptions, pageNumber, location, "", res.latitude, res.longitude)
                .then((res) => {
                    if (res.data.length == 0) {
                        message.info("không có bài viết nào !");
                    }
                    setData(res.data.rows);

                    setTotalPosts(res.data.totalPosts);
                });
        });
    }, [filterOptions, pageNumber, searchParams]);

    useEffect(() => {
        setPageNumber(1);
    }, [filterOptions]);

    return (
        <div className="sessions-content-page min-h-screen flex gap-4">
            <div className="relative w-full">
                <Post_options setFilterOptions={setFilterOptions} />
                <div className="relative w-screen min-h-screen sm:w-full sm:min-h-full transition-all z-[9] sm:static bg-white rounded-xl top-[calc(100vh - 192px)]">
                    <div className="py-[15px] pl-[42px]">
                        <span className="text-lg sm:text-xl font-semibold">
                            {data ? `Tìm thấy ${totalPosts} bài viết` : "Không tìm thấy sân đấu nào"}
                        </span>
                    </div>
                    <div className="px-[40px] grid gap-2 grid-cols-1 md:grid-cols-2">
                        {data &&
                            data?.map((post) => {
                                return <PostCard key={post._id} post={post} />;
                            })}
                    </div>

                    {/* PAGINATION */}
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
