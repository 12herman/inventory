import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Popconfirm, Table, message } from 'antd';
import { Col, Row, Statistic, Divider, Tag, Card, Modal, Select ,Tooltip} from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faPen, faL } from "@fortawesome/free-solid-svg-icons";
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { getProductStorageLocation, putProductStorageLocation } from '../redux/slices/productStorageLocationSlice';
import { getProductsDetail, postProductsDetail, putProductsDetail } from '../redux/slices/productsDetailSlice';
import { getEmployeeAccessories,putEmployeeAccessories,postEmployeeAccessories } from '../redux/slices/employeeaccessoriesSlice';
import { postProductsRepairHistory } from '../redux/slices/productsrepairhistorySlice';

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

  const onAssign =()=> {
    form.validateFields().then((values) =>{
      ProductAssign();
    }).catch((errorInfo)=>{
      console.log("Validation Failed",errorInfo);
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
    // {
    //   title: "Employee Name",
    //   dataIndex: "employeeId",
    //   key: "employeeId",
    // },
    {
      title: "Status",
      key: "tags",
      dataIndex: "tags",
      render: (x, text,record) =>     
      (
        
       <>
       <div className="flex gap-x-2">{
         text.isRepair === true ? <Tag color="yellow">Repair</Tag> 
         : text.isAssigned === true 
         ?  <Tag color="green">Assigned</Tag> 
         :text.isStorage === true? <Tag color ="orange">Storage</Tag>
         : text.isAssigned === false ? <Tag color="red">Not Assigned</Tag> :0     
       }
       {
        text.employeeId === null ? 
        "": <Tag color="blue">
        {text.employeeId }
      </Tag> 
       }
       </div></>
      ),
    },   
  ];

  //Columns that are appeared in the Repair modal 
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

  const [comments, setComments] = useState('');
  
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

  const [AssignStatus,setAssignStatus] =useState(false);

  const {employee} = useSelector((state) => state.employee);
 
  const [RepairModal, setRepairModal] = useState(false);
  const OpenRepairModal = () => setRepairModal(true);
  const CloseRepairModal = () => setRepairModal(false);

  const [AssignModal,setAssignModal] = useState(false);
  const OpenAssignModal =()=> setAssignModal(true);
  const CloseAssignModal =()=> setAssignModal(false);
  const [loadTable,setLoadTable] = useState(false);
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
    comments:"",
    employeeId:null
  });

  const [popConfirmRepairVisible, setPopConfirmRepairVisible] = useState(false);
  const [popConfirmAssignVisible, setPopConfirmAssignVisible] = useState(false);

  useEffect(() => {
    dispatch(getProductsDetail());
  }, [loadTable]);

  useEffect(() => {
    setProLocData(productsDetail);
    setTableData(productsDetail);
    DataLoading();
    console.log(TableDatas);
  }, [ officeData,productsDetail,loadTable]);

  //Filter Table Data Based on the Office in Dropdown 
  function DataLoading() {

    var numberOfOffice = officeData.filter((off) => off.isdeleted === false);

    var officeNames = numberOfOffice.map((off) => {
      return off.officename;
    });

    if (officeNames.length === 1) {
      const filterOneOffice = productsDetail ? productsDetail.filter(system => system.isDeleted === false && system.officeName === officeNames[0] && system.isStorage ===true) : 0;
      console.log(filterOneOffice);
      setstorageLocationCount(filterOneOffice.length);
      setTableData(filterOneOffice);
    }
    else {
      const filterAllOffice = productsDetail ? productsDetail.filter(system => system.isDeleted === false && system.isStorage ===true) : 0;
      setstorageLocationCount(filterAllOffice.length);
      setTableData(filterAllOffice);

    }
  }

  //Table Data 
  const [tableData, setTableData] = useState([]);

//Displayed table in UI
const FilterDatas = tableData && tableData.length > 0 ? tableData .filter(data => data.isDeleted === false && data.isStorage === true && data.isRepair === false).sort((a,b) => a.id - b.id) :[]
      
