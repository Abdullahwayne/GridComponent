import { Table } from "antd";
import React, { useEffect, useState } from "react";
import CustomTable from "./Table/Table";
import sampleData from "../Assets/SampleData.json";
import { Tabs } from "antd";

const Parent = () => {
  const items = [
    {
      key: "1",
      label: `Tab 1`,
      children: `wow`,
    },
    {
      key: "2",
      label: `Tab 2`,
      children: `Content of Tab Pane 2`,
    },
    {
      key: "3",
      label: `Tab 3`,
      children: `Content of Tab Pane 3`,
    },
  ];
  const [data, setData] = useState([]);
  const setTabs = () => {
    console.log("i ran");
    let newData = [];
    for (let index = 0; index < Object.keys(sampleData).length; index++) {
      const element = Object.keys(sampleData)[index];
      console.log(element, "<===");
      console.log(sampleData[element], "<=== data");
      newData.push({
        key: (index + 1).toString(),
        label: element,
        children: <CustomTable dataSet={sampleData[element]} title={element} />,
      });
    }
    console.log(newData, ",=== new data");
    setData(newData);
  };
  const onChange = (key) => {
    console.log(key);
  };

  useEffect(() => {
    setTabs();
  }, []);

  return (
    <div>
      <Tabs defaultActiveKey="1" onChange={onChange} items={data} />
    </div>
  );
};

export default Parent;
