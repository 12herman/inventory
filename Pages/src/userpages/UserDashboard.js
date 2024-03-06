import React, { useContext, useEffect, useState } from "react";
import { Card, Col, Form, Row, Select, Statistic, message } from "antd";
import CountUp from "react-countup";
import {
  Progress,
  Flex,
  Button,
  Timeline,
  Divider,
  Modal,
  Input,
  DatePicker,
  Switch,
  Radio,
  Dropdown,
  Space,
  Menu,
  Comment,
  Avatar,
  Editor,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { DownOutlined } from "@ant-design/icons";
import { SmileOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { GetHoliday } from "../redux/slices/holidaySlice";
import { Getemployeeleave } from "../redux/slices/employeeLeaveSlice";
import { getEmployees } from "../redux/slices/employeeSlice";
import { faL } from "@fortawesome/free-solid-svg-icons";
import {
  Getemployeeleavehistory,
  Postemployeeleavehistory,
  Putemployeeleavehistory,
} from "../redux/slices/EmployeeLeaveHistorySlice";
import { isString } from "antd/es/button";
import { Postleaveconfirmation } from "../redux/slices/leaveConfirmationSlice";
import dayjs from "dayjs";

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";
const formatter = (value) => <CountUp end={value} />;

const UserDashboard = ({
  Id,
  LeaveDatas,
  holiday,
  employee,
  leavehistory,
  leaderData,
  hrData,
}) => {
  const [Emails, setEmails] = useState({
    leaderEmail: leaderData === null ? null : leaderData.officeEmail,
    hrEmail: hrData === null ? null : hrData.officeEmail,
  });

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const LeaveData = LeaveDatas.filter((x) => x.employeeId === Id)
    ? LeaveDatas.filter((x) => x.employeeId === Id)[0]
    : undefined;
  function calculatePercentage(value, total) {
    if (total === 0) {
      // Avoid division by zero
      return 0;
    }
    return (value / total) * 100;
  }
  const TotalCircle = calculatePercentage(LeaveData.total, LeaveData.total);
  const casualCircle = calculatePercentage(
    LeaveData.casualLeave,
    LeaveData.total
  );
  const SickCircle = calculatePercentage(LeaveData.sickLeave, LeaveData.total);
  const LeaveAvailedCircle = calculatePercentage(
    LeaveData.leaveAvailed,
    LeaveData.total
  );

  const employeeFilter = employee.filter((x) => x.id === Id)[0];
  const employeeName =
    employeeFilter === null || employeeFilter === undefined
      ? null
      : employeeFilter.firstName + " " + employeeFilter.lastName;

  const filterEmpLocation = employee.filter((x) => x.id === Id)[0]
    .officeLocationId.id;

  const holidayfilter = holiday.filter(
    (x) => x.officelocationId === filterEmpLocation
  );

  function categorizeDates(dateArray) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set hours to midnight for accurate date comparison

    const dateObject = new Date(dateArray);
    dateObject.setHours(0, 0, 0, 0);

    if (dateObject < currentDate) {
      return { status: "blue" }; // Past date
    } else if (dateObject.getTime() === currentDate.getTime()) {
      return { status: <SmileOutlined /> }; // Today's date
    } else {
      return { status: "green" }; // Upcoming date
    }
  }

  const holidayTable = holidayfilter
    .map((x) => ({
      label: x.holidayName,
      children: x.date,
      color:
        categorizeDates(x.date).status === `green` ||
        categorizeDates(x.date).status === `blue`
          ? categorizeDates(x.date).status
          : "blue",
      dot:
        categorizeDates(x.date).status === `green` ||
        categorizeDates(x.date).status === `blue` ? (
          false
        ) : (
          <SmileOutlined />
        ), // Apply categorizeDates to an array containing x
    }))
    .sort((a, b) => new Date(a.children) - new Date(b.children));

  // const leaveFilterId = employeeleavehistory.filter(data => data.employeeId === Id);

  //  console.log(leaveFilterId);
  const [LeaveHistory, setLeaveHistory] = useState({
    LeaveType: null,
    Date: undefined,
    Comments: null,
    employeeId: Id,
  });

  //drop down
  const [select, setSelect] = useState(null);
  const handleChange = (value) => {
    setSelect(value);
    setLeaveHistory((pre) => ({ ...pre, LeaveType: value }));
  };

  // pop up modal && apply,cancle btn
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const showModal = () => {
    setOpen(true);
  };

  const ClearFileds = () => {
    setOpen(false);
    setDisabled((pre) => ({
      ...pre,
      oneday: false,
      aboveonedaty: true,
      oneDay: null,
      aboveDay: null,
    }));
    setSelect(null);
    setLeaveHistory({
      LeaveType: null,
      Date: undefined,
      Comments: null,
      employeeId: null,
    });
    //setValue(1);
  };

  //check input dates
  const CheckApplyDate = (newd) => {
    const ArrayExistDate =
      leavehistory.length > 0
        ? leavehistory.map((x) => {
            return x.date.split("T")[0];
          })
        : null;
    const CheckOneDate =
      ArrayExistDate === null
        ? false
        : typeof newd === "string"
        ? ArrayExistDate.some((pre) => pre === newd)
        : ArrayExistDate.some((x) => newd.some((y) => x === y));
    return CheckOneDate;
  };

  //apply leave
  const handleOk = async () => {
    if (LeaveHistory.LeaveType === null) {
      message.error("Fill the type of leave");
    } else if (LeaveHistory.Date === null) {
      message.error("Fill the Date");
    } else if (LeaveHistory.Comments === null) {
      message.error("Fill the reson");
    } else if (CheckApplyDate(LeaveHistory.Date) === true) {
      message.error("Already you was applied leave for this date");
    } else {
      //check array and multiple leave method
      if (Array.isArray(LeaveHistory.Date)) {
        const MultiDates = await LeaveHistory.Date.map((date) => ({
          employeeId: Id,
          leaveType: LeaveHistory.LeaveType,
          date: date,
          comments: LeaveHistory.Comments,
          isApproved: false,
          isRejected: false,
          isDeleted: false,
          createdBy: employeeName,
          modifiedBy: employeeName,
        }));
        // await MultiDates.map(async (data) => {
        //   await dispatch(Postemployeeleavehistory(data));
        // });
        await SendToMail(MultiDates);
        // await message.success("Apllied leave successfully. Check the holiday calender")
        //await ClearFileds();
      }
    }
  };

  //cancel leave
  const handleCancel = () => {
    setOpen(false);
    setDisabled((pre) => ({
      ...pre,
      oneday: false,
      aboveonedaty: true,
      oneDay: null,
      aboveDay: null,
    }));
    setSelect(null);
    setLeaveHistory({
      LeaveType: null,
      Date: undefined,
      Comments: null,
      employeeId: null,
    });
  };

  //Date
  const [disabled, setDisabled] = useState({
    oneday: false,
    aboveonedaty: true,
    oneDay: null,
    aboveDay: null,
  });
  const onChange = (date, dateString) => {
    setLeaveHistory((pre) => ({ ...pre, Date: dateString }));
  };

  //comments or reson
  const Comments = (e) => {
    setLeaveHistory((pre) => ({ ...pre, Comments: e.target.value }));
  };

  const { employeeleavehistory } = useSelector(
    (state) => state.employeeleavehistory
  );

  useEffect(() => {
    dispatch(Getemployeeleavehistory());
  }, []);
  const CurrentDate = new Date();
  const ModifiedDate = CurrentDate.toISOString();

  // Send to
  const SendToMail = async (userleave) => {
    const leaveDataApi = await dispatch(Getemployeeleavehistory());
    const filterLeave =
      leaveDataApi.payload.length > 0
        ? leaveDataApi.payload.filter((leave) =>
            userleave.some(
              (user) =>
                leave.employeeId === user.employeeId &&
                leave.isDeleted === user.isDeleted &&
                leave.isApproved === user.isApproved &&
                leave.isRejected === user.isRejected &&
                leave.comments === user.comments
            )
          )
        : null;
    const PutDatas =
      filterLeave.length > 0
        ? filterLeave.map((data) => ({
            id: data.id,
            employeeId: data.employeeId,
            leaveType: data.leaveType,
            date: data.date,
            comments: data.comments,
            isApproved: false,
            isRejected: false,
            isDeleted: false,
            createdDate: data.createdDate,
            createdBy: null,
            modifiedDate: ModifiedDate,
            modifiedBy: null,
            email:
              Emails.leaderEmail === null ? Emails.hrEmail : Emails.leaderEmail,
          }))
        : null;

    console.log({
      ...PutDatas[0],
      ids: PutDatas.map((id) => id.id).join("-"),
      date: PutDatas.map((date) => date.date.split("T")[0]).join(","),
    });
    //send mail api
    dispatch(
      Postleaveconfirmation({
        ...PutDatas[0],
        ids: PutDatas.map((id) => id.id).join("-"),
        date: PutDatas.map((date) => date.date.split("T")[0]).join(","),
      })
    );
  };

  const radioBtnChange =()=>{

  };
  const [value,setValue] = useState(1);
  const MultiDatePicking =()=>{

  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Flex justify="space-between" align="center">
              <Statistic
                title="Total Working Days"
                value={LeaveData.total}
                formatter={formatter}
                valueStyle={{
                  color: "#3f8600",
                  fontWeight: "bold",
                }}
              />
              <Progress
                type="circle"
                percent={TotalCircle}
                status="active"
                format={() => `${LeaveData.total} Days`}
              />
            </Flex>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Flex justify="space-between" align="center">
              <Statistic
                title="Casual Leave"
                value={LeaveData.casualLeave}
                formatter={formatter}
                valueStyle={{
                  color: "#3f8600",
                  fontWeight: "bold",
                }}
              />
              <Progress
                type="circle"
                percent={casualCircle}
                status="active"
                format={() => `${LeaveData.casualLeave} Days`}
              />
            </Flex>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Flex justify="space-between" align="center">
              <Statistic
                title="Sick Leave"
                value={LeaveData.sickLeave}
                formatter={formatter}
                valueStyle={{
                  color: "#3f8600",
                  fontWeight: "bold",
                }}
              />
              <Progress
                type="circle"
                percent={SickCircle}
                status="active"
                format={() => `${LeaveData.sickLeave} Days`}
              />
            </Flex>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Flex justify="space-between" align="center">
              <Statistic
                title="Leave Availed"
                value={LeaveData.leaveAvailed}
                formatter={formatter}
                valueStyle={{
                  color: "#3f8600",
                  fontWeight: "bold",
                }}
              />
              <Progress
                type="circle"
                percent={LeaveAvailedCircle}
                status="active"
                format={() => `${LeaveData.leaveAvailed}Days`}
              />
            </Flex>
          </Card>
        </Col>
      </Row>
      <Button
        onClick={showModal}
        className="bg-blue-500"
        type="primary"
        style={{ marginTop: "20px" }}
      >
        Apply for Leave
      </Button>

      <Divider />
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        Office Holidays - 2024
      </h2>

      <Timeline mode="right" items={holidayTable} />

      <Modal
        title="Apply for Leave"
        open={open}
        // onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
        footer={[
          <Button onClick={handleCancel}>Cancel</Button>,
          <Button onClick={handleOk} type="primary" className="bg-blue-500">
            Apply
          </Button>,
        ]}
      >
        <Form form={form}>
          <ul className="flex flex-col gap-y-3">
            <li>
              <p className="pb-2">Should you have what type of Leave?</p>
              <Select
                className="w-full"
                placeholder="Select Leave Type"
                options={[
                  { label: "Casual Leave", value: "casualleave" },
                  { label: "Sick Leave", value: "sickleave" },
                ]}
                value={select}
                onChange={handleChange}
              />
            </li>



            <li>
             
              <p className="pb-2">Select one or multiply days?</p>
              <DatePicker
                multiple
                onChange={onChange}
                // maxTagCount="responsive"
                value={
                  LeaveHistory.Date === undefined
                    ? undefined
                    : LeaveHistory.Date.map((x) => dayjs(x))
                }
                size="middle"
              />

              {/* <br /> */}
            </li>


            <li>
            <p className="pb-2">Pick start date and End date </p>
            <RangePicker
                    value={disabled.aboveDay}
                    onChange={MultiDatePicking}
                  />

              {/* <p className="pb-2 ">
                Select Date: &#160; &#160;
                <Switch
                  className=" bg-slate-300"
                  size="small"
                  checked={disabled.oneday}
                  onChange={onChange}
                />
              </p> */}
            </li>

            <li>
              <p className="pb-2">Give me the reson for leave?</p>
              <TextArea
                value={LeaveHistory.Comments}
                onChange={Comments}
                rows={3}
              />
            </li>
          </ul>
        </Form>
      </Modal>
    </div>
  );
};

export default UserDashboard;
