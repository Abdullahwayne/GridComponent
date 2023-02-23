import { Table } from "antd";
import React from "react";
import CustomTable from "./Table/Table";
import sampleData from "../Assets/SampleData.json";
const Parent = () => {
  console.log(sampleData);
  return (
    <div>
      <CustomTable />
    </div>
  );
};

export default Parent;
