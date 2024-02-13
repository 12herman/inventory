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

          <Button onClick={() => PencilBtn(record.id)}>
            <FontAwesomeIcon icon={faPen} />
          </Button>
        </div>
      ),
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

  //pop-Up Window
  const [modalOpen, setModalOpen] = useState(false);
  const ModalOpen = () => setModalOpen(true);
  const ModalClose = () => setModalOpen(false);

  //Save or Add Button State
  const [saveBtn, setsaveBtn] = useState(false);
  const saveBtnOn = () => setsaveBtn(true);
  const saveBtnOff = () => setsaveBtn(false);

  //Add New Field
  const AddNewBtn = () => {
    clearFields();
    saveBtnOff();
    ModalOpen();
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
    isdeleted: false,
  });

  //Storage
  const [storage, setStorage] = useState({
    productDetailsId: null,
    officeLocationId: null,
    isDeleted: false,
    isAssigned: false,
  })

  //Table data and Column
  const TableDatas = productsDetail.map((cnsl, i) => ({
    id: cnsl.id,
    accessoriesId: cnsl.accessoriesId,
    brandId: cnsl.brandId,
    productName: cnsl.productName,
    modelNumber: cnsl.modelNumber,
    serialNumber: cnsl.serialNumber,
    tags: cnsl.isAssigned,
    isdeleted: false,
  }));

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
      isdeleted: false,
    });
  };
  useEffect(() => {
    dispatch(getProductStorageLocation());
  }, []);

  //Brand Dropdown
  const brandDropDown = (data) => {
    setSystem((pre) => ({ ...pre, brandId: data }));
    // console.log(data);
  };

  //Delete Icon
  const DeleteIcon = async (id) => {
    const PreviousValue = TableDatas.filter((pr) => pr.id === id.id);
    const DeleteData = {
      id: PreviousValue[0].id,
      accessoriesId: PreviousValue[0].accessoriesId,
      brandId: PreviousValue[0].brandId,
      productName: PreviousValue[0].productName,
      modelNumber: PreviousValue[0].modelNumber,
      serialNumber: PreviousValue[0].serialNumber,
      tags: PreviousValue[0].isAssigned,
      isdeleted: true,
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
      isdeleted: false,
    });
    setPutSystem({
      id: filterConsoleData[0].id,
      accessoriesId: filterConsoleData[0].accessoriesId,
      brandId: filterConsoleData[0].brandId,
      productName: filterConsoleData[0].productName,
      modelNumber: filterConsoleData[0].modelNumber,
      serialNumber: filterConsoleData[0].serialNumber,
      tags: filterConsoleData[0].isAssigned,
      isdeleted: false,
    });
    saveBtnOn();
    ModalOpen();
  };

  //PutMethod
  const PutMethod = async () => {
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
        isdeleted: putSystem.isdeleted,
      };
      await dispatch(putProductsDetail(putData));
      dispatch(getProductsDetail());
      ModalClose();
      message.success("Saved Successfully!");
    }
  };

  //Add Product Button
  const addProduct = async () => {
    if (
      !system.productName ||
      !system.accessoriesId ||
      !system.brandId ||
      !system.modelNumber ||
      !system.serialNumber
    ) {
      message.error("Please Fill all the fields!");
    } else {
      const newProduct = {
        accessoriesId: system.accessoriesId,
        brandId: system.brandId,
        productName: system.productName,
        modelNumber: system.modelNumber,
        serialNumber: system.serialNumber,
        tags: system.isAssigned,
        isAssigned: false
      };
      try {
        await dispatch(postProductsDetail(newProduct));
        await dispatch(getProductsDetail());
        setModalOpen(false);
        clearFields();
      } catch (error) {
        console.error("Error adding product:", error);
      }
    }
  };

  //Displaying data in table data
  const consolesUnDeleted = productsDetail.filter(
    (consoleItem) => consoleItem.isDeleted === false
  );
  const TableDATA = consolesUnDeleted.map((cnsl, i) => ({
    SNo: i + 1,
    key: cnsl.id,
    id: cnsl.id,
    producttype: cnsl.accessoryName,
    brand: cnsl.brandName,
    productName: cnsl.productName,
    modelNumber: cnsl.modelNumber,
    serialNumber: cnsl.serialNumber,
    tags: cnsl.isAssigned
  }));

  const [empData, setEmpData] = useState([]);

  useEffect(() => {
    dispatch(getEmployees());
    dispatch(getaccessories());
    dispatch(getProductsDetail());
    dispatch(getbrand());

  }, [dispatch]);

  function DataLoading() {
    const filteredProducts = productsDetail.filter(
      (products) => products.isDeleted === false
    );
    setProCounts(filteredProducts.length);
    const filteredPcData = productsDetail.filter(
      (pc) => pc.accessoryName === "Pc" && pc.isDeleted === false
    );
    setPcCounts(filteredPcData.length);
  }
  useEffect(() => {
    setEmpData(employee);
    setProData(productsDetail);
    setPcData(productsDetail);
    DataLoading();
  }, [employee, productsDetail, officeData]);
  // useEffect(() => {
  //   const combinedData = accessories.map((item) => ({
  //     name: item.name,
  //   }));
  // }, [accessories]);

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
  const officeFilter = office.filter((ofc) => ofc.isdeleted === false);
  const officeOption = officeFilter.map((off) => ({
    label: off.officename,
    value: off.id,
  }));

  //office Dropdown
  const officeNameDropdown = (data, value) => {  
    setStorage((pre) => ({ ...pre, officeLocationId: value.value }));
    console.log(value);
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

  const [popConfirmVisible, setPopConfirmVisible] = useState(false);

  //Transfer Ok Button function
  const handleTransferConfirm = () => {
    setStorage({
      productDetailsId: null,
      officeLocationId: null,
      isDeleted: false,
      isAssigned: false,
    })
    OpenTransferModal();  
    setPopConfirmVisible(false);
    setSelectedRowKeys([]);
  };

  //Transfer Cancel Button function
  const handleTransferCancel = () => {
    setPopConfirmVisible(false);
  };

  //Table Row Selection Check box
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [SelectedIds, setSelectedIds] = useState([]);
  const [TypeCounts, setTypeCounsts] = useState([]);
  const onSelectChange = async (newSelectedRowKeys, x) => {
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

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record) => ({
      disabled: record.tags === true
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

  //Assigned data
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 19);
  const PostStorage = async () => {        
    if (storage.officeLocationId === null) {
      message.error("Please Fill all the Fields!")
    }
    else {
      const ProductAssign = await productsDetail.filter(data => SelectedIds.some(id => id === data.id));
      const UpdateProductDetails = await ProductAssign.map(data => ({
        id: data.id,
        accessoriesId: data.accessoriesId,
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
        modifiedBy: data.modifiedBy
      }));

      //product details
      UpdateProductDetails.map(data => {
        dispatch(putProductsDetail(data));
      });

      const TransferData = SelectedIds.map(id => ({
        productDetailsId: id,
        officeLocationId: storage.officeLocationId,
        isDeleted: false,
        isAssigned: false,
      }));
      await TransferData.map(data => {
        dispatch(postProductStorageLocation(data));
      });
     CloseTransferModal();
     setIsButtonEnabled(false);
    }
  };

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
        <Col span={12} style={{ left: "35%" }}>
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
            title="Are you sure you want to transfer the data to Storage?"
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
              onClick={() => setPopConfirmVisible(true)}
              disabled={!isButtonEnabled}>
              <span>Transfer Data to Storage</span>

            </Button>
          </Popconfirm>

        </Col>

        <Col justify="flex-end" style={{ right: "1.5%" }}>

          <Button

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
          pageSize: 4,
        }}
      />

      <Modal
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
        <Form>
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

          {/* Add more form fields as needed */}
        </Form>
      </Modal>

      <Modal
        title="Add to Storage"
        open={TransferModal}
        onCancel={CloseTransferModal}
        footer={[
          <Button key="1" onClick={PostStorage}>
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
        <Form>
          <Form.Item label="Product Detail" style={{ marginBottom: 0, marginTop: 10 }}
          >
            {
              Object.entries(TypeCounts).map(([product, count]) => {
                return <><span key={product}>{product + ` -${count}`}</span>, </>
              })
            }
          </Form.Item>

          <Form.Item label="Office Location" style={{ marginBottom: 0, marginTop: 10 }} >
            <Select style={{ float: "right", width: "380px" }}
              placeholder="Select Office Location"
              options={officeOption}
              value={storage.officeLocationId}
              name="Office Location"
              onChange={officeNameDropdown}
            />
          </Form.Item>
        </Form>

      </Modal>
    </div>
  );
};
export default Products;
