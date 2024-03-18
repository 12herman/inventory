import React, { useState, useEffect, useRef } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, DownOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, theme, Modal, Dropdown, Space, Col, Row, Form, Input, message,Popconfirm, Tag,Popover } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSliders, faHouse, faUser, faDesktop, faWarehouse, faScrewdriverWrench, faPlus, faRightFromBracket, faQuoteLeftAlt,faDollar,faBars,faArrowLeft} from '@fortawesome/free-solid-svg-icons';
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
import {useMediaQuery} from 'react-responsive'
// import { getEmployees } from '../redux/slices/employeeSlice';

const { Header, Sider, Content } = Layout;

const Accessories = ({Id,Employees}) => {
  
  // states
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState();
  const [selectedOffice, setSelectedOffice] = useState("All Office");
  const [officeData, setOfficeData] = useState([]);
  
  // Apis
  const dispatch = useDispatch();
  const { office, loading } = useSelector(state => state.office);
  const {employee} = useSelector(state => state.employee); 

 

  useEffect(() => {
    dispatch(getOffice());
  }, []);

  useEffect(() => {
    setOfficeData(office);
    dispatch(getEmployees());
  }, [office]);


  const isDeleteOffice = office.filter(off => off.isdeleted === false);
  // console.log(isDeleteOffice);

  
  // const EmployeeFiltering = 
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


const Emp = employee.filter(emp => emp.id === Id) ;
const EmpFilter = Emp && typeof Emp === 'object' ?  Emp[0] : undefined;

// console.log(EmpFilter);

const LoginUser = EmpFilter && EmpFilter !== undefined ? EmpFilter.firstName +" "+ EmpFilter.lastName : null;

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
      icon: faHouse,
      label: 'Dashboard',
      Content: <Dashboard LoginUser={LoginUser} />,
      Components: 'Dashboard'
    },
    {
      key: '2',
      icon: faUser,
      label: 'User',
      Content: <Employee LoginUser={LoginUser} />,
      Components: 'Employee'
    },
    {
      key: '3',
      icon: faDesktop,
      label: 'Products',
      Content: <Products LoginUser={LoginUser} />,
      Components: 'Products'
    },
    {
      key: '4',
      icon: faWarehouse,
      label: 'Storage',
      Content: <Storage LoginUser={LoginUser} />,
      Components: 'Storage'
    },
    {
      key: '5',
      icon: faScrewdriverWrench,
      label: 'Repair',
      Content: <Repair LoginUser={LoginUser} />,
      Components: 'Repair'
    },
    {
      key: '6',
      icon: faDollar,
      label: 'Salary',
      Content: <Salary />,
      Components: 'Salary'
    },
    {
      key: '7',
      icon: faSliders,
      label: 'Settings',
      Content: <Settings user={EmpFilter} LoginUser={LoginUser} />,
      Components: 'Settings'
    },  
  ];

  const content = (
    <div className="px-5 flex flex-col justify-center items-center gap-y-2">
    <p className="text-sm font-bold flex items-center justify-center gap-x-2"> {EmpFilter && typeof EmpFilter === 'object' ? EmpFilter.firstName + " " + EmpFilter.lastName : null} <Tag color="green" className="text-[10px] font-medium">{EmpFilter && typeof EmpFilter === 'object' ? EmpFilter.departmentId.departmentName : null}</Tag></p>
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
  // console.log(EmpFilter && typeof EmpFilter === 'object' ? EmpFilter.firstName + " " + EmpFilter.lastName : null);
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

<main className={`relative w-11/12 ${ isMobile === true ? "mx-auto" : " ml-auto"} transition-all ease-in duration-300`}>

<ul className="header bg-blue-500 px-5 fixed flex justify-between top-[0px] left-[0px] z-10 w-full  shadow-md  py-5 ">
        <li className="menu-btn flex items-center gap-x-5 ">
        {Nav.open === false ? 
          <FontAwesomeIcon onClick={()=> setNav(pre => ({...pre, open: true}))} className="cursor-pointer text-white text-xl" icon={faArrowLeft} />
        :  <FontAwesomeIcon className="cursor-pointer text-white text-xl" icon={faBars} onClick={()=> setNav(pre => ({...pre, open: false}))}/> } 
          <h3 className="text-md font-medium text-white hidden md:block">{Nav.menu}</h3>
        </li>
        
        <li className='flex justify-center items-center gap-x-5'>
       <div className='m-[-4.5px]'> <Dropdown className='bg-white'  overlay={officeMenu} trigger={['click']} placement="bottomLeft">
                   <Button>
                     <Space>
                       {selectedOffice ? selectedOffice : 'All Office'} <DownOutlined />
                     </Space>
                   </Button>
                 </Dropdown></div>
        <Popover content={content} placement="bottomRight"  trigger="click">
        <FontAwesomeIcon  className="text-xl cursor-pointer text-white" icon={faUser}/>
        </Popover> 
        </li>
      </ul>

      <ul className={`transition-all ease-in duration-300 menu-slide fixed bg-white border top-16  h-screen z-50 
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
      </ul>

      <section className={`relative pt-24 pb-5 transition-all ease-in duration-300  ${Nav.open === false && isMobile === false ? "pl-[135px] lg:pr-20" : "pl-[0px] lg:pr-20"} `}>
     
     {Nav.content != null ? 
       (
       Nav.content ? (
            React.cloneElement(Nav.content, {
              key: Nav.content, //Ensure a unique key for each component
              officeData: officeData,
              LoginUser:LoginUser,
            })
          ) : <Dashboard officeData={officeData} />
     )
     : Employees.length > 0 ?
     <Dashboard LoginUser={LoginUser} officeData={officeData}/> 
     : (
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

export default Accessories;