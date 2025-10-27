import { Form, FormItemProps } from "antd";
import { ReactNode } from "react";

interface MyFormItemProps extends FormItemProps {
    children: ReactNode;
}

export const MyFormItem = ({ children, ...restProps }: MyFormItemProps) => {
    return (
        <Form.Item {...restProps} className="my-form-item">
            {children}
        </Form.Item>
    );
};
