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

  const [loadingholiday, setLoadingholiday] = useState(false);

  useEffect(() => {
    dispatch(GetHoliday());
    dispatch(Getemployeeleave());
    dispatch(getEmployees());
    dispatch(getAddress());
    dispatch(getaccount());
  }, [dispatch]);

  const EmpFilter = employee.filter((emp) => emp.id === Id);
  const AddressFilter = address.filter((add) => add.employeeId === Id);
  const AccountFillter = account.filter((acc) => acc.employeeId === Id);
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
      Content: <System Id={UpdateId} />,
    },
    {
      key: "6",
      icon: <FontAwesomeIcon icon={faCalendarDays} />,
      label: "Holiday Calender",
      Content: <Holiday Id={UpdateId} />,
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
        style={{ height: "100vh" }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          onClick={({ key }) =>
            handleMenuClick(menuItems.find((item) => item.key === key))
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
            //position:'fixed',
            //width:"100%",
            // display:"flex",
            // justifyContent:"space-evenly",
            // justifyItems:'center',
            // zIndex:1,
            
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
            //margin: '24px 16px',
            margin: "10px 16px",
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
           
          
            // overflow: 'auto', // Set overflow to auto to enable scrolling
            // height: `calc(100vh - 64px)`
          }}
        >
          {selectedMenuItem ? (
            selectedMenuItem.Content
          ) : employeeleave.length > 0 &&
            holiday.length > 0 &&
            employee.length > 0 ? (
            <UserDashboard
              Id={Id}
              LeaveDatas={employeeleave}
              holiday={holiday}
              employee={employee}
            />
          ) : (
            <LoadingOutlined
              style={{
                fontSize: 24,
              }}
              spin
            />
          )}
        </Content>
      </Layout>
    </Layout>
 
  );
};

export default User;
