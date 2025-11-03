import React, { useEffect, useState } from "react";

import { useSearchParams } from "react-router-dom";
import { FacilitiesCard } from "./FacilitiesCard";
import { PaginationComponent } from "../Pagination/Pagination";
import { Facility } from "../../../../interface";
import LocationService from "../../../../services/location/LocationService";
import { getLocation } from "../../../../utils/location";

export const FacilitiesPage: React.FC = () => {
    const [data, setData] = useState<Facility[] | null>();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = searchParams.get("location");
    const [pageNumber, setPageNumber] = useState(1);
    const [totalFacility, setTotalFacility] = useState(0);
    const locationService = new LocationService();

    useEffect(() => {
        const params = {
            params: {
                city: location,
            },
        };
        locationService.countLocationsByCity(params).then((response) => {
            setTotalFacility(response.data.count);
        });
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
            .then((resolve) => {
                getData(resolve.latitude, resolve.longitude).then((res) => {
                    if (res.data) {
                        setData(res.data);
                        console.log(res);
                    }
                });
            })
            .catch((error) => {
                console.log("error :", error);
            });

        async function getData(latitude: number, longitude: number) {
            const params = {
                params: {
                    city: location,
                    page: pageNumber,
                    latitude: latitude,
                    longitude: longitude,
                },
            };
            const res = await locationService.getLocationByCity(params);
            return res;
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen flex gap-4">
            <div className="relative w-full">
                <div className="relative w-screen min-h-screen sm:w-full sm:min-h-full transition-all z-[9] sm:static bg-white rounded-xl top-[calc(100vh - 192px)]">
                    <div className="flex justify-center sm:hidden">
                        <button>
                            <svg
                                stroke="currentColor"
                                fill="currentColor"
                                strokeWidth="0"
                                viewBox="0 0 1024 1024"
                                className="fill-[#c6c6c6]"
                                height="32"
                                width="32"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M872 474H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h720c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path>
                            </svg>
                        </button>
                    </div>
                    <div className="sm:hidden pb-[15px] w-full text-center relative -top-1">
                        <span className="text-sm">Tìm thêm hoạt động</span>
                    </div>
                    <div className="py-[15px] pl-[42px]">
                        <span className="text-lg sm:text-xl font-semibold">
                            {data ? `Tìm thấy ${totalFacility} sân đấu` : "Không tìm thấy sân đấu nào"}
                        </span>
                    </div>
                    <div className="px-[40px] grid gap-2 grid-cols-1 md:grid-cols-2">
                        {data?.map((facility) => {
                            return <FacilitiesCard key={facility.name} facility={facility} />;
                        })}
                    </div>

                    {/* PAGINATION */}
                    <PaginationComponent
                        pageNumber={pageNumber}
                        setPageNumber={setPageNumber}
                        totalFacility={totalFacility}
                    />
                </div>
            </div>
        </div>
    );
};
