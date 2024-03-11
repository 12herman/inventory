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
  Checkbox,
  Spin,
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
import {
  Getemployeeleave,
  Putemployeeleave,
} from "../redux/slices/employeeLeaveSlice";
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
import moment from "moment";
import { getleaderemployee } from "../redux/slices/leaderEmployeeSlice";

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

  const { employeeleavehistory } = useSelector(
    (state) => state.employeeleavehistory
  );
  const { employeeleave } = useSelector((state) => state.employeeleave);
  const { leaderemployee } = useSelector((state) => state.leaderemployee);

  //const leaderAndHr = employeeleave.filter((data) => data.employeeId === Id);
  // const filterLeaders = leaderAndHr.length > 0  ? leaderAndHr[0]: null;
  //   const leadersIds = filterLeaders.length>0 ? filterLeaders.hrManagerId : null;
  // console.log(leaderAndHr);

  useEffect(() => {
    dispatch(Getemployeeleavehistory());
    dispatch(Getemployeeleave());
    dispatch(getleaderemployee());
    setEmails({});
  }, []);

  // change normal date without time
  const convertDate = employeeleavehistory.map((entry) => {
    const fromdate = entry.fromdate
      ? new Date(entry.fromdate).toISOString().split("T")[0]
      : null;
    const todate = entry.todate
      ? new Date(entry.todate).toISOString().split("T")[0]
      : null;
    return {
      ...entry,
      fromdate: fromdate,
      todate: todate,
    };
  });

  const hrFilters = leaderemployee.filter((le) => le.employeeId === Id);
  const hrIds = hrFilters.length > 0 ? hrFilters[0].hrManagerId : null;
  const hrDataFilters = employee.filter((emp) => emp.id === hrIds);
  const hrDatas = hrDataFilters.length > 0 ? hrDataFilters[0] : null;

  const leaderFilters = leaderemployee.filter((le) => le.employeeId === Id);
  const leaderIds = leaderFilters.length > 0 ? leaderFilters[0].leaderId : null;
  const leaderDataFilter = employee.filter((emp) => emp.id === leaderIds);
  const leaderDatas = leaderDataFilter.length > 0 ? leaderDataFilter[0] : null;

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
    todate: null,
    numberOfDays: 0,
    fromdate: null,
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
  const [postLeaveLoading, setpostLeaveLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const ClearFileds = () => {
    setOpen(false);
    SetDatePick(null);
    SetCheckBox({
      disablecheck: true,
      checkvalue: false,
    });
    ClearDates();
    setSelect(null);
    setLeaveHistory({
      LeaveType: null,
      todate: null,
      numberOfDays: 0,
      fromdate: null,
      Comments: null,
      employeeId: null,
    });
  };

  //check input dates
  const CheckApplyDate = async (startdate, enddate) => {
    const startDateObj = new Date(startdate);
    const endDateObj = new Date(enddate);
    const timeDifference = endDateObj.getTime() - startDateObj.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    const datesInRange = await Array.from(
      { length: daysDifference + 1 },
      (_, index) => {
        const currentDate = new Date(startDateObj);
        currentDate.setDate(startDateObj.getDate() + index);
        return currentDate.toISOString().split("T")[0];
      }
    );
    await datesInRange.push(enddate);
    const UserCheckLeave = await convertDate.filter(
      (data) => data.employeeId === Id
    );
    const newDatesArray = await datesInRange.slice(1);
    const convertedDates =await newDatesArray.map(date => date.replace(/\//g, '-'));
    const checkDates = await UserCheckLeave.filter(data =>  convertedDates.some(date => data.fromdate === date || data.todate === date));
    const outPut = (await checkDates.length) > 0 ? true : false;  
    return outPut;
  };



  //apply leave
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 19);
  const handleOk = async () => {
    if (LeaveHistory.LeaveType === null) {
      message.error("Fill the type of leave");
    } else if (DatePick.length === 0 || DatePick[0] === null) {
      message.error("Fill the Date");
    } else if (LeaveHistory.Comments === null || LeaveHistory.Comments === "") {
      message.error("Fill the reson");
    } else if (
      (await CheckApplyDate(LeaveHistory.fromdate, LeaveHistory.todate)) ===true
    ) {
      message.error("Already you was applied leave for this date");
    } else {
      const fromdate = new Date(LeaveHistory.fromdate);
      const todate = new Date(LeaveHistory.todate);
      // Adding 1 day to both fromdate and todate
      fromdate.setDate(fromdate.getDate() + 1);
      todate.setDate(todate.getDate() + 1);
      const LeaveDatas = {
        employeeId: Id,
        leaveType: LeaveHistory.LeaveType,
        fromdate: fromdate.toISOString(),
        todate: todate.toISOString(),
        numberOfDays: LeaveHistory.numberOfDays,
        comments: LeaveHistory.Comments,
        hrIsApproved: false,
        hrIsRejected: false,
        leaderIsApproved: false,
        leaderIsRejected: false,
        isDeleted: false,
        createdBy: employeeName,
        modifiedBy: employeeName,
        // "dto": "value_for_dto_field", // Add this line
      };
      console.log(LeaveDatas);
      await setpostLeaveLoading(true);
      await SendToMail(LeaveDatas);
      await dispatch(Postemployeeleavehistory(LeaveDatas));
      await ClearFileds();
      await setpostLeaveLoading(false);
      await message.success("Your leave is processing check the calender")
    }
  };

  //cancel leave
  const handleCancel = () => {
    setOpen(false);
    ClearFileds();
  };

  // date (changes)
  const dateFormat = "YYYY/MM/DD";
  const [DatePick, SetDatePick] = useState([]);
  const [CheckDates, setCheckDates] = useState(["", ""]);
  const ClearDates = () => {
    SetDatePick([]);
  };
  const MultiDatePicking = (date, dateString) => {
    SetCheckBox({
      disablecheck: true,
      checkvalue: false,
    })
    // set ui changes
    if (dateString.length > 0) {
      SetDatePick([
        dateString[0] === "" ? null : dayjs(dateString[0], dateFormat),
        dateString[1] === "" ? null : dayjs(dateString[1], dateFormat),
      ]);
      function countDatesInRange(dateArray) {
        // Extract start date and end date from the array
        const [startDate, endDate] = dateArray;
        // Convert start and end dates to Date objects
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        // Calculate the difference in days
        const timeDifference = endDateObj.getTime() - startDateObj.getTime();
        const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
        // Generate an array of dates in the range
        const datesInRange = Array.from(
          { length: daysDifference + 1 },
          (_, index) => {
            const currentDate = new Date(startDateObj);
            currentDate.setDate(startDateObj.getDate() + index);
            return currentDate.toISOString().split("T")[0];
          }
        );
        // Return the count of dates in the range
        return datesInRange.length;
      }
      const count = countDatesInRange(dateString);
      setLeaveHistory((pre) => ({
        ...pre,
        fromdate: dateString[0],
        todate: dateString[1],
        numberOfDays: count,
      }));
    }
    setCheckDates(dateString);
    if (dateString[0] === "" && dateString[1] === "") {
      SetCheckBox((pre) => ({ ...pre, disablecheck: true }));
    } else if (
      dateString[0] !== "" &&
      dateString[1] !== "" &&
      dateString[0] === dateString[1]
    ) {
      SetCheckBox((pre) => ({ ...pre, disablecheck: false }));
    } else if (dateString[0] !== dateString[1]) {
      SetCheckBox((pre) => ({ ...pre, disablecheck: true }));
    }
  };

  //check box
  const [CheckBox, SetCheckBox] = useState({
    disablecheck: true,
    checkvalue: false,
  });

  const CheckBoxMethod = () => {
    if (LeaveHistory.numberOfDays === 1) {
      SetCheckBox((pre) => ({ ...pre, checkvalue: true }));
      setLeaveHistory((pre) => ({ ...pre, numberOfDays: 0.5 }));
    } else {
      SetCheckBox((pre) => ({ ...pre, checkvalue: false }));
      setLeaveHistory((pre) => ({ ...pre, numberOfDays: 1 }));
    }
  };

  //comments or reson
  const Comments = (e) => {
    setLeaveHistory((pre) => ({ ...pre, Comments: e.target.value }));
  };

  const CurrentDate = new Date();
  const ModifiedDate = CurrentDate.toISOString();

  // Send to
  const SendToMail = async (LeaveDatas) => {
    const leaveDataApi = await dispatch(Getemployeeleavehistory());

    const filterLeave =
      (await leaveDataApi.payload.length) > 0
        ? await leaveDataApi.payload.filter(
            (leave) =>
              leave.employeeId === LeaveDatas.employeeId &&
              leave.isDeleted === LeaveDatas.isDeleted &&
              leave.hrIsApproved === LeaveDatas.hrIsApproved &&
              leave.hrIsRejected === LeaveDatas.hrIsRejected &&
              leave.leaderIsApproved === LeaveDatas.leaderIsApproved &&
              leave.leaderIsRejected === LeaveDatas.leaderIsRejected &&
              leave.comments === LeaveDatas.comments
          )
        : null;
    await filterLeave;

    if ((await filterLeave) && filterLeave.length > 0) {
      const emailDatas = {
        id: filterLeave[0].id,
        employeeId: LeaveDatas.employeeId,
        employeeName: employeeName,
        leaveType: LeaveDatas.leaveType,
        date:
          LeaveDatas.fromdate.split("T")[0] +
          " ," +
          LeaveDatas.todate.split("T")[0],
        numberOfDays: LeaveDatas.numberOfDays,
        comments: LeaveDatas.comments,
      };

      await dispatch(
        Postleaveconfirmation({
          ...emailDatas,
          email: "yenoklesin@gmail.com",
          id: filterLeave[0].id + "+hr",
        })
      );
      await dispatch(
        Postleaveconfirmation({
          ...emailDatas,
          email: "yenoklesin@gmail.com",
          id: filterLeave[0].id + "+leader",
        })
      );
    } else if ((await filterLeave) === null) {
      message.error("The mail not send Hr and Leader please contact the admin");
    }
  };

  return (
    
      postLeaveLoading === false ?
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
          <Button key={1} onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key={2}
            onClick={handleOk}
            type="primary"
            className="bg-blue-500"
          >
            Apply
          </Button>,
        ]}
      >
          <ul className="flex flex-col gap-y-3">
          <li>
            <p className="pb-2">Should you have what type of Leave?</p>
            <Select
              className="w-full"
              placeholder="Select Leave Type"
              options={[
                { key: 1, label: "Casual Leave", value: "casualLeave" },
                { key: 2, label: "Sick Leave", value: "sickLeave" },
              ]}
              value={select}
              onChange={handleChange}
            />
          </li>

          <li>
            <p className="">Pick start date and End date </p>
            <span className="text-[10px] pb-2 block text-red-500">
              *Don't leave apply for holidays{" "}
            </span>
            <RangePicker
              format={dateFormat}
              value={DatePick}
              onChange={MultiDatePicking}
            />
          </li>

          <li>
            <p className="pb-2">Total number of days</p>

            <span className="ml-2  w-[10%] inline-block">
              {LeaveHistory.numberOfDays}
            </span>
            <Checkbox
              checked={CheckBox.checkvalue}
              disabled={CheckBox.disablecheck}
              onChange={CheckBoxMethod}
              value="A"
            >
              Half Day
            </Checkbox>
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
      </Modal>
    </div>

    : <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <Spin
      indicator={
        <LoadingOutlined
          style={{
            fontSize: 24,
          }}
          spin
        />
      }
    />
   </div>

    
   
  );
};

export default UserDashboard;
