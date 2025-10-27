import { Carousel } from "antd";
import React from "react";

export const Test = () => {
    const contentStyle: React.CSSProperties = {
        margin: 0,
        height: "160px",
        color: "#fff",
        lineHeight: "160px",
        textAlign: "center",
        background: "#364d79",
    };
    return (
        <div>
            <div className="h-[186px] sm:h-[300px] sm:rounded-xl overflow-hidden relative">
                <Carousel arrows infinite={false}>
                    <div>
                        <img
                            alt="Description image"
                            loading="lazy"
                            decoding="async"
                            className="object-cover cursor-pointer w-full"
                            style={contentStyle}
                            src="https://arrokflwjtkkchhzuiuz.supabase.co/storage/v1/object/public/courts/san_286_nguyen_xien_vatzuk/01ed06ec-1deb-46f8-8534-d9393fec7bc7"
                        />
                    </div>
                    <div>
                        <img
                            alt="Description image"
                            loading="lazy"
                            decoding="async"
                            className="object-cover cursor-pointer w-full"
                            style={contentStyle}
                            src="https://arrokflwjtkkchhzuiuz.supabase.co/storage/v1/object/public/courts/san_286_nguyen_xien_vatzuk/01ed06ec-1deb-46f8-8534-d9393fec7bc7"
                        />
                    </div>
                </Carousel>

                <div className="absolute bottom-[15px] right-[15px] bg-primary text-white rounded-full py-[2px] px-[12px]">
                    50,000 - 70,000
                </div>
            </div>
        </div>
    );
};