const TableDatas = FilterDatas.map((data, i) => ({
  SNo: i + 1,
  key: data.id,
  id: data.id,
  officeLocationId: data.officeName,
  productName: data.productName,
  producttype: data.accessoryName,
  brand: data.brandName,
  modelNumber: data.modelNumber,
  serialNumber: data.serialNumber,
  isRepair: data.isRepair,
  tags: data.isRepair,
  isDeleted: false,
  isAssigned: data.isAssigned,
  isStorage: false,
  comments: data.comments,
  employeeId: data.employeeName
}))
 // Sort by `id` in ascending order;


// console.log(TableDatas);

  //Row key selection
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = async (newSelectedRowKeys, x) => {
    console.log(newSelectedRowKeys,x);
    await setSelectedRowKeys(newSelectedRowKeys);
    await setIsButtonEnabled(newSelectedRowKeys.length > 0);
    await setSelectedIds(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record) => ({
      disabled: record.isAssigned === true  
    }),
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

  //Assign Ok Button Function
  const [temporaryCheckKey, setTemporaryCheckKey] = useState([]);

  const handleAsssignConfirm = () => {
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
      comments:null,
      employeeId:null
    });
    OpenAssignModal();
    setPopConfirmAssignVisible(false);
    setSelectedRowKeys(temporaryCheckKey);
    setTemporaryCheckKey([]);
  };

  //Assign Cancel Button
  const handleAssignCancel = () => {
    setPopConfirmAssignVisible(false);
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
      comments:null,
      employeeId:null
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
    isStorage:false,
    officeLocationId:data.officeLocationId,
    comments:comments,
    employeeId:data.employeeId
  }));

  const UpdateProductRepairHistory=await ProductRepair.map(data2 => ({
      productsDetailId: data2.id,
      comments:comments,
      createdDate: data2.createdDate,
      createdBy: data2.createdBy,
      modifiedDate: data2.modifiedDate,
      modifiedBy: data2.modifiedBy,
      isDeleted: data2.isDeleted,
    
  }));

  UpdateRepairedProductDetails.map(async data =>{
   await dispatch(putProductsDetail(data));
   await dispatch (getProductsDetail());
   
  });

  UpdateProductRepairHistory.map(async data2 =>{
  await dispatch(postProductsRepairHistory(data2));
  })

  CloseRepairModal();
  setIsButtonEnabled(false);

}


//Product Assign 
const ProductAssign=async()=>{
     if(system.employeeId ===undefined){
      message.error("Select an Employee")
     }else{
      const ProductAssignation = await productsDetail.filter(data => SelectedIds.some(id => id ===data.id));
      console.log(ProductAssignation);
     
     const updateProductAssignation = await ProductAssignation.map(data => ({
      id:data.id,
      accessoriesId:data.accessoriesId,
      brandId: data.brandId,
      productName: data.productName,
      modelNumber: data.modelNumber,
      serialNumber: data.serialNumber,
      isDeleted: false,      
      isRepair: false,
      isAssigned: true,
      createdDate: data.createdDate,
      createdBy: data.createdBy,
      modifiedDate: formattedDate,
      modifiedBy: data.modifiedBy,
      isStorage:data.isStorage,
      officeLocationId:data.officeLocationId,
      comments:comments,
      employeeId:system.employeeId,
     }))

     await Promise.all(updateProductAssignation.map(data => dispatch(putProductsDetail(data))));
     await setLoadTable(!loadTable);
      // await dispatch(getProductsDetail());
     CloseAssignModal();
     setIsButtonEnabled(false);
     setSelectedRowKeys([]);
    //  setSystem(pre => ({...pre,employeeId:null}))
    };
}

//Employee Dropdown option
const employeeOption=[
  {label:'Select an Employee',value:null},
  ...employee.filter(empacc => !empacc.isDeleted).map(emp =>({  
    label:emp.firstName,
    value:emp.id
  })),
];

//Employee Dropdown
const employeeNameDropdowninProduct=(data,value) => {
  console.log(value.value);
  setSystem((pre) => ({...pre,employeeId:value.value}));
  if(value.value ===null){
    setAssignStatus(false);
  }else{
    setAssignStatus(true);
  }
}

  const selectedrowrepairData = TableDatas.filter(row => selectedRowKeys.includes(row.key));
  return (
    <div>
      <Row justify='space-between' align='middle' gutter={12} className="flex justify-between items-center">
        <Col span={4} className="grid grid-flow-col gap-x-10 items-center">
            <Statistic
             className="block w-fit"
              title="Stored Products"
              value={storageLocationCount}
              formatter={formatter}
              valueStyle={{ color: "#3f8600" }}
            />
        </Col>{" "}
        <Col span={10} style={{ right: "14.50%", width:"100%"}}>
          {" "}
          <Input.Search
           className="block w-fit"
            placeholder="Search here...."
            onSearch={(value) => {
              setSearchText(value);
            }}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            
          />
        </Col>

        <Col justify='flex-end' style={{ left: '8%', }}>
          <Popconfirm                                                              //Assign to Employee Button
          title="Are you sure you want to assign the Products to Employee?"
          open={popConfirmAssignVisible}
          onConfirm={handleAsssignConfirm}
          onCancel={handleAssignCancel}
          okText="Yes"
          cancelText="No"
          okButtonProps={{
            style:{backgroundColor:"#4088ff"}
          } }
          >
          <Button type="primary" className='bg-blue-500 flex items-center gap-x-1float-right mb-3 mt-3'
           open={AssignModal}
           onClick={() => {
             setPopConfirmAssignVisible(true);
             setTemporaryCheckKey(selectedRowKeys);
              // Store the temporary selected row keys
           }}
            disabled={!isButtonEnabled}
          >Assign to Employee</Button>
          </Popconfirm>  
        </Col>

        <Col justify='flex-end' style={{ left: '3.5%' }}>
          <Popconfirm
            title="Are you sure you want to transfer the Products to Repair?"
            open={popConfirmRepairVisible}
            onConfirm={handleRepairConfirm}
            onCancel={handleRepairCancel}
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              style:{backgroundColor:"#4088ff"}
            } }
          >
            <Button type="primary" className="bg-blue-500 flex items-center gap-x-1float-right mb-3 mt-3"    //Transfer to Repair Button
              open={RepairModal}
              onClick={() => {
                setPopConfirmRepairVisible(true);
                setTemporaryKey(selectedRowKeys); // Store the temporary selected row keys
              }}
              disabled={!isButtonEnabled}
            >Add to Repair</Button></Popconfirm>
            </Col>

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
        // rowClassName={() => 'editable-row'}
        // bordered
        dataSource={TableDatas}
        columns={defaultColumns}
        pagination={{
          pageSize: 6,
        }}
      />

<Modal                                //Assign to Employee Modal 
        title="Assign to Employee"
        open={AssignModal}
        onCancel={CloseAssignModal}
        width={"1200px"}
        footer={[
          <Button key="1" 
          onClick={onAssign}
          >
            Assign
          </Button>,
          <Button
            type="text"
            key="2"
            danger="red"
            style={{ border: "0.5px solid red" }}
            onClick={() => CloseAssignModal()}
          >
            Cancel
          </Button>
        ]}>
          <Form>
          {/* <Form.Item
           
            style={{ marginBottom: 0, marginTop: 10 }}
          >
            <Select
              style={{ float: "right", width: "380px" }}
              placeholder="Select Employee Name"
              options={employeeOption}
              value={system.employeeId || undefined}
              name="employeeId"
              onChange={employeeNameDropdowninProduct}
            />
          </Form.Item> */}
          <Form.Item
    style={{ marginBottom: 0, marginTop: 10 }}
>
    <Select
        showSearch
        style={{ width: 380 ,float:"right"}}
        placeholder="Select Employee Name"
        optionFilterProp="children"
        filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        value={system.employeeId || undefined}
        onChange={employeeNameDropdowninProduct}
    >
        {employeeOption.map((employee) => (
            <Select.Option key={employee.value} value={employee.value}>
                {employee.label}
            </Select.Option>
        ))}
    </Select>
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
          <Input.TextArea rows={3} style={{ width: "40%" }} placeholder='Add a Comment...' value={comments} onChange={(e) => setComments(e.target.value)}/>
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