import React, { useContext, useEffect, useState } from "react";
import { Card, Col, Row, Statistic } from "antd";
import CountUp from "react-countup";
import { Progress, Flex, Button, Timeline, Divider } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { GetHoliday } from "../redux/slices/holidaySlice";
import { Getemployeeleave } from "../redux/slices/employeeLeaveSlice";
import { getEmployees } from "../redux/slices/employeeSlice";
import { faL } from "@fortawesome/free-solid-svg-icons";

const formatter = (value) => <CountUp end={value} />;

const UserDashboard = ({ Id ,LeaveDatas,holiday,employee}) => {
   
 const LeaveData = LeaveDatas.filter(x => x.employeeId ===Id) ? LeaveDatas.filter(x => x.employeeId ===Id)[0] : undefined;
 function calculatePercentage(value, total) {
    if (total === 0) {
      // Avoid division by zero
      return 0;
    }
    return (value / total) * 100;
  }
const TotalCircle = calculatePercentage( LeaveData.total,LeaveData.total);
const casualCircle = calculatePercentage( LeaveData.casualLeave,LeaveData.total);
const SickCircle = calculatePercentage( LeaveData.sickLeave,LeaveData.total);
const LeaveAvailedCircle = calculatePercentage( LeaveData.leaveAvailed,LeaveData.total)




const filterEmpLocation= employee.filter ( x => x.id === Id)[0].officeLocationId.id;
const holidayfilter = holiday.filter(x => x.officelocationId === filterEmpLocation);


function categorizeDates(dateArray) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set hours to midnight for accurate date comparison
    
    const dateObject = new Date(dateArray);
    dateObject.setHours(0, 0, 0, 0);
    
    if (dateObject < currentDate) {
        return { status: 'blue' }; // Past date
      } else if (dateObject.getTime() === currentDate.getTime()) {
        return { status: <SmileOutlined /> }; // Today's date
      } else {
        return { status: 'green' }; // Upcoming date
      }
  }
  
  const holidayTable = holidayfilter.map(x => ({
    label: x.holidayName,
    children: x.date,
    color: categorizeDates(x.date).status === `green` ||  categorizeDates(x.date).status === `blue` ? categorizeDates(x.date).status : "blue",
    dot:  categorizeDates(x.date).status === `green` ||  categorizeDates(x.date).status === `blue` ? false : <SmileOutlined /> // Apply categorizeDates to an array containing x
  })).sort((a, b) => new Date(a.children) - new Date(b.children));
  

  
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
      <Button className="bg-blue-500" type="primary" style={{ marginTop: "20px" }}>
        Apply for Leave
      </Button>

      <Divider />
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        Office Holidays - 2024
      </h2>

      <Timeline
        mode="right"
        items={holidayTable}
      />
    </div>
  );
};

export default UserDashboard;

