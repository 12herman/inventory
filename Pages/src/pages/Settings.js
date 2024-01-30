import React, { useState } from 'react';
import { Button, Col, Divider, Layout, Switch, Row } from 'antd';
import Icon from '@ant-design/icons/lib/components/Icon';
import { LeftCircleOutlined } from '@ant-design/icons'
import OfficeSettings from './settingsPages/OfficeSettings';
import RoleSettings from './settingsPages/RoleSettings';
import AccountDetailSettings from './settingsPages/AccountDetailsSettings';
import DepartmentSettings from './settingsPages/DepartmentSettings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBuilding,faToolbox,faBuildingColumns,faBuildingUser} from '@fortawesome/free-solid-svg-icons';




const Settings = () => {

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
    <div>
      {/* <h3>Theme <Switch checkedChildren="Dark" unCheckedChildren="Light" defaultChecked /></h3> */}
      {
        settingsBack === true ? 
        <Row align="middle">
        {
          settingList.map((settings, i) => {
            return (
                <Col key={i} onClick={curdPage} name={settings.settingname} className='cursor-pointer block w-full py-2 hover:text-gray-500 z-50'> <FontAwesomeIcon  icon={settings.icon}/> &#160; <span>{settings.settingname}</span>  <Divider style={{ marginTop: 0, marginBottom: 3 }} /></Col>
            )
          })
        }
      </Row> : setingPreview
      }
    </div>
  );
};

export default Settings;