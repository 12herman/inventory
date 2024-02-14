import React, { useEffect, useState, useRef } from "react";
import {
  ConfigProvider,
  Steps,
  Popconfirm,
  Form,
  Modal,
  Space,
  Table,
  Tag,
  Button,
  Col,
  Row,
  Statistic,
  Divider,
  Input,
  Checkbox,
  Select,
  DatePicker,
  message,
} from "antd";
import CountUp from "react-countup";
import { useDispatch, useSelector } from "react-redux";
import {
  getEmployees,
  postEmployees,
  putEmployees,
} from "../redux/slices/employeeSlice";
import { getrole } from "../redux/slices/roleSlice";
import "../css/user.css";
import { CountriesAPI } from "../apilinks/countrycode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPen,
  faInfoCircle,
  faLocationDot,
  faLandmark,
  faCircleCheck,
  faPeopleGroup,
  faL,
} from "@fortawesome/free-solid-svg-icons";
import {
  LoadingOutlined,
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getDepartment } from "../redux/slices/departmentSlice";
import {
  getRoleDetail,
  postRoleDetail,
  putRoleDetail,
} from "../redux/slices/roleDetailsSlice";
import TeamForm from "../components/TeamForm";
import AddressForm from "../components/AddressForm";
import AccountForm from "../components/AccountForm";
import FinishForm from "../components/FinishForm";
import {
  getleaderemployee,
  postleaderemployee,
  putleaderemployee,
} from "../redux/slices/leaderEmployeeSlice";
import { getAddress, postAddress, putAddress } from "../redux/slices/addressSlice";
import { getaccount, postaccount, putaccount } from "../redux/slices/accountdetailsSlice";
import moment, { months } from "moment";
const dateFormat = "YYYY-MM-DD";
const formatter = (value) => <CountUp end={value} />;
const headingValue = "Employee";
const { Option } = Select;
const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 19);
const Employee = ({ officeData }) => {
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

  const [searchText, setSearchText] = useState("");
  const columns = [
    {
      title: "S.No",
      dataIndex: "sno",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "id",
      render: (text) => <a>{text}</a>,
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return (
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          // String(record.lastname)
          // .toLowerCase().includes(value.toLowerCase()) ||
          String(record.age).toLowerCase().includes(value.toLowerCase()) ||
          String(record.sno).toLowerCase().includes(value.toLowerCase()) ||
          String(record.position).toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    // {
    //   title: 'Last Name',
    //   dataIndex: 'lastname',
    //   key: 'id',
    //   render: (text) => <a>{text}</a>,
    // },
    {
      title: "Age",
      dataIndex: "age",
      key: "id",
    },
    {
      title: "Position",
      key: "position",
      dataIndex: "position",
      render: (_, { position }) => (
        <>
          {position.map((tag) => {
            let color = tag.length > 7 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            } else if (tag === "Not Assigned") {
              color = "red";
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
      title: "MobileNumber",
      dataIndex: "mobilenumber",
      key: "id",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-x-2">
          <Popconfirm
            title="Are you sure to delete this?"
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              style: { backgroundColor: "red", color: "white" },
            }}
            onConfirm={() => DeleteIcon(record)}
          >
            <Button>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </Popconfirm>

          <Button onClick={() => EditPencilIcon(record)}>
            <FontAwesomeIcon icon={faPen} />
          </Button>
        </div>
      ),
    },
  ];

  // API calls
  const dispatch = useDispatch();
  const { employee, loading } = useSelector((state) => state.employee);
  const { role } = useSelector((state) => state.role);
  const { office } = useSelector((state) => state.office);
  const { department } = useSelector((state) => state.department);
  const { leaderemployee } = useSelector((state) => state.leaderemployee);
  const { roledetail } = useSelector((state) => state.roledetail);
  const { address } = useSelector((state) => state.address);
  const {account} = useSelector(state => state.account)

  const [empData, setEmpData] = useState([]);
  const [roledetailData, setRoledetailData] = useState([]);
  const [empCounts, setEmpCounts] = useState();
  const [tableData, setTableData] = useState([]);

 

  function DataLoading() {
    var numberOfOffice = officeData.filter((off) => off.isdeleted === false);
    var officeNames = numberOfOffice.map((off) => {
      return off.officename;
    });
    if (officeNames.length === 1) {
      var filterOneOffice = empData.filter(
        (off) => off.officeLocationId.officename === officeNames[0]
      );
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
  }

  function roleCheck(roleid) {
    var roleDataCheck = roledetailData.filter((role) => role.id === roleid);

    if (roleDataCheck.length > 0) {
      return roleDataCheck[0].rollName;
    } else {
      return "Not Assigned";
    }
  }

  const filterEmployeeDatas =
    tableData && tableData.length > 0
      ? tableData.filter((el) => el.isDeleted === false)
      : [];
  const Tbdata =
    filterEmployeeDatas && filterEmployeeDatas.length > 0
      ? filterEmployeeDatas.map((el, i) => {
          const roleName =
            el.roleDetails && el.roleDetails.length > 0
              ? roleCheck(el.roleDetails[0].roleId)
              : "Not Assigned";
          return {
            sno: i + 1,
            key: el.id || "",
            name: `${el.firstName + " " + el.lastName}` || "",
            lastname: el.lastName || "",
            age: calculateAge(el.dateOfBirth),
            position: [
              el.departmentId && el.departmentId.departmentName,
              roleName,
            ],
            mobilenumber: el.mobileNumber || "",
          };
        })
      : [];

  // popup-window
  const [modelOpen, setModelOpen] = useState(false);
  const ModelOpen = () => setModelOpen(true);
  const ModelClose = () => {
    setModelOpen(false);
  };
  // save (or) add btn state
  const [saveBtn, setsaveBtn] = useState(false);
  const saveBtnOn = () => setsaveBtn(true);
  const saveBtnOff = () => setsaveBtn(false);
  //exit conformation model
  const handleCancel = () => {
    Modal.confirm({
      icon: null,
      content: <div >
        Are you sure to exit this process?
      </div>,
      onCancel: () => {},
      onOk: () => setModelOpen(false),
      okButtonProps: { type: "default", danger: true }, // Prevent the default Modal onCancel behavior
      width: 300, // Adjust the width as needed
    });
  };
  //new emp id
  const [newempid, setNewempId] = useState("");

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
      //!EmployeeInput.officeEmail.trim() ||
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
    // else if (validateEmail(EmployeeInput.officeEmail) === false) {
    //   message.error("Office email is not a valid email");
    // }

    // check the mobile number
    else if (validateMobileNumber(EmployeeInput.mobileNumber) === false) {
      message.error("please check the mobile number");
    }
    // check the alternate mobile number
    else if (validateMobileNumber(EmployeeInput.alternateContactNo) === false) {
      message.error("please check the alternate number");
    }
    // employee && role details post method
    else {
       
       if(validateEmail(EmployeeInput.officeEmail) === false || EmployeeInput.officeEmail ===""){
        setEmployeeInput((pre)=> ({ ...pre,officeEmail:null}));
       };
       infoPostProcessBar();
    }
    //infoPostProcessBar();
    // setNewempId(3);
  };

  
  // Table Delete Icon
  const DeleteIcon = (data) => {
    console.log(data.key);
  };

  // Table Edit Icon
  const [EditPencilData, setEditPencilData] = useState([]);
  const [EditPencilState, setEditPencilState] = useState(false);
  
  const EditPencilIcon = async (data) => {
    await saveBtnOn();
   await ModelOpen();
   await setAddressCheck(false);
   await setEditPencilState(true);
    //employee
    const EmpFilter = await employee.filter((emp) => emp.id === data.key);
    const EData = (await EmpFilter) && EmpFilter[0] ? EmpFilter[0] : [];
    //role
    const RoleDetailsFilter = await roledetail.filter(
      (roleDetails) => roleDetails.employeeId === data.key
    );
    const RoleDetailsData =
      await RoleDetailsFilter.length === 0
        ? null
        : RoleDetailsFilter[0];
    //team
    const TeamFilter = await leaderemployee.filter(
      (leader) => leader.employeeId === data.key
    );
    const TeamData = (await TeamFilter.length) === 0 ? null : TeamFilter[0];
    // address
    const AddressFilter = await address.filter(
      (add) => add.employeeId === data.key
    );
    const AddressData =await AddressFilter.length === 0 ? null : AddressFilter;
    const PermanetFilter = await AddressData ===null ? null:await AddressData.filter((per) => per.type === 2);
    const PermanetData =await PermanetFilter === null ? null : PermanetFilter[0];
    const CurrentFilter = await AddressData ===null ? null: await AddressData.filter((per) => per.type === 1);
    const CurrentData =await CurrentFilter ===null ? null : CurrentFilter[0];
    //account
    const AccountFilter = await account.filter(acc => acc.employeeId === data.key);
    const AccountData = await AccountFilter.length === 0 ? null : AccountFilter[0];
    
    //set method
    //employee details && team
    await setEditPencilData(EData);
    await setNewempId(EData.id);
    await setEmployeeInput({
      id: EData.id,
      firstName: EData.firstName,
      lastName: EData.lastName,
      gender: EData.gender,
      personalEmail: EData.personalEmail,
      officeEmail: EData.officeEmail,
      mobileNumber: EData.mobileNumber,
      dateOfBirth: EData.dateOfBirth,
      dateOfJoin: EData.dateOfJoin,
      bloodGroup: EData.bloodGroup,
      alternateContactNo: EData.alternateContactNo,
      contactPersonName: EData.contactPersonName,
      relationship: EData.relationship,
      maritalStatus: EData.maritalStatus,
      officeLocationId: EData.officeLocationId.id,
      departmentId: EData.departmentId.id,
      isDeleted: false,
      createdDate: EData.createdDate,
      createdBy: EData.createdBy,
      modifiedDate:formattedDate,
      modifiedBy: EData.modifiedBy
    });
    await form.setFieldsValue({
      firstName: EData.firstName,
      lastName: EData.lastName,
      gender: EData.gender ? EData.gender : null,
      personalEmail: EData.personalEmail,
      officeEmail: EData.officeEmail,
      mobileNumber: EData.mobileNumber,
      dateOfBirth: moment(moment(EData.dateOfBirth)._i),
      dateOfJoin: moment(moment(EData.dateOfJoin)._i),
      bloodGroup: EData.bloodGroup,
      alternateContactNo: EData.alternateContactNo,
      contactPersonName: EData.contactPersonName,
      relationship: EData.relationship,
      maritalStatus: EData.maritalStatus,
      officeLocationId: EData.officeLocationId.id,
      departmentId: EData.departmentId.id,
      isDeleted: false,
      Role:RoleDetailsData===null?null: RoleDetailsData.roleId,
    });

    //role details
    setRoleValue({
      id: RoleDetailsData === null ? null : RoleDetailsData.id,
      employeeId:RoleDetailsData === null ? null : RoleDetailsData.employeeId,
      roleId:RoleDetailsData === null ? null : RoleDetailsData.roleId,
      isdeleted: false,
      createdDate:RoleDetailsData === null ? null : RoleDetailsData.createdDate,
      createdBy:RoleDetailsData === null ? null : RoleDetailsData.createdBy,
      modifiedDate:formattedDate,
      modifiedBy:RoleDetailsData === null ? null : RoleDetailsData.modifiedBy
    });

    //team
    await setTeamFData({
      id:TeamData === null ? null : TeamData.id,
      employeeId:TeamData === null ? null : TeamData.employeeId ,
      leaderId: TeamData === null ? null : TeamData.leaderId,
      hrManagerId: TeamData === null ? null : TeamData.hrManagerId,
      isdeleted: false,
      createdDate:TeamData === null ? null : TeamData.createdDate,
      createdBy:TeamData === null ? null : TeamData.createdBy,
      modifiedDate:formattedDate,
      modifiedBy:TeamData === null ? null : TeamData.modifiedBy
    });

    //address
    await setPermanetFAdd({
      id: PermanetData === null ? null : PermanetData.id,
      employeeId:PermanetData === null ? null : PermanetData.employeeId,
      address1: PermanetData === null ? null : PermanetData.address1,
      city: PermanetData === null ? null : PermanetData.city,
      state: PermanetData === null ? null : PermanetData.state,
      country: PermanetData === null ? null : PermanetData.country,
      postalCode: PermanetData === null ? null : PermanetData.postalCode,
      isdeleted: false,
      type: 2,
      createdDate:PermanetData === null ? null : PermanetData.createdDate,
      createdBy:PermanetData === null ? null : PermanetData.createdBy,
      modifiedDate:formattedDate,
      modifiedBy:PermanetData === null ? null : PermanetData.modifiedBy
    });
    await setCurrentFAdd({
      id: CurrentData === null ? null : CurrentData.id,
      employeeId:CurrentData === null ? null : CurrentData.employeeId,
      address1: CurrentData === null ? null : CurrentData.address1,
      city: CurrentData === null ? null : CurrentData.city,
      state: CurrentData === null ? null : CurrentData.state,
      country: CurrentData === null ? null : CurrentData.country,
      postalCode: CurrentData === null ? null : CurrentData.postalCode,
      isdeleted: false,
      type: 1,
      createdDate:CurrentData === null ? null : CurrentData.createdDate,
      createdBy:CurrentData === null ? null : CurrentData.createdBy,
      modifiedDate:formattedDate,
      modifiedBy:CurrentData === null ? null : CurrentData.modifiedBy
    });

    //account
    await setAccF({
    id : AccountData === null ? null : AccountData.accountId,
    employeeId:AccountData === null ? null : AccountData.employeeId,  
    bankName: AccountData === null ? null : AccountData.bankName,
    branchName: AccountData === null ? null : AccountData.branchName,
    accountNumber: AccountData === null ? null : AccountData.accountNumber,
    bankLocation: AccountData === null ? null : AccountData.bankLocation,
    ifsc: AccountData === null ? null : AccountData.ifsc,
    isdeleted: false,
    createdDate:AccountData === null ? null : AccountData.createdDate,
    createdBy:AccountData === null ? null : AccountData.createdBy,
    modifiedDate:formattedDate,
    modifiedBy:AccountData === null ? null : AccountData.modifiedBy
    });
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
    isDeleted: false,
  });
  // all fields set
  const EmployeeInputsOnchange = (e) => {
    const { name, value } = e.target;
    setEmployeeInput((pre) => ({
      ...pre,
      [name]: value,
    }));
  };
  // gender set
  const GengerDropDown = (data) => {
    setEmployeeInput((prevState) => ({ ...prevState, gender: data }));
  };
  // date of birth set
  const DateOfBirthValue = (date, dateString) => {
    setEmployeeInput((prevState) => ({
      ...prevState,
      dateOfBirth: dateString,
    }));
  };
  // date of join set
  const DateOfJoinValue = (date, dateString) => {
    setEmployeeInput((prevState) => ({ ...prevState, dateOfJoin: dateString }));
  };
  // bloodGroup set
  const BloodGroupValue = (value) => {
    // const bloodArray = Object.values(value);
    // const bloodGroupString = bloodArray.join(''); // Join the values without any separator
    setEmployeeInput((prevState) => ({ ...prevState, bloodGroup: value }));
  };
  // maritalStatus set
  const MarriedDropDown = (data) => {
    setEmployeeInput((prevState) => ({ ...prevState, maritalStatus: data }));
  };
  // relationship set
  const relationShipValue = (data) => {
    setEmployeeInput((prevState) => ({ ...prevState, relationship: data }));
  };
  // officeLocationId set
  const officeFilterFalse = office.filter((off) => off.isdeleted === false);
  const officeOption = [
    ...officeFilterFalse.map((off) => ({
      key: off.id,
      value: off.id,
      label: off.officename,
    })),
  ];
  const officeLocationDropDown = (data) => {
    setEmployeeInput((prevState) => ({ ...prevState, officeLocationId: data }));
  };
  // departmentId set
  const departmentFilterFalse = department.filter(
    (dep) => dep.isdeleted === false
  );
  const departmentOption = [
    ...departmentFilterFalse.map((dep) => ({
      key: dep.id,
      value: dep.id,
      label: dep.departmentName,
    })),
  ];
  const departmentDropDown = (data) => {
    setEmployeeInput((prevState) => ({ ...prevState, departmentId: data }));
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
      isDeleted: false,
    });
  };

  // Roll Details
  const [RoleValue, setRoleValue] = useState({
    roleId: null,
    isdeleted: false,
  });
  // drop down set
  const roleDropDown = (data) => {
    setRoleValue((pre) => ({ ...pre, roleId: data }));
    //console.log(data);
  };
  // role clear
  const roleClear = () => {
    setRoleValue({
      roleId: null,
      isdeleted: false,
    });
  };
  // role drop down data
  const roleFilter = role.filter((roles) => roles.isdeleted === false);
  const optionRoles = [
    ...roleFilter.map((roles) => ({
      key: roles.id,
      value: roles.id,
      label: roles.rollName,
    })),
  ];

  // Employee Add|+| Btn
  const [form] = Form.useForm();
  const AddEmployeeBtn = () => {
    setNewempId('');
    setEditPencilState(false);//post method
    ClearEmployeeInputs(); //clear employee
    roleClear(); //clear role
    TeamFDataClear(); //clear team
    clearAddress(); //clear address
    setAddressCheck(false);
    ClearAccount(); //clear account
    if (form) {
      form.resetFields([
        "firstName",
        "lastName",
        "gender",
        "personalEmail",
        "officeEmail",
        "mobileNumber",
        "dateOfBirth",
        "dateOfJoin",
        "bloodGroup",
        "alternateContactNo",
        "contactPersonName",
        "relationship",
        "maritalStatus",
        "officeLocationId",
        "departmentId",
        "isDeleted",
        "Role",
      ]);
    }
    setProcessBar({
      info: "process",
      team: "wait",
      address: "wait",
      account: "wait",
      done: "wait",
    });
    saveBtnOff();
    ModelOpen();
  };

  // process bar
  const [processbar, setProcessBar] = useState({
    info: "process",
    team: "wait",
    address: "wait",
    account: "wait",
    done: "wait",
  });
  //info
  const infoPostProcessBar = () => {
    setProcessBar((pre) => ({ ...pre, info: "finish" }));
    setProcessBar((pre) => ({ ...pre, team: "process" }));
  };
  //team
  const teamPostProcessBar = () => {
    setProcessBar((pre) => ({ ...pre, address: "process" }));
    setProcessBar((pre) => ({ ...pre, team: "finish" }));
  };
  // address
  const addressPostProcessBar = () => {
    setProcessBar((pre) => ({ ...pre, address: "finish" }));
    setProcessBar((pre) => ({ ...pre, account: "process" }));
  };
  // account
  const accountPostProcessBar = () => {
    setProcessBar((pre) => ({ ...pre, account: "finish" }));
    setProcessBar((pre) => ({ ...pre, done: "finish" }));
  };
  // fist back
  const inforReturn = () => {
    setProcessBar((pre) => ({ ...pre, info: "process" }));
    setProcessBar((pre) => ({ ...pre, team: "wait" }));
  };
  //team back
  const teamReturn = () => {
    setProcessBar((pre) => ({ ...pre, address: "wait" }));
    setProcessBar((pre) => ({ ...pre, team: "process" }));
  };
  //account back
  const accountReturn = () => {
    setProcessBar((pre) => ({ ...pre, address: "process" }));
    setProcessBar((pre) => ({ ...pre, account: "wait" }));
  };
  // child to parent function
  const teamFormRef = useRef();
  const postTeam = () => {
    if (teamFormRef.current) {
      teamFormRef.current.teamValidateData();
    }
  };

  const addressRef = useRef();
  const postAdd = () => {
    if (addressRef.current) {
      addressRef.current.addredValidateDate();
    }
  };
  const accFormRef = useRef();
  const postAcc = () => {
    if (accFormRef.current) {
      accFormRef.current.accountValidateData();
    }
  };

  //employee api
  const FalseEmp = employee.filter((emp) => emp.isDeleted === false);

  // team
  const [TeamFData, setTeamFData] = useState({
    leaderId: null,
    hrManagerId: null,
    isdeleted: false,
  });
  const TeamFDataClear = () => {
    setTeamFData({
      leaderId: null,
      hrManagerId: null,
      isdeleted: false,
    });
  };
  const employeeRoleData = FalseEmp.filter(
    (emp) => emp.roleDetails && emp.roleDetails.length > 0
  );
  const UpdatedTeamFData = (NewData) => {
    setTeamFData((PrevData) => ({
      ...PrevData,
      ...NewData,
    }));
  };

  // address
  // type 1 -current address
  // type 2 - permanet address
  const [CureentFAdd, setCurrentFAdd] = useState({
    address1: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    isdeleted: false,
    type: 1,
  });
  const [PermanetFAdd, setPermanetFAdd] = useState({
    address1: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    isdeleted: false,
    type: 2,
  });
  const UpdatedCurrentFAdd = (NewData) => {
    setCurrentFAdd((PrevData) => ({ ...PrevData, ...NewData }));
  };
  const UpdatedPermanetFAdd = (NewData) => {
    setPermanetFAdd((PrevData) => ({ ...PrevData, ...NewData }));
  };
  const [AddressCheck, setAddressCheck] = useState(false);
  const AddCheckBox = (value) => {
    setAddressCheck(value);
  };
  const clearAddress = () => {
    setCurrentFAdd({
      address1: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      isdeleted: false,
      type: 1,
    });
    setPermanetFAdd({
      address1: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      isdeleted: false,
      type: 1,
    });
  };

  //account
  const [AccF, setAccF] = useState({
    bankName: null,
    branchName: null,
    bankLocation: null,
    accountNumber: null,
    ifsc: null,
    isdeleted: false,
  });
  const UpdateAccountF = (NewData) => {
    setAccF((PreData) => ({ ...PreData, ...NewData }));
  };
  const ClearAccount = () => {
    setAccF({
      bankName: null,
      branchName: null,
      bankLocation: null,
      accountNumber: null,
      ifsc: null,
      isdeleted: false,
    });
  };

  const [loadings, setLoading] = useState(true);

  const newEmployee = async () => {
    const employeeDatas = await dispatch(postEmployees(EmployeeInput));
    if (employeeDatas && employeeDatas.payload.id) {
      setNewempId(employeeDatas.payload.id);
      console.log({ employeeId: employeeDatas.payload.id });
      //role creation
      await dispatch(
        postRoleDetail({ employeeId: employeeDatas.payload.id, ...RoleValue })
      );
      //leaderemployee creation
      await dispatch(
        postleaderemployee({
          employeeId: employeeDatas.payload.id,
          ...TeamFData,
        })
      );
      // address creation
      await dispatch(
        postAddress({ employeeId: employeeDatas.payload.id, ...CureentFAdd })
      );
      await dispatch(
        postAddress({ employeeId: employeeDatas.payload.id, ...PermanetFAdd })
      );
      //account creation
      await dispatch(
        postaccount({ employeeId: employeeDatas.payload.id, ...AccF })
      );
      //await dispatch()
      await setLoading(false);
    }
  };

  //put employee
  const PutEmployee =async ()=>{
    await dispatch(putEmployees(EmployeeInput)); //employee
    await dispatch(putRoleDetail(RoleValue)); //role
    await dispatch(putleaderemployee(TeamFData));//leader employee
    await dispatch(putAddress(CureentFAdd));
    await dispatch(putAddress(PermanetFAdd));
    await dispatch(putaccount(AccF));
    await setLoading(false);
  };

  //initial reneder
  useEffect(() => {
    dispatch(getEmployees());
    dispatch(getrole());
    dispatch(getDepartment());
    dispatch(getleaderemployee());
    dispatch(getRoleDetail());
    dispatch(getAddress());
    dispatch(getaccount());
  }, []);


  //table loading 
  useEffect(() => {
    setRoledetailData(role);
    setEmpData(employee);
    DataLoading();
  }, [employee, officeData, role]);


  //form edit initial loading screen
  const InitialFormEdit = ()=>{
    setProcessBar({
      info: "process",
      team: "wait",
      address: "wait",
      account: "wait",
      done: "wait",
    })
  };
  useEffect(()=>{
    InitialFormEdit();
  },[modelOpen]);

  console.log(EmployeeInput);
  return (
    <div>
      <Row gutter={[16, 16]} align="middle">
        <Col span={3}>
          <Statistic
            title="User Count"
            value={empCounts}
            formatter={formatter}
          />
        </Col>
        <Col span={17} style={{ left: "0%" }}>
          {" "}
          <Input.Search
            placeholder="Search here...."
            onSearch={(value) => {
              setSearchText(value);
            }}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            style={{ width: `30%` }}
          />
        </Col>
        <Col span={4}>
          <Button
            onClick={AddEmployeeBtn}
            type="primary"
            className="bg-blue-500"
          >{`Add ${headingValue}`}</Button>
        </Col>
      </Row>

      <Divider />

      <Col span={25}>
        <Table
          columns={columns}
          dataSource={Tbdata}
          pagination={{ pageSize: 5 }}
        />
      </Col>

      <Modal
        title={[
          <h2 className="text-center pt-2">{EditPencilState === false ? `Add New ${headingValue}` :`Edit Employee Details`}</h2>,
          <Steps
            className="mt-3 px-[100px]"
            size="small"
            items={[
              {
                title: "Info",
                key: 1,
                status: processbar.info,
                icon:
                  processbar.info === "process" ? (
                    <LoadingOutlined />
                  ) : (
                    <FontAwesomeIcon icon={faInfoCircle} />
                  ),
                //&& <LoadingOutlined />
              },
              {
                title: "Team",
                key: 2,
                status: processbar.team,
                icon:
                  processbar.team === "process" ? (
                    <LoadingOutlined />
                  ) : (
                    <FontAwesomeIcon icon={faPeopleGroup} />
                  ),
                //&& <LoadingOutlined />
              },
              {
                title: "Address",
                key: 3,
                status: processbar.address,
                icon:
                  processbar.address === "process" ? (
                    <LoadingOutlined />
                  ) : (
                    <FontAwesomeIcon icon={faLocationDot} />
                  ),
              },
              {
                title: "Account",
                key: 4,
                status: processbar.account,
                icon:
                  processbar.account === "process" ? (
                    <LoadingOutlined />
                  ) : (
                    <FontAwesomeIcon icon={faLandmark} />
                  ),
              },
              {
                title: "Done",
                key: 5,
                status: processbar.done,
                icon:
                  processbar.done === "process" ? (
                    <LoadingOutlined />
                  ) : (
                    <FontAwesomeIcon icon={faCircleCheck} />
                  ),
              },
            ]}
          />,
        ]}
        open={modelOpen}
        centered
        onCancel={handleCancel}
        width={1000}
        footer={[
          //info back
          // close && finish btn
          processbar.info === "process" ? ( //condition
            <Button onClick={handleCancel} danger={true} key="submit1">
              close
            </Button>
          ) : processbar.team === "process" ? (
            <Button onClick={inforReturn} key="submit2">
              info back
            </Button>
          ) : processbar.address === "process" ? (
            <Button onClick={teamReturn} key="submit3">
              team back
            </Button>
          ) : processbar.account === "process" ? (
            <Button onClick={accountReturn} key="submit4">
              address back
            </Button>
          ) : processbar.account === "finish" ? (
            <Button
              disabled
              className="custom-button"
              type="text"
              key="submit5"
            >
              {" "}
            </Button>
          ) : (
            <Button
              disabled
              className="custom-button"
              type="text"
              key="submit6"
            >
              {" "}
            </Button>
          ),
          // backbtn.infoback === true
          //   ? <Button onClick={InfoBack}>Back</Button>
          //   : "",
          //saveBtn === false ? <Button key="submit" onClick={informationPostBtn}>Next</Button> : <Button key="1" onClick={ModelEditBtn} >Save</Button>,
          //next btns
          processbar.info === "process" ? ( //condition
            <Button key="submit7" type="submit" onClick={informationPostBtn}>
              Next
            </Button>
          ) : processbar.team === "process" ? ( //condition
            <Button key="submit8" type="submit" onClick={postTeam}>
              Next
            </Button>
          ) : processbar.address === "process" ? ( //condition
            <Button key="submit9" type="submit" onClick={postAdd}>
              Next
            </Button>
          ) : processbar.account === "process" ? ( //condition
            <Button key="submit10" type="submit" onClick={postAcc}>
              Next
            </Button>
          ) : (
            ""
          ),
        ]}
        maskClosable={false}
      >
        {/* (i)Employee-Details-section */}
        {processbar.info === "process" ? (
          <section>
            {/* <h1 className='font-bold mt-2 text-center'>Employee Details</h1> */}
            <Form form={form}>
              {/* firstName */}
              <Form.Item
                name="firstName"
                label="First Name"
                style={{ marginBottom: 0, marginTop: 10 }}
                className="px-7"
              >
                <Input
                  style={{ float: "right", width: filedWidth }}
                  placeholder="first name"
                  name="firstName"
                  value={EmployeeInput.firstName}
                  onChange={EmployeeInputsOnchange}
                />
              </Form.Item>

              {/* lastName */}
              <Form.Item
                name="lastName"
                label="Last Name"
                style={{ marginBottom: 0, marginTop: 10 }}
                className="px-7"
              >
                <Input
                  style={{ float: "right", width: filedWidth }}
                  placeholder="last name"
                  name="lastName"
                  value={EmployeeInput.lastName}
                  onChange={EmployeeInputsOnchange}
                />
              </Form.Item>

              {/* gender */}
              <Form.Item
                name="gender"
                rules={[
                  { message: "Please select your gender!", type: "string" },
                ]}
                label="Gender"
                style={{ marginBottom: 0, marginTop: 10 }}
                className="px-7"
              >
                <Select
                  optionFilterProp="children"
                  placeholder="select gender"
                  style={{ float: "right", width: filedWidth }}
                  onChange={GengerDropDown}
                  options={[
                    {
                      key: 1,
                      value: "Male",
                      label: "Male",
                    },
                    {
                      key: 2,
                      value: "Female",
                      label: "Female",
                    },
                    {
                      key: 3,
                      value: "Other",
                      label: "Other",
                    },
                  ]}
                  value={EmployeeInput.gender}
                />
              </Form.Item>

              {/* personalEmail */}
              <Form.Item
                rules={[{ type: "email" }]}
                className="px-7"
                label="Personal Email"
                name="personalEmail"
                style={{ marginBottom: 0, marginTop: 10 }}
              >
                <Input
                  style={{ float: "right", width: filedWidth }}
                  placeholder="personal email"
                  name="personalEmail"
                  value={EmployeeInput.personalEmail}
                  onChange={EmployeeInputsOnchange}
                />
              </Form.Item>

              {/* officeEmail */}
              <Form.Item
                rules={[{ type: "email" }]}
                className="px-7"
                name="officeEmail"
                label="Office Email (optional)"
                style={{ marginBottom: 0, marginTop: 10 }}
              >
                <Input
                  style={{ float: "right", width: filedWidth }}
                  placeholder="office email"
                  name="officeEmail"
                  value={EmployeeInput.officeEmail}
                  onChange={EmployeeInputsOnchange}
                />
              </Form.Item>

              {/* mobileNumber */}
              <Form.Item
                className="px-7"
                style={{ marginBottom: 0, marginTop: 10 }}
                label="Mobile Number"
                name="mobileNumber"
                rules={[
                  { message: "Please enter your mobile number" },
                  {
                    pattern: /^[0-9]{10}$/, // Adjust the regular expression as needed
                    message: "Please enter a valid 10-digit mobile number",
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
                className="px-7"
                label="Date Of Birth"
                style={{ marginBottom: 0, marginTop: 10 }}
              >
                <DatePicker
                  style={{ float: "right", width: filedWidth }}
                  format={dateFormat}
                  onChange={DateOfBirthValue}
                />
              </Form.Item>
              {/* maritalStatus */}
              <Form.Item
                name="maritalStatus"
                className="px-7"
                label="Marital Status"
                style={{ marginBottom: 0, marginTop: 10 }}
              >
                <Select
                  optionFilterProp="children"
                  placeholder="select marital status"
                  style={{ float: "right", width: filedWidth }}
                  onChange={MarriedDropDown}
                  options={[
                    {
                      value: "Married",
                      label: "Married",
                    },
                    {
                      value: "Unmarried",
                      label: "Unmarried",
                    },
                  ]}
                  value={EmployeeInput.maritalStatus}
                />
              </Form.Item>
              {/* dateOfJoin*/}
              <Form.Item
                name="dateOfJoin"
                className="px-7"
                label="Date Of Join"
                style={{ marginBottom: 0, marginTop: 10 }}
              >
                <DatePicker
                  style={{ float: "right", width: filedWidth }}
                  format={dateFormat}
                  onChange={DateOfJoinValue}
                />
              </Form.Item>

              {/* bloodGroup */}
              <Form.Item
                name="bloodGroup"
                className="px-7"
                label="Blood Group"
                style={{ marginBottom: 0, marginTop: 10 }}
              >
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
                      label: "A+",
                    },
                    {
                      key: 2,
                      value: "A-",
                      label: "A-",
                    },
                    {
                      key: 3,
                      value: "B+",
                      label: "B+",
                    },
                    {
                      key: 4,
                      value: "B-",
                      label: "B-",
                    },
                    {
                      key: 5,
                      value: "O+",
                      label: "O+",
                    },
                    {
                      key: 6,
                      value: "O-",
                      label: "O-",
                    },
                    {
                      key: 7,
                      value: "AB+",
                      label: "AB+",
                    },
                    {
                      key: 8,
                      value: "AB-",
                      label: "AB-",
                    },
                  ]}
                />
              </Form.Item>

              {/* alternateContactNo */}
              <Form.Item
                className="px-7"
                style={{ marginBottom: 0, marginTop: 10 }}
                label="Alternate Contact No"
                name="alternateContactNo"
                rules={[
                  { message: "Please enter your mobile number" },
                  {
                    pattern: /^[0-9]{10}$/, // Adjust the regular expression as needed
                    message: "Please enter a valid 10-digit mobile number",
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
              {/* contactPersonName */}
              <Form.Item
                name="contactPersonName"
                className="px-7"
                label="Contact Person Name"
                style={{ marginBottom: 0, marginTop: 10 }}
              >
                <Input
                  style={{ float: "right", width: filedWidth }}
                  placeholder="contact person name"
                  name="contactPersonName"
                  value={EmployeeInput.contactPersonName}
                  onChange={EmployeeInputsOnchange}
                />
              </Form.Item>
              {/* Relationship */}
              <Form.Item
                name="relationship"
                className="px-7"
                label="Relationship"
                style={{ marginBottom: 0, marginTop: 10 }}
              >
                <Select
                  optionFilterProp="children"
                  placeholder="select relationship"
                  style={{ float: "right", width: filedWidth }}
                  onChange={relationShipValue}
                  options={[
                    {
                      key: 1,
                      value: "Father",
                      label: "Father",
                    },
                    {
                      key: 2,
                      value: "Mother",
                      label: "Mother",
                    },
                    {
                      key: 3,
                      value: "Son",
                      label: "Son",
                    },
                    {
                      key: 4,
                      value: "Daughter",
                      label: "Daughter",
                    },
                    {
                      key: 5,
                      value: "Husband",
                      label: "Husband",
                    },
                    {
                      key: 6,
                      value: "Wife",
                      label: "Wife",
                    },
                    {
                      key: 7,
                      value: "Brother",
                      label: "Brother",
                    },
                    {
                      key: 8,
                      value: "Sister",
                      label: "Sister",
                    },
                    {
                      key: 9,
                      value: "Grandfather",
                      label: "Grandfather",
                    },
                    {
                      key: 10,
                      value: "Grandmother",
                      label: "Grandmother",
                    },
                    {
                      key: 11,
                      value: "Grandson",
                      label: "Grandson",
                    },
                    {
                      key: 12,
                      value: "Uncle",
                      label: "Uncle",
                    },
                    {
                      key: 13,
                      value: "Aunt",
                      label: "Aunt",
                    },
                    {
                      key: 14,
                      value: "Nephew",
                      label: "Nephew",
                    },
                    {
                      key: 15,
                      value: "Niece",
                      label: "Niece",
                    },
                    {
                      key: 16,
                      value: "Cousins",
                      label: "Cousins",
                    },
                  ]}
                  value={EmployeeInput.relationship}
                />
              </Form.Item>

              {/* officeLocationId */}
              <Form.Item
                name="officeLocationId"
                className="px-7"
                label="Office Location"
                style={{ marginBottom: 0, marginTop: 10 }}
              >
                <Select
                  optionFilterProp="children"
                  placeholder="select office location"
                  style={{ float: "right", width: filedWidth }}
                  onChange={officeLocationDropDown}
                  options={officeOption}
                  value={EmployeeInput.officeLocationId}
                />
              </Form.Item>

              {/* departmentId */}
              <Form.Item
                name="departmentId"
                className="px-7"
                label="Department"
                style={{ marginBottom: 0, marginTop: 10 }}
              >
                <Select
                  optionFilterProp="children"
                  placeholder="select department"
                  style={{ float: "right", width: filedWidth }}
                  onChange={departmentDropDown}
                  options={departmentOption}
                  value={EmployeeInput.departmentId}
                />
              </Form.Item>

              {/* Roll Detail */}
              <Form.Item
                name="Role"
                className="px-7"
                label="Role"
                style={{ marginBottom: 0, marginTop: 10 }}
              >
                <Select
                  optionFilterProp="children"
                  placeholder="select role"
                  style={{ float: "right", width: filedWidth }}
                  onChange={roleDropDown}
                  options={optionRoles}
                  value={RoleValue.roleId}
                />
              </Form.Item>
            </Form>
          </section>
        ) : processbar.team === "process" ? (
          <TeamForm
            key="team"
            EmpApi={employeeRoleData} //api
            TeamFData={TeamFData} //state
            UpdatedTeamFData={UpdatedTeamFData} //updated data
            EmployeeInput={EmployeeInput} //input employee name
            teamPostProcessBar={teamPostProcessBar} // process bar
            ref={teamFormRef}
            EditData={EditPencilData} //edit data
          />
        ) : processbar.address === "process" ? (
          <AddressForm
            key="address"
            FormCAdd={CureentFAdd} //state1
            FormPAdd={PermanetFAdd} //state2
            CheckBoxF={AddressCheck} //state3
            UpdateCAdd={UpdatedCurrentFAdd} //update cureent add
            UpdatePAdd={UpdatedPermanetFAdd} //update permanent add
            UpdateCheckBox={AddCheckBox} // update check box
            addressPostProcessBar={addressPostProcessBar} // process bar
            ref={addressRef}
            EditData={EditPencilData} //edit data
          />
        ) : processbar.account === "process" ? (
          <AccountForm
            key="account"
            FormAccF={AccF} //state
            UpdateAccF={UpdateAccountF} //update account
            accountPostProcessBar={accountPostProcessBar} //process bar
            newEmployee={newEmployee}
            ref={accFormRef}
            EditData={EditPencilData} //edit data
            EditPencilState={EditPencilState} // true put method
            PutEmployee={PutEmployee}
          />
        ) : processbar.done === "finish" ? (
          <FinishForm
            EmployeeData={EmployeeInput} //emp data
            RoleData={RoleValue} //role data
            TeamData={TeamFData} //team data
            CAddData={CureentFAdd} //cureent add data
            PAddData={PermanetFAdd} //permenanat add data
            AccountData={AccF} //account data
            newempid={newempid} //emp id
            loadings={loadings} //loading
            modelclose={ModelClose}
            EditData={EditPencilData} //edit data
            EditPencilState={EditPencilState} // true put method
          />
        ) : (
          ""
        )}
      </Modal>
    </div>
  );
};

export default Employee;
