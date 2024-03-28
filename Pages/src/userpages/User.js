import React, { useEffect, useState, createContext } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Menu, Button, theme, Modal,Popover,Tag } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUser,
  faDesktop,
  faVault,
  faMoneyBill,
  faCalendarDays,
  faBars,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Spin } from "antd";
import { Switch } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import UserDashboard from "./UserDashboard";
import Personal from "./Personal";
import Bank from "./Bank";
import Pay from "./Pay";
import System from "./System";
import Holiday from "./Holiday";
import { useDispatch, useSelector } from "react-redux";
import { GetHoliday } from "../redux/slices/holidaySlice";
import { Getemployeeleave } from "../redux/slices/employeeLeaveSlice";
import { getEmployees } from "../redux/slices/employeeSlice";
import { getAddress } from "../redux/slices/addressSlice";
import { getaccount } from "../redux/slices/accountdetailsSlice";
import LogoutPage from "../components/LogoutPage";
import "../css/user.css";
import { Getemployeeleavehistory } from "../redux/slices/EmployeeLeaveHistorySlice";
import { getEmployeeAccessories } from "../redux/slices/employeeaccessoriesSlice";
import { getProductsDetail } from "../redux/slices/productsDetailSlice";
import { getleaderemployee } from "../redux/slices/leaderEmployeeSlice";
import { Getleavetable } from "../redux/slices/leaveTableSlice";
import AppLogo from "../Assets/qosteqlogo.webp";
import { RightCircleFilled } from "@ant-design/icons";
import { useMediaQuery } from 'react-responsive';
import { getSalary } from "../redux/slices/salarySlice";
const { Header, Sider, Content } = Layout;


const User = ({ Id, Data }) => {
  const [UpdateId] = useState(Id);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  const handleMenuClick = (item) => {
    setSelectedMenuItem(item);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const dispatch = useDispatch();
  const { holiday } = useSelector((state) => state.holiday);
  const { employeeleave } = useSelector((state) => state.employeeleave);
  const { employee } = useSelector((state) => state.employee);
  const { address } = useSelector((state) => state.address);
  const { account } = useSelector((state) => state.account);
  const { employeeleavehistory } = useSelector(
    (state) => state.employeeleavehistory
  );
  const { productsDetail } = useSelector((state) => state.productsDetail);
  const { leaderemployee } = useSelector((state) => state.leaderemployee);
  const { leavetable } = useSelector((state) => state.leavetable);
  const {salary} = useSelector(state => state.salary);



  useEffect(() => {
    dispatch(GetHoliday());
    dispatch(Getemployeeleave());
    dispatch(getEmployees());
    dispatch(getAddress());
    dispatch(getaccount());
    dispatch(Getemployeeleavehistory());
    dispatch(getProductsDetail());
    dispatch(getleaderemployee());
    dispatch(Getleavetable());
    dispatch(getSalary());
  }, []);

  const EmpFilter = employee.filter((emp) => emp.id === Id);
  const AddressFilter = address.filter((add) => add.employeeId === Id);
  const AccountFillter = account.filter((acc) => acc.employeeId === Id);
  const LeaveFilter = employeeleavehistory.filter(
    (leave) => leave.employeeId === Id
  );
  const ProductEmpFilter = productsDetail.filter((pr) => pr.employeeId === Id);
  const SalaryFilter = salary.filter(data => data.employeeId === Id);


  const leaderFilter = leaderemployee.filter((le) => le.employeeId === Id);
  const leaderId = leaderFilter.length > 0 ? leaderFilter[0].leaderId : null;
  const leaderDataFilter = employee.filter((emp) => emp.id === leaderId);
  const leaderData = leaderDataFilter.length > 0 ? leaderDataFilter : null;

  const hrFilter = leaderemployee.filter((le) => le.employeeId === Id);
  const hrId = hrFilter.length > 0 ? hrFilter[0].hrManagerId : null;
  const hrDataFilter = employee.filter((emp) => emp.id === hrId);
  const hrData = hrDataFilter.length > 0 ? hrDataFilter : null;

  const EmployeeLeaves =
    employeeleave.length > 0
      ? employeeleave.filter((data) => data.employeeId === Id)
      : null;
  const EmployeeLeavesFilter =
    EmployeeLeaves === null ? null : EmployeeLeaves[0];

  const menuItems = [
    {
      key: "1",
      icon: faHouse,
      label: "Dashboard",
      Content: (
        <UserDashboard
          Id={UpdateId}
          LeaveDatas={employeeleave}
          holiday={holiday}
          employee={employee}
          leavehistory={LeaveFilter}
          leaderData={leaderData}
          hrData={hrData}
          leavetable={leavetable[0]}
        />
      ),
    },
    {
      key: "2",
      icon: faUser,
      label: "Personal",
      Content: (
        <Personal
          Id={UpdateId}
          employee={EmpFilter}
          addressData={AddressFilter}
        />
      ),
    },
    {
      key: "3",
      icon: faVault,
      label: "Bank Info",
      Content: <Bank Id={UpdateId} account={AccountFillter} />,
    },
    {
      key: "4",
      icon: faMoneyBill,
      label: "Pay Info",
      Content: <Pay Id={UpdateId} salary={SalaryFilter} employee={EmpFilter}/>,
    },
    {
      key: "5",
      icon: faDesktop,
      label: "System Info",
      Content: <System products={ProductEmpFilter} Id={UpdateId} />,
    },
    {
      key: "6",
      icon: faCalendarDays,
      label: "Holiday ",
      Content: <Holiday Id={UpdateId} leavehistory={LeaveFilter} />,
    },
  ];

  const content = (
    <div className="px-5 flex flex-col justify-center items-center gap-y-2">
    <p className="text-sm font-bold flex items-center justify-center gap-x-2"> {EmpFilter&& EmpFilter.length > 0 ? EmpFilter[0].firstName + " " + EmpFilter[0].lastName : null} <Tag color="green" className="text-[10px] font-medium">{EmpFilter && EmpFilter.length > 0 ? EmpFilter[0].departmentId.departmentName : null}</Tag></p>
      <LogoutPage/>
    </div>
  );

  const isMobile = useMediaQuery({ maxWidth: 1024 });
  //nav bar responsive
  const [Nav,setNav] = useState({
    open: isMobile === true ? true : false,
    menu: "Dashboard",
    content: null
  });

  const menuClcik = (menu,contents) => {
    setNav(pre => ({...pre,menu: menu,content:contents}));
    if(isMobile === true){
      setNav(pre => ({...pre, open:true}))
    }
  };

 
  return (
    <main className={`relative w-11/12 ${ isMobile === true ? "mx-auto" : " ml-auto"} transition-all ease-in duration-300`}>
      
      <ul className="header bg-blue-500 px-5 fixed flex justify-between top-[0px] left-[0px] z-10 w-full  shadow-md  py-5 ">
        <li className="menu-btn flex items-center gap-x-5 ">
        {Nav.open === false ? 
          <FontAwesomeIcon onClick={()=> setNav(pre => ({...pre, open: true}))} className="cursor-pointer text-white text-xl" icon={faArrowLeft} />
        :  <FontAwesomeIcon className="cursor-pointer text-white text-xl" icon={faBars} onClick={()=> setNav(pre => ({...pre, open: false}))}/> } 
          <h3 className="text-md font-medium text-white hidden md:block">{Nav.menu}</h3>
        </li>
        <li><Popover content={content} placement="bottomRight"  trigger="click">
        <FontAwesomeIcon  className="text-xl cursor-pointer text-white" icon={faUser}/>
        </Popover> </li>
      </ul>

      <ul className={`transition-all ease-in duration-300 menu-slide fixed bg-white border top-16  h-screen z-10 
      ${Nav.open === false && isMobile === false ? "w-[200px]" : 
      isMobile === true && Nav.open === false ? " left-0 w-[200px]" 
    : isMobile === true && Nav.open === true ? "-left-[150%]  w-[200px]" 
    : "w-[60px]"} -left-0`}>
        
        {
          menuItems.map(data => {
            return (
    <li key={data.key} onClick={()=>menuClcik(data.label,data.Content) } 
    className= {`grid px-2 py-3 grid-cols-2 place-items-center gap-x-3 cursor-pointer hover:bg-blue-50  border-b-[1px] border-gray-200 ${Nav.menu === data.label ? "bg-blue-100 " :""}`}>   
      <FontAwesomeIcon className={` ${Nav.menu === data.label ? "text-blue-500" :"text-gray-500"}  ${isMobile === false && Nav.open === true ? 'pl-[20px]' : 'pl-0'}`} icon={data.icon}/>
      <span className={` text-sm w-36 inline-block transition-all duration-300 ease-in-out  ${Nav.open === false && isMobile === false ? "opacity-100 visible animation-effect" : Nav.open === false && isMobile === true ? 'opacity-100' :"opacity-0 invisible"} `}> {data.label}</span> 
      </li>
            )
          })
        }
     

      {/* <li className="cursor-pointer hover:bg-blue-100  px-5 py-4 flex gap-x-5">   
      <FontAwesomeIcon className="text-gray-400" icon={faHouse}/>
      <span className={` text-sm inline-block text-gray-400 transition-all duration-300 ease-in-out ${Nav.open === false ? "opacity-1" :"opacity-0 invisible"}`}> Home</span> 
      </li> */}

       {/* (
          Nav.content
        )  */}

      </ul> 

      <section className={`relative pt-24 pb-5 transition-all ease-in duration-300  ${Nav.open === false && isMobile === false ? "pl-[135px] lg:pr-20" : "pl-[0px] lg:pr-20"} `}>
     
        {Nav.content != null ? 
          (
          Nav.content
        )
        : employeeleave &&
          holiday &&
          employee &&
          employeeleavehistory &&
          leavetable &&
          hrData &&
          leaderData &&
          employeeleave.length > 0 &&
          holiday.length > 0 &&
          employee.length > 0 &&
          employeeleavehistory.length > 0 &&
          leavetable.length > 0 &&
          hrData.length > 0 &&
          leaderData.length > 0 ? (
          <UserDashboard
            Id={UpdateId}
            LeaveDatas={employeeleave}
            holiday={holiday}
            employee={employee}
            leavehistory={LeaveFilter}
            leaderData={leaderData}
            hrData={hrData[0]}
            leavetable={leavetable[0]}
          />
        ) : (
          <div className="w-full h-screen flex justify-center items-center">
            <LoadingOutlined
              style={{
                fontSize: 24,
              }}
              spin
            />
          </div>
        )}
      </section>
    
    </main>
  );
};

export default User;
