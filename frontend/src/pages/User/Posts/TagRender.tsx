import { Tag } from "antd";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";
import React from "react";

export const TagRender = (props: CustomTagProps) => {
    const { label, value, closable, onClose } = props;
    let color;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };
    if (value === 1) {
        color = "#f50";
    } else {
        color = "#108ee9";
    }
    return (
        <Tag className="tag-post" color={color} onMouseDown={onPreventMouseDown} closable={closable} onClose={onClose}>
            {label}
        </Tag>
    );
};
