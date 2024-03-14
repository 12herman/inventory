import React, { useEffect, useState, createContext } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUser,
  faDesktop,
  faVault,
  faMoneyBill,
  faCalendarDays,
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
import '../css/user.css'
import { Getemployeeleavehistory } from "../redux/slices/EmployeeLeaveHistorySlice";
import { getEmployeeAccessories } from "../redux/slices/employeeaccessoriesSlice";
import { getProductsDetail } from "../redux/slices/productsDetailSlice";
import { getleaderemployee } from "../redux/slices/leaderEmployeeSlice";
import { Getleavetable } from "../redux/slices/leaveTableSlice";
const { Header, Sider, Content } = Layout;

const User =  ({ Id, Data }) => {
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
  const {employeeleavehistory} = useSelector(state => state.employeeleavehistory);
  const {productsDetail} = useSelector(state => state.productsDetail);
  const {leaderemployee} = useSelector(state=> state.leaderemployee);
  const {leavetable} = useSelector(state =>state.leavetable);


  useEffect( () => {
    dispatch(GetHoliday());
    dispatch(Getemployeeleave());
    dispatch(getEmployees());
    dispatch(getAddress());
    dispatch(getaccount());
    dispatch(Getemployeeleavehistory());
    dispatch(getProductsDetail());
    dispatch(getleaderemployee());
    dispatch(Getleavetable());   
  }, []);



  const EmpFilter = employee.filter((emp) => emp.id === Id);
  const AddressFilter = address.filter((add) => add.employeeId === Id);
  const AccountFillter = account.filter((acc) => acc.employeeId === Id);
  const LeaveFilter = employeeleavehistory.filter(leave => leave.employeeId === Id);
  const ProductEmpFilter = productsDetail.filter(pr => pr.employeeId === Id);
  
  const leaderFilter = leaderemployee.filter(le => le.employeeId === Id);
  const leaderId = leaderFilter.length>0 ? leaderFilter[0].leaderId: null;
  const leaderDataFilter = employee.filter(emp => emp.id === leaderId);
  const leaderData = leaderDataFilter.length > 0 ? leaderDataFilter : null;

  const hrFilter = leaderemployee.filter(le => le.employeeId === Id);
  const hrId = hrFilter.length >0 ? hrFilter[0].hrManagerId: null;
  const hrDataFilter = employee.filter(emp => emp.id === hrId);
  const hrData = hrDataFilter.length > 0 ? hrDataFilter : null;

  const EmployeeLeaves = employeeleave.length > 0 ? employeeleave.filter(data => data.employeeId === Id) : null
  const EmployeeLeavesFilter = EmployeeLeaves === null ? null: EmployeeLeaves[0] ;



  const menuItems = [
    {
      key: "1",
      icon: <FontAwesomeIcon icon={faHouse} />,
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
      icon: <FontAwesomeIcon icon={faUser} />,
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
      icon: <FontAwesomeIcon icon={faVault} />,
      label: "Bank Info",
      Content: <Bank Id={UpdateId} account={AccountFillter} />,
    },
    {
      key: "4",
      icon: <FontAwesomeIcon icon={faMoneyBill} />,
      label: "Pay Details",
      Content: <Pay Id={UpdateId} />,
    },
    {
      key: "5",
      icon: <FontAwesomeIcon icon={faDesktop} />,
      label: "System Assigned",
      Content: <System products={ProductEmpFilter} Id={UpdateId} />,
    },
    {
      key: "6",
      icon: <FontAwesomeIcon icon={faCalendarDays} />,
      label: "Holiday Calender",
      Content: <Holiday Id={UpdateId} leavehistory={LeaveFilter}/>,
    },
  ];



  return (
    
    <Layout style={{
      minHeight: '100vh',
    }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        //style={{ height: "100vh" }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          onClick={({ key }) =>
            {
              handleMenuClick(menuItems.find((item) => item.key === key))
            }
          }
                style={{
                  overflow: 'auto', // Set overflow to auto to enable scrolling
                }}
        >
          {menuItems.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            fontSize: "25px",
            fontWeight: "bold",  
          }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "26px",
                  width: 64,
                  height: 64,
                }}
              />
              {selectedMenuItem ? selectedMenuItem.label : "Dashboard"}
            </Col>
            <Col justify="flex-end" style={{ right: "1%" }}>
              <LogoutPage />
            </Col>
          </Row>
        </Header>
        <Content
          className="custom-content"
          style={{
            margin: "10px 16px",
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {/* {
            employeeleave&& employeeleave.length > 0 &&
            holiday&& holiday.length > 0 &&
            employee&& employee.length > 0 &&
            employeeleavehistory&& employeeleavehistory.length > 0 &&
            leavetable&& leavetable.length > 0 &&
            hrData&& hrData.length > 0 && 
            leaderData&& leaderData.length > 0 
            ? (
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
          ) :  
          selectedMenuItem != null?
            selectedMenuItem.Content
            :
            (
            <LoadingOutlined
              style={{
                fontSize: 24,
              }}
              spin
            />
          )
          } */}
          {
            selectedMenuItem != null?
            selectedMenuItem.Content
            :
            employeeleave &&
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
            leaderData.length > 0 ?
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
          : (
           <div className="w-full h-screen flex justify-center items-center">
           <LoadingOutlined
              style={{
                fontSize: 24,
              }}
              spin
            />
           </div>
          )
          }
        </Content>
      </Layout>
    </Layout>
  );
};

export default User;
