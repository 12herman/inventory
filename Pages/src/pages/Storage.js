import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Popconfirm, Table, message } from 'antd';
import { Col, Row, Statistic, Divider, Tag, Card, Modal, Select ,Tooltip} from 'antd';
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
  const [form] = Form.useForm();
  const onFinish = () => {
    form.validateFields().then((values) => {
      // Handle form submission if validation succeeds
      PostRepair();
    }).catch((errorInfo) => {
      console.log('Validation failed:', errorInfo);
    });
  };
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

  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [SelectedIds, setSelectedIds] = useState([]);

  //Columns
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
      render: (x, text) =>   
      (
       <>{
         text.isRepair === true ? <Tag color="yellow">Repair</Tag> 
         : text.isAssigned === true 
         ?  <Tag color="green">Assigned</Tag> 
         :text.isStorage === true? <Tag color ="orange">Storage</Tag>
         : text.isAssigned === false ? <Tag color="red">Not Assigned</Tag> :0
         
       }</>
      ),
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

  //Delete Button Function
  const DeleteIcon = async (id) => {
    const PreviousValue = TableDatas.filter((pr) => selectedRowKeys.some(id => pr.id === id));
    //true 
    const DeletedData = PreviousValue.map(data => ({
      id: data.id,
      productName:data.productName,
      producttype:data.producttype,
      brand:data.brand,
      modelNumber:data.modelNumber,
      serialNumber:data.serialNumber,
      officeLocationId: data.officeLocationId,
      isDeleted: data.isDeleted,
      isAssigned: data.isAssigned,
      isRepair: false,
      isStorage:data.isStorage,
      createdDate: data.createdDate,
      createdBy: data.createdBy,
      modifiedDate: formattedDate,
      modifiedBy: data.modifiedBy
    }));
console.log(DeletedData);
  }; 

  const dispatch = useDispatch();

  const { productsDetail } = useSelector(state => state.productsDetail);

  const { office } = useSelector((state) => state.office);

  const [storagelocData, setProLocData] = useState();

  const [storageLocationCount, setstorageLocationCount] = useState([]);

  const [tableData, setTableData] = useState([]);

  const [LocationStatus,setLocationStatus] =useState(false);

  const { TextArea } = Input;

  const [RepairModal, setRepairModal] = useState(false);
  const OpenRepairModal = () => setRepairModal(true);
  const CloseRepairModal = () => setRepairModal(false);

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


  const [popConfirmRepairVisible, setPopConfirmRepairVisible] = useState(false);


  useEffect(() => {
    // dispatch(getProductStorageLocation());
    dispatch(getProductsDetail());
  }, []);

  useEffect(() => {
    // setProLocData(productstoragelocation);
    setProLocData(productsDetail);
    setTableData(productsDetail);
    DataLoading();
  }, [ officeData,productsDetail]);

  //Filter Table Data Based on the Office in Dropdown 
  function DataLoading() {

    var numberOfOffice = officeData.filter((off) => off.isdeleted === false);

    var officeNames = numberOfOffice.map((off) => {
      return off.officename;
    });

    if (officeNames.length === 1) {
      const filterOneOffice = storagelocData ? storagelocData.filter(system => system.isDeleted === false && system.officeName === officeNames[0] && system.isStorage ===true) : 0;
      console.log(filterOneOffice);
      setstorageLocationCount(filterOneOffice.length);
      setTableData(filterOneOffice);
    }
    else {
      const filterAllOffice = storagelocData ? storagelocData.filter(system => system.isDeleted === false && system.isStorage ===true) : 0;
      setstorageLocationCount(filterAllOffice.length);
      setTableData(filterAllOffice);

    }
  }

  //Table Data 
  const TableDatas = tableData && tableData.length > 0 ? tableData.filter(data => data.isDeleted === false && data.isStorage===true ).map((data, i) => ({
    SNo: i + 1,
    key: data.id,
    id: data.id,
    officeLocationId: data.officeLocationId,
    productName: data.productName,
    producttype: data.accessoryName,
    brand: data.brandName,
    modelNumber: data.modelNumber,
    serialNumber: data.serialNumber,
    isRepair: data.isRepair,
    tags:data.isRepair,
    isDeleted: false,
    isAssigned: false,
    isStorage:false,
    comments:system.comments
  })) : [];

