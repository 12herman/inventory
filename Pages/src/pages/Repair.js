import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Popconfirm, Table } from 'antd';
import { Col, Row, Statistic, Divider, Tag, Card, Modal, Select, message, Timeline,Empty} from 'antd';
import CountUp from 'react-countup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faHistory } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from 'react-redux'
import { getEmployees } from '../redux/slices/employeeSlice';
import { getProductsDetail, putProductsDetail } from '../redux/slices/productsDetailSlice';
import { getProductsRepairHistory, putProductsRepairHistory, postProductsRepairHistory } from '../redux/slices/productsrepairhistorySlice';



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


const Repair = ({ officeData }) => {

  //Input Field Value
  const [system, setSystem] = useState({
    id: null,
    accessoriesId: null,
    brandId: null,
    productName: "",
    modelNumber: "",
    serialNumber: "",
    isAssigned: false,
    isDeleted: false,
    isRepair: false,
    isStorage: false,
    officeLocationId: undefined,
    comments: ""
  });
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const { employee, loading } = useSelector(state => state.employee);
  const [empData, setEmpData] = useState([]);

  const { productsDetail } = useSelector(state => state.productsDetail);

  const [proData, setProData] = useState([]);

  const [proCount, setProCount] = useState();

  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const [SelectedIds, setSelectedIds] = useState([]);

  const [StorageModal, setStorageModal] = useState(false);

  const openStorageModal = () => setStorageModal(true);

  const closeStorageModal = () => setStorageModal(false);

  const [popConfirmRepairVisible, setPopConfirmRepairVisible] = useState(false);

  const [temporaryKey, setTemporaryKey] = useState([]);

  const { office } = useSelector((state) => state.office);

  const [LocationStatus, setLocationStatus] = useState(false);

  const [storagelocData, setProLocData] = useState();

  const { productsrepairhistory } = useSelector((state) => state.productsrepairhistory);

  const [repairHistoryModal, setRepairHistoryModal] = useState(false);

  const OpenRepairHistoryModal = () => setRepairHistoryModal(true);

  const CloseRepairHistoryModal = () => {
    SetSendHistory({
      key: null,
      label: null,
      children: null
    });
    setRepairHistoryModal(false);
  };


  useEffect(() => {
    dispatch(getEmployees());
    dispatch(getProductsDetail());
    dispatch(getProductsRepairHistory());
  }, []);


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
    {
      title: "View History",
      dataIndex: "history",
      key: "history",
      render: (_, record) => (
        <div className="flex gap-x-2">
          <Button onClick={() => historyButton(record.id)} type='link'>
            <FontAwesomeIcon icon={faHistory} />

          </Button>
        </div>
      )


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
      // tags: null,
      isDeleted: false,
      isRepair: false,
      isStorage: false,
      isAssigned: false,
      officeLocationId: null,
      comments: null
    })
    openStorageModal();
    setPopConfirmRepairVisible(false);
    setSelectedRowKeys(temporaryKey);
    setTemporaryKey([]);
  };

  const handleStorageCancel = () => {
    setPopConfirmRepairVisible(false);
  };

  const PostStorage = async () => {
    if (system.officeLocationId === undefined) {
      message.error("select office location");
    } else {
      const ProductStorage = await productsDetail.filter(data => SelectedIds.some(id => id === data.id));
      console.log(ProductStorage);

      const updatedStorageDetails = await ProductStorage.map(data => ({
        id: data.id,
        accessoriesId: data.accessoriesId,
        brandId: data.brandId,
        productName: data.productName,
        modelNumber: data.modelNumber,
        serialNumber: data.serialNumber,
        createdDate: data.createdDate,
        createdBy: data.createdBy,
        modifiedDate: data.modifiedDate,
        modifiedBy: data.modifiedBy,
        isDeleted: data.isDeleted,
        isRepair: false,
        isAssigned: data.isAssigned,
        comments: data.comments,
        officeLocationId: system.officeLocationId,
        isStorage: true
      })
      );

      const UpdateProductRepairHistory = await ProductStorage.map(data2 => ({
        productsDetailId: data2.id,
        comments: " Product Returned",
        createdDate: data2.createdDate,
        createdBy: data2.createdBy,
        modifiedDate: data2.modifiedDate,
        modifiedBy: data2.modifiedBy,
        isDeleted: data2.isDeleted,

      }));

      UpdateProductRepairHistory.map(async data2 => {
        await dispatch(postProductsRepairHistory(data2));
      })

      updatedStorageDetails.map(async data => {
        await dispatch(putProductsDetail(data));
        await dispatch(getProductsDetail());
      });
      closeStorageModal();
      setIsButtonEnabled(false);
      setSystem(pre => ({ ...pre, officeLocationId: undefined }))
    }
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

  useEffect(() => {
    // setEmpData(employee)
    setTableData(productsDetail);
    setProData(productsDetail);
    DataLoading();
  }, [productsDetail, officeData]);

  function DataLoading() {

    var numberOfOffice = officeData.filter((off) => off.isdeleted === false);

    var officeNames = numberOfOffice.map((off) => {
      return off.officename;
    })

    if (officeNames.length === 1) {
      // const filteredProducts = await productsDetail.filter((products) => products.isDeleted === false && products.isRepair === true);
      // console.log(filteredProducts);
      // setProCount(filteredProducts.length);

      const filterOneOffice = proData ? proData.filter(system => system.isDeleted === false && system.officeName === officeNames[0] && system.isRepair === true) : 0;
      console.log(filterOneOffice);
      setProCount(filterOneOffice.length);
      setTableData(filterOneOffice);
    } else {
      const filterAllOffice = proData ? proData.filter(system => system.isDeleted === false && system.isRepair === true) : 0;
      setProCount(filterAllOffice.length);
      setTableData(filterAllOffice);
    }

  }

  // console.log(productsDetail);

  const FilterDatas = productsDetail && productsDetail.length > 0 ? productsDetail.filter(data => data.isDeleted === false && data.isRepair === true).sort((a, b) => a.id - b.id) : 0;
  const TableDatas = FilterDatas.map((data, i) => ({
    SNo: i + 1,
    key: data.id,
    id: data.id,
    productName: data.productName,
    producttype: data.accessoryName,
    brand: data.brandName,
    modelNumber: data.modelNumber,
    serialNumber: data.serialNumber,
    // tags: data.isAssigned,
    isDeleted: data.isDeleted,
    isAssigned: data.isAssigned,
    isStorage: data.isStorage,
    isRepair: data.isRepair,
    officeLocationId: data.officeName,
    comments: data.comments,
  }));
  // console.log(TableDatas);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = async (newSelectedRowKeys) => {
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
  const [OptionClick, setOptionClick] = useState(false);

  const officeNameDropdowninProduct = (data, value) => {

    setOptionClick(true)
    setSystem((pre) => ({ ...pre, officeLocationId: value.value }));
    // setLocationStatus(true);
    if (value.value === null) {
      setLocationStatus(false);
    }
    else {
      setLocationStatus(true);
    }
  }
  const selectedrowrepairData = TableDatas.filter(row => selectedRowKeys.includes(row.key));
  // console.log(selectedrowrepairData);

  const [sendHistory, SetSendHistory] = useState([]);
  const historyButton = async (record) => {

    const historyFilter = productsrepairhistory.filter(data => data.productsDetailId === record);
    // historyFilter.map(data=>{
    //   SetSendHistory(pre => ({...pre,key:data.id,label:data.createdDate,children:data.comments}));
    // });
    if (historyFilter.length > 0) {
      // const historyItem = historyFilter[historyFilter.length-1]; // Assuming there's only one history item per product
      console.log(historyFilter.length);
      const historyItems = historyFilter.map(item => ({
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
  }
  const items = Array.isArray(sendHistory) ? sendHistory.map(historyItem => ({
    key: historyItem.key,
    label: historyItem.label,
    children: historyItem.children
  })) : [];

  // console.log(items);
  return (
    <div>
      <Row justify='space-between' align='middle'>
        <Col span={4}>
          <Statistic title="Product in Repair" value={proCount} formatter={formatter} valueStyle={{ color: "#3f8600" }} />
        </Col>{" "}
        <Col span={10} style={{ right: "16%" }}>
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
        <Col justify='flex-end' style={{ right: '1%' }} >
          <Popconfirm
            title="Are you sure you want to transfer the Products to Storage?"
            open={popConfirmRepairVisible}
            onConfirm={handleStorageConfirm}
            onCancel={handleStorageCancel}
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              style:{backgroundColor:"#4088ff"}
            } }
          >
            <Button
              type="primary" className="bg-blue-500 flex items-center gap-x-1float-right mb-3 mt-3"
              open={StorageModal}
              onClick={() => {
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
      <Modal                                //Add to Storage Modal 
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
        <div style={{ display: "flex", flexDirection: "column" }}>
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

      <Modal
        title="Products History"
        open={repairHistoryModal}
        onOk={CloseRepairHistoryModal}
        okButtonProps={{
          style:{backgroundColor:"#4088ff"}
        } }
        onCancel={CloseRepairHistoryModal}
        width={1200}
      >
        {items.length > 0 ? (
    <Timeline mode='left' style={{ margin: '10px' }}>
      {items.map((item) => (
        <Timeline.Item key={item.key} label={item.label}>
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

export default Repair;