// import { Button } from "antd";
// import React, { useEffect, useState } from "react";
// import QosteqLogo from "../Assets/qosteqlogo.webp";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { Getemployeeleavehistory } from "../redux/slices/EmployeeLeaveHistorySlice";
// import { getEmployees } from "../redux/slices/employeeSlice";
// import { Spin } from "antd";
// import { LoadingOutlined } from "@ant-design/icons";
// import ApprovePng from "../Assets/approve_png.png";
// const LeaveConfirmationPage = () => {
//   const { id } = useParams();
  
//   const IdArray = id.split('-');
//   const IdsConvertNo =  IdArray.map(id => parseInt(id,10));

  

//   const dispatch = useDispatch();
//   const { employeeleavehistory } = useSelector(
//     (state) => state.employeeleavehistory
//   );
//   const { employee } = useSelector((state) => state.employee);

//   useEffect(() => {
//     dispatch(Getemployeeleavehistory());
//     dispatch(getEmployees());
//   }, []);

//   const DashboardScreen = employeeleavehistory.filter(leave => IdsConvertNo.some(id => id  === leave.id));

//   const filterLeave = [{...DashboardScreen[0],"dates": DashboardScreen.map(data => data.date.split('T')[0]).join(', ')}]

//   const checkFilterLeave = filterLeave.map(data => data.dates === '')[0];

//   console.log(DashboardScreen);
//   // const filterLeave = employeeleavehistory.filter(
//   //   (data) =>
//   //     data.id === parseInt(id, 10) &&
//   //     data.isApproved === false &&
//   //     data.isDeleted === false &&
//   //     data.isRejected === false
//   // );
//   // const CheckFilterLeave = filterLeave.length > 0 ? filterLeave : null;

//   const filterEmp = employee.filter((emp) =>
//     filterLeave.some((data) => data.employeeId === emp.id)
//   );

//   const EmpName =
//     filterEmp.length > 0
//       ? filterEmp[0].firstName + " " + filterEmp[0].lastName
//       : null;

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 5000);

//     return () => clearTimeout(timer);
//   }, []);


// // const Approve = ()=>{
// //   let filterData =employeeleavehistory.filter(leave => IdsConvertNo.some(id => leave.id === id));
// //   console.log(filterData); 
// // }
// // Approve();


//   return (
//     <>
//       {checkFilterLeave === true ? (
//         <>
//           {loading === true ? (
//             <div className="flex justify-center items-center w-full h-screen">
//             <Spin
//               indicator={
//                 <LoadingOutlined
//                   style={{
//                     fontSize: 24,
//                   }}
//                   spin
//                 />
//               }
//             />
//             </div>
//           ) : (
//             <div className="w-full h-screen flex flex-col justify-center items-center">
//               <img className="w-[20%]" src={ApprovePng} />
//               <span className="sm:text-sm lg:text-lg pt-2 font-bold">
//                 This page is already Validate
//               </span>
//             </div>
//           )}
//         </>
//       ) : (
//         filterLeave.map((data,i) => {
//           return (
//             <section key={i} className="flex flex-col justify-center items-center w-full h-screen ">
//               <img className="w-[10%]" src={QosteqLogo} />
//               <h3 className="text-2xl font-bold pb-5">Leave Approval Form</h3>
//               <ul className="flex flex-col gap-y-2">
//                 <li>Employee ID: &nbsp; {data.employeeId}</li>
//                 <li>Employee Name: &nbsp; {EmpName}</li>
//                 <li>Leave Type: &nbsp; {data.leaveType}</li>
//                 <li>Date:&nbsp; {data.dates}</li>
//                 <li>Reson:&nbsp; {data.comments}</li>
//                 <li className="flex gap-x-2 mt-3">
//                   <Button>Approve</Button>
//                   <Button danger>Rejected</Button>
//                 </li>
//               </ul>
//             </section>
//           );
//         })
//       )}
//     </>
//   );
// };
// export default LeaveConfirmationPage;


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
 
  let { id } = useParams();
  id = parseInt(id,10)
    const dispatch = useDispatch();
  const { employeeleavehistory } =  useSelector((state) => state.employeeleavehistory);
  const { employee } = useSelector((state) => state.employee);

  useEffect(() => {
    dispatch(Getemployeeleavehistory());
    dispatch(getEmployees());
  }, []);

  const LHistory = employeeleavehistory.filter(data => data.id === id)
  const EmpId =LHistory.length >0 ? LHistory[0].employeeId :null;
   const EmpDetails =EmpId !== null ? employee.filter(data => data.id === EmpId) : null;
  const EmpName = EmpDetails !== null && EmpDetails.length>0 ? EmpDetails[0].firstName + " " + EmpDetails[0].lastName : null;
  
  console.log(LHistory);

// console.log(EmpDetails);
  //const { id } = useParams();
  // const filterEmp = employee.filter((emp) =>
  //   filterLeave.some((data) => data.employeeId === emp.id)
  // );
  // const EmpName =
  //   filterEmp.length > 0
  //     ? filterEmp[0].firstName + " " + filterEmp[0].lastName
  //     : null;

  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
    {
      employeeleavehistory.length > 0 && LHistory.length > 0  && employee.length >0
      ? 
     (
      LHistory.map((data,i) => {
           return (
            <section className="relative" key={i}>
            <img className="w-[60px] absolute left-[60%] -translate-x-1/2 top-[74%] -translate-y-1/2" src={QosteqLogo} />
             <div  className="w-11/12 mx-auto h-screen flex justify-center">
               <ul className="flex flex-col gap-y-2 justify-center items-start">
               <h3 className="text-lg sm:text-2xl font-bold pb-2">Leave Approval Form</h3>
                 <li className="text-xs sm:text-sm md:text-base">Employee ID: &nbsp; {data.employeeId}</li>
                 <li className="text-xs sm:text-sm md:text-base">Employee Name: &nbsp; {EmpName}</li>
                 <li className="text-xs sm:text-sm md:text-base">Leave Type: &nbsp; {data.leaveType}</li>
                 <li className="text-xs sm:text-sm md:text-base">Date:&nbsp; {(data.fromdate).split('T')[0]} ,{(data.todate).split('T')[0]} </li>
                 <li className="text-xs sm:text-sm md:text-base">Number of Days:&nbsp; {data.numberOfDays} </li>
                 <li className="text-xs sm:text-sm md:text-base">Reson:&nbsp; {data.comments}</li>
                 <li className="flex gap-x-2 mt-3">
                   <Button className="text-xs sm:text-sm md:text-base">Approve</Button>
                   <Button className="text-xs sm:text-sm md:text-base" danger>Rejected</Button>
                 </li>
               </ul>
             </div>
             </section>
           );
         })
     )
      :  <div className="flex justify-center items-center w-full h-screen">
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
    }
      
    </>
  );
};
export default LeaveConfirmationPage;