console.log(TableDatas);
  //Row key selection
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = async (newSelectedRowKeys, x) => {
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

  //Repair Ok Button Function
  const [temporaryKey, setTemporaryKey] = useState([]);

  const handleRepairConfirm = () => {
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
      comments:null
    })
    OpenRepairModal();
    setPopConfirmRepairVisible(false);
    setSelectedRowKeys(temporaryKey);
    setTemporaryKey([]);
  };

  //Repair Cancel Button

  const handleRepairCancel = () => {
    setPopConfirmRepairVisible(false);
  };

   //Send Repair Function
const PostRepair =async ()=>{
  const ProductRepair = await productsDetail.filter(data => SelectedIds.some(id =>id ===data.id));
  console.log(ProductRepair);
  
  const UpdateRepairedProductDetails=await ProductRepair.map(data => ({
    id:data.id,
    accessoriesId:data.accessoriesId,
    brandId: data.brandId,
    productName: data.productName,
    modelNumber: data.modelNumber,
    serialNumber: data.serialNumber,
    isDeleted: false,      
    isRepair: true,
    isAssigned: false,
    createdDate: data.createdDate,
    createdBy: data.createdBy,
    modifiedDate: formattedDate,
    modifiedBy: data.modifiedBy,
    isStorage:data.isStorage,
    officeLocationId:system.officeLocationId,
    comments:data.comments
  }));
  console.log(UpdateRepairedProductDetails);

  UpdateRepairedProductDetails.map(async data =>{
   await dispatch(putProductsDetail(data));
   await dispatch (getProductsDetail());
  });

  CloseRepairModal();
  setIsButtonEnabled(false);

}

  

  const selectedrowrepairData = TableDatas.filter(row => selectedRowKeys.includes(row.key));
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
        <Col justify='flex-end' style={{ left: '39%' }}>
          <Button type="primary" className='bg-blue-500 flex items-center gap-x-1float-right mb-3 mt-3'
            disabled={!isButtonEnabled}
          >Assign to Employee</Button>
        </Col>
        <Col justify='flex-end' style={{ left: '19%' }}>
          <Popconfirm
            title="Are you sure you want to transfer the Products to Repair?"
            open={popConfirmRepairVisible}
            onConfirm={handleRepairConfirm}
            onCancel={handleRepairCancel}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" className="bg-blue-500 flex items-center gap-x-1float-right mb-3 mt-3"    //Transfer to Repair Button
              open={RepairModal}
              onClick={() => {
                setPopConfirmRepairVisible(true);
                setTemporaryKey(selectedRowKeys); // Store the temporary selected row keys
              }}
              disabled={!isButtonEnabled}
            >Add to Repair</Button></Popconfirm></Col>

        <Col justify='flex-end' style={{ right: '1%' }}>
          <Popconfirm
            title="Are you sure to delete this?"
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              style: { backgroundColor: "red", color: "white" },
            }}
            onClick={() => DeleteIcon(selectedRowKeys)
            }
          >
            <Button
              disabled={selectedRowKeys.length === 0}
            >
              <FontAwesomeIcon icon={faTrash} />

            </Button>
          </Popconfirm>

        </Col>

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

       <Modal                                //Add to Repair Modal 
        title="Add to Repair"
        open={RepairModal}
        onCancel={CloseRepairModal}
        width={"1200px"}
        footer={[
          <Button key="1" 
          onClick={onFinish }
          >
            Send
          </Button>,
          <Button
            type="text"
            key="2"
            danger="red"
            style={{ border: "0.5px solid red" }}
            onClick={() => CloseRepairModal()}
          >
            Cancel
          </Button>
        ]}>
  <Form form={form}>
        <Form.Item
          name="comments"
          rules={[{ required: true, message: 'Add a Comment!' }]}
        >
          <Input.TextArea rows={3} style={{ width: "40%" }} placeholder='Add a Comment...' />
        </Form.Item>
      </Form>
  <Divider />
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
}

export default Storage;