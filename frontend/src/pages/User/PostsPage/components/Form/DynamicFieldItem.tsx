import React from "react";
import { MinusCircleOutlined } from "@ant-design/icons";

interface Props {
    index: number;
    value: string;
    onChange: any;
    onRemove: any;
}
export const DynamicFieldItem: React.FC<Props> = (props) => {
    const { index, value, onChange, onRemove } = props;
    return (
        <div className="dynamic-form-input-container">
            <input
                id="test"
                className="p-2 dynamic-form-input"
                placeholder="Số điện thoại"
                type="text"
                name="phone"
                value={value}
                onChange={(e) => onChange(index, e)}
            />

            <MinusCircleOutlined className="dynamic-delete-button" onClick={() => onRemove(index)} />
        </div>
    );
};
