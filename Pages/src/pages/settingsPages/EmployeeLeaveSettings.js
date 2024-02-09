import React, { useEffect, useState } from "react";
import {
  Popconfirm,
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Tag,
  message,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faPen,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  Deleteemployeeleave,
  Getemployeeleave,
  Postemployeeleave,
  Putemployeeleave,
} from "../../redux/slices/employeeLeaveSlice";
import { getEmployees } from "../../redux/slices/employeeSlice";
const headingValue = "Leave";
const filedWidth = "370px";
export default function EmployeeLeaveSettings({ BackToSetting }) {
  const [form] = Form.useForm();
  const columns = [
    {
      title: "S.No",
      dataIndex: "SerialNo",
      width: "7%",
    },
    {
      title: "Name",
      dataIndex: "employeeName",
      // width:'60%',
    },
    {
      title: "Sick Leave",
      dataIndex: "sickLeave",
      // width:'60%',
    },
    {
      title: "Casual Leave",
      dataIndex: "casualLeave",
      // width:'60%',
    },
    {
      title: "Total",
      dataIndex: "total",
      // width:'60%',
    },
    {
      title: "Leave Availed",
      dataIndex: "leaveAvailed",
      // width:'60%',
    },
    {
      title: "Operation",
      dataIndex: "operation",
      width: "20%",
      render: (text, record) => (
        <div className="flex gap-x-2">
          <Popconfirm
            title="Are you sure to delete this?"
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              style: { backgroundColor: "red", color: "white" },
            }}
            onConfirm={() => Delete(record.key)}
          >
            <Button disabled={SelectTableData}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </Popconfirm>
          <Button
            disabled={SelectTableData}
            onClick={() => PencelBtn(record.key)}
          >
            <FontAwesomeIcon icon={faPen} />
          </Button>
        </div>
      ),
    },
  ];
  //input fields and clear fields
  const [EmployeeLeaveIn, setEmployeeLeaveIn] = useState({
    employeeId: null,
    sickLeave: null,
    casualLeave: null,
    total: null,
    leaveAvailed: null,
    isDeleted: false,
  });
  const clearEmployeeLeaveIn = () => {
    setEmployeeLeaveIn({
      employeeId: null,
      sickLeave: null,
      casualLeave: null,
      total: null,
      leaveAvailed: null,
      isDeleted: false,
    });
    form.setFieldsValue({
      Employee: null,
    });
    ClearValidate();
  };
  const [NumberValidate, setNumberValidate] = useState({
    sickLeave: false,
    casualLeave: false,
    total: false,
    leaveAvalied: false,
  });
  const ClearValidate = () => {
    setNumberValidate({
      sickLeave: false,
      casualLeave: false,
      total: false,
      leaveAvalied: false,
    });
  };
  //input onchange
  const InputDataFields = (e) => {
    const { name, value } = e.target;
    setEmployeeLeaveIn((pre) => ({ ...pre, [name]: value }));
    if (name === "sickLeave") {
      isNaN(value) === false
        ? setNumberValidate((pre) => ({ ...pre, sickLeave: false }))
        : setNumberValidate((pre) => ({ ...pre, sickLeave: true }));
    } else if (name === "casualLeave") {
      isNaN(value) === false
        ? setNumberValidate((pre) => ({ ...pre, casualLeave: false }))
        : setNumberValidate((pre) => ({ ...pre, casualLeave: true }));
    } else if (name === "total") {
      isNaN(value) === false
        ? setNumberValidate((pre) => ({ ...pre, total: false }))
        : setNumberValidate((pre) => ({ ...pre, total: true }));
    } else if (name === "leaveAvailed") {
      isNaN(value) === false
        ? setNumberValidate((pre) => ({ ...pre, leaveAvalied: false }))
        : setNumberValidate((pre) => ({ ...pre, leaveAvalied: true }));
    }
  };
  const DropDown = (e) => {
    setEmployeeLeaveIn((pre) => ({ ...pre, employeeId: e }));
  };

  //Pop Up Window
  const [modalOpen, setModalOpen] = useState(false);
  const ModalOpen = () => {
    setModalOpen(true);
  };
  const ModalClose = () => setModalOpen(false);

  //Save or Add Button
  const [saveBtn, setsaveBtn] = useState(false);
  const saveBtnOn = () => setsaveBtn(true);
  const saveBtnOff = () => setsaveBtn(false);

  //btns
  //add+
  const AddBtn = () => {
    setDropDownDisable(false);
    form.setFieldsValue({
      Employee: null,
    });
    clearEmployeeLeaveIn();
    ModalOpen();
    saveBtnOff();
  };
  //pencil btn
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 19);
  const [DropDownDisable, setDropDownDisable] = useState(false);
  const PencelBtn = (id) => {
    setDropDownDisable(true);
    const EditData = employeeleave.filter((data) => data.id === id);
    EditData.map((x) => {
      form.setFieldsValue({
        Employee: x.employeeName,
      });
      setEmployeeLeaveIn({
        id: x.id,
        employeeId: x.employeeId,
        sickLeave: x.sickLeave,
        casualLeave: x.casualLeave,
        total: x.total,
        leaveAvailed: x.leaveAvailed,
        isDeleted: false,
        createdDate: x.createdDate,
        createdBy: x.createdBy,
        modifiedDate: formattedDate,
        modifiedBy: x.modifiedBy,
      });
    });
    saveBtnOn();
    ModalOpen();
  };

  //api
  const dispatch = useDispatch();
  const { employeeleave } = useSelector((state) => state.employeeleave);
  const { employee } = useSelector((state) => state.employee);
  useEffect(() => {
    dispatch(Getemployeeleave());
    dispatch(getEmployees());
  }, []);

  //table data
  const EmpLeaveData = employeeleave
    .filter((data) =>
      employee.some(
        (emp) => emp.isDeleted === false && data.isdeleted === false
      )
    )
    .map((data, i) => ({
      SerialNo: i + 1,
      key: data.id,
      employeeName: data.employeeName,
      sickLeave: data.sickLeave,
      casualLeave: data.casualLeave,
      total: data.total,
      leaveAvailed: data.leaveAvailed,
    }));
  // drop down
  const employeeOption = employee
    .filter(
      (data) =>
        !employeeleave.some(
          (leave) =>
            leave.employeeId === data.id &&
            data.isDeleted !== undefined &&
            data.isDeleted === false
        )
    )
    .map((data, i) => ({
      key: data.id,
      value: data.id,
      label: data.firstName + " " + data.lastName,
    }));
  //post method
  const PostMethod = async () => {
    if (
      EmployeeLeaveIn.casualLeave === null ||
      EmployeeLeaveIn.employeeId === null ||
      EmployeeLeaveIn.leaveAvailed === null ||
      EmployeeLeaveIn.sickLeave === null ||
      EmployeeLeaveIn.total === null
    ) {
      message.error("fill the all field");
    } else if (
      isNaN(EmployeeLeaveIn.casualLeave) ||
      isNaN(EmployeeLeaveIn.leaveAvailed) ||
      isNaN(EmployeeLeaveIn.sickLeave) ||
      isNaN(EmployeeLeaveIn.total)
    ) {
      message.error("check the field it's not a number");
    } else {
      await dispatch(Postemployeeleave(EmployeeLeaveIn));
      await dispatch(Getemployeeleave());
      await ModalClose();
    }
  };
  //put method
  const PutMethod = async () => {
    if (
      EmployeeLeaveIn.casualLeave === null ||
      EmployeeLeaveIn.employeeId === null ||
      EmployeeLeaveIn.leaveAvailed === null ||
      EmployeeLeaveIn.sickLeave === null ||
      EmployeeLeaveIn.total === null
    ) {
      message.error("fill the all field");
    } else if (
      isNaN(EmployeeLeaveIn.casualLeave) ||
      isNaN(EmployeeLeaveIn.leaveAvailed) ||
      isNaN(EmployeeLeaveIn.sickLeave) ||
      isNaN(EmployeeLeaveIn.total)
    ) {
      message.error("check the field it's not a number");
    } else {
      await dispatch(Putemployeeleave(EmployeeLeaveIn));
      await dispatch(Getemployeeleave());
      await ModalClose();
      await setSelectTableData(false)
    }
  };
  //delete method
  const Delete = async (id) => {
    await dispatch(Deleteemployeeleave(id));
    await dispatch(Getemployeeleave());
  };

  //multi delete btn
  const MultiDelete = async () => {
    const FilterDeletingData = await employeeleave.filter((data) =>
      selectedRowKeys.some((id) => id === data.id)
    );
    const updateDeletingData = await FilterDeletingData.map((data, i) => ({
      id: data.id,
      employeeId: data.employeeId,
      sickLeave: data.sickLeave,
      casualLeave: data.casualLeave,
      total: data.total,
      leaveAvailed: data.leaveAvailed,
      isdeleted: true,
      createdBy: data.createdBy,
      createdDate: data.createdDate,
      modifiedBy: data.modifiedBy,
      modifiedDate: formattedDate,
    }));
    //api delete
    await updateDeletingData.map(async (data) => {
      await dispatch(Putemployeeleave(data));
      await dispatch(Getemployeeleave());
    });
  };

  //multi edit
  const MultiEditBtn = () => {
    ClearValidate();
    setModalOpen(true);
  };
  const MultiEdit = async () => {
    if (
      EmployeeLeaveIn.casualLeave === null ||
      EmployeeLeaveIn.leaveAvailed === null ||
      EmployeeLeaveIn.sickLeave === null ||
      EmployeeLeaveIn.total === null
    ) {
      message.error("fill the all field");
    } else if (
      isNaN(EmployeeLeaveIn.casualLeave) ||
      isNaN(EmployeeLeaveIn.leaveAvailed) ||
      isNaN(EmployeeLeaveIn.sickLeave) ||
      isNaN(EmployeeLeaveIn.total)
    ) {
      message.error("check the field it's not a number");
    } else {
      const FilterDeletingData = await employeeleave.filter((data) =>
        selectedRowKeys.some((id) => id === data.id)
      );

      const updateDeletingData = await FilterDeletingData.map((data, i) => ({
        id: data.id,
        employeeId: data.employeeId,
        sickLeave: EmployeeLeaveIn.sickLeave,
        casualLeave: EmployeeLeaveIn.casualLeave,
        total: EmployeeLeaveIn.total,
        leaveAvailed: EmployeeLeaveIn.leaveAvailed,
        isdeleted: false,
        createdBy: data.createdBy,
        createdDate: data.createdDate,
        modifiedBy: data.modifiedBy,
        modifiedDate: formattedDate,
      }));
      //api delete
      await updateDeletingData.map(async (data) => {
        await dispatch(Putemployeeleave(data));
        await dispatch(Getemployeeleave());
      });
      await clearEmployeeLeaveIn();
      await ModalClose();
    }
  };



  //reset btn
  const [ResetState,setResetState]= useState({
    sickLeave:null,
    casualLeave:null,
    total:null,
    leaveAvailed:0,
    isDeleted:false,
  });
  const ClearResetState= ()=> setResetState({
    sickLeave:null,
    casualLeave:null,
    total:null,
    leaveAvailed:0,
    isDeleted:false,
  })
  const [ResetModel,setResetModel]=useState(false);
  const OpenRestModal=()=> {setResetModel(true);ClearResetState();};
  const CloseResetModal=()=>setResetModel(false);
  const ResetStateOnchange= (e)=>{
    const {name,value}=e.target;
    setResetState(pre=>({...pre,[name]:value}));
    if (name === "sickLeave") {
      isNaN(value) === false
        ? setNumberValidate((pre) => ({ ...pre, sickLeave: false }))
        : setNumberValidate((pre) => ({ ...pre, sickLeave: true }));
    } else{
      isNaN(value) === false
        ? setNumberValidate((pre) => ({ ...pre, casualLeave: false }))
        : setNumberValidate((pre) => ({ ...pre, casualLeave: true }));
    }
  };
  const ResetConfirm = async () => {
    if (
      ResetState.casualLeave === null ||
      ResetState.sickLeave === null 
    ) {
      message.error("fill the all field");
    }
    else if (
      isNaN(ResetState.casualLeave) ||
      isNaN(ResetState.sickLeave) 
    ) {
      message.error("check the field it's not a number");
    }
    else{
      const FilterDeletingData = await employeeleave.filter((data) =>
      selectedRowKeys.some((id) => id === data.id)
    );
    const updateDeletingData = await FilterDeletingData.map((data, i) => ({
      id: data.id,
      employeeId: data.employeeId,
      sickLeave: data.sickLeave,
      casualLeave: data.casualLeave,
      total: data.total,
      leaveAvailed: data.leaveAvailed,
      isdeleted: true,
      createdBy: data.createdBy,
      createdDate: data.createdDate,
      modifiedBy: data.modifiedBy,
      modifiedDate: formattedDate,
    }));
 
    //api delete
    await updateDeletingData.map(async (data) => {
      await dispatch(Putemployeeleave(data));
      await dispatch(Getemployeeleave());
    });

  //post method
   const EmpIds= await updateDeletingData.map(getemp => getemp.employeeId);
   const TotalLeaves=await parseInt(ResetState.casualLeave) +await parseInt(ResetState.sickLeave);
   const YearlyLeaveData = await EmpIds.map(ids=>({
    employeeId: ids,
    sickLeave: ResetState.sickLeave,
    casualLeave: ResetState.casualLeave,
    total: TotalLeaves,
    leaveAvailed: ResetState.leaveAvailed,
    isdeleted: false,
      // createdBy: data.createdBy,
      // createdDate: data.createdDate,
      // modifiedBy: data.modifiedBy,
      // modifiedDate: formattedDate,
  }));
  await YearlyLeaveData.map(async(newdata)=>{
   await dispatch(Postemployeeleave(newdata));
   await dispatch(Getemployeeleave());
  });
  await CloseResetModal();
  await ClearResetState();
  await setSelectedRowKeys([]);
    }
  };

  //enable && disable btn
  const [SelectTableData, setSelectTableData] = useState(false);
  const DisableBtn = () => setSelectTableData(true);
  const EnableBtn = () => setSelectTableData(false);
  //multi select
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    //console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
    console.log(newSelectedRowKeys);
  };

  const [UpdateDefalutValue, setUpdateDefalutValue] = useState([]);

  const DisableAndValueUpdate = () => {
    if (selectedRowKeys.length === 0) {
      EnableBtn();
    } else {
      DisableBtn();
      const FilterMultiDropDown = employeeleave.filter((data) =>
        selectedRowKeys.some((id) => data.id === id)
      );
      const DefalutValue = FilterMultiDropDown.map((data, i) => {
        return data.employeeName;
      });
      setUpdateDefalutValue(DefalutValue);
    }
  };

  useEffect(() => {
    DisableAndValueUpdate();
  }, [selectedRowKeys]);

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "odd",
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
        key: "even",
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

  return (
    <>
      <div className="flex items-center justify-between">
        <h2>Employee Leave Settings </h2>

        <Button style={{ float: "right" }} onClick={() => BackToSetting()}>
          {" "}
          Back
        </Button>
      </div>

      <>
        {SelectTableData === true ? (
          //multi edit and delete btn
          <span className="flex items-center justify-end mt-2">
            <Popconfirm
              okButtonProps={{
                style: { backgroundColor: "red", color: "white" },
              }}
              title="Reset the task"
              description={<>Selected data is reset so <br/>are you sure to reset this data?</>}
              okText="Yes"
              cancelText="No"
              onConfirm={OpenRestModal}
              className="mr-2 flex items-center justify-center"
            >
              <Button danger>
                {" "}
                <FontAwesomeIcon
                  icon={faRotate}
                  className="icon mr-2"
                /> Reset{" "}
              </Button>
            </Popconfirm>

            <Button
              onClick={() => MultiEditBtn()}
              type="primary"
              className="mr-2 bg-blue-500 flex justify-center items-center gap-x-2"
            >
              <FontAwesomeIcon icon={faPen} className="icon" />
            </Button>

            <Popconfirm
              okButtonProps={{
                style: { backgroundColor: "red", color: "white" },
              }}
              title="Delete the task"
              description="Are you sure to delete this task?"
              okText="Yes"
              cancelText="No"
              onConfirm={MultiDelete}
            >
              <Button danger>
                <FontAwesomeIcon icon={faTrash} className="icon" />
              </Button>
            </Popconfirm>
          </span>
        ) : (
          // add btn
          <Button
            disabled={SelectTableData}
            onClick={() => AddBtn()}
            type="primary"
            className="bg-blue-500 flex items-center gap-x-1 float-right mt-2 mb-2"
          >
            {" "}
            <span>Add Holiday</span>{" "}
            <FontAwesomeIcon icon={faPlus} className="icon" />{" "}
          </Button>
        )}
      </>

      <Table
        rowSelection={rowSelection}
        style={{ marginTop: 10 }}
        bordered
        columns={columns}
        dataSource={EmpLeaveData}
        pagination={{
          pageSize: 6,
        }}
      />
      <Modal
        title={`Add New ${headingValue}`}
        open={modalOpen}
        onCancel={ModalClose}
        footer={[
          SelectTableData === false ? (
            saveBtn === false ? (
              <Button key="1" onClick={PostMethod}>
                Add
              </Button>
            ) : (
              <Button key="3" onClick={PutMethod}>
                Save
              </Button>
            )
          ) : (
            <Button key="3" onClick={MultiEdit}>
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
            name="Employee"
            label="Employee"
            style={{ marginBottom: 0, marginTop: 10 }}
          >
            {SelectTableData === false ? (
              //normal select
              <Select
                disabled={DropDownDisable}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                placeholder="Select Employee"
                style={{ float: "right", width: filedWidth }}
                onChange={DropDown}
                options={employeeOption}
              />
            ) : (
              UpdateDefalutValue.map((emname,i) => {
                return <Tag key={i} bordered={false}>{emname},</Tag>;
              })
            )}
          </Form.Item>

          <Form.Item
            label="Sick Leave"
            style={{ marginBottom: 0, marginTop: 10 }}
            rules={[
              {
                type: "number",
                message: "Please enter a valid number!",
              },
            ]}
            validateStatus={NumberValidate.sickLeave === true ? "error" : ""}
          >
            <Input
              value={EmployeeLeaveIn.sickLeave}
              style={{ float: "right", width: filedWidth }}
              placeholder="Sick Leave"
              name="sickLeave"
              onChange={InputDataFields}
            />
          </Form.Item>

          <Form.Item
            label="Casual Leave"
            style={{ marginBottom: 0, marginTop: 10 }}
            rules={[
              {
                type: "number",
                message: "Please enter a valid number!",
              },
            ]}
            validateStatus={NumberValidate.casualLeave === true ? "error" : ""}
          >
            <Input
              value={EmployeeLeaveIn.casualLeave}
              style={{ float: "right", width: filedWidth }}
              placeholder="Casual Leave"
              name="casualLeave"
              onChange={InputDataFields}
            />
          </Form.Item>
          <Form.Item
            label="Total"
            style={{ marginBottom: 0, marginTop: 10 }}
            rules={[
              {
                type: "number",
                message: "Please enter a valid number!",
              },
            ]}
            validateStatus={NumberValidate.total === true ? "error" : ""}
          >
            <Input
              value={EmployeeLeaveIn.total}
              style={{ float: "right", width: filedWidth }}
              placeholder="Total"
              name="total"
              onChange={InputDataFields}
            />
          </Form.Item>
          <Form.Item
            label="Leave Availed"
            style={{ marginBottom: 0, marginTop: 10 }}
            validateStatus={NumberValidate.leaveAvalied === true ? "error" : ""}
          >
            <Input
              value={EmployeeLeaveIn.leaveAvailed}
              style={{ float: "right", width: filedWidth }}
              placeholder="Leave Availed"
              name="leaveAvailed"
              onChange={InputDataFields}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
      title={`Add New ${headingValue}`}
      open={ResetModel}
      onCancel={CloseResetModal}
      footer={[
        <Button key="1" onClick={ResetConfirm}>
                Add
        </Button>,
        <Button
            type="text"
            key="2"
            danger="red"
            style={{ border: "0.5px solid red" }}
            onClick={() => CloseResetModal()}
          >
            Close
          </Button>
      ]}>
     <Form.Item label="Sick Leave" style={{ marginBottom: 0, marginTop: 10 }}
     rules={[
              {
                type: "number",
                message: "Please enter a valid number!",
              },
            ]}
            validateStatus={NumberValidate.sickLeave === true ? "error" : ""}>
      <Input onChange={ResetStateOnchange} style={{ float: "right", width: filedWidth }} value={ResetState.sickLeave} name="sickLeave" placeholder="Sick Leave"/>
     </Form.Item>

     <Form.Item  rules={[
              {
                type: "number",
                message: "Please enter a valid number!",
              },
            ]}
            validateStatus={NumberValidate.casualLeave === true ? "error" : ""} label="Casual Leave" style={{ marginBottom: 0, marginTop: 10 }}>
      <Input onChange={ResetStateOnchange} style={{ float: "right", width: filedWidth }} value={ResetState.casualLeave} name="casualLeave" placeholder="Casual Leave"/>
     </Form.Item>
      </Modal>
    </>
  );
}
