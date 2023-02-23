import { Form, Input, InputNumber, Popconfirm, Select, Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import MyData from "../../Assets/data.json";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const CustomTable = (props) => {
  const { dataSet, title } = props;
  const [form] = Form.useForm();
  const [originData, setOriginDate] = useState([]);
  const [data, setData] = useState(dataSet);
  const [fieldOne, setFieldOne] = useState("name");
  const [fieldTwo, setFeldTwo] = useState("");
  const [filteredData, setFilteredData] = useState("");
  const [filterOptions, setFilterOptions] = useState([]);

  MyData.data = dataSet;
  const [editingtableID, setEditingtableID] = useState("");
  const isEditing = (record) => {
    if (record === editingtableID) return true;
    return false;
  };

  const addingTableId = () => {
    MyData.data.map((item, i) => {
      item.tableID = i + 1;
    });
  };

  const handleDelete = (tableID) => {
    const newData = data.filter((item) => item.tableID !== tableID);
    setData(newData);
  };
  // function sortDataByGroup(tableID) {
  //   const newData = [...originData].sort((a, b) => a.name.localeCompare(b.name));
  //   setOriginData(newData);
  // }
  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      id: "",
      fieldOne: "",
      fieldTwo: "",
      fieldThree: "",
      ...record,
    });
    setEditingtableID(record.tableID);
  };
  const cancel = () => {
    setEditingtableID("");
  };
  const save = async (tableID) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => tableID === item.tableID);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingtableID("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingtableID("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = Object.keys(MyData.data[0]).map((item, index) => {
    addingTableId();
    return {
      title:
        typeof item === "object"
          ? item.name.charAt(0).toUpperCase() + item.name.slice(1)
          : item.charAt(0).toUpperCase() + item.slice(1),
      dataIndex: item,
      width: 100,
      sorter: (a, b) => a.name - b.name,
      editable: item === "tableID" ? false : true,
    };
  });

  columns.push({
    title: "Action",
    width: 100,
    dataIndex: "",
    tableID: "x",
    render: (_, record) =>
      data.length >= 1 ? (
        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.tableID)}>
          <a
            onClick={() => {
              console.log(record, "record");
            }}
          >
            Delete
          </a>
        </Popconfirm>
      ) : null,
  });
  columns.push({
    title: "Action",
    dataIndex: "edit",
    width: 100,
    render: (_, record) => {
      const editable = isEditing(record.tableID);
      return editable ? (
        <span>
          <Typography.Link
            onClick={() => save(record.tableID)}
            style={{
              marginRight: 8,
            }}
          >
            Save
          </Typography.Link>
          <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
            <a>Cancel</a>
          </Popconfirm>
        </span>
      ) : (
        <Typography.Link disabled={editingtableID !== ""} onClick={() => edit(record)}>
          Edit
        </Typography.Link>
      );
    },
  });

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record.tableID),
      }),
    };
  });

  const onChange = (pagination, filters, sorter, extra) => {
    let names = data.map((item, index) => {
      return item[sorter.field];
    });
    let uniques = [...new Set(names)];
    let datam = [];
    for (let index = 0; index < uniques.length; index++) {
      const element = uniques[index];
      for (let indexTwo = 0; indexTwo < data.length; indexTwo++) {
        const elementTwo = data[indexTwo];
        if (element === elementTwo[sorter.field]) {
          datam.push(elementTwo);
        }
      }
    }
    setData(datam);
  };

  const setOptionsData = async () => {
    let data = Object.keys(MyData.data[0]).map((item, index) => {
      return { label: item, value: item };
    });
    setFilterOptions(data);
  };

  useEffect(() => {
    setOptionsData();
  }, []);

  return (
    <Form form={form} component={false}>
      <h1>{title}</h1>
      <Space wrap>
        <p style={{ fontWeight: "bolder" }}>Filter:</p>
        <Select
          value={fieldOne}
          onChange={(e) => {
            setFieldOne(e);
          }}
          defaultValue={""}
          style={{
            width: 120,
          }}
          options={filterOptions}
        />
      </Space>
      <Input
        value={fieldTwo}
        onChange={(e) => {
          console.log(e, "<===");
          setFeldTwo(e.target.value);
          console.log(data, "<== data");
          let newData = [];
          for (let index = 0; index < data.length; index++) {
            const element = data[index];
            if (element[fieldOne] === e.target.value) {
              newData.push(element);
            }
          }
          console.log(newData, "<=== new data");
          setFilteredData(newData);
        }}
        placeholder={""}
        style={{ width: "30%" }}
      />

      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={fieldTwo === "" ? data : filteredData}
        columns={mergedColumns}
        rowClassName="editable-row"
        onChange={onChange}
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};
export default CustomTable;
