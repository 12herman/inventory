import React, { useEffect, useState ,useRef} from 'react';
import { ConfigProvider, Steps, Popconfirm, Form, Modal, Space, Table, Tag, Button, Col, Row, Statistic, Divider, Input, Checkbox, Select, DatePicker, message } from 'antd';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployees, postEmployees, putEmployees } from '../redux/slices/employeeSlice';
import { getrole } from '../redux/slices/roleSlice';
import '../css/user.css';
import { CountriesAPI } from '../apilinks/countrycode'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen, faInfoCircle, faLocationDot, faLandmark, faCircleCheck, faPeopleGroup, faL } from "@fortawesome/free-solid-svg-icons"
import { LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { getDepartment } from '../redux/slices/departmentSlice';
import { postRoleDetail } from '../redux/slices/roleDetailsSlice';
import TeamForm from '../components/TeamForm';
import AddressForm from '../components/AddressForm';
import AccountForm from '../components/AccountForm';
import FinishForm from '../components/FinishForm';
const dateFormat = 'YYYY-MM-DD';
const formatter = (value) => <CountUp end={value} />;
const headingValue = 'Employee';
const { Option } = Select;

const Users = ({ officeData }) => {

  //Emil validation
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  //Mobile number validation
  function validateMobileNumber(mobileNumber) {
    const mobileNumberRegex = /^\d{10}$/;
    return mobileNumberRegex.test(mobileNumber);
  }

  const [searchText, setSearchText] = useState('');
  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'id',
      render: (text) => <a>{text}</a>,
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return (
          String(record.name)
            .toLowerCase().includes(value.toLowerCase()) ||
          // String(record.lastname)
          // .toLowerCase().includes(value.toLowerCase()) ||
          String(record.age)
            .toLowerCase().includes(value.toLowerCase()) ||
          String(record.sno)
            .toLowerCase().includes(value.toLowerCase()) ||
          String(record.position)
            .toLowerCase().includes(value.toLowerCase())
        );
      }
    },
    // {
    //   title: 'Last Name',
    //   dataIndex: 'lastname',
    //   key: 'id',
    //   render: (text) => <a>{text}</a>,
    // },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'id',
    },
    {
      title: 'Position',
      key: 'position',
      dataIndex: 'position',
      render: (_, { position }) => (
        <>
          {position.map((tag) => {
            let color = tag.length > 7 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            } else if (tag === 'Not Assigned') {
              color = 'red';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'MobileNumber',
      dataIndex: 'mobilenumber',
      key: 'id',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div className="flex gap-x-2">
          <Popconfirm
            title="Are you sure to delete this?"
            okText="Yes"
            cancelText="No"
            okButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
            onConfirm={() => DeleteIcon(record)}
          >
            <Button><FontAwesomeIcon icon={faTrash} /></Button>
          </Popconfirm>

          <Button onClick={() => EditPencilIcon(record)}><FontAwesomeIcon icon={faPen} /></Button>
        </div>
      ),
    },
  ];

  // API calls
  const dispatch = useDispatch();
  const { employee, loading } = useSelector(state => state.employee);
  const { role } = useSelector(state => state.role);
  const { office } = useSelector(state => state.office);
  const { department } = useSelector(state => state.department);

  const [empData, setEmpData] = useState([]);
  const [roledetailData, setRoledetailData] = useState([]);
  const [empCounts, setEmpCounts] = useState();
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    dispatch(getEmployees());
    dispatch(getrole());
    dispatch(getDepartment());
  }, []);

  useEffect(() => {
    setRoledetailData(role);
    setEmpData(employee);
    DataLoading();
  }, [employee, officeData, role]);


  function DataLoading() {
    var numberOfOffice = officeData.filter((off) => off.isdeleted === false);
    var officeNames = numberOfOffice.map((off) => {
      return off.officename;
    });
    if (officeNames.length === 1) {
      var filterOneOffice = empData.filter((off) => off.officeLocationId.officename === officeNames[0]);
      setEmpCounts(filterOneOffice.length);
      setTableData(filterOneOffice);
    } else {
      setEmpCounts(empData.length);
      setTableData(empData);
    }
  }

  function calculateAge(birthdate) {
    const birthDateObj = new Date(birthdate);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDateObj.getFullYear();
    if (
      currentDate.getMonth() < birthDateObj.getMonth() ||
      (currentDate.getMonth() === birthDateObj.getMonth() &&
        currentDate.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }
    return age;
  };

  function roleCheck(roleid) {
    var roleDataCheck = roledetailData.filter(role => role.id === roleid);

    if (roleDataCheck.length > 0) {
      return roleDataCheck[0].rollName;
    } else {
      return "Not Assigned";
    }
  }

  const filterEmployeeDatas = tableData && tableData.length > 0 ? tableData.filter(el => el.isDeleted === false) : [];
  const Tbdata = filterEmployeeDatas && filterEmployeeDatas.length > 0
    ? filterEmployeeDatas.map((el, i) => {
      const roleName = el.roleDetails && el.roleDetails.length > 0 ? roleCheck(el.roleDetails[0].roleId) : "Not Assigned";
      return {
        sno: i + 1,
        key: el.id || '',
        name: `${el.firstName + " " + el.lastName}` || '',
        lastname: el.lastName || '',
        age: calculateAge(el.dateOfBirth),
        position: [el.departmentId && el.departmentId.departmentName, roleName],
        mobilenumber: el.mobileNumber || '',
      };
    })
    : [];



  // popup-window
  const [modelOpen, setModelOpen] = useState(false);
  const ModelOpen = () => setModelOpen(true);
  const ModelClose = () => { setModelOpen(false);  };
  // save (or) add btn state
  const [saveBtn, setsaveBtn] = useState(false);
  const saveBtnOn = () => setsaveBtn(true);
  const saveBtnOff = () => setsaveBtn(false);

  //new emp id
  const [newempid, setNewempId] = useState('');

  // Modal
  // post methods
  // 1.information
  const informationPostBtn = async () => { 
   
    //check all empty fields
      if (
        !EmployeeInput.firstName.trim() ||
        !EmployeeInput.lastName.trim() ||
        !String(EmployeeInput.gender).trim() || // Convert to string
        !EmployeeInput.personalEmail.trim() ||
        !EmployeeInput.officeEmail.trim() ||
        !EmployeeInput.mobileNumber.trim() ||
        !EmployeeInput.dateOfBirth.trim() ||
        !EmployeeInput.dateOfJoin.trim() ||
        !EmployeeInput.bloodGroup.trim() ||
        !EmployeeInput.alternateContactNo.trim() ||
        !EmployeeInput.contactPersonName.trim() ||
        !String(EmployeeInput.relationship).trim() || // Convert to string
        !String(EmployeeInput.maritalStatus).trim() || // Convert to string
        !String(EmployeeInput.officeLocationId).trim() || // Convert to string
        !String(EmployeeInput.departmentId).trim() // Convert to string
      ) {
        message.error("Fill all the fields");
      }
      // check the personal email 
      else if (validateEmail(EmployeeInput.personalEmail) === false) {
        message.error("Personal email is not a valid email");
      }
      // check the office email 
      else if (validateEmail(EmployeeInput.officeEmail) === false) {
        message.error("Office email is not a valid email");
      }
      // check the mobile number 
      else if(validateMobileNumber(EmployeeInput.mobileNumber) === false){
        message.error("please check the mobile number");
      } 
      // check the alternate mobile number
      else if(validateMobileNumber(EmployeeInput.alternateContactNo) === false){
        message.error("please check the alternate number");
      }
      // employee && role details post method
      else {
        // post employee details
         const employeeDatas =await dispatch(postEmployees(EmployeeInput));
        // post role details
         if(employeeDatas && employeeDatas.payload.id){
          console.log({ employeeId:employeeDatas.payload.id,...RoleValue}); 
          await dispatch(postRoleDetail({ employeeId:employeeDatas.payload.id,...RoleValue}));
          setNewempId(employeeDatas.payload.id);
         }
        infoPostProcessBar();
      };
    // infoPostProcessBar();
    // setNewempId(3);
  };


  // Model Edit Btn
  const ModelEditBtn = () => {
    ModelClose();
  };

  // Table Delete Icon 
  const DeleteIcon = (data) => {
    console.log(data.key);
  };

  // Table Edit Icon
  const EditPencilIcon = (data) => {
    saveBtnOn();
    ModelOpen();
    console.log(data.key);
  };



  // Employee Inputs
  const filedWidth = "730px";
  const [EmployeeInput, setEmployeeInput] = useState({
    firstName: "",
    lastName: "",
    gender: null,
    personalEmail: "",
    officeEmail: "",
    mobileNumber: "",
    dateOfBirth: "",
    dateOfJoin: "",
    bloodGroup: "",
    alternateContactNo: "",
    contactPersonName: "",
    relationship: null,
    maritalStatus: null,
    officeLocationId: null,
    departmentId: null,
    isDeleted: false
  });
  // all fields set
  const EmployeeInputsOnchange = (e) => {
    const { name, value } = e.target;
    setEmployeeInput(pre => ({
      ...pre,
      [name]: value
    }));
  };
  // gender set
  const GengerDropDown = (data) => {
    setEmployeeInput(prevState => ({ ...prevState, gender: data }));
  };
  // date of birth set
  const DateOfBirthValue = (date, dateString) => {
    setEmployeeInput(prevState => ({ ...prevState, dateOfBirth: dateString }));
  };
  // date of join set
  const DateOfJoinValue = (date, dateString) => {
    setEmployeeInput(prevState => ({ ...prevState, dateOfJoin: dateString }));
  };
  // bloodGroup set
  const BloodGroupValue = (value) => {
    // const bloodArray = Object.values(value);
    // const bloodGroupString = bloodArray.join(''); // Join the values without any separator
    setEmployeeInput(prevState => ({ ...prevState, bloodGroup: value }));
  };
  // maritalStatus set
  const MarriedDropDown = (data) => {
    setEmployeeInput(prevState => ({ ...prevState, maritalStatus: data }));
  };
  // relationship set
  const relationShipValue = (data) => {
    setEmployeeInput(prevState => ({ ...prevState, relationship: data }));
  };
  // officeLocationId set
  const officeFilterFalse = office.filter(off => off.isdeleted === false);
  const officeOption = [
    ...officeFilterFalse.map(off => ({
      key: off.id,
      value: off.id,
      label: off.officename
    }))
  ];
  const officeLocationDropDown = (data) => {
    setEmployeeInput(prevState => ({ ...prevState, officeLocationId: data }));
  };
  // departmentId set
  const departmentFilterFalse = department.filter(dep => dep.isdeleted === false);
  const departmentOption = [
    ...departmentFilterFalse.map(dep => ({
      key: dep.id,
      value: dep.id,
      label: dep.departmentName
    }))
  ];
  const departmentDropDown = (data) => {
    setEmployeeInput(prevState => ({ ...prevState, departmentId: data }));
  };
  // clear the fields
  const ClearEmployeeInputs = () => {
    setEmployeeInput({
      firstName: "",
      lastName: "",
      gender: null,
      personalEmail: "",
      officeEmail: "",
      mobileNumber: "",
      dateOfBirth: "",
      dateOfJoin: "",
      bloodGroup: "",
      alternateContactNo: "",
      contactPersonName: "",
      relationship: null,
      maritalStatus: null,
      officeLocationId: null,
      departmentId: null,
      isDeleted: false
    })
  };

  // Roll Details 
  const [RoleValue, setRoleValue] = useState({
    roleId: null,
    isdeleted: false
  });
  // drop down set
  const roleDropDown = (data) => {
    setRoleValue(pre => ({ ...pre, roleId: data }));
    //console.log(data);
  };
  // role clear
  const roleClear = () => {
    setRoleValue({
      roleId: null,
      isdeleted: false
    })
  };
  // role drop down data
  const roleFilter = role.filter(roles => roles.isdeleted === false);
  const optionRoles = [
    ...roleFilter.map(roles => ({
      key: roles.id,
      value: roles.id,
      label: roles.rollName
    }))
  ];
  const [form] = Form.useForm();
  // Employee Add|+| Btn
  const AddEmployeeBtn = () => {
    ClearEmployeeInputs(); //clear employee
    roleClear(); //clear role
    if (form) {
      form.resetFields(["firstName","lastName","gender","personalEmail","officeEmail","mobileNumber","dateOfBirth","dateOfJoin","bloodGroup","alternateContactNo","contactPersonName","relationship","maritalStatus","officeLocationId","departmentId","isDeleted","Role"]);
    }
    setProcessBar({
      info: 'process',
      team: 'wait',
      address: 'wait',
      account: 'wait',
      done: 'wait'
    })
    saveBtnOff();
    ModelOpen();
  };




  // process bar 
  const [processbar, setProcessBar] = useState({
    info: 'process',
    team: 'wait',
    address: 'wait',
    account: 'wait',
    done: 'wait'
  });
  //info
  const infoPostProcessBar = () => {
    setProcessBar(pre => ({ ...pre, info: "finish" }));
    setProcessBar(pre => ({ ...pre, team: 'process' }));
  };
  //team
  const teamPostProcessBar = () => {
    setProcessBar(pre => ({ ...pre, address: "process" }));
    setProcessBar(pre => ({ ...pre, team: 'finish' }));
  };
  // address
  const addressPostProcessBar = () => {
    console.log("address Post");
    setProcessBar(pre => ({ ...pre, address: "finish" }));
    setProcessBar(pre => ({ ...pre, account: 'process' }));
  };
  // account
  const accountPostProcessBar = () => {
    console.log("account Post");
    setProcessBar(pre => ({ ...pre, account: "finish" }));
    setProcessBar(pre => ({ ...pre, done: 'finish' }));
  };




  

// child to parent function
const teamFormRef = useRef();
const postTeam = () => {
  if (teamFormRef.current) {
    teamFormRef.current.teamValidateData();
  }
};



  return (
    <div >

      <Row gutter={[16, 16]} align='middle'>
        <Col span={3}><Statistic title="User Count" value={empCounts} formatter={formatter} /></Col>
        <Col span={17} style={{ left: '0%' }}> <Input.Search placeholder='Search here....'
          onSearch={(value) => { setSearchText(value) }}
          onChange={(e) => { setSearchText(e.target.value) }} style={{ width: `30%` }} /></Col>
        <Col span={4}  ><Button onClick={AddEmployeeBtn} type="primary" className='bg-blue-500'>{`Add ${headingValue}`}</Button></Col>
      </Row>


      <Divider />


      <Col span={25}>
        <Table columns={columns}
          dataSource={Tbdata}
          pagination={{ pageSize: 5 }} />
      </Col>

      <Modal title={[<h2 className='text-center pt-2'>{`Add New ${headingValue}`}</h2>,
      <Steps
        className='mt-3 px-[100px]'
        size='small'
        items={[
          {
            title: 'Info',
            status: processbar.info,
            icon: processbar.info === 'process' ? <LoadingOutlined /> : <FontAwesomeIcon icon={faInfoCircle} />,
            //&& <LoadingOutlined />
          },
          {
            title: 'Team',
            status: processbar.team,
            icon: processbar.team === 'process' ? <LoadingOutlined /> : <FontAwesomeIcon icon={faPeopleGroup} />,
            //&& <LoadingOutlined />
          },
          {
            title: 'Address',
            status: processbar.address,
            icon: processbar.address === 'process' ? <LoadingOutlined /> : <FontAwesomeIcon icon={faLocationDot} />,
          },
          {
            title: 'Account',
            status: processbar.account,
            icon: processbar.account === 'process' ? <LoadingOutlined /> : <FontAwesomeIcon icon={faLandmark} />,
          },
          {
            title: 'Done',
            status: processbar.done,
            icon: processbar.done === 'process' ? <LoadingOutlined /> : <FontAwesomeIcon icon={faCircleCheck} />,
          },
        ]}
      />]}
        open={modelOpen}
        centered
        onCancel={ModelClose}
        width={1000}
        footer={[
          //info back
          // backbtn.infoback === true
          //   ? <Button onClick={InfoBack}>Back</Button>
          //   : "",
          //saveBtn === false ? <Button key="submit" onClick={informationPostBtn}>Next</Button> : <Button key="1" onClick={ModelEditBtn} >Save</Button>,

         
          //next btns
          processbar.info === 'process'//condition
            ? <Button key="submit" onClick={informationPostBtn}>Next</Button>
            : processbar.team === 'process'//condition
              ? <Button key="submit" onClick={teamPostProcessBar}>Next</Button>
              : processbar.address === 'process'//condition
                ? <Button key="submit" onClick={addressPostProcessBar}>Next</Button>
                : processbar.account === 'process'//condition
                  ? <Button key="submit" onClick={accountPostProcessBar}>Next</Button>
                  : "" ,
                  /*
                  processbar.info === 'process'//condition
                  ? <Button key="submit" onClick={informationPostBtn}>Next</Button>
                  : 
                  processbar.team === 'process' ? <Button key="submit" onClick={postTeam}>Next</Button> : <Button key="submit" onClick={teamPostProcessBar}>Next</Button>,
                  */
          // close && finish btn
          processbar.done === 'finish'//condition
            ? <Button onClick={()=>ModelClose()} style={{ borderColor: '#00b96b', color: '#00b96b' }}>Finish</Button>
            : <Button type='text' key="2" danger="red" style={{ border: "0.5px solid red" }} onClick={() => ModelClose()}>Close</Button>
        ]}>

        {/* (i)Employee-Details-section */}
        {processbar.info === "process" ?
          <section>
            {/* <h1 className='font-bold mt-2 text-center'>Employee Details</h1> */}
            <Form form={form}
            >
              {/* firstName */}
              <Form.Item
                name="firstName" label="First Name" style={{ marginBottom: 0, marginTop: 10, }} className='px-7' >
                <Input style={{ float: "right", width: filedWidth }} placeholder='first name' name='firstName' value={EmployeeInput.firstName} onChange={EmployeeInputsOnchange} />
              </Form.Item>

              {/* lastName */}
              <Form.Item name="lastName" label="Last Name" style={{ marginBottom: 0, marginTop: 10 }} className='px-7'>
                <Input style={{ float: "right", width: filedWidth }} placeholder='last name' name='lastName' value={EmployeeInput.lastName} onChange={EmployeeInputsOnchange} />
              </Form.Item >

              {/* gender */}
              <Form.Item name="gender" rules={[{ message: 'Please select your gender!', type: 'string' },]}
                label="Gender" style={{ marginBottom: 0, marginTop: 10 }}
                className='px-7'>
                <Select optionFilterProp="children"

                  placeholder="select gender"
                  style={{ float: "right", width: filedWidth }}
                  onChange={GengerDropDown}
                  options={[
                    {
                      key: 1,
                      value: "Male",
                      label: "Male"
                    },
                    {
                      key: 2,
                      value: "Female",
                      label: "Female"
                    },
                    {
                      key: 3,
                      value: "Other",
                      label: "Other"
                    },
                  ]}
                  value={EmployeeInput.gender}
                />
              </Form.Item >

              {/* personalEmail */}
              <Form.Item rules={[{ type: 'email', }]} className='px-7'
                label="Personal Email"
                name='personalEmail'
                style={{ marginBottom: 0, marginTop: 10 }}>
                <Input style={{ float: "right", width: filedWidth }} placeholder='personal email' name='personalEmail' value={EmployeeInput.personalEmail} onChange={EmployeeInputsOnchange} />
              </Form.Item >

              {/* officeEmail */}
              <Form.Item rules={[{ type: 'email', }]} className='px-7'
                name='officeEmail' label="Office Email" style={{ marginBottom: 0, marginTop: 10 }}>
                <Input style={{ float: "right", width: filedWidth }} placeholder='office email' name='officeEmail' value={EmployeeInput.officeEmail} onChange={EmployeeInputsOnchange} />
              </Form.Item >

              {/* mobileNumber */}
              <Form.Item className='px-7'
                style={{ marginBottom: 0, marginTop: 10 }}
                label="Mobile Number"
                name="mobileNumber"
                rules={[
                  { message: 'Please enter your mobile number' },
                  {
                    pattern: /^[0-9]{10}$/, // Adjust the regular expression as needed
                    message: 'Please enter a valid 10-digit mobile number',
                  },
                ]}
              >
                <Input
                  style={{ float: "right", width: filedWidth }}
                  placeholder="Mobile Number"
                  name="mobileNumber"
                  value={EmployeeInput.mobileNumber}
                  onChange={EmployeeInputsOnchange}
                />
              </Form.Item>

              {/* dateOfBirth*/}
              <Form.Item
                name="dateOfBirth"
                className='px-7' label="Date Of Birth" style={{ marginBottom: 0, marginTop: 10 }}>
                <DatePicker style={{ float: "right", width: filedWidth }} format={dateFormat} onChange={DateOfBirthValue} />
              </Form.Item >

              {/* dateOfJoin*/}
              <Form.Item
                name="dateOfJoin"
                className='px-7' label="Date Of Join" style={{ marginBottom: 0, marginTop: 10 }}>
                <DatePicker style={{ float: "right", width: filedWidth }} format={dateFormat} onChange={DateOfJoinValue} />
              </Form.Item >

              {/* bloodGroup */}
              <Form.Item
                name="bloodGroup"
                className='px-7' label="Blood Group" style={{ marginBottom: 0, marginTop: 10 }}>
                <Select
                  //mode="multiple"
                  //size={size}
                  placeholder="select blood group"
                  onChange={BloodGroupValue}
                  style={{ float: "right", width: filedWidth }}
                  options={[
                    {
                      key: 1,
                      value: "A+",
                      label: "A+"
                    },
                    {
                      key: 2,
                      value: "A-",
                      label: "A-"
                    },
                    {
                      key: 3,
                      value: "B+",
                      label: "B+"
                    },
                    {
                      key: 4,
                      value: "B-",
                      label: "B-"
                    },
                    {
                      key: 5,
                      value: "O+",
                      label: "O+"
                    },
                    {
                      key: 6,
                      value: "O-",
                      label: "O-"
                    },
                    {
                      key: 7,
                      value: "AB+",
                      label: "AB+"
                    },
                    {
                      key: 8,
                      value: "AB-",
                      label: "AB-"
                    }
                  ]}
                />
              </Form.Item >

              {/* alternateContactNo */}
              <Form.Item

                className='px-7'
                style={{ marginBottom: 0, marginTop: 10 }}
                label="Alternate Contact No"
                name="alternateContactNo"
                rules={[
                  { message: 'Please enter your mobile number' },
                  {
                    pattern: /^[0-9]{10}$/, // Adjust the regular expression as needed
                    message: 'Please enter a valid 10-digit mobile number',
                  },
                ]}
              >
                <Input
                  style={{ float: "right", width: filedWidth }}
                  placeholder="alternate contact no"
                  name="alternateContactNo"
                  value={EmployeeInput.alternateContactNo}
                  onChange={EmployeeInputsOnchange}
                />
              </Form.Item>

              {/* Relationship */}
              <Form.Item

                name="relationship" className='px-7' label="Relationship" style={{ marginBottom: 0, marginTop: 10 }}>
                <Select

                  optionFilterProp="children"
                  placeholder="select relationship"
                  style={{ float: "right", width: filedWidth }}
                  onChange={relationShipValue}
                  options={[
                    {
                      key: 1,
                      value: "Father",
                      label: "Father"
                    },
                    {
                      key: 2,
                      value: "Mother",
                      label: "Mother"
                    },
                    {
                      key: 3,
                      value: "Son",
                      label: "Son"
                    },
                    {
                      key: 4,
                      value: "Daughter",
                      label: "Daughter"
                    },
                    {
                      key: 5,
                      value: "Husband",
                      label: "Husband"
                    },
                    {
                      key: 6,
                      value: "Wife",
                      label: "Wife"
                    },
                    {
                      key: 7,
                      value: "Brother",
                      label: "Brother"
                    },
                    {
                      key: 8,
                      value: "Sister",
                      label: "Sister"
                    },
                    {
                      key: 9,
                      value: "Grandfather",
                      label: "Grandfather"
                    },
                    {
                      key: 10,
                      value: "Grandmother",
                      label: "Grandmother"
                    },
                    {
                      key: 11,
                      value: "Grandson",
                      label: "Grandson"
                    },
                    {
                      key: 12,
                      value: "Uncle",
                      label: "Uncle"
                    },
                    {
                      key: 13,
                      value: "Aunt",
                      label: "Aunt"
                    },
                    {
                      key: 14,
                      value: "Nephew",
                      label: "Nephew"
                    },
                    {
                      key: 15,
                      value: "Niece",
                      label: "Niece"
                    },
                    {
                      key: 16,
                      value: "Cousins",
                      label: "Cousins"
                    }

                  ]}
                  value={EmployeeInput.relationship}
                />

              </Form.Item>

              {/* contactPersonName */}
              <Form.Item
                name="contactPersonName"
                className='px-7' label="Contact Person Name" style={{ marginBottom: 0, marginTop: 10 }}>
                <Input style={{ float: "right", width: filedWidth }} placeholder='contact person name' name='contactPersonName' value={EmployeeInput.contactPersonName} onChange={EmployeeInputsOnchange} />
              </Form.Item>

              {/* maritalStatus */}
              <Form.Item

                name="maritalStatus" className='px-7' label="Marital Status" style={{ marginBottom: 0, marginTop: 10 }}>
                <Select optionFilterProp="children"
                  placeholder="select marital status"
                  style={{ float: "right", width: filedWidth }}
                  onChange={MarriedDropDown}
                  options={[
                    {
                      value: "Married",
                      label: "Married"
                    },
                    {
                      value: "Unmarried",
                      label: "Unmarried"
                    }
                  ]}
                  value={EmployeeInput.maritalStatus}
                />
              </Form.Item >

              {/* officeLocationId */}
              <Form.Item
                name="officeLocationId" className='px-7' label="Office Location" style={{ marginBottom: 0, marginTop: 10 }}>
                <Select optionFilterProp="children"
                  placeholder="select office location"
                  style={{ float: "right", width: filedWidth }}
                  onChange={officeLocationDropDown}
                  options={officeOption}
                  value={EmployeeInput.officeLocationId}
                />
              </Form.Item >

              {/* departmentId */}
              <Form.Item
                name="departmentId" className='px-7' label="Department" style={{ marginBottom: 0, marginTop: 10 }}>
                <Select optionFilterProp="children"
                  placeholder="select department"
                  style={{ float: "right", width: filedWidth }}
                  onChange={departmentDropDown}
                  options={departmentOption}
                  value={EmployeeInput.departmentId}
                />
              </Form.Item >

              {/* Roll Detail */}
              <Form.Item
                name="Role" className='px-7' label="Role" style={{ marginBottom: 0, marginTop: 10 }}>
                <Select optionFilterProp="children"
                  placeholder="select role"
                  style={{ float: "right", width: filedWidth }}
                  onChange={roleDropDown}
                  options={optionRoles}
                  value={RoleValue.roleId}
                />
              </Form.Item >

            </Form>
          </section>
          : processbar.team === "process"
            ? <TeamForm newempid={newempid} teamPostProcessBar={teamPostProcessBar} ref={teamFormRef}/>
            : processbar.address === "process"
              ? <AddressForm newempid={newempid} />
              : processbar.account === "process"
                ? <AccountForm newempid={newempid}/>
                : processbar.done === "finish"
                  ? <FinishForm newempid={newempid}/> : ''}
      </Modal>
    </div>

  );
};

export default Users;