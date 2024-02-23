import React, { useState, useEffect } from "react";
import { Space, Table, Tag, Modal, Form, Input, message } from "antd";
import {
  Button,
  Col,
  Row,
  Statistic,
  Divider,
  Select,
  Popconfirm,
  Card,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faPen, faL } from "@fortawesome/free-solid-svg-icons";
import CountUp from "react-countup";
import { useDispatch, useSelector } from "react-redux";
import { getEmployees } from "../redux/slices/employeeSlice";
import { getaccessories } from "../redux/slices/accessoriesSlice";
import { getbrand } from "../redux/slices/brandSlice";
import {
  getProductsDetail,
  putProductsDetail,
  postProductsDetail,
} from "../redux/slices/productsDetailSlice";
import { getProductStorageLocation, postProductStorageLocation, putProductStorageLocation } from "../redux/slices/productStorageLocationSlice";

const formatter = (value) => <CountUp end={value} />;

const Products = ({ officeData }) => {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  const columns = [
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
    //   title: "Office Location",
    //   dataIndex: "officeLocationId",
    //   key: "offLoc",
    // },
    {
      title: "Status",
      key: "tags",
      dataIndex: "tags",
      render: (x, text) =>   
       (
        <>{
          text.isRepair === true ? <Tag color="yellow">Repair</Tag> 
          : text.isAssigned === true ?  <Tag color="green">Assigned</Tag> 
          :text.isStorage === true? <Tag color ="orange">Storage</Tag>
          : text.isAssigned === false ? <Tag color="red">Not Assigned</Tag> :0
          
        }</>
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

          <Button onClick={() => PencilBtn(record.id)}>
            <FontAwesomeIcon icon={faPen} />
          </Button>
        </div>
      ),
    },
  ];

  const modalColumn= [
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
  ];

  const dispatch = useDispatch();

  const { employee } = useSelector((state) => state.employee);

  const { accessories } = useSelector((state) => state.accessories);

  const { brand } = useSelector((state) => state.brand);

  const { productsDetail } = useSelector((state) => state.productsDetail);

  const { productstoragelocation } = useSelector((state) => state.productstoragelocation);

  const { office } = useSelector((state) => state.office);

  const [proData, setProData] = useState([]);

  const [proCounts, setProCounts] = useState();

  const [pcData, setPcData] = useState([]);

  const [pcCounts, setPcCounts] = useState();

  const [tableDATA,setTableDATA] = useState([]);

  //pop-Up Window
  const [modalOpen, setModalOpen] = useState(false);
  const ModalOpen = () => setModalOpen(true);
  const ModalClose = () => {setModalOpen(false);   setSystem(pre => ({...pre,officeLocationId:undefined}));};

  //Save or Add Button State
  const [saveBtn, setsaveBtn] = useState(false);
  const saveBtnOn = () => setsaveBtn(true);
  const saveBtnOff = () => setsaveBtn(false);

  //Add New Field
  const AddNewBtn = () => {
    clearFields();
    saveBtnOff();
    ModalOpen();
    if (form) {
      form.resetFields(["officeLocationId"])};
      setSystem(pre =>({...pre,officeLocationId:undefined}));
  };

  //Input Field Value
  const [system, setSystem] = useState({
    id: null,
    accessoriesId: null,
    brandId: null,
    productName: "",
    modelNumber: "",
    serialNumber: "",
    tags: "",
    isAssigned:false,
    isDeleted: false,
    isRepair:false,
    officeLocationId:undefined,
    isStorage:false
  });
 

  //Storage
  const [storage, setStorage] = useState({
    productDetailsId: null,
    officeLocationId:null,
    isDeleted: false,
    isAssigned: false,
    isStorage:false,
    isRepair:false
  })
// console.log(productsDetail);
  //Table data and Column
  const TableDatas = productsDetail.map((cnsl, i) => ({
    id: cnsl.id,
    accessoriesId: cnsl.accessoriesId,
    brandId: cnsl.brandId,
    productName: cnsl.productName,
    modelNumber: cnsl.modelNumber,
    serialNumber: cnsl.serialNumber,
    tags: cnsl.isAssigned,
    isAssigned:false,
    isRepair:false,
    isDeleted: false,
    isStorage:false,
    officeLocationId:cnsl.officeLocationId,
  }));
  // console.log(TableDatas);

  //Modify
  const [putSystem, setPutSystem] = useState([]);
  const clearFields = () => {
    setSystem({
      ...system,
      id: "",
      accessoriesId: "",
      brandId: "",
      productName: "",
      modelNumber: "",
      serialNumber: "",
      tags: "",
      isDeleted: false,
      isAssigned:false,
      isRepair:false,
      officeLocationId:"",
      isStorage:false
    });
    setSystem(pre => ({...pre,officeLocationId:undefined}));
    
  };
  useEffect(() => {
    // dispatch(getProductStorageLocation());
    dispatch(getProductsDetail());
  }, []);

  //Brand Dropdown
  const brandDropDown = (data) => {
    setSystem((pre) => ({ ...pre, brandId: data }));
    // console.log(data);
  };

  //Delete Icon
  const DeleteIcon = async (id) => {
    const PreviousValue = TableDatas.filter((pr) => pr.id === id.id);
    console.log(PreviousValue);
    const DeleteData = {
      id: PreviousValue[0].id,
      accessoriesId: PreviousValue[0].accessoriesId,
      brandId: PreviousValue[0].brandId,
      productName: PreviousValue[0].productName,
      modelNumber: PreviousValue[0].modelNumber,
      serialNumber: PreviousValue[0].serialNumber,
      tags: PreviousValue[0].isAssigned,
      isDeleted: true,
      isStorage:false,
      isRepair:false,
      isAssigned:false,
      officeLocationId:PreviousValue[0].officeLocationId,
    };
    await dispatch(putProductsDetail(DeleteData));
    await dispatch(getProductsDetail());
    message.success("Deleted Successfully!");

    // //Hard Delete
    // await dispatch(deleteconsoles(id.id));
    // await dispatch(getconsoles());
  };

  useEffect(() => {
    dispatch(getProductsDetail());
  }, []);

  //Edit Icon
  const PencilBtn = (record) => {
    const filterConsoleData = productsDetail.filter((cl) => cl.id === record);
    setSystem({
      id: filterConsoleData[0].id,
      accessoriesId: filterConsoleData[0].accessoriesId,
      brandId: filterConsoleData[0].brandId,
      productName: filterConsoleData[0].productName,
      modelNumber: filterConsoleData[0].modelNumber,
      serialNumber: filterConsoleData[0].serialNumber,
      tags: filterConsoleData[0].isAssigned,
      isDeleted: false,
      isAssigned:false,
      isRepair:false,
      isStorage:false,
      officeLocationId:filterConsoleData[0].officeLocationId,
    });
    setPutSystem({
      id: filterConsoleData[0].id,
      accessoriesId: filterConsoleData[0].accessoriesId,
      brandId: filterConsoleData[0].brandId,
      productName: filterConsoleData[0].productName,
      modelNumber: filterConsoleData[0].modelNumber,
      serialNumber: filterConsoleData[0].serialNumber,
      tags: filterConsoleData[0].isAssigned,
      isDeleted: false,
      isStorage:false,
      isRepair:false,
      isAssigned:false,
      officeLocationId:filterConsoleData[0].officeLocationId,
    });
    saveBtnOn();
    ModalOpen();
  };

  //PutMethod
  const PutMethod = async () => {
    setLocationStatus(false);
    if (
      !system.productName ||
      !system.accessoriesId ||
      !system.brandId ||
      !system.modelNumber ||
      !system.serialNumber     
    ) {
      message.error("Please Fill all the Fields!");
    } else {
      const putData = {
        id: putSystem.id,
        accessoriesId: system.accessoriesId,
        brandId: system.brandId,
        productName: system.productName,
        modelNumber: system.modelNumber,
        serialNumber: system.serialNumber,
        tags: system.isAssigned,
        isDeleted: system.isDeleted,
        isStorage:LocationStatus,
        isAssigned:system.isAssigned,
        isRepair:system.isRepair,
        officeLocationId:system.officeLocationId
      };
      // console.log(putData);
      await dispatch(putProductsDetail(putData));
      dispatch(getProductsDetail());
      ModalClose();
      message.success("Saved Successfully!");
    }
  };

const [LocationStatus,setLocationStatus] =useState(false)
  //Add Product Button
  const addProduct = async () => {
    
    setLocationStatus(false);
    if (
      !system.productName ||
      !system.accessoriesId ||
      !system.brandId ||
      !system.modelNumber ||
      !system.serialNumber ||
      system.officeLocationId === undefined
    ) {
      message.error("Please Fill all the fields!");
    } else {
      const newProduct = {
        accessoriesId: system.accessoriesId,
        brandId: system.brandId,
        productName: system.productName,
        modelNumber: system.modelNumber,
        serialNumber: system.serialNumber,
        isAssigned: false,
        isDeleted:false,
        isRepair:false,
        officeLocationId:system.officeLocationId,
        isStorage:LocationStatus
      };
      console.log(newProduct);
      try {
        await dispatch(postProductsDetail(newProduct));   
        await dispatch(getProductsDetail());
        setModalOpen(false);
        clearFields();
      } catch (error) {
        console.error("Error adding product:", error);
      }
      await dispatch(getProductsDetail());
     await setSystem(pre=>({...pre,officeLocationId:undefined}));
    }
  };

  //Displaying data in table data
const productsCopy = [...tableDATA];
productsCopy.sort((a, b) => a.id - b.id);

// console.log(productsCopy);
// console.log(tableDATA);

// Map the sorted productsDetail array to TableDATA
const TableDATA =productsCopy&&productsCopy.length>0? productsCopy
  .filter((consoleItem) => !consoleItem.isDeleted)
  .map((cnsl, i) => ({
    SNo: i + 1,
    key: cnsl.id,
    id:cnsl.id,
    producttype: cnsl.accessoryName,
    brand: cnsl.brandName,
    productName: cnsl.productName,
    modelNumber: cnsl.modelNumber,
    serialNumber: cnsl.serialNumber,
    tags: cnsl.isAssigned,
    isAssigned:cnsl.isAssigned,
    isDeleted:cnsl.isDeleted,
    isRepair:cnsl.isRepair,
    officeLocationId:cnsl.officeLocationId,
    isStorage:cnsl.isStorage
  })):[];
// console.log(TableDATA);

  useEffect(() => {
    dispatch(getEmployees());
    dispatch(getaccessories());
    dispatch(getProductsDetail());
    dispatch(getbrand());
  }, [dispatch]);

  //Filter Table Data Based on the Office in Dropdown 
  function DataLoading() {

    var numberOfOffice = officeData.filter((off) => off.isdeleted === false);

    var officeNames = numberOfOffice.map((off) => {
      return off.officename;
    });

    if (officeNames.length === 1) {
      const filterOneOffice = proData ? proData.filter(products => products.isDeleted === false && products.officeName === officeNames[0]) : 0;
      setProCounts(filterOneOffice.length);
      setTableDATA(filterOneOffice);
    }
    else {
      const filterAllOffice = proData ? proData.filter(products => products.isDeleted === false) : 0;
      setProCounts(filterAllOffice.length);
      setTableDATA(filterAllOffice);

    }
  }
  useEffect(()=> {
    setProData(productsDetail);
    DataLoading();
  },[productsDetail,officeData]);

  const productFilter = accessories.filter((acc) => acc.isdeleted === false);
  const productOption = productFilter.map((pr, i) => ({
    label: pr.name,
    value: pr.id,
  }));

  //Product Dropdown
  const productNameDropDown = (data, value) => {
    setSystem((pre) => ({ ...pre, accessoriesId: data }));
    // console.log(data);
  };

  //Brand Dropdown Option
  const brandFilter = brand.filter((brnd) => brnd.isdeleted === false);
  const brandOption = brandFilter.map((br) => ({
    label: br.name,
    value: br.id,
  }));

  //office Dropdown Option
  // const officeFilter = office.filter((ofc) => ofc.isdeleted === false);
  // const officeOption = officeFilter.map((off) => ({
  //   label: off.officename,
  //   value: off.id,
  // }));
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

  //Product Input 
  const productNameInputChange = (e) => {
    setSystem((pre) => ({ ...pre, productName: e.target.value }));
    console.log("productName:", e.target.value);
  };

  //Model Number Input
  const handleModelNumberChange = (e) => {
    setSystem((pre) => ({ ...pre, modelNumber: e.target.value }));
    // console.log(e.target.valuesdfdsf);
  };

  //Serial Number Input 
  const serialNumberInputChange = (e) => {
    setSystem((pre) => ({ ...pre, serialNumber: e.target.value }));
    // console.log(e.target.valuesdfdsf);
  };

  // Transfer Modal Popup
  const [TransferModal, setTransferModal] = useState(false);
  const OpenTransferModal = () => setTransferModal(true);
  const CloseTransferModal = () => setTransferModal(false);

  //Repair Modal Popup
  const [RepairModal,setRepairModal] = useState(false);
  const OpenRepairModal =()=> setRepairModal(true);
  const CloseRepairModal =()=> setRepairModal(false);

  const [popConfirmVisible, setPopConfirmVisible] = useState(false);

  const [popConfirmRepairVisible,setPopConfirmRepairVisible] = useState(false);

  //Transfer Storage Ok Button function
  const [temporarySelectedRowKeys, setTemporarySelectedRowKeys] = useState([]);

  const handleTransferConfirm = () => {
    setStorage(productstoragelocation);
    setStorage({
      productDetailsId: null,
      officeLocationId:null,
      isDeleted: false,
      isAssigned: false,
      isStorage:false,
      isRepair:false
    })
    OpenTransferModal();  
    setPopConfirmVisible(false);
    setSelectedRowKeys(temporarySelectedRowKeys);
    setTemporarySelectedRowKeys([]);
  };

  //Transfer Cancel Button function
  const handleTransferCancel = () => {
    setPopConfirmVisible(false);
  };

  //Repair Ok Button Function
  const [temporaryKey,setTemporaryKey] = useState([]);

  const handleRepairConfirm =()=> {
    setSystem({
      SNo: null,
    key: null,
    id:null,
    producttype: null,
    brand:null ,
    productName: null,
    modelNumber: null,
    serialNumber:null,
    tags: null,
    isDeleted: false,
    isRepair:false
    })
    OpenRepairModal();
    setPopConfirmRepairVisible(false);
    setSelectedRowKeys(temporaryKey);
    setTemporaryKey([]);
  };

  //Repair Cancel Button

  const handleRepairCancel =()=>{
    setPopConfirmRepairVisible(false);
  };

  //Table Row Selection Check box
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [SelectedIds, setSelectedIds] = useState([]);
  const [TypeCounts, setTypeCounsts] = useState([]);
 
  const onSelectChange = async (newSelectedRowKeys, x) => {
    console.log(newSelectedRowKeys.length > 0);
    await setSelectedRowKeys(newSelectedRowKeys);
    await setIsButtonEnabled(newSelectedRowKeys.length > 0);
    await setSelectedIds(newSelectedRowKeys);
    const types = await x.map(obj => (
      obj.producttype
    ));
    const counts = await {};
    await types.forEach(item => {
      counts[item] = counts[item] ? counts[item] + 1 : 1;
    });
    const filteredCounts = [];
    for (const key in counts) {
      if (counts[key] >= 1) {
        filteredCounts[key] = counts[key];
      }
    }
    await setTypeCounsts(filteredCounts);
  };

  //Row Selection
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record) => ({
      disabled: record.isAssigned === true  || record.isRepair===true 
    }),
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        id: 'odd',
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
        id: 'even',
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

  //Assigned data
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 19);

  //put storage
  const PostStorage = async () => {    
     
      if(system.officeLocationId === undefined){
        message.error("select office location");
      }else{
        const ProductAssign = await productsDetail.filter(data => SelectedIds.some(id => id === data.id));
        console.log(ProductAssign);
        
        const UpdateProductDetails = await ProductAssign.map(data => ({
          id: data.id,
          accessoriesId: data.accessoriesId,
          brandId: data.brandId,
          productName: data.productName,
          modelNumber: data.modelNumber,
          serialNumber: data.serialNumber,
          isDeleted: false,
          isRepair: false,
          isAssigned: false,
          isStorage:true,
          officeLocationId:system.officeLocationId,
          createdDate: data.createdDate,
          createdBy: data.createdBy,
          modifiedDate: formattedDate,
          modifiedBy: data.modifiedBy
        }));
        console.log(UpdateProductDetails);
     
        // //product details
        UpdateProductDetails.map(async data => {
          console.log(data);
          await dispatch(putProductsDetail(data));
        });
  
       await dispatch(getProductsDetail());
       CloseTransferModal();
       setIsButtonEnabled(false);
       setSystem(pre =>({...pre,officeLocationId:undefined}))
      
      }
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
      tags:data.isRepair,
      isAssigned: false,
      createdDate: data.createdDate,
      createdBy: data.createdBy,
      modifiedDate: formattedDate,
      modifiedBy: data.modifiedBy,
      isStorage:false,
      officeLocationId:data.officeLocationId,
      comments:data.comments
    }));
    // console.log("UpdateRepairedProductDetails:",UpdateRepairedProductDetails);
    setSelectedRowKeys([])
    UpdateRepairedProductDetails.map(async data =>{
     await dispatch(putProductsDetail(data));
     await dispatch (getProductsDetail());
    });
 
    // const TransferRepairData = SelectedIds.map(id =>({
    //   id: id,
    //   isAssigned:false,
    //   isdeleted: false,
    //   isRepair:false
    // }));
    // // console.log("TransferRepairData:",TransferRepairData);
    // await TransferRepairData.map(data=>{
    //    dispatch(postProductsDetail(data))
    // });
    CloseRepairModal();
    setIsButtonEnabled(false);

}


  
  const selectedrowDatas=TableDATA.filter(row => selectedRowKeys.includes(row.key));
  // console.log(selectedrowDatas);

  const selectedrowrepairData =TableDATA.filter(row => selectedRowKeys.includes(row.key));
