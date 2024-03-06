import { Button } from "antd";
import React, { useEffect, useState } from "react";
import QosteqLogo from "../Assets/qosteqlogo.webp";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Getemployeeleavehistory } from "../redux/slices/EmployeeLeaveHistorySlice";
import { getEmployees } from "../redux/slices/employeeSlice";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import ApprovePng from "../Assets/approve_png.png";
const LeaveConfirmationPage = () => {
  const { id } = useParams();
  
  const IdArray = id.split('-');
  const IdsConvertNo =  IdArray.map(id => parseInt(id,10));

  

  const dispatch = useDispatch();
  const { employeeleavehistory } = useSelector(
    (state) => state.employeeleavehistory
  );
  const { employee } = useSelector((state) => state.employee);

  useEffect(() => {
    dispatch(Getemployeeleavehistory());
    dispatch(getEmployees());
  }, []);

  const DashboardScreen = employeeleavehistory.filter(leave => IdsConvertNo.some(id => id  === leave.id));

  const filterLeave = [{...DashboardScreen[0],"dates": DashboardScreen.map(data => data.date.split('T')[0]).join(', ')}]

  const checkFilterLeave = filterLeave.map(data => data.dates === '')[0];

  console.log(DashboardScreen);
  // const filterLeave = employeeleavehistory.filter(
  //   (data) =>
  //     data.id === parseInt(id, 10) &&
  //     data.isApproved === false &&
  //     data.isDeleted === false &&
  //     data.isRejected === false
  // );
  // const CheckFilterLeave = filterLeave.length > 0 ? filterLeave : null;

  const filterEmp = employee.filter((emp) =>
    filterLeave.some((data) => data.employeeId === emp.id)
  );

  const EmpName =
    filterEmp.length > 0
      ? filterEmp[0].firstName + " " + filterEmp[0].lastName
      : null;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);


// const Approve = ()=>{
//   let filterData =employeeleavehistory.filter(leave => IdsConvertNo.some(id => leave.id === id));
//   console.log(filterData); 
// }
// Approve();


  return (
    <>
      {checkFilterLeave === true ? (
        <>
          {loading === true ? (
            <div className="flex justify-center items-center w-full h-screen">
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
          ) : (
            <div className="w-full h-screen flex flex-col justify-center items-center">
              <img className="w-[20%]" src={ApprovePng} />
              <span className="sm:text-sm lg:text-lg pt-2 font-bold">
                This page is already Validate
              </span>
            </div>
          )}
        </>
      ) : (
        filterLeave.map((data,i) => {
          return (
            <section key={i} className="flex flex-col justify-center items-center w-full h-screen ">
              <img className="w-[10%]" src={QosteqLogo} />
              <h3 className="text-2xl font-bold pb-5">Leave Approval Form</h3>
              <ul className="flex flex-col gap-y-2">
                <li>Employee ID: &nbsp; {data.employeeId}</li>
                <li>Employee Name: &nbsp; {EmpName}</li>
                <li>Leave Type: &nbsp; {data.leaveType}</li>
                <li>Date:&nbsp; {data.dates}</li>
                <li>Reson:&nbsp; {data.comments}</li>
                <li className="flex gap-x-2 mt-3">
                  <Button>Approve</Button>
                  <Button danger>Rejected</Button>
                </li>
              </ul>
            </section>
          );
        })
      )}
    </>
  );
};
export default LeaveConfirmationPage;
