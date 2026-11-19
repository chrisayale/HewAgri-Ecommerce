import { Spin } from "antd";
import React from "react";
import "./style.css";

const SpinLoader = () => {
  return (
    <Spin tip="Chargement" style={{ color: "#16A34A" }}>
      <div
        className="w-[185px] h-[185px] flex justify-center items-center"
        style={{ color: "#16A34A" }}
      />
    </Spin>
  );
};

export default SpinLoader;
