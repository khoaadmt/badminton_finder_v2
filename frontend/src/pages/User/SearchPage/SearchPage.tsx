import { Footer } from "antd/es/layout/layout";
import { SearchPageHeader } from "./header/SearchPageHeader";
import { useSearchParams } from "react-router-dom";
import { Outlet } from "react-router-dom";

export const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = searchParams.get("location");
    const type = searchParams.get("type");

    return (
        <>
            <SearchPageHeader defaultSelectedKeys={"2"} />
            <Outlet />
        </>
    );
};
