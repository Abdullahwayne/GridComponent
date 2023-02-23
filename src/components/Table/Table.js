import { UsergroupAddOutlined } from '@ant-design/icons';
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd';
import { useState } from 'react';
 
const onChange = (pagination, filters, sorter, extra) => {
  console.log('params', sorter,filters, "COming");
};


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
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
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
  const [originData, setOriginData] = useState( [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
    },
    {
      key: '4',
      name: 'Jim Red',
      age: 32,
      address: 'London No. 2 Lake Park',
    },
  ])
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record) => record.key === editingKey;
  const handleDelete = (key) => {
    const newData = originData.filter((item) => item.key !== key);
    setOriginData(newData);
  };
  
  
  function sortDataByGroup(key) {
    const newData = [...originData].sort((a, b) => a.name.localeCompare(b.name));
    setOriginData(newData);
  }
  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey('');
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  const columns = [
    {
      title: "NO",
      dataIndex: "id",
      key: "id",
      width: "15%",
      sorter: (a, b) => a.id - b.id,
      render: (data, index, element) => {
        return <p onClick={console.log(element)}>{element + 1}</p>
      },
    },
    {
      title: 'name',
      dataIndex: 'name',
      width: '30%',
      // sorter: (a, b) => a.name - b.name,
     
      
            editable: true,
    },
    {
      title: 'age',
      dataIndex: 'age',
      width: '10%',
      sorter: (a, b) => a.age - b.age,
      editable: true,
    },
    
    {
      title: 'address',
      dataIndex: 'address',
      // sorter: (a, b) => a.address - b.address,
      onHeaderCell: (column) => {
        <></>
      },

      width: '40%',
      editable: true,
    },
    
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
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
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) =>
      originData.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key) }>
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
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