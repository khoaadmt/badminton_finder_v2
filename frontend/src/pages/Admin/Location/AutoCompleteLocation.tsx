import { AutoComplete } from "antd";
import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import "./index.css";

type Coordinates = {
  lat: string;
  lng: string;
} | null;

interface Options {
  value: string;
  label: string;
  place_id?: string;
}

interface Props {
  setCoordinates: React.Dispatch<React.SetStateAction<Coordinates>>;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  defaultvalue?: string | null;
}

export const AutoCompleteLocation: React.FC<Props> = ({
  setCoordinates,
  setAddress,
  defaultvalue,
}) => {
  const [options, setOptions] = useState<Options[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!inputValue) return;

    const delayDebounce = setTimeout(() => {
      axios
        .get(
          `https://rsapi.goong.io/place/autocomplete?input=${encodeURIComponent(
            inputValue,
          )}&api_key=${process.env.REACT_APP_API_KEY_GOONG_MAP}`,
        )
        .then((response) => {
          const locations = response.data.predictions;
          const opts = locations.map((loc: any) => ({
            value: loc.description,
            place_id: loc.place_id,
          }));
          setOptions(opts);
        })
        .catch((error) => {
          console.error("Error fetching autocomplete:", error);
        });
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [inputValue]);

  const handleOnChange = (value: string) => {
    setInputValue(value);
  };

  const handleOnSelect = (value: string, option: any) => {
    setAddress(value);
    const placeId = option.place_id;
    axios
      .get(
        `https://rsapi.goong.io/geocode?place_id=${placeId}&api_key=${process.env.REACT_APP_API_KEY_GOONG_MAP}`,
      )
      .then((response) => {
        const location = response.data.results[0].geometry.location;
        setCoordinates({ lat: location.lat, lng: location.lng });
      })
      .catch((error) => {
        console.error("Error fetching coordinates:", error);
      });
  };

  return (
    <AutoComplete
      options={options}
      placeholder="Nhập địa chỉ"
      onChange={handleOnChange}
      onSelect={handleOnSelect}
      defaultValue={defaultvalue ?? ""}
      filterOption={(input, option) =>
        option!.value.toUpperCase().includes(input.toUpperCase())
      }
    />
  );
};
