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
import { getProducts } from "../redux/slices/productSlice";
import {
  getProductsDetail,
  putProductsDetail,
  postProductsDetail,
} from "../redux/slices/productsDetailSlice";

const formatter = (value) => <CountUp end={value} />;

const Products = ({ officeData }) => {
  const [searchText, setSearchText] = useState("");
  const columns = [
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
      // render: (_, { tags }) => (
      //   <>
      //     {Array.isArray(tags) &&
      //       tags.map((tag) => {
      //         let color = tag.length > 5 ? "geekblue" : "green";
      //         if (tag === "Repair") {
      //           color = "volcano";
      //         }else if (tag ==="Not Assigned"){
      //           color="red";
      //         }
      //         return (
      //           <Tag color={color} key={tag}>
      //             {tag.toUpperCase()}
      //           </Tag>
      //         );
      //       })}
      //   </>
      // ),
      
        render: (_, tags) => {
          let color = tags.isAssigned ? "geekblue" : "red";
          let tagText = tags.isAssigned ? "Assigned" : "Not Assigned";
          return (
            <Tag color={color}>
              {tagText.toUpperCase()}
            </Tag>
          );
        }, 
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
            <Button>
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

  const { employee, loading } = useSelector((state) => state.employee);

  const { accessories } = useSelector((state) => state.accessories);

  const { brand } = useSelector((state) => state.brand);

  const { productsDetail } = useSelector((state) => state.productsDetail) || [];

  const { products } = useSelector((state) => state.products);

  const [proData, setProData] = useState([]);

  const [proCounts, setProCounts] = useState();

  const [pcData, setPcData] = useState([]);

  const [pcCounts, setPcCounts] = useState();



  // console.log("Consoles:",consoles);

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
    tags:"",
    isdeleted: false,
  });
  // console.log("System:",system);

  //Table data and Column
  const TableDatas = productsDetail.map((cnsl, i) => ({
    // id:cnsl.id,
    id: cnsl.id,
    accessoriesId: cnsl.accessoriesId,
    brandId: cnsl.brandId,
    productName: cnsl.productName,
    modelNumber: cnsl.modelNumber,
    serialNumber: cnsl.serialNumber,
    tags:cnsl.isAssigned,
    isdeleted: false,
  }));
  //  console.log("Table Datas:",TableDatas);

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
      tags:"",
      isdeleted: false,
    });
  };

  //Brand Dropdown
  const brandDropDown = (data) => {
    setSystem((pre) => ({ ...pre, brandId: data }));
    // console.log(data);
  };

  //Delete Icon
  const DeleteIcon = async (id) => {
    console.log(id.id);

    const PreviousValue = TableDatas.filter((pr) => pr.id === id.id);
    console.log("Previous Value:", PreviousValue);

    const DeleteData = {
      id: PreviousValue[0].id,
      accessoriesId: PreviousValue[0].accessoriesId,
      brandId: PreviousValue[0].brandId,
      productName: PreviousValue[0].productName,
      modelNumber: PreviousValue[0].modelNumber,
      serialNumber: PreviousValue[0].serialNumber,
      tags:PreviousValue[0].isAssigned,
      isdeleted: true,
    };
    console.log("Deleted Data:", DeleteData);
    await dispatch(putProductsDetail(DeleteData));
    await dispatch(getProductsDetail());
    message.success("Deleted Successfully!");

    // //Hard Delete
    // await dispatch(deleteconsoles(id.id));
    // await dispatch(getconsoles());
  };

  useEffect(() => {
    dispatch(getProductsDetail());
  }, [dispatch]);

  //Edit Icon
  const PencilBtn = (record) => {
    // const PreviousValue = TableDatas.filter(pr => pr.key === record);

    const filterConsoleData = productsDetail.filter((cl) => cl.id === record);
    console.log("Filter Console Data", filterConsoleData);

    setSystem({
      id: filterConsoleData[0].id,
      accessoriesId: filterConsoleData[0].accessoriesId,
      brandId: filterConsoleData[0].brandId,
      productName: filterConsoleData[0].productName,
      modelNumber: filterConsoleData[0].modelNumber,
      serialNumber: filterConsoleData[0].serialNumber,
      tags:filterConsoleData[0].isAssigned,
      isdeleted: false,
    });
    console.log("Sysytem:", system);
    setPutSystem({
      id: filterConsoleData[0].id,
      accessoriesId: filterConsoleData[0].accessoriesId,
      brandId: filterConsoleData[0].brandId,
      productName: filterConsoleData[0].productName,
      modelNumber: filterConsoleData[0].modelNumber,
      serialNumber: filterConsoleData[0].serialNumber,
      tags:filterConsoleData[0].isAssigned,
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
        tags:system.isAssigned,
        isdeleted: putSystem.isdeleted,
      };
      console.log("putData:", putData);
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
        // id:system.id,
        accessoriesId: system.accessoriesId,
        brandId: system.brandId,
        productName: system.productName,
        modelNumber: system.modelNumber,
        serialNumber: system.serialNumber,
        tags:system.isAssigned
      };
      // console.log("newProduct:",newProduct);
      try {
        await dispatch(postProductsDetail(newProduct));
        await dispatch(getProductsDetail());
        // setCombinedDatas(system);
        // console.log(system);
        setModalOpen(false);
        clearFields();
      } catch (error) {
        console.error("Error adding product:", error);
      }
    }
  };

  console.log("Products Detail:", productsDetail);

  //Displaying data in table data
  const consolesUnDeleted = productsDetail.filter(
    (consoleItem) => consoleItem.isDeleted === false 
  );
  console.log(consolesUnDeleted);
  const TableDATA = consolesUnDeleted.map((cnsl) => ({
    id: cnsl.id,
    producttype: cnsl.accessoryName,
    brand: cnsl.brandName,
    productName: cnsl.productName,
    modelNumber: cnsl.modelNumber,
    serialNumber: cnsl.serialNumber,
    tags: cnsl.isAssigned ? "Assigned" : "Not Assigned"
  }));
  console.log("TableDATA:",TableDATA);

  const [empData, setEmpData] = useState([]);

  const showModal = () => {
    setModalOpen(true);
    // dispatch(getconsoles());
  };

  useEffect(() => {
    dispatch(getEmployees());
    dispatch(getaccessories());
    dispatch(getProductsDetail());
    dispatch(getbrand());
    dispatch(getProducts());
    // console.log(employee.length);
  }, [dispatch]);

  // console.log("proData:",proData);
  // console.log("Pc Data:",pcData);

  function DataLoading() {
    const filteredProducts = productsDetail.filter(
      (products) => products.isDeleted === false
    );
    console.log("Filter:", filteredProducts);
    // setTabelData(filteredProducts)
    setProCounts(filteredProducts.length);
    const filteredPcData = productsDetail.filter(
      (pc) => pc.accessoryName === "Pc" && pc.isDeleted === false
    );
    console.log("Filtr pc:", filteredPcData);
    setPcCounts(filteredPcData.length);
  }

  // console.log("COnsoles:",system);
  useEffect(() => {
    setEmpData(employee);
    setProData(productsDetail);
    setPcData(productsDetail);
    DataLoading();
  }, [employee, productsDetail, officeData]);

  useEffect(() => {
    // console.log("Accessories Data:",accessories);
    const combinedData = accessories.map((item) => ({
      name: item.name,
    }));
    // console.log("Combined Data:",combinedData);
  }, [accessories]);

  //console.log(empData);

  const productFilter = accessories.filter((acc) => acc.isdeleted === false);
  const productOption = productFilter.map((pr, i) => ({
    label: pr.name,
    value: pr.id,
  }));

  const productNameDropDown = (data, value) => {
    setSystem((pre) => ({ ...pre, accessoriesId: data }));
    // console.log(data);
  };

  const brandFilter = brand.filter((brnd) => brnd.isdeleted === false);
  // console.log(brandFilter);
  const brandOption = brandFilter.map((br, i) => ({
    label: br.name,
    value: br.id,
  }));

  const productNameInputChange = (e) => {
    setSystem((pre) => ({ ...pre, productName: e.target.value }));
    console.log("productName:", e.target.value);
  };

  const handleModelNumberChange = (e) => {
    setSystem((pre) => ({ ...pre, modelNumber: e.target.value }));
    // console.log(e.target.valuesdfdsf);
  };
  const serialNumberInputChange = (e) => {
    setSystem((pre) => ({ ...pre, serialNumber: e.target.value }));
    // console.log(e.target.valuesdfdsf);
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
        <Col span={17} style={{ left: "45%" }}>
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
        <Col justify="flex-end" style={{ right: "1%" }}>
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

    

      {/* <Row justify='space-between' align='middle' gutter={16}><Col span={4}><Card bordered={true}><Statistic title="Pc" value={pcCounts} formatter={formatter} valueStyle={{ color: '#3f8600' }} /></Card></Col> </Row> */}
      {/* <Divider/>
      <Row justify='space-between' align='middle' gutter={16}><Col span={4}><Card bordered={true}><Statistic title="Pc" value={pcCounts} formatter={formatter} valueStyle={{ color: '#3f8600' }} /></Card></Col> </Row> */}

      {/* <Divider /> */}
      <Table
        columns={columns}
        dataSource={TableDATA}
        pagination={{
          pageSize: 4,
        }}
      />

{/* <Row justify="space-between" align="middle" gutter={16}>
        <Col span={4}>
          <Card bordered={true}>
            <Statistic
              title="PC"
              value={pcCounts}
              formatter={formatter}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>

        <Col span={4}>
          <Card bordered={true}>
            <Statistic
              title="Pc"
              value={pcCounts}
              formatter={formatter}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>

        <Col span={4}>
          <Card bordered={true}>
            <Statistic
              title="Pc"
              value={pcCounts}
              formatter={formatter}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>

        <Col span={4}>
          <Card bordered={true}>
            <Statistic
              title="Pc"
              value={pcCounts}
              formatter={formatter}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>

        <Col span={4}>
          <Card bordered={true}>
            <Statistic
              title="Pc"
              value={pcCounts}
              formatter={formatter}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>

        <Col span={4}>
          <Card bordered={true}>
            <Statistic
              title="Pc"
              value={pcCounts}
              formatter={formatter}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        
      </Row>
      <Divider /> */}

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
    </div>
  );
};

export default Products;
