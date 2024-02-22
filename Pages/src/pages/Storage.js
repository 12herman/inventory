import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Popconfirm, Table, message } from 'antd';
import { Col, Row, Statistic, Divider, Tag ,Card} from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faPen, faL } from "@fortawesome/free-solid-svg-icons";
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { getProductStorageLocation, putProductStorageLocation } from '../redux/slices/productStorageLocationSlice';
import { getProductsDetail, postProductsDetail, putProductsDetail } from '../redux/slices/productsDetailSlice';

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

const Storage = ({ officeData }) => {


  const [searchText, setSearchText] = useState("");
  const [dataSource, setDataSource] = useState([
    {
      key: '0',
      name: 'Laptop',
      age: '5',
      address: 'Dell',
    },
    {
      key: '1',
      name: 'Monitor',
      age: '12',
      address: 'Hp',
    },
  ]);
  const [count, setCount] = useState(2);
  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };
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
      title: "Status",
      key: "tags",
      dataIndex: "tags",
      render: (x, text) => (
        <>
          {text.tags === false ? <Tag color="red">Not Assigned</Tag> : <Tag color="green">Assigned</Tag>}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-x-2">
          <Popconfirm
            title="Are you sure to delete this?"
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              style: { backgroundColor: "red", color: "white" },
            }}
          onConfirm={() => DeleteIcon(record)}
          >
            <Button >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </Popconfirm>

          {/* <Button >
            <FontAwesomeIcon icon={faPen} />
          </Button> */}
        </div>
      ),
    },
  ];
 
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
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 19);

  
  const DeleteIcon =async(id)=>{
    
   


    const PreviousValue = TableDatas.filter((pr) => selectedRowKeys.some(id => pr.id ===id));
    

    //true 
    const DeletedData = PreviousValue.map(data => ({
      id:data.id,
      productDetailsId:data.productDetailsId,
      officeLocationId:data.officeLocationId,
      isDeleted:true,
      isAssigned:data.isAssigned,
      createdDate:data.createdDate,
      createdBy:data.createdBy,
      modifiedDate:formattedDate,
      modifiedBy:data.modifiedBy
    }));

   await DeletedData.map(async data=>{
     await dispatch(putProductStorageLocation(data))
    });

    const DeletedIds =await DeletedData.map(data =>{
    return  data.productDetailsId
  });
    
  const productfl = await productsDetail.filter(data => data.isDeleted ===false);

    const UpdatedDeletedDatas =await productfl.filter(data => DeletedIds.some(id => data.id ===id));
    
   //updated datas 
   const UpdatedDates =await UpdatedDeletedDatas.map(data=>({
    id: data.id,
    accessoriesId: data.accessoriesId,
    brandId: data.brandId,
    productName: data.productName,
    modelNumber: data.modelNumber,
    serialNumber: data.serialNumber,
    isDeleted: false,
    isRepair: false,
    isAssigned: false,
    createdDate: data.createdDate,
    createdBy: data.createdBy,
    modifiedDate: formattedDate,
    modifiedBy: data.modifiedBy
   }));

  await UpdatedDates.map(async data=> {
    await dispatch(putProductsDetail(data));
  });
    // const DeleteData = {
    //   id:PreviousValue[0].id,
    //   productDetailsId:PreviousValue[0].productDetailsId,
    //   officelocationId:PreviousValue[0].officelocationId,
    //   productName:PreviousValue[0].productName,
    //   producttype:PreviousValue[0].producttype,
    //   brand:PreviousValue[0].brand,
    //   modelNumber:PreviousValue[0].modelNumber,
    //   serialNumber:PreviousValue[0].serialNumber,
    //   tags:PreviousValue[0].isAssigned,
    //   isDeleted:true,
    //   isAssigned:false,
    // }
    // console.log(DeleteData);
    // // await dispatch(putProductStorageLocation(DeleteData));
    // // dispatch(getProductStorageLocation());
    // message.success("Row Deleted Successfully!");

    // const SelectedIdinTable= productstoragelocation.filter((data) => data.id ===data.productDetailsId );
    
    // console.log(SelectedIdinTable);

    // const unAssignedRow = PreviousValue.map(data=> ({
    //   id: data.id,
    //   productName: data.productName,
    //   modelNumber: data.modelNumber,
    //   serialNumber: data.serialNumber,
    //   isDeleted: false,
    //   isRepair: false,
    //   isAssigned: false,
    //   createdDate: data.createdDate,
    //   createdBy: data.createdBy,
    //   modifiedDate: formattedDate,
    //   modifiedBy: data.modifiedBy
    // }));
    // console.log(unAssignedRow);

    // await unAssignedRow.map(data => {
    //   dispatch(postProductsDetail(data));
    // })
  };


  useEffect(() =>{
    dispatch(getProductStorageLocation());
  },[]);

  const dispatch = useDispatch();

  const { productstoragelocation } = useSelector(state => state.productstoragelocation);
  const {productsDetail} = useSelector(state=> state.productsDetail)

  const [storagelocData, setProLocData] = useState();

  const [storageLocationCount, setstorageLocationCount] = useState([]);

  const [tableData,setTableData] = useState([]);

  useEffect(() => {
    dispatch(getProductStorageLocation());
    dispatch(getProductsDetail());
  }, []);

  useEffect(() => {
    setProLocData(productstoragelocation);
    DataLoading();
  }, [productstoragelocation, officeData]);


  function DataLoading() {

    var numberOfOffice = officeData.filter((off) => off.isdeleted === false);
    
    var officeNames = numberOfOffice.map((off) => {
      return off.officename;
    });

    if (officeNames.length === 1) {
      const filterOneOffice = storagelocData ? storagelocData.filter(storage => storage.isDeleted === false && storage.officename ===officeNames[0]) :0;
      setstorageLocationCount(filterOneOffice.length);
      setTableData(filterOneOffice);
    }
    else{
      const filterAllOffice = storagelocData?storagelocData.filter(storage => storage.isDeleted === false):0;
      setstorageLocationCount(filterAllOffice.length);
      setTableData(filterAllOffice);

    }
  }

 
  const TableDatas = tableData && tableData.length>0 ?tableData.filter(data => data.isDeleted === false).map((data, i) => ({
    SNo: i + 1,
    key:data.id,
    id:data.id,
    productDetailsId:data.productDetailsId,
    officeLocationId:data.officeLocationId,
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
  // console.log(productstoragelocation);
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
          <Statistic
            title="Stored Products"
            value={storageLocationCount}
            formatter={formatter}
            valueStyle={{ color: "#3f8600" }}
          />
          </Card>
        </Col>
        {/* <Col justify='flex-end' style={{right :'1%'}}><Button onClick={handleAdd} type="primary">Add to Storage</Button></Col> */}
      </Row>
      <Divider />
      <Table
      rowSelection={rowSelection}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={TableDatas}
        columns={columns}
        pagination={{
          pageSize: 6,
        }}
      />
    </div>
  );
      }

export default Storage