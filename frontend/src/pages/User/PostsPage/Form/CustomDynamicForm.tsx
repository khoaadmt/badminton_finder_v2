import React, { useState } from "react";

import "./index.css";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { DynamicFieldItem } from "./DynamicFieldItem";
interface Props {
    values: string[];
    setValues: React.Dispatch<React.SetStateAction<string[]>>;
}

export const CustomDynamicForm: React.FC<Props> = (props) => {
    const { values, setValues } = props;
    const addField = () => {
        setValues([...values, ""]);
    };

    const handleInputChange = (index: number, event: any) => {
        const newPhones = [...values];
        newPhones[index] = event.target.value;
        setValues(newPhones);
    };

    const handleRemoveField = (index: number) => {
        const newPhones = values.filter((_, i) => i !== index);

        setValues(newPhones);
    };
    return (
        <div className="dynamic-form-container">
            {values.map((value, index) => (
                <DynamicFieldItem
                    key={index}
                    index={index}
                    value={value}
                    onChange={handleInputChange}
                    onRemove={handleRemoveField}
                />
            ))}
            <Button type="dashed" onClick={addField} icon={<PlusOutlined />}>
                Add field
            </Button>
        </div>
    );
};
