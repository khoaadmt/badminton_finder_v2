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
}

interface Props {
    setCoordinates: React.Dispatch<React.SetStateAction<Coordinates>>;
    setAddress: React.Dispatch<React.SetStateAction<string>>;
    defaultvalue: string | undefined | null;
}
export const AutoCompleteLocation: React.FC<Props> = (props) => {
    const { setCoordinates, setAddress, defaultvalue } = props;
    const [options, setOptions] = useState<Options[]>([]);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        if (inputValue) {
            axios
                .get(
                    `https://rsapi.goong.io/place/autocomplete?input=${inputValue}&api_key=TdpeykZUUxLdwjL0YR7ygbi0G8Jmk3TjBn8nkCuG`
                )
                .then((response) => {
                    const locations = response.data.predictions;
                    const options = locations.map((location: any) => {
                        return {
                            value: location.description,
                            place_id: location.place_id,
                        };
                    });
                    setOptions(options);
                })
                .catch((error) => {
                    console.log("error :", error);
                });
        }
    }, [inputValue]);

    const handleOnChange = (value: string) => {
        setInputValue(value);
    };

    const handOnSelect = (value: string, option: any) => {
        setAddress(value);
        const placeId = option.place_id;
        axios
            .get(`https://rsapi.goong.io/geocode?place_id=${placeId}&api_key=TdpeykZUUxLdwjL0YR7ygbi0G8Jmk3TjBn8nkCuG`)
            .then((response) => {
                const location = response.data.results[0].geometry.location;
                setCoordinates({ lat: location.lat, lng: location.lng });
            })
            .catch((error) => {
                console.log("Error fetching coordinates: ", error);
            });
    };
    return (
        <AutoComplete
            options={options}
            placeholder="Nhập địa chỉ"
            filterOption={(inputValue, option) => option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
            onChange={handleOnChange}
            onSelect={handOnSelect}
            defaultValue={defaultvalue}
        />
    );
};
