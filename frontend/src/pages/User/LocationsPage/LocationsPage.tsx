import React, { useEffect, useState } from "react";

import { useSearchParams } from "react-router-dom";
import { BadmintonVenue } from "../../../interface";
import LocationService from "../../../services/location/LocationService";
import { LocationCard } from "./components/LocationCard";
import { PaginationComponent } from "./components/Pagination";
import { getLocation } from "../../../utils/location";

export const LocationsPage: React.FC = () => {
  const [data, setData] = useState<BadmintonVenue[] | null>();
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
    <div className="flex min-h-screen gap-4">
      <div className="relative w-full">
        <div className="top-[calc(100vh - 192px)] relative z-[9] min-h-screen w-screen rounded-xl bg-white transition-all sm:static sm:min-h-full sm:w-full">
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
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M872 474H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h720c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path>
              </svg>
            </button>
          </div>

          <div className="py-[15px] pl-[42px]">
            <span className="text-lg font-semibold sm:text-xl">
              {data
                ? `Tìm thấy ${totalFacility} sân đấu`
                : "Không tìm thấy sân đấu nào"}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2 px-[40px] md:grid-cols-2">
            {data?.map((location) => {
              return (
                <LocationCard key={location.name} badmintonVenue={location} />
              );
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
