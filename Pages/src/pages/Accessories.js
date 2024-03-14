import React, { useState, useEffect, useRef } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, DownOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, theme, Modal, Dropdown, Space, Col, Row, Form, Input, message,Popconfirm } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSliders, faHouse, faUser, faDesktop, faWarehouse, faScrewdriverWrench, faPlus, faRightFromBracket, faQuoteLeftAlt,faDollar } from '@fortawesome/free-solid-svg-icons';
import { PlusOutlined } from '@ant-design/icons';

import Dashboard from './Dashboard';
import Users from './Users';
import Products from './Products';
import Storage from './Storage';
import Repair from './Repair';
import Salary from './Salary';
import Settings from './Settings';

import { useDispatch, useSelector } from 'react-redux';
import { createOffice, getOffice } from '../redux/slices/officeSlice';

import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import Employee from './employee';
import LoginPage from "../Loginpage"
import LogoutPage from '../components/LogoutPage';
import { getEmployees } from '../redux/slices/employeeSlice';
// import { getEmployees } from '../redux/slices/employeeSlice';

const { Header, Sider, Content } = Layout;

const Accessories = ({Id}) => {
  
  // Apis
  const dispatch = useDispatch();
  const { office, loading } = useSelector(state => state.office);

  const isDeleteOffice = office.filter(off => off.isdeleted === false);
  //console.log(isDeleteOffice);

  useEffect(() => {
   
    dispatch(getOffice());
  }, []);

  const officeList = [
    {
      label: 'All Office',
      key: 'All Office',
    },
    ...isDeleteOffice.map((officeItem) => ({
      label: officeItem.officename,
      key: officeItem.officename, // Replace with the actual key from your API response
    })),
  ];

  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState();
  const [selectedOffice, setSelectedOffice] = useState("All Office");
  const [officeData, setOfficeData] = useState([]);

  
  const {employee} = useSelector(state => state.employee); 

  useEffect(() => {
    setOfficeData(office);
    dispatch(getEmployees());
  }, [office]);

  
  const EmpFilter = employee.filter(emp => emp.id === Id) ? employee.filter(emp => emp.id === Id)[0] : undefined;


  const handleMenuClick = (item) => {
    setSelectedMenuItem(item);
    // console.log(`item : ${item.label}`);
  };


  const handleOfficeSelect = (key) => {
    setSelectedOffice(key);
    if (key === "All Office") {
      setOfficeData(office);
    }
    else {
      var officeFilter = office.filter(off =>  off.officename === key);
      setOfficeData(officeFilter);
    }
  };

  const officeMenu = (
    <Menu onClick={({ key }) => handleOfficeSelect(key)} items={officeList.map((office) =>({key:office.key,label:office.label}))}/>
  );

  // const officeMenu = (
  //   <Menu onClick={({ key }) => handleOfficeSelect(key)}>
  //     {officeList.map((item) => (
  //       <Menu.Item key={item.key}>
  //         {item.label}
  //       </Menu.Item>
  //     ))}
  //   </Menu>
  // );

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const showPopconfirm = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };
  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };
  const menuItems = [
    {
      key: '1',
      icon: <FontAwesomeIcon icon={faHouse} />,
      label: 'Dashboard',
      Content: <Dashboard />,
      Components: 'Dashboard'
    },
    // {
    //   key: '2',
    //   icon: <FontAwesomeIcon icon={faUser} />,
    //   label: 'Users',
    //   Content: <Users />,
    //   Components: 'Users'
    // },
    {
      key: '2',
      icon: <FontAwesomeIcon icon={faUser} />,
      label: 'User',
      Content: <Employee />,
      Components: 'Employee'
    },
    {
      key: '3',
      icon: <FontAwesomeIcon icon={faDesktop} />,
      label: 'Products',
      Content: <Products />,
      Components: 'Products'
    },
    {
      key: '4',
      icon: <FontAwesomeIcon icon={faWarehouse} />,
      label: 'Storage',
      Content: <Storage />,
      Components: 'Storage'
    },
    {
      key: '5',
      icon: <FontAwesomeIcon icon={faScrewdriverWrench} />,
      label: 'Repair',
      Content: <Repair />,
      Components: 'Repair'
    },
    {
      key: '6',
      icon: <FontAwesomeIcon icon={faDollar} />,
      label: 'Salary',
      Content: <Salary />,
      Components: 'Salary'
    },
    {
      key: '7',
      icon: <FontAwesomeIcon icon={faSliders} />,
      label: 'Settings',
      Content: <Settings user={EmpFilter}/>,
      Components: 'Settings'
    },  
  ];



  // const [newOfficePopup, setNewOfficePopup] = useState(false);
  // const handleOk = () => setNewOfficePopup(false);
  // const handleCancel = () => setNewOfficePopup(false);

  // const [officeField, setOfficeFileld] = useState({
  //   officename: '',
  //   address: '',
  //   city: '',
  //   state: '',
  //   country: ''
  // });
  // const officeInputData = (e) => {
  //   const { name, value } = e.target;
  //   setOfficeFileld((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };
  // const createNewOffice = () => {
  //   if (officeField.officename === "" ||
  //     officeField.address === "" ||
  //     officeField.city === "" ||
  //     officeField.country === "" ||
  //     officeField.state === "") {
  //     message.error("Fill all the fields");
  //   }
  //   else {
  //     console.log(officeField);
  //     dispatch(createOffice(officeField));
  //       message.success("New office created successfully");
  //       setNewOfficePopup(false)
  //       setOfficeFileld({
  //         officename: '',
  //         address: '',
  //         city: '',
  //         state: '',
  //         country: ''
  //       });
  //       setOfficeData(office);
  //   }
  // };

  

  return (
    <Layout style={{ position: 'relative' }}>

      <Sider trigger={null} collapsible collapsed={collapsed} style={{
        height: '100vh', zIndex: 99,
        //position:'fixed'
      }}>
        <div className="demo-logo-vertical" />

        <Menu
  theme="dark"
  mode="inline"
  defaultSelectedKeys={['1']}
  onClick={({ key }) => handleMenuClick(menuItems.find((item) =>  item.key === key ))}
  items={ menuItems.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
  }))}
/>

      </Sider>

      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            fontSize: '25px',
            fontWeight: 'bold',
            // margin: '0px 0px 0px 15%',
          }}>
          <Row justify='space-between' align='middle' >
            <Col>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '26px',
                  width: 64,
                  height: 64,

                }}
              />
              {selectedMenuItem ? selectedMenuItem.label : 'Dashboard'}
            </Col>
            <Col justify='flex-end' style={{ right: '1%' }}>

              <div className='flex justify-center items-center gap-x-2'>
                
                  <Dropdown  overlay={officeMenu} trigger={['click']} placement="bottomLeft">
                    <Button>
                      <Space>
                        {selectedOffice ? selectedOffice : 'All Office'} <DownOutlined />
                      </Space>
                    </Button>
                  </Dropdown>
                  <LogoutPage/>
                
              </div>
            </Col>
          </Row>
        </Header>

        <Content 
        
          className="custom-content"
          style={{
            //width:'85%',
            //margin: '10px 10px 0px 15%',
            margin: '20px 20px',
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            height: `auto`,
            overflow:'auto'
          }}>
          {selectedMenuItem ? (
            React.cloneElement(selectedMenuItem.Content, {
              key: selectedMenuItem.Components, // Ensure a unique key for each component
              officeData: officeData,
            })
          ) : <Dashboard officeData={officeData} />}

        </Content>
      </Layout>
    </Layout>
  );
};

export default Accessories;