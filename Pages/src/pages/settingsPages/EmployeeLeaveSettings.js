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
  message,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faPen, faRotate } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { Deleteemployeeleave, Getemployeeleave, Postemployeeleave, Putemployeeleave } from "../../redux/slices/employeeLeaveSlice";
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
            <Button>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </Popconfirm>
          <Button onClick={() => PencelBtn(record.key)}>
            <FontAwesomeIcon icon={faPen} />
          </Button>
        </div>
      ),
    },
  ];

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
    sickLeave:false,
    casualLeave:false,
    total:false,
    leaveAvalied:false
  });
  const ClearValidate = ()=>{
    setNumberValidate({
        sickLeave:false,
        casualLeave:false,
        total:false,
        leaveAvalied:false
      })
  }
  //input onchange
  const InputDataFields = (e) => {
    const { name, value } = e.target;
    setEmployeeLeaveIn((pre) => ({ ...pre, [name]: value }));
    if(name === "sickLeave"){
        isNaN(value) === false ? setNumberValidate(pre=>({...pre,sickLeave:false})): setNumberValidate(pre=>({...pre,sickLeave:true}));
    }
    else if(name==="casualLeave")
    {
        isNaN(value) === false ? setNumberValidate(pre=>({...pre,casualLeave:false})): setNumberValidate(pre=>({...pre,casualLeave:true}));
    }
    else if(name=== "total")
    {
        isNaN(value) === false ? setNumberValidate(pre=>({...pre,total:false})): setNumberValidate(pre=>({...pre,total:true}));
    }
    else if(name === "leaveAvailed")
    {
        isNaN(value) === false ? setNumberValidate(pre=>({...pre,leaveAvalied:false})): setNumberValidate(pre=>({...pre,leaveAvalied:true}));
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
    setRestBtn(false);
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
  const PencelBtn = (id) => {
    setRestBtn(true);
    const EditData = employeeleave.filter((data) => data.id === id);
    EditData.map((x) => {
      form.setFieldsValue({
        Employee: x.employeeName,
      });
      setEmployeeLeaveIn({
        id:x.id,
        employeeId: x.employeeId,
        sickLeave: x.sickLeave,
        casualLeave: x.casualLeave,
        total: x.total,
        leaveAvailed: x.leaveAvailed,
        isDeleted: false,
        createdDate:x.createdDate,
        createdBy:x.createdBy,
        modifiedDate:formattedDate,
        modifiedBy:x.modifiedBy
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
    .filter((data) => employee.some(emp=> emp.isDeleted === false && data.employeeData && data.employeeData.isDeleted === false))
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
          (leave) => leave.employeeId === data.id && data.isDeleted !== undefined &&  data.isDeleted === false
        )
    )
    .map((data, i) => ({
      key: data.id,
      value: data.id,
      label: data.firstName + " " + data.lastName,
    }));
//post method
  const PostMethod = async() => {
    if(EmployeeLeaveIn.casualLeave === null ||
        EmployeeLeaveIn.employeeId === null ||
        EmployeeLeaveIn.leaveAvailed===null ||
        EmployeeLeaveIn.sickLeave=== null ||
        EmployeeLeaveIn.total=== null)
        {
            message.error("fill the all field")
        }
        else if(isNaN(EmployeeLeaveIn.casualLeave) ||
                 isNaN(EmployeeLeaveIn.leaveAvailed)||
                 isNaN(EmployeeLeaveIn.sickLeave) ||
                 isNaN(EmployeeLeaveIn.total)  ){
                 message.error("check the field it's not a number");
        }
        else{
          await dispatch(Postemployeeleave(EmployeeLeaveIn));
          await dispatch(Getemployeeleave());
          await ModalClose();
        }
  };
//put method
  const PutMethod = async() => {
    if(EmployeeLeaveIn.casualLeave === null ||
      EmployeeLeaveIn.employeeId === null ||
      EmployeeLeaveIn.leaveAvailed===null ||
      EmployeeLeaveIn.sickLeave=== null ||
      EmployeeLeaveIn.total=== null)
      {
          message.error("fill the all field")
      }
      else if(isNaN(EmployeeLeaveIn.casualLeave) ||
               isNaN(EmployeeLeaveIn.leaveAvailed)||
               isNaN(EmployeeLeaveIn.sickLeave) ||
               isNaN(EmployeeLeaveIn.total)  ){
               message.error("check the field it's not a number");
      }
      else{
        await dispatch(Putemployeeleave(EmployeeLeaveIn));
        await dispatch(Getemployeeleave());
        await ModalClose();
      }
  };
  //delete method
  const Delete = async(id) => {
    await dispatch(Deleteemployeeleave(id));
    await dispatch(Getemployeeleave());
  };

  //reset btn
  const [RestBtn,setRestBtn]=useState(false);
  const RestBtnLogo =()=>{
    setRestBtn(true);
    form.setFieldsValue({
      Employee: "All",
    });
    ModalOpen();
  };

const ResetAll= ()=>{
  const Ids = employee.filter(data => EmpLeaveData.some(leaveEmp => leaveEmp.key === data.id));

 console.log(Ids);
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
      <Button
        onClick={() => AddBtn()}
        type="primary"
        className="bg-blue-500 flex items-center gap-x-1 float-right mb-3 mt-3"
      >
        {" "}
        <span>Add Holiday</span>{" "}
        <FontAwesomeIcon icon={faPlus} className="icon" />{" "}
      </Button>

      <Button
        onClick={() => RestBtnLogo()}
        type="primary"
        className="mx-2 bg-blue-500 flex items-center gap-x-1 float-right mb-3 mt-3"
      >
        {" "}
        <span>Reset</span>{" "}
        <FontAwesomeIcon icon={faRotate} className="icon" />{" "}
      </Button>

      <Table
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
         RestBtn === true ? <Button key="3" onClick={ResetAll}>
              Reset
            </Button> :
         saveBtn === false ? (
            <Button key="1" onClick={PostMethod}>
              Add
            </Button>
          ) :    (
            <Button key="3" onClick={PutMethod}>
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
            {/* <Input value={EmployeeLeaveIn.employeeId} style={{float:"right",width:InputSize}} placeholder="Employee Name" name="employeeId"  onChange={InputDataFields} /> */}
            <Select
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
              disabled={RestBtn === false ? false : true}
            />
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
    </>
  );
}
