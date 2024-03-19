import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Modal,
  Form,
  Input,
  message,
  Timeline,
  Button,
  Col,
  Row,
  Statistic,
  Divider,
  Select,
  Popconfirm,
  Empty,
} from "antd";
import {
  faPlus,
  faTrash,
  faPen,
  faHistory,
  faWarehouse,
  faScrewdriverWrench,
} from "@fortawesome/free-solid-svg-icons";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getProductsRepairHistory,
  postProductsRepairHistory,
} from "../redux/slices/productsrepairhistorySlice";

const formatter = (value) => <CountUp end={value} />;

const Products = ({ officeData }) => {
  const [form] = Form.useForm();

  //Validation for comment in Add to Repair Button
  const onFinish = () => {
    form
      .validateFields()
      .then((values) => {
        PostRepair();
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };

  const [searchText, setSearchText] = useState("");

  const columns = [
    {
      title: "S.No",
      dataIndex: "SNo",
      key: "SNo",
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
          {text.isRepair === true ? (
            <Tag color="yellow">Repair</Tag>
          ) : text.isAssigned === true ? (
            <Tag color="green">Assigned</Tag>
          ) : text.isStorage === true ? (
            <Tag color="orange">Storage</Tag>
          ) : text.isAssigned === false ? (
            <Tag color="red">Not Assigned</Tag>
          ) : (
            0
          )}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-x-2">
          <Button onClick={() => historyButton(record.id)} type="link">
            <FontAwesomeIcon icon={faHistory} />
          </Button>
          <Button onClick={() => PencilBtn(record.id)} type="link">
            <FontAwesomeIcon icon={faPen} color="#000000" />
          </Button>

          <Popconfirm
            title="Are you sure to delete this?"
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              style: { backgroundColor: "red", color: "white" },
            }}
            onConfirm={() => DeleteIcon(record)}
          >
            <Button type="link">
              <FontAwesomeIcon icon={faTrash} color="#fd5353" />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const modalColumn = [
    {
      title: "S.No",
      dataIndex: "SNo",
      key: "SNo",
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
      title: "Office Name",
      dataIndex: "officeLocationId",
      key: "officeLocationId",
    },
  ];

  const dispatch = useDispatch();

  const { accessories } = useSelector((state) => state.accessories);

  const { brand } = useSelector((state) => state.brand);

  const { productsDetail } = useSelector((state) => state.productsDetail);

  const { productsrepairhistory } = useSelector(
    (state) => state.productsrepairhistory
  );

  const { office } = useSelector((state) => state.office);

  const [proData, setProData] = useState([]);

  const [proCounts, setProCounts] = useState();

  const [tableDATA, setTableDATA] = useState([]);

  const [select, setSelect] = useState(undefined);

  const [repairHistoryModal, setRepairHistoryModal] = useState(false);

  const OpenRepairHistoryModal = () => setRepairHistoryModal(true);

  const CloseRepairHistoryModal = () => {
    SetSendHistory({
      key: null,
      label: null,
      children: null,
    });
    setRepairHistoryModal(false);
  };

  //pop-Up Window
  const [modalOpen, setModalOpen] = useState(false);
  const ModalOpen = () => setModalOpen(true);
  const ModalClose = () => {
    setModalOpen(false);
    setSystem((pre) => ({ ...pre, officeLocationId: undefined }));
    setSelect(true);
  };

  //Save or Add Button State
  const [saveBtn, setsaveBtn] = useState(false);
  const saveBtnOn = () => setsaveBtn(true);
  const saveBtnOff = () => setsaveBtn(false);

  const [notAssign, setNotAssign] = useState(false);

  //Add New Field
  const AddNewBtn = () => {
    setNotAssign(!notAssign);
    clearFields();
    saveBtnOff();
    ModalOpen();
    if (form) {
      form.resetFields();
    }
    setSystem((pre) => ({ ...pre, officeLocationId: undefined }));
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
    isAssigned: false,
    isDeleted: false,
    isRepair: false,
    officeLocationId: undefined,
    isStorage: false,
    employeeId: null,
  });

  //Table data and Column
  const TableDatas = productsDetail.map((cnsl, i) => ({
    id: cnsl.id,
    accessoriesId: cnsl.accessoriesId,
    brandId: cnsl.brandId,
    productName: cnsl.productName,
    modelNumber: cnsl.modelNumber,
    serialNumber: cnsl.serialNumber,
    tags: cnsl.isAssigned,
    isAssigned: false,
    isRepair: false,
    isDeleted: false,
    isStorage: false,
    officeLocationId: cnsl.officeLocationId,
    employeeId: cnsl.employeeId,
  }));

  //Modify
  const [putSystem, setPutSystem] = useState([]);
  const clearFields = () => {
    setSystem((pre) => ({
      ...pre,
      id: "",
      accessoriesId: "",
      brandId: "",
      productName: "",
      modelNumber: "",
      serialNumber: "",
      tags: "",
      isDeleted: false,
      isAssigned: false,
      isRepair: false,
      officeLocationId: undefined,
      isStorage: false,
      employeeId: "",
    }));
    if (form) {
      form.resetFields(["officeLocationId"]);
    }
  };
  useEffect(() => {
    dispatch(getProductsDetail());
  }, []);

  //Brand Dropdown
  const brandDropDown = (data) => {
    setSystem((pre) => ({ ...pre, brandId: data }));
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
      isStorage: false,
      isRepair: false,
      isAssigned: false,
      officeLocationId: PreviousValue[0].officeLocationId,
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
    dispatch(getProductsRepairHistory());
  }, []);

  //Edit Icon
  const PencilBtn = (record) => {
    const filterConsoleData = tableDATA.filter((cl) => cl.id === record);
    setSystem({
      id: filterConsoleData[0].id,
      accessoriesId: filterConsoleData[0].accessoriesId,
      brandId: filterConsoleData[0].brandId,
      productName: filterConsoleData[0].productName,
      modelNumber: filterConsoleData[0].modelNumber,
      serialNumber: filterConsoleData[0].serialNumber,
      tags: filterConsoleData[0].isAssigned,
      isDeleted: false,
      isAssigned: false,
      isRepair: false,
      isStorage: false,
      officeLocationId: filterConsoleData[0].officeLocationId,
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
      isStorage: false,
      isRepair: false,
      isAssigned: false,
      officeLocationId: filterConsoleData[0].officeLocationId,
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
        isStorage: LocationStatus,
        isAssigned: system.isAssigned,
        isRepair: system.isRepair,
        officeLocationId: system.officeLocationId,
      };
      // console.log(putData);
      await dispatch(putProductsDetail(putData));
      dispatch(getProductsDetail());
      ModalClose();
      message.success("Saved Successfully!");
    }
  };

  const [LocationStatus, setLocationStatus] = useState(false);

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
      const serialNumberExists = tableDATA.some(
        (product) => product.serialNumber === system.serialNumber
      );
      if (serialNumberExists) {
        message.error("Serial Number already exists!");
      } else {
        const newProduct = {
          accessoriesId: system.accessoriesId,
          brandId: system.brandId,
          productName: system.productName,
          modelNumber: system.modelNumber,
          serialNumber: system.serialNumber,
          isAssigned: false,
          isDeleted: false,
          isRepair: false,
          officeLocationId: system.officeLocationId,
          isStorage: LocationStatus,
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
        await setSystem((pre) => ({ ...pre, officeLocationId: undefined }));
        if (form) {
          form.resetFields(["officeLocationId"]);
        }
      }
    }
  };

  // Map the sorted productsDetail array to TableDATA
  const FilterData =
    tableDATA && tableDATA.length > 0
      ? tableDATA
          .filter((consoleItem) => !consoleItem.isDeleted)
          .sort((a, b) => a.id - b.id)
      : [];

  const TableDATA = FilterData.map((cnsl, i) => ({
    SNo: i + 1,
    key: cnsl.id,
    id: cnsl.id,
    producttype: cnsl.accessoryName,
    brand: cnsl.brandName,
    productName: cnsl.productName,
    modelNumber: cnsl.modelNumber,
    serialNumber: cnsl.serialNumber,
    tags: cnsl.isAssigned,
    isAssigned: cnsl.isAssigned,
    isDeleted: cnsl.isDeleted,
    isRepair: cnsl.isRepair,
    officeLocationId: cnsl.officeName,
    isStorage: cnsl.isStorage,
    employeeId: cnsl.employeeId,
  }));
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
      const filterOneOffice = productsDetail
        ? productsDetail.filter(
            (products) =>
              products.isDeleted === false &&
              products.officeName === officeNames[0]
          )
        : 0;
      console.log(filterOneOffice);
      setProCounts(filterOneOffice.length);
      setTableDATA(filterOneOffice);
    } else {
      const filterAllOffice = productsDetail
        ? productsDetail.filter((products) => products.isDeleted === false)
        : 0;
      setProCounts(filterAllOffice.length);
      setTableDATA(filterAllOffice);
    }
  }

  useEffect(() => {
    setProData(productsDetail);
    DataLoading();
  }, [productsDetail, officeData]);

  //Product Option
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

  //Office Dropdown Option
  const officeOption = [
    { label: "Not Assigned", value: null }, // Static option
    ...office
      .filter((ofc) => !ofc.isdeleted)
      .map((off) => ({
        label: off.officename,
        value: off.id, // Assuming 'id' is the unique identifier for each office
      })),
  ];

  const officeNameDropdowninProduct = (data, value) => {
    console.log(value.value, data);
    setSystem((pre) => ({ ...pre, officeLocationId: value.value }));
    setSelect(value);
    // setLocationStatus(true);
    if (value.value === null) {
      setLocationStatus(false);
    } else {
      setLocationStatus(true);
    }
  };

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
  const [RepairModal, setRepairModal] = useState(false);
  const OpenRepairModal = () => setRepairModal(true);
  const CloseRepairModal = () => setRepairModal(false);

  const [popConfirmVisible, setPopConfirmVisible] = useState(false);

  const [popConfirmRepairVisible, setPopConfirmRepairVisible] = useState(false);

  //Transfer Storage Ok Button function
  const [temporarySelectedRowKeys, setTemporarySelectedRowKeys] = useState([]);

  const [comments, setComments] = useState("");

  const handleTransferConfirm = () => {
    setSystem(productsDetail);
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
      isDeleted: false,
      isRepair: false,
      isAssigned: false,
      isStorage: false,
      comments: null,
      officeLocationId: null,
    });
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
      isDeleted: false,
      isRepair: false,
    });
    OpenRepairModal();
    setPopConfirmRepairVisible(false);
    setSelectedRowKeys(temporaryKey);
    setTemporaryKey([]);
  };

  //Repair Cancel Button

  const handleRepairCancel = () => {
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
    const types = await x.map((obj) => obj.producttype);
    const counts = await {};
    await types.forEach((item) => {
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
      disabled: record.isAssigned === true || record.isRepair === true,
    }),
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        id: "odd",
        text: "Select Odd Row",
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
        id: "even",
        text: "Select Even Row",
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
    if (system.officeLocationId === undefined) {
      message.error("select office location");
    } else {
      const ProductAssign = await productsDetail.filter((data) =>
        SelectedIds.some((id) => id === data.id)
      );
      console.log(ProductAssign);

      const UpdateProductDetails = await ProductAssign.map((data) => ({
        id: data.id,
        accessoriesId: data.accessoriesId,
        brandId: data.brandId,
        productName: data.productName,
        modelNumber: data.modelNumber,
        serialNumber: data.serialNumber,
        isDeleted: false,
        isRepair: false,
        isAssigned: false,
        isStorage: true,
        officeLocationId: system.officeLocationId,
        createdDate: data.createdDate,
        createdBy: data.createdBy,
        modifiedDate: formattedDate,
        modifiedBy: data.modifiedBy,
      }));
      // console.log(UpdateProductDetails);

      await Promise.all(
        UpdateProductDetails.map(async (data) => {
          await dispatch(putProductsDetail(data));
          await dispatch(getEmployees());
          await dispatch(getbrand());
          await dispatch(getaccessories());
          await dispatch(getProductsDetail());
        })
      );

      await dispatch(getEmployees());
      await dispatch(getbrand());
      await dispatch(getaccessories());
      await dispatch(getProductsDetail());

      CloseTransferModal();
      setIsButtonEnabled(false);
      setSystem((pre) => ({ ...pre, officeLocationId: undefined }));
      setSelectedRowKeys([]);
    }
  };

  //Send Repair Function
  const PostRepair = async () => {
    const ProductRepair = await productsDetail.filter((data) =>
      SelectedIds.some((id) => id === data.id)
    );
    console.log(ProductRepair);

    const UpdateRepairedProductDetails = await ProductRepair.map((data) => ({
      id: data.id,
      accessoriesId: data.accessoriesId,
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
      isStorage: false,
      officeLocationId: data.officeLocationId,
      comments: comments,
    }));
    setSelectedRowKeys([]);
    UpdateRepairedProductDetails.map(async (data) => {
      await dispatch(putProductsDetail(data));
      await dispatch(getProductsDetail());
    });

    const UpdateProductRepairHistory = await ProductRepair.map((data2) => ({
      productsDetailId: data2.id,
      comments: comments,
      createdDate: data2.createdDate,
      createdBy: data2.createdBy,
      modifiedDate: data2.modifiedDate,
      modifiedBy: data2.modifiedBy,
      isDeleted: data2.isDeleted,
    }));

    UpdateProductRepairHistory.map(async (data2) => {
      await dispatch(postProductsRepairHistory(data2));
    });

    CloseRepairModal();
    setIsButtonEnabled(false);
  };

  const selectedrowDatas = TableDATA.filter((row) =>
    selectedRowKeys.includes(row.key)
  );

  const selectedrowrepairData = TableDATA.filter((row) =>
    selectedRowKeys.includes(row.key)
  );

  const [sendHistory, SetSendHistory] = useState([]);
  
  const historyButton = async (record) => {
    const historyFilter = productsrepairhistory.filter(
      (data) => data.productsDetailId === record
    );
    if (historyFilter.length > 0) {
      console.log(historyFilter.length);
      const historyItems = historyFilter.map((item) => ({
        key: item.id,
        label: item.createdDate,
        children: item.comments,
      }));
      SetSendHistory(historyItems);
    } else {
      SetSendHistory([]);
    }
    await getProductsRepairHistory();
    OpenRepairHistoryModal();
  };

  const items = Array.isArray(sendHistory)
    ? sendHistory.map((historyItem) => ({
        key: historyItem.key,
        label: historyItem.label,
        children: historyItem.children,
      }))
    : [];

  return (
    <div>
      <ul className="flex flex-col lg:flex-row justify-between lg:items-center gap-y-3 gap-x-2 2xl:gap-x-0 xl:gap-y-0">
        <li className="grid grid-flow-col gap-x-10 items-center self-center xs:self-start">
          <Statistic
            className="block text-center w-fit lg:w-[120px]"
            title="Products Count"
            value={proCounts}
            formatter={formatter}
            valueStyle={{ color: "#3f8600" }}
          />
          <Input.Search
             className=" w-fit hidden md:block"
            placeholder="Search here...."
            onSearch={(value) => {
              setSearchText(value);
            }}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
        </li>

        <li  className="flex flex-col  xmm:flex-row gap-x-2 gap-y-3 lg:gap-y-0">
          
          <Popconfirm
            title="Are you sure you want to transfer the data to Storage?" //Transfer to Storage Button
            open={popConfirmVisible}
            onConfirm={handleTransferConfirm}
            onCancel={handleTransferCancel}
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              style: { backgroundColor: "#4088ff" },
            }}>
            <Button
              type="primary"
              className="bg-blue-500 flex justify-center items-center gap-x-1 w-full xs:w-fit"
              open={TransferModal}
              onClick={() => {
                setPopConfirmVisible(true);
                setTemporarySelectedRowKeys(selectedRowKeys); // Store the temporary selected row keys
              }}
              disabled={!isButtonEnabled}
            >
              <FontAwesomeIcon icon={faWarehouse} className="icon" />{" "}
              <span>Move to Storage</span>
            </Button>
          </Popconfirm>


          <Popconfirm
          className=""
            title="Are you sure you want to transfer the Products to Repair?"
            open={popConfirmRepairVisible}
            onConfirm={handleRepairConfirm}
            onCancel={handleRepairCancel}
            okText="Yes"
            okButtonProps={{
              style: { backgroundColor: "#4088ff" },
            }}
            cancelText="No">
            <Button
              type="primary"
              className="bg-blue-500 flex justify-center items-center gap-x-1 w-full xs:w-fit" //Transfer to Repair Button
              open={RepairModal}
              onClick={() => {
                setPopConfirmRepairVisible(true);
                setTemporaryKey(selectedRowKeys); // Store the temporary selected row keys
              }}
              disabled={!isButtonEnabled}
            >
              <FontAwesomeIcon icon={faScrewdriverWrench} className="icon " />{" "}
              <span>Transfer to Repair</span>
            </Button>
          </Popconfirm>

          <Button
            disabled={isButtonEnabled}
            onClick={() => AddNewBtn()}
            type="primary"
            className="bg-blue-500 sm:col-span-2  md:col-span-1 flex justify-center items-center gap-x-1 w-full xs:w-fit"
          >
            <FontAwesomeIcon icon={faPlus} className="icon" />{" "}
            <span>Add Product</span>
          </Button>

</li>


<li className="block md:hidden">
<Input.Search
             className=" block w-full "
            placeholder="Search here...."
            onSearch={(value) => {
              setSearchText(value);
            }}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />

</li>

       
      </ul>

      {/* <Row
        justify="space-between"
        align="middle"
        gutter={12}
        className="flex justify-between items-center"
      >
        <Col
          span={4}
          className="grid grid-flow-col gap-x-10 items-center"
        ></Col>
        <Col span={10} style={{ right: "10%", width: "100%" }}></Col>

        <Col justify="flex-end" style={{ right: "1%" }}></Col>

        <Col justify="flex-end" style={{ right: "0.5%" }}></Col>

        <Col justify="flex-end" style={{ right: "0%" }}></Col>
      </Row> */}

      <Divider />
      <div className="w-full overflow-x-scroll sm:overflow-x-hidden">
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={TableDATA}
        pagination={{
          pageSize: 6,
        }}
        xs={20}
        xl={4}
      />
      </div>

      <Modal //Add Product Modal
       centered ={true}
        title="Add Product"
        open={modalOpen}
        onCancel={ModalClose}
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
        xs={20}
        xl={4}
      >
  
        <Form form={form} className="grid grid-cols-1 gap-y-0" layout="vertical">
          
          <Form.Item
            label="Product Name"
            style={{ marginBottom: 0, marginTop: 10 }}
          >
            <Input
              // style={{ float: "right", width: "380px" }}
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
              // style={{ float: "right", width: "380px" }}
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
              // style={{ float: "right", width: "380px" }}
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
              // style={{ float: "right", width: "380px" }}
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
              // style={{ float: "right", width: "380px" }}
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
              // style={{ float: "right", width: "380px" }}
              placeholder="Select Office Location"
              options={officeOption}
              value={system.officeLocationId}
              name="officeLocationId"
              onChange={officeNameDropdowninProduct}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal //Add to Storage Modal
        title="Add to Storage"
        centered={true}
        open={TransferModal}
        onCancel={CloseTransferModal}
        width={1000}
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
          </Button>,
        ]}
        xs={20}
        xl={4}
      >
        <div className="w-full flex justify-start items-center mb-3 mt-4">
            <Select
             
              placeholder="Select Office Location"
              options={officeOption}
              value={system.officeName}
              onChange={officeNameDropdowninProduct}
            />
        </div>

        <div className="w-full overflow-x-scroll sm:overflow-x-hidden">
        <Table
          columns={modalColumn}
          dataSource={selectedrowDatas}
          pagination={{
            pageSize: 6,
          }}
          xs={20}
          xl={4}
        ></Table>
        </div>
      </Modal>

      <Modal //Add to Repair Modal
        title="Add to Repair"
        open={RepairModal}
        onCancel={CloseRepairModal}
        centered={true}
        width={1000}
        footer={[
          <Button key="1" onClick={onFinish}>
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
          </Button>,
        ]}
        xs={20}
        xl={4}
      >
        <Form form={form} className="mt-2">
          <Form.Item
            name="comments"
            rules={[{ required: true, message: "Add a Comment!" }]}
          >
            <Input.TextArea
            className="w-full"
              rows={3}
              
              placeholder="Add a Comment..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </Form.Item>
        </Form>
        {/* <Divider /> */}
       <div className="w-full overflow-x-scroll sm:overflow-x-hidden">
       <Table
          columns={modalColumn}
          dataSource={selectedrowrepairData}
          pagination={{
            pageSize: 6,
          }}
        ></Table>
       </div>

      </Modal>

      <Modal //History Button Modal
      centered={true}
        title={<div className="text-center mt-3">Products History</div>}
        open={repairHistoryModal}
        // onOk={CloseRepairHistoryModal}
        // okButtonProps={{
        //   style: { backgroundColor: "#4088ff" },
        // }}
        className="h-fit m-0"
        onCancel={CloseRepairHistoryModal}
        //width={1000}
        xs={20}
        xl={4}
        footer={[""]}
      >
        {items.length > 0 ? (
          <Timeline mode="left" className="w-full pt-4 xs:overflow-x-hidden ">
            {items.map((item) => (
              <Timeline.Item key={item.key} label={item.label.split('T')[0]}>
                {item.children}
              </Timeline.Item>
            ))}
          </Timeline>
        ) : (
          <Empty /> // Empty fragment
        )}
      </Modal>
    </div>
  );
};
export default Products;