//   // console.log(selectedrowrepairData);
  return (
    <div>
      <Row justify="space-between" align="middle" gutter={16}>
        <Col span={4}>
          <Card bordered={true}>
            <Statistic
              title="Product Count"
              value={proCounts}
              formatter={formatter}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>{" "}
        <Col span={10} style={{ right: "1%" }}>
          {" "}
          <Input.Search
            placeholder="Search here...."
            onSearch={(value) => {
              setSearchText(value);
            }}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            style={{ width: `30%` }}
          />
        </Col>

        <Col justify="flex-end" style={{ right: "0.5%" }}>
          <Popconfirm
            title="Are you sure you want to transfer the data to Storage?"   //Transfer to Storage Button 
            open={popConfirmVisible}
            onConfirm={handleTransferConfirm}
            onCancel={handleTransferCancel}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              className="bg-blue-500 flex items-center gap-x-1float-right mb-3 mt-3"
              open={TransferModal}
              onClick={() => {
                setPopConfirmVisible(true);
                setTemporarySelectedRowKeys(selectedRowKeys); // Store the temporary selected row keys
              }}
              disabled={!isButtonEnabled}>
              <span>Move Products to Other Storage</span>

            </Button>

            
          </Popconfirm>
         

        </Col>

        <Col  justify="flex-end" style={{ right: "1%" }}>
        <Popconfirm
            title="Are you sure you want to transfer the Products to Repair?"
            open={popConfirmRepairVisible}
            onConfirm={handleRepairConfirm}
            onCancel={handleRepairCancel}
            okText="Yes"
            cancelText="No"
          >
        <Button
              type="primary"
              className="bg-blue-500 flex items-center gap-x-1float-right mb-3 mt-3"    //Transfer to Repair Button
              open={RepairModal}
              onClick={() => {
                setPopConfirmRepairVisible(true);
                setTemporaryKey(selectedRowKeys); // Store the temporary selected row keys
              }}
              disabled={!isButtonEnabled}
              >
              <span>Transfer Products to Repair</span>

            </Button>
            </Popconfirm>
            </Col>

        <Col justify="flex-end" style={{ right: "1.5%" }}>

          <Button
            disabled={isButtonEnabled}
            onClick={() => AddNewBtn()}
            type="primary"
            className="bg-blue-500 flex items-center gap-x-1 float-right mb-3 mt-3"
          >
            <span>Add Product</span>
            <FontAwesomeIcon icon={faPlus} className="icon" />
          </Button>
        </Col>
      </Row>
      <Divider />
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={TableDATA}
        pagination={{
          pageSize: 6,
        }}
      />

      <Modal                             //Add Product Modal
        title="Add Product"
        open={modalOpen}
        onCancel={ModalClose}
        //  onOk={addProduct}
        footer={[
          saveBtn === false ? (
            <Button onClick={addProduct}>Add</Button>
          ) : (
            <Button key="1" onClick={PutMethod}>
              Save
            </Button>
          ),
          <Button
            type="text"
            key="2"
            danger="red"
            style={{ border: "0.5px solid red" }}
            onClick={() => ModalClose()}
          >
            Close
          </Button>,
        ]}
      >
        <Form form={form}>
          <Form.Item
            label="Product Name"
            style={{ marginBottom: 0, marginTop: 10 }}
          >
            <Input
              style={{ float: "right", width: "380px" }}
              placeholder="Product Name"
              name="productName"
              value={system.productName}
              onChange={productNameInputChange}
            />
          </Form.Item>

          <Form.Item
            label="Product Type"
            style={{ marginBottom: 0, marginTop: 10 }}
          >
            <Select
              style={{ float: "right", width: "380px" }}
              placeholder="Select Product Type"
              options={productOption}
              value={system.accessoriesId || undefined}
              name="producttype"
              onChange={productNameDropDown}
            />
          </Form.Item>

          {/* Additional form fields for brand name and model number */}
          <Form.Item
            label="Brand Name"
            style={{ marginBottom: 0, marginTop: 10 }}
          >
            <Select
              style={{ float: "right", width: "380px" }}
              placeholder="Select Brand Name"
              options={brandOption}
              value={system.brandId || undefined}
              name="brand"
              onChange={brandDropDown}
            />
          </Form.Item>

          <Form.Item
            label="Model No"
            style={{ marginBottom: 0, marginTop: 10 }}
          >
            <Input
              style={{ float: "right", width: "380px" }}
              placeholder="Model No."
              name="modelNumber"
              value={system.modelNumber}
              onChange={handleModelNumberChange}
            />
          </Form.Item>
          <Form.Item
            label="Serial Number"
            style={{ marginBottom: 0, marginTop: 10 }}
          >
            <Input
              style={{ float: "right", width: "380px" }}
              placeholder="Serial Number"
              name="serialNumber"
              value={system.serialNumber}
              onChange={serialNumberInputChange}
            />
          </Form.Item>
          <Form.Item
            label="Office Location"
            style={{ marginBottom: 0, marginTop: 10 }}
          >
            <Select
              style={{ float: "right", width: "380px" }}
              placeholder="Select Office Location"
              options={officeOption}
              value={system.officeLocationId || undefined}
              name="officeLocationId"
              onChange={officeNameDropdowninProduct}
            />
          </Form.Item>

          {/* Add more form fields as needed */}
        </Form>
      </Modal>
   
   
      <Modal                                  //Add to Storage Modal 
        title="Add to Storage"
        open={TransferModal}
        onCancel={CloseTransferModal}
        width={"1200px"}
        footer={[
          <Button key="1" 
          onClick={PostStorage}
          >
            Transfer
          </Button>,
          <Button
            type="text"
            key="2"
            danger="red"
            style={{ border: "0.5px solid red" }}
            onClick={() => CloseTransferModal()}
          >
            Cancel
          </Button>
        ]}>
        <div style={{ display: "flex", flexDirection: "column"}}>
    <div style={{ marginBottom: "16px", display: "flex", justifyContent: "flex-end" }}>
    <Select
      style={{ width: "20%" }}
      placeholder="Select Office Location"
      options={officeOption}
      value={system.officeLocationId}
      onChange={officeNameDropdowninProduct}
    />
    </div>
  </div>
      <Table columns={modalColumn}
      dataSource={selectedrowDatas}
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
          onClick={PostRepair}
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
        {/* <div style={{ display: "flex", flexDirection: "column"}}>
    <div style={{ marginBottom: "16px", display: "flex", justifyContent: "flex-end" }}>
    <Select
      style={{ width: "20%" }}
      placeholder="Select Office Location"
      options={officeOption}
      onChange={officeNameDropdowninProduct}
    />
    </div>
  </div> */}
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
export default Products;
