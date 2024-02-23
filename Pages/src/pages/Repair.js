import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Popconfirm, Table } from 'antd';
import { Col, Row, Statistic, Divider,Tag,Card } from 'antd';
import CountUp  from 'react-countup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faPen, faL } from "@fortawesome/free-solid-svg-icons";
import {useSelector,useDispatch} from 'react-redux'
import { getEmployees } from '../redux/slices/employeeSlice';


const formatter = (value) => <CountUp end={value} />;

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};


const Repair = () => {
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const {employee,loading} = useSelector(state => state.employee);
  const [empData,setEmpData] = useState([]);

  const {productsDetail} = useSelector(state => state.productsDetail);

  const [proData,setProData] = useState([]);

  const [proCount,setProCount] = useState();

  useEffect(()=>{
    dispatch(getEmployees());
  },[])

  useEffect(()=>{
    setEmpData(employee)
    setTableData(productsDetail);
    setProData(productsDetail);
    DataLoading();
  },[employee,productsDetail]);

  async function DataLoading(){
  const filteredProducts = await productsDetail.filter((products) => products.isDeleted === false && products.isRepair === true);
  console.log(filteredProducts);
  setProCount(filteredProducts.length);
  }
  
  const [dataSource, setDataSource] = useState([
    {
      key: '0',
      name: 'Laptop',
      age: '2',
      address: 'Chennai',
    },
    {
      key: '1',
      name: 'Mouse',
      age: '1',
      address: 'Bangalore',
    },
  ]);
  const [count, setCount] = useState(2);
  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };
  // const defaultColumns = [
  //   {
  //     title: 'Name',
  //     dataIndex: 'name',
  //     width: '25%',
  //     editable: true,
  //   },
  //   {
  //     title: 'Count',
  //     dataIndex: 'age',
  //     width: '25%',
  //     editable: true,
  //   },
  //   {
  //     title: 'address',
  //     dataIndex: 'address',
  //     width: '25%',
  //     editable: true,
  //   },
  //   {
  //     title: 'operation',
  //     dataIndex: 'operation',
  //     render: (_, record) =>
  //       dataSource.length >= 1 ? (
  //         <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
  //           <a>Delete</a>
  //         </Popconfirm>
  //       ) : null,
  //   },
  // ];
  const defaultColumns = [
    {
      title: "S.No",
      dataIndex: "SNo",
      key: "SNo"
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Product Type",
      dataIndex: "producttype",
      key: "producttype",
      render: (text) => <a>{text}</a>,
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return (
          String(record.productName)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.producttype)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.brand).toLowerCase().includes(value.toLowerCase()) ||
          String(record.modelNumber)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.serialNumber)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.tags).toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Model",
      dataIndex: "modelNumber",
      key: "modelNo",
    },
    {
      title: "Serial Number",
      dataIndex: "serialNumber",
      key: "serialNumber",
    },
    // {
    //   title: "Status",
    //   key: "tags",
    //   dataIndex: "tags",
    //   render: (x, text) => (
    //     <>
    //       {text.tags === false ? <Tag color="red">Not Assigned</Tag> : <Tag color="green">Assigned</Tag>}
    //     </>
    //   ),
    // },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <div className="flex gap-x-2">
    //       <Popconfirm
    //         title="Are you sure to delete this?"
    //         okText="Yes"
    //         cancelText="No"
    //         okButtonProps={{
    //           style: { backgroundColor: "red", color: "white" },
    //         }}
    //       // onConfirm={() => DeleteIcon(record)}
    //       >
    //         <Button >
    //           <FontAwesomeIcon icon={faTrash} />
    //         </Button>
    //       </Popconfirm>

    //       {/* <Button >
    //         <FontAwesomeIcon icon={faPen} />
    //       </Button> */}
    //     </div>
    //   ),
    // },
  ];
  const handleAdd = () => {
    const newData = {
      key: count,
      name: `Enter Product Name`,
      age: 'Enter Count',
      address: `Enter Address`,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
const [tableData,setTableData] = useState([]);
  const TableDatas= tableData && tableData.length > 0 ? tableData.filter(data => data.isDeleted ===false && data.isRepair ===true).map((data,i)=> ({
    SNo: i + 1,
    key:data.id,
    id:data.id,
    productName: data.productName,
    producttype: data.accessoryName,
    brand: data.brandName,
    modelNumber: data.modelNumber,
    serialNumber: data.serialNumber,
    tags: data.isAssigned,
    isDeleted:false,
    isAssigned:false
  })):[];
  console.log(TableDatas);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  return (
    <div>
      <Row justify='space-between' align='middle'>
      <Col span={4}>
          <Card bordered={true}>
      <Statistic title="Product in Repair" value={proCount} formatter={formatter} valueStyle={{ color: "#3f8600" }}/>
      </Card>
      </Col>
      <Col justify='flex-end' style={{right :'1%'}}><Button onClick={handleAdd} type="primary" >Send to Storage</Button></Col>
      </Row>
      <Divider />
      <Table
      rowSelection={rowSelection}
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={TableDatas}
        columns={columns}
      />
      
    </div>
  );
};

export default Repair;