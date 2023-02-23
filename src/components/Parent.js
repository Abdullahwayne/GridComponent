import { Table } from "antd";
import React, { useEffect } from "react";
import CustomTable from "./Table/Table";
import sampleData from "../Assets/data.json";
const Parent = () => {
  return (
    <div>
      {Object.keys(sampleData).map((item, index) => {
        return <CustomTable dataSet={sampleData[item]} title={item} />;
      })}
    </div>
  );
};

export default Parent;
