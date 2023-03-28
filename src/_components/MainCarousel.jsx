import "./index.css"
import React from "react";
import { Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const styleDefaults = {
    height: "50vh",
    color: "white",
    fontSize: 100,
    textAlign: "center"
};

export function MainCarousel() {
    return (
        <div >
            <Carousel autoplay arrows prevArrow={<LeftOutlined/>} nextArrow={<RightOutlined/>}>
                <div>
                    <h3
                        style={{
                            backgroundColor: "red",
                            ...styleDefaults
                        }}
                    >
                        1
                    </h3>
                </div>
                <div>
                    <h3 style={{backgroundColor: "teal", ...styleDefaults}}>2</h3>
                </div>
                <div>
                    <h3 style={{backgroundColor: "yellow", ...styleDefaults}}>3</h3>
                </div>
                <div>
                    <h3 style={{backgroundColor: "blue", ...styleDefaults}}>4</h3>
                </div>
            </Carousel>
        </div>
    );
}

