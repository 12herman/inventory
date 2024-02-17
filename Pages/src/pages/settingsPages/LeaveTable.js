import React, { useEffect, useState } from "react";
import { Button, Form, Table, message, Modal, Input, Popconfirm } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faPen,
  faL,
  faRotate,
  faCaretUp,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { Tuple } from "@reduxjs/toolkit";
import {
  Getleavetable,
  Postleavetable,
  Putleavetable,
} from "../../redux/slices/leaveTableSlice";
import { Getemployeeleave, Postemployeeleave, Putemployeeleave } from "../../redux/slices/employeeLeaveSlice";
import dayjs from "dayjs";

const LeaveTable = ({ BackToSetting }) => {
  const dispatch = useDispatch();
  const { leavetable } = useSelector((state) => state.leavetable);
  const { employeeleave } = useSelector((state) => state.employeeleave);
  useEffect(() => {
    dispatch(Getleavetable());
  }, []);

  const columns = [
    {
      title: "S.No",
      dataIndex: "serialno",
      width: "10%",
    },
    {
      title: "Sick Leave",
      dataIndex: "sickLeave",
      width: "20%",
    },
    {
      title: "Casual Leave",
      dataIndex: "casualLeave",
      width: "20%",
    },
    {
      title: "Leave Availed",
      dataIndex: "leaveAvailed",
      width: "20%",
    },
    {
      title: "Total",
      dataIndex: "total",
      width: "20%",
    },
    // {
    //     title: 'operation',
    //     dataIndex: 'operation',
    //     width: '30%',
    //     render: (text, record) => (
    //         <div className="flex gap-x-2">
    //             <Popconfirm
    //                 title="Are you sure to delete this?"
    //                 okText="Yes"
    //                 cancelText="No"
    //                 okButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
    //                 onConfirm={() => DeleteMethod(record.key)}
    //             >
    //                 <Button><FontAwesomeIcon icon={faTrash} /></Button>
    //             </Popconfirm>
    //             <Button
    //                 onClick={() => PencelBtn(record.key)}
    //             >
    //                 <FontAwesomeIcon icon={faPen} /></Button>
    //         </div>
    //     ),
    // },
  ];

  const TableDataSource = leavetable.map((data, i) => ({
    serialno: i + 1,
    sickLeave: data.sickLeave,
    casualLeave: data.casualLeave,
    leaveAvailed: data.leaveAvailed,
    total: data.total,
  }));

  //input filed value
  const headingValue = "Leave Table";
  const [LeaveTable, setLeaveTable] = useState({
    sickLeave: null,
    casualLeave: null,
    leaveAvailed: null,
    total: null,
    // createdDate: null,
    // createdBy: null,
    // modifiedDate: null,
    // modifiedBy: null,
    // isdeleted: false,
  });
  //clear inputs
  const clearFileds = () => {
    setLeaveTable({
      sickLeave: null,
      casualLeave: null,
      leaveAvailed: null,
      total: null,
      // createdDate: null,
      // createdBy: null,
      // modifiedDate: null,
      // modifiedBy: null,
      // isdeleted: false,
    });
  };
  //input data
  const [NumberValidate, setNumberValidate] = useState({
    sickLeave: false,
    casualLeave: false,
    leaveAvailed: false,
    total: false,
  });
  const InputDataFilelds = (e) => {
    const { value, name } = e.target;
    setLeaveTable((pre) => ({
      ...pre,
      [name]: value,
    }));

    //validation
    if (name === "sickLeave") {
      isNaN(value) === false
        ? setNumberValidate((pre) => ({ ...pre, sickLeave: false }))
        : setNumberValidate((pre) => ({ ...pre, sickLeave: true }));
    }

    if (name === "casualLeave") {
      isNaN(value) === false
        ? setNumberValidate((pre) => ({ ...pre, casualLeave: false }))
        : setNumberValidate((pre) => ({ ...pre, casualLeave: true }));
    }

    if (name === "leaveAvailed") {
      isNaN(value) === false
        ? setNumberValidate((pre) => ({ ...pre, leaveAvailed: false }))
        : setNumberValidate((pre) => ({ ...pre, leaveAvailed: true }));
    }

    if (name === "total") {
      isNaN(value) === false
        ? setNumberValidate((pre) => ({ ...pre, total: false }))
        : setNumberValidate((pre) => ({ ...pre, total: true }));
    }
  };

  // popup-window
  const [modelOpen, setModelOpen] = useState(false);
  const ModelOpen = () => setModelOpen(true);
  const ModelClose = () => setModelOpen(false);
  // save (or) add btn state
  const [saveBtn, setsaveBtn] = useState(false);
  const saveBtnOn = () => setsaveBtn(true);
  const saveBtnOff = () => setsaveBtn(false);
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 19);
  // add new filed open
  const AddNewBtn = async () => {
    await clearFileds();
    await saveBtnOff();
    await ModelOpen();
    await leavetable
      .filter((data) => data.id === 2)
      .map((data) => {
        setLeaveTable({
          id: data.id,
          casualLeave: data.casualLeave,
          leaveAvailed: data.leaveAvailed,
          sickLeave: data.sickLeave,
          total: data.total,
          createdDate: data.createdDate,
          createdBy: data.createdBy,
          modifiedDate: formattedDate,
          modifiedBy: data.modifiedBy,
        });
      });
  };

  //CURD Method
  //PostMethod
  const PostMethod = async () => {
    if (
      LeaveTable.sickLeave === null ||
      LeaveTable.sickLeave === "" ||
      LeaveTable.casualLeave === null ||
      LeaveTable.casualLeave === "" ||
      LeaveTable.leaveAvailed === null ||
      LeaveTable.leaveAvailed === "" ||
      LeaveTable.total === null ||
      LeaveTable.total === ""
    ) {
      message.error("Fill all the fields");
    } else if (
      NumberValidate.sickLeave === true ||
      NumberValidate.casualLeave === true ||
      NumberValidate.leaveAvailed === true ||
      NumberValidate.total === true
    ) {
      message.error("Enter number only");
    } else {
      //   await dispatch(Putleavetable(LeaveTable));
      
      const DeletedLeaveData = await employeeleave
        .filter((data) => data.isdeleted === false)
        .map((data) => ({
          id: data.id,
          employeeId: data.employeeId,
          sickLeave: data.sickLeave,
          casualLeave: data.casualLeave,
          total: data.total,
          leaveAvailed: data.leaveAvailed,
          createdDate: data.createdDate,
          createdBy: data.createdBy,
          modifiedDate: formattedDate,
          modifiedBy: data.modifiedBy,
          isDeleted: true,
        }));
       
        const UpdateDeletedNewData =await DeletedLeaveData.map(data=>({
            employeeId: data.employeeId,
            sickLeave: LeaveTable.sickLeave,
            casualLeave: LeaveTable.casualLeave,
            total: LeaveTable.total,
            leaveAvailed: LeaveTable.leaveAvailed,
            isDeleted: false,
        }));

        await DeletedLeaveData.map(data => dispatch (Putemployeeleave(data)));
        await UpdateDeletedNewData.map(data => dispatch(Postemployeeleave(data)))
       
          await dispatch(Getleavetable());
          await dispatch(Getemployeeleave());
          await ModelClose();
    }
  };

  // pencil icon click
  //const PencelBtn = (record) => {};
  //put method
  const PutMethod = async () => {};
  //Delete
  //const DeleteMethod = async (key) => {};

  return (
    <>
      <div className="flex items-center justify-between">
        <h2>{headingValue} Settings</h2>
        <Button style={{ float: "right" }} onClick={() => BackToSetting()}>
          {" "}
          Back
        </Button>
      </div>
      <Button
        onClick={() => AddNewBtn()}
        type="primary"
        className="bg-red-500 flex items-center gap-x-1 float-right mb-3 mt-3"
      >
        {" "}
        <span>Reset</span> <FontAwesomeIcon icon={faRotate} className="icon" />{" "}
      </Button>
      <Table
        style={{ marginTop: 10 }}
        bordered
        columns={columns}
        dataSource={TableDataSource}
        pagination={{
          pageSize: 6,
        }}
      />

      <Modal
        title={`Add New ${headingValue}`}
        open={modelOpen}
        onCancel={ModelClose}
        //onOk={handleOk}
        footer={[
          saveBtn === false ? (
            <Button key="1" onClick={PostMethod}>
              Update
            </Button>
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
            onClick={() => ModelClose()}
          >
            Close
          </Button>,
        ]}
      >
        <Form>
          {/* sickLeave */}
          <Form.Item
            label="Sick Leave"
            style={{ marginBottom: 0, marginTop: 10 }}
            validateStatus={NumberValidate.sickLeave === true ? "error" : ""}
            pattern="[0-9]*"
          >
            <Input
              style={{ float: "right", width: "370px" }}
              placeholder="Sick Leave"
              name="sickLeave"
              value={LeaveTable.sickLeave}
              onChange={InputDataFilelds}
            />
          </Form.Item>

          {/* casualLeave */}
          <Form.Item
            label="Casual Leave"
            style={{ marginBottom: 0, marginTop: 10 }}
            validateStatus={NumberValidate.casualLeave === true ? "error" : ""}
            pattern="[0-9]*"
          >
            <Input
              style={{ float: "right", width: "370px" }}
              placeholder="Sick Leave"
              name="casualLeave"
              value={LeaveTable.casualLeave}
              onChange={InputDataFilelds}
            />
          </Form.Item>

          {/* leaveAvailed */}
          <Form.Item
            label="Leave Availed"
            style={{ marginBottom: 0, marginTop: 10 }}
            validateStatus={NumberValidate.leaveAvailed === true ? "error" : ""}
            pattern="[0-9]*"
          >
            <Input
              style={{ float: "right", width: "370px" }}
              placeholder="Sick Leave"
              name="leaveAvailed"
              value={LeaveTable.leaveAvailed}
              onChange={InputDataFilelds}
            />
          </Form.Item>

          {/* total */}
          <Form.Item
            label="Total"
            style={{ marginBottom: 0, marginTop: 10 }}
            validateStatus={NumberValidate.total === true ? "error" : ""}
            pattern="[0-9]*"
          >
            <Input
              style={{ float: "right", width: "370px" }}
              placeholder="Sick Leave"
              name="total"
              value={LeaveTable.total}
              onChange={InputDataFilelds}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default LeaveTable;
