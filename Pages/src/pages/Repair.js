import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Popconfirm, Table } from 'antd';
import { Col, Row, Statistic, Divider, Tag, Card,Modal,Select } from 'antd';
import CountUp from 'react-countup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faPen, faL } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from 'react-redux'
import { getEmployees } from '../redux/slices/employeeSlice';
import { getProductsDetail, putProductsDetail } from '../redux/slices/productsDetailSlice';


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

  //Input Field Value
  const [system, setSystem] = useState({
    id: null,
    accessoriesId: null,
    brandId: null,
    productName: "",
    modelNumber: "",
    serialNumber: "",
    tags: "",
    isAssigned: false,
    isdeleted: false,
    isRepair: false,
    isStorage:false,
    officeLocationId:null,
    comments:""
  });
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const { employee, loading } = useSelector(state => state.employee);
  const [empData, setEmpData] = useState([]);

  const { productsDetail } = useSelector(state => state.productsDetail);

  const [proData, setProData] = useState([]);

  const [proCount, setProCount] = useState();

  const[isButtonEnabled,setIsButtonEnabled] = useState(false);

  const [SelectedIds,setSelectedIds]=useState([]);

  const [StorageModal,setStorageModal] = useState(false);

  const openStorageModal =()=> setStorageModal(true);

  const closeStorageModal =()=> setStorageModal(false);

  const [popConfirmRepairVisible, setPopConfirmRepairVisible] = useState(false);

  const [temporaryKey, setTemporaryKey] = useState([]);

  const { office } = useSelector((state) => state.office);

  const [LocationStatus,setLocationStatus] =useState(false)

  useEffect(() => {
    dispatch(getEmployees());
    dispatch(getProductsDetail());
  }, []);

  useEffect(() => {
    setEmpData(employee)
    setTableData(productsDetail);
    setProData(productsDetail);
    DataLoading();
  }, [employee, productsDetail]);

  async function DataLoading() {
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
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
    },
  ];

  //Columns that are appeared in the modal 
  const modalColumn = [
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
    {
      title: "Office Location",
      dataIndex: "officeLocationId",
      key: "officeLocationId",
    }
  ];

 const handleStorageConfirm = () => {
  setSystem({
    SNo: null,
    key: null,
    id: null,
    producttype: null,
    brand: null,
    productName: null,
    modelNumber: null,
    serialNumber: null,
    tags: null,
    isdeleted: false,
    isRepair: false,
    isStorage:false,
    isAssigned:false,
    officeLocationId:null,
    officeName:null,
    comments:null
  })
  openStorageModal();
  setPopConfirmRepairVisible(false);
  setSelectedRowKeys(temporaryKey);
  setTemporaryKey([]);
};

const handleStorageCancel = () => {
  setPopConfirmRepairVisible(false);
};

  const PostStorage =async ()=>{
    const ProductStorage= await productsDetail.filter(data=> SelectedIds.some(id=>id===data.id));
    console.log(ProductStorage);

    const updatedStorageDetails=await ProductStorage.map(data=>({
      id:data.id,
      accessoriesId:data.accessoriesId,
      brandId:data.brandId,
      productName:data.productName,
      modelNumber:data.modelNumber,
      serialNumber:data.serialNumber,
      createdDate:data.createdDate,
      createdBy:data.createdBy,
      modifiedDate:data.modifiedDate,
      modifiedBy:data.modifiedBy,
      isDeleted:data.isDeleted,
      isRepair:false,
      isAssigned:data.isAssigned,
      comments:data.comments,
      officeLocationId:system.officeLocationId,
      isStorage:true
    })
    );

    updatedStorageDetails.map(async data =>{
      await dispatch(putProductsDetail(data));
      await dispatch(getProductsDetail());
    });
    closeStorageModal();
    setIsButtonEnabled(false);
    
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
  const [tableData, setTableData] = useState([]);
  const TableDatas = tableData && tableData.length > 0 ? tableData.filter(data => data.isDeleted === false && data.isRepair === true).map((data, i) => ({
    SNo: i + 1,
    key: data.id,
    id: data.id,
    productName: data.productName,
    producttype: data.accessoryName,
    brand: data.brandName,
    modelNumber: data.modelNumber,
    serialNumber: data.serialNumber,
    tags: data.isAssigned,
    isDeleted: data.isDeleted,
    isAssigned: data.isAssigned,
    isStorage:data.isStorage,
    isRepair:data.isRepair,
    officeLocationId:data.officeLocationId,
    comments:data.comments
  })) : [];
  console.log(TableDatas);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange =async (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    await setSelectedRowKeys(newSelectedRowKeys);
    await setIsButtonEnabled(newSelectedRowKeys.length > 0);
    await setSelectedIds(newSelectedRowKeys);
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

  const officeOption = [
    { label: 'Not Assigned', value: null }, // Static option
    ...office.filter(ofc => !ofc.isdeleted).map(off => ({
      label: off.officename,
      value: off.id, // Assuming 'id' is the unique identifier for each office
    })),
  ];
  const [OptionClick,setOptionClick] = useState(false);
  const dropdownOffice =()=>{
    console.log("hi");
  }
  const officeNameDropdowninProduct = (data,value) =>{
    
    setOptionClick(true)
    setSystem((pre) =>({...pre,officeLocationId:value.value}));
    // setLocationStatus(true);
    if(value.value === null){
      setLocationStatus(false);
    }
    else{
      setLocationStatus(true);
    }
  }
  const selectedrowrepairData = TableDatas.filter(row => selectedRowKeys.includes(row.key));
  console.log(selectedrowrepairData);
  return (
    <div>
      <Row justify='space-between' align='middle'>
        <Col span={4}>
          <Card bordered={true}>
            <Statistic title="Product in Repair" value={proCount} formatter={formatter} valueStyle={{ color: "#3f8600" }} />
          </Card>
        </Col>
        <Col justify='flex-end' style={{ right: '1%' }} >
        <Popconfirm
            title="Are you sure you want to transfer the Products to Storage?"
            open={popConfirmRepairVisible}
            onConfirm={handleStorageConfirm}
            onCancel={handleStorageCancel}
            okText="Yes"
            cancelText="No"
          >
          <Button
          type="primary"  className="bg-blue-500 flex items-center gap-x-1float-right mb-3 mt-3"   
          open={StorageModal}
          onClick={()=>{
            setPopConfirmRepairVisible(true);
            setTemporaryKey(selectedRowKeys);
          }}
          disabled={!isButtonEnabled}
            >Send to Storage</Button>
           </Popconfirm>
        </Col>
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
       <Modal                                //Add to Repair Modal 
        title="Send to Storage"
        open={StorageModal}
        onCancel={closeStorageModal}
        width={"1200px"}
        footer={[
          <Button key="1" 
          onClick={PostStorage}
          >
            Send
          </Button>,
          <Button
            type="text"
            key="2"
            danger="red"
            style={{ border: "0.5px solid red" }}
            onClick={() => closeStorageModal()}
          >
            Cancel
          </Button>
        ]}>
        <div style={{ display: "flex", flexDirection: "column"}}>
    <div style={{ marginBottom: "16px", display: "flex", justifyContent: "flex-end" }}>
    <Select
      style={{ width: "20%" }}
      placeholder="Change Office Location"
      options={officeOption}
      // value={system.officeLocationId}
      onChange={officeNameDropdowninProduct}
    />
    </div>
  </div>
      <Table 
      columns={modalColumn}
      dataSource={selectedrowrepairData}
      pagination={{
        pageSize: 6,
      }}  
      >
      </Table>
      </Modal>

    </div>
  );
};

export default Repair;