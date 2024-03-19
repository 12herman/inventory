import React, { useState } from 'react';
import { Button, Col, Divider, Layout, Switch, Row } from 'antd';
import Icon from '@ant-design/icons/lib/components/Icon';
import { LeftCircleOutlined } from '@ant-design/icons'
import OfficeSettings from './settingsPages/OfficeSettings';
import RoleSettings from './settingsPages/RoleSettings';
import AccountDetailSettings from './settingsPages/AccountDetailsSettings';
import DepartmentSettings from './settingsPages/DepartmentSettings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBuilding,faToolbox,faBuildingColumns,faBuildingUser,faKeyboard,faCopyright,faChampagneGlasses, faCalendarDays, faTable, faUserTie} from '@fortawesome/free-solid-svg-icons';
import BrandSettings  from './settingsPages/BrandSettings';
import AccessoriesSettings from './settingsPages/AccessoriesSettings';
import HolidaySetting from './settingsPages/HolidaySettings';
import EmployeeLeaveSettings from './settingsPages/EmployeeLeaveSettings';
import LeaveTable from './settingsPages/LeaveTable';


const Settings = ({user}) => {

  const [settingsBack, setsettingsBack] = useState(true);
  const [setingPreview, setPreview] = useState();


  const BackToSetting = ()=>{
    setsettingsBack(true)
  };

  const settingList = [
    {
      key: 1,
      settingname: "Office",
      componets: <OfficeSettings />,
      icon: faBuilding,
      props: { BackToSetting : () => setsettingsBack(true) },
      
    },
    {
      key: 2,
      settingname: "Role",
      componets: <RoleSettings />,
      icon: faToolbox,
      props: { BackToSetting : () => setsettingsBack(true) },
      
    },
    {
      key: 3,
      settingname: "Account Details",
      componets: <AccountDetailSettings />,
      icon: faBuildingColumns,
      props: { BackToSetting : () => setsettingsBack(true) }
    },
    {
      key: 4,
      settingname: "Department",
      componets: <DepartmentSettings />,
      icon: faBuildingUser,
      props: { BackToSetting : () => setsettingsBack(true) }
    },
    {
      key: 5,
      settingname: "Brand",
      componets: <BrandSettings />,
      icon: faCopyright,
      props: { BackToSetting : () => setsettingsBack(true) }
    },
    {
      key: 6,
      settingname: "Accessories",
      componets: <AccessoriesSettings />,
      icon: faKeyboard,
      props: { BackToSetting : () => setsettingsBack(true) }
    },
    {
      key: 7,
      settingname: "Yearly Holiday Table",
      componets: <HolidaySetting/>,
      icon: faCalendarDays,
      props: { BackToSetting : () => setsettingsBack(true) }
    },
    {
      key: 8,
      settingname: "Employee Leave",
      componets: <EmployeeLeaveSettings/>,
      icon: faChampagneGlasses,
      props: { BackToSetting : () => setsettingsBack(true) }
    },
    {
      key: 9,
      settingname: "Leave Table",
      componets: <LeaveTable/>,
      icon: faTable,
      props: { BackToSetting : () => setsettingsBack(true) }
    },
  ];


  const curdPage = (e) => {
    setsettingsBack(false);
    const clickedCol = e.target.closest('.cursor-pointer');
    if (clickedCol) {
      const settingName = clickedCol.getAttribute('name');
      const selectedSetting = settingList.find((setting) => setting.settingname === settingName);
      if (selectedSetting && selectedSetting.componets) {
        setPreview(React.cloneElement(selectedSetting.componets, { ...selectedSetting.props, BackToSetting }));
      }
    }
  };
  
  return (
    <div className='z-0'>
      {/* <h3>Theme <Switch checkedChildren="Dark" unCheckedChildren="Light" defaultChecked /></h3> */}
      {
        settingsBack === true ? 
        <ul className='flex flex-col gap-y-5'>
        <li key="1" className='border-b-[1px] border-gray-200 pb-2'><FontAwesomeIcon className='text-3xl ' icon={faUserTie}/> <span className='ml-2 font-medium'>{user === undefined ? "Admin Not Fount" : user.firstName + " " + user.lastName}</span></li>
        {/* <Divider className='mb-0 mt-2'/> */}
        {
          settingList.map((settings, i) => {
            return (
                <li key={i} onClick={curdPage} name={settings.settingname} className='cursor-pointer border-b-[1px] border-gray-200 block w-full text-gray-400 hover:text-blue-500  text-base '> <FontAwesomeIcon   icon={settings.icon}/> &#160; <span className='text-gray-400 font-[480]'>{settings.settingname}</span></li>
            )
          })
        }
      </ul> : setingPreview
      }
    </div>
  );
};

export default Settings;