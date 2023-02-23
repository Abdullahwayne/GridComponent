import { Form, Input, InputNumber, Popconfirm, Table, Typography } from "antd";
import { useState } from "react";
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
const CustomTable = () => {
  const [form] = Form.useForm();
  const [originData, setOriginDate] = useState([]);
  const [data, setData] = useState(MyData.data);
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
    console.log(newData, "data incoming", tableID, "tableID incoming");
    console.log(newData, "new data incoming");
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
      title: item.charAt(0).toUpperCase() + item.slice(1),
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
    console.log(col, "<==== col");
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
    console.log(columns, "<===");
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
    console.log(datam, "<=== final data");
  };
  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
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
