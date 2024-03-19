import React, { useEffect, useState, useRef } from "react";
import {
  Steps,
  Popconfirm,
  Form,
  Modal,
  Table,
  Tag,
  Button,
  Col,
  Row,
  Statistic,
  Divider,
  Input,
  Select,
  DatePicker,
  message,
} from "antd";
import CountUp from "react-countup";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteEmployee,
  getEmployees,
  postEmployees,
  putEmployees,
} from "../redux/slices/employeeSlice";
import { getrole, putrole } from "../redux/slices/roleSlice";
// import "../css/user.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPen,
  faInfoCircle,
  faLocationDot,
  faLandmark,
  faCircleCheck,
  faPeopleGroup,
  faPlus,
  faDollar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { LoadingOutlined } from "@ant-design/icons";
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
import {
  getAddress,
  postAddress,
  putAddress,
} from "../redux/slices/addressSlice";
import {
  getaccount,
  postaccount,
  putaccount,
} from "../redux/slices/accountdetailsSlice";
import moment from "moment";
import "../css/employee.css";
import bcrpt from "bcryptjs";
import { GetLogin, PostLogin, PutLogin } from "../redux/slices/loginSlice";
import { Getleavetable } from "../redux/slices/leaveTableSlice";
import {
  Getemployeeleave,
  Postemployeeleave,
  Putemployeeleave,
} from "../redux/slices/employeeLeaveSlice";
import {
  getProductsDetail,
  putProductsDetail,
} from "../redux/slices/productsDetailSlice";
import {
  Getemployeeleavehistory,
  Putemployeeleavehistory,
} from "../redux/slices/EmployeeLeaveHistorySlice";
import { getSalary, postSalary } from "../redux/slices/salarySlice";
import { useMediaQuery } from "react-responsive";
const dateFormat = "YYYY-MM-DD";

const formatter = (value) => <CountUp end={value} />;
const headingValue = "Employee";
const currentDate = new Date();
const formattedDate = currentDate.toISOString().slice(0, 19);

const Employee = ({ officeData, LoginUser }) => {
  const [form] = Form.useForm();

  const [DisplayLogin, setDisplayLogin] = useState({
    userName: null,
    password: null,
  });

  //password readom genorator human readable
  function generateRandomPassword() {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$&";
    let password = "";
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }
    const HashedPassword = bcrpt.hashSync(password, 10);
    // console.log(password);
    // console.log(HashedPassword);
    return { password, HashedPassword };
  }

  //radom username genorator
  async function generateRandomUsername(firstName, lastName, id) {
    const randomNumbers = await Math.floor(100 + Math.random() * 900);
    const username = await `${firstName}${randomNumbers}`;
    const { password, HashedPassword } = generateRandomPassword();

    const userNameFl = await login.filter((user) => user.userName === username);
    const sameName =
      (await userNameFl) && userNameFl[0] ? userNameFl[0].userName : "";

    if (sameName === username) {
      generateRandomUsername(firstName, lastName, id);
      console.log("2ed loop");
    } else {
      setDisplayLogin({ userName: username, password: password });
      return {
        employeeId: id,
        userName: username,
        password: HashedPassword,
        isDeleted: false,
      };
    }
  }

  //validate email
  function validateEmail(email) {
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(email)) {
      setValidate((pre) => ({ ...pre, officeEmail: false }));
    } else {
      setValidate((pre) => ({ ...pre, officeEmail: true }));
    }
  }
  function pvalidateEmail(email) {
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(email)) {
      setValidate((pre) => ({ ...pre, personalEmail: false }));
    } else {
      setValidate((pre) => ({ ...pre, personalEmail: true }));
    }
  }

  //validate mobile no
  function validateMobileNumber(mobileNumber) {
    const mobileNumberRegex = /^\d{10}$/;
    if (mobileNumberRegex.test(mobileNumber)) {
      setValidate((pre) => ({ ...pre, mobileNumber: false }));
    } else {
      setValidate((pre) => ({ ...pre, mobileNumber: true }));
    }
  }
  function avalidateMobileNumber(mobileNumber) {
    const mobileNumberRegex = /^\d{10}$/;
    if (mobileNumberRegex.test(mobileNumber)) {
      setValidate((pre) => ({ ...pre, alternateContactNo: false }));
    } else {
      setValidate((pre) => ({ ...pre, alternateContactNo: true }));
    }
  }

  //age calculater
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
          String(record.age).toLowerCase().includes(value.toLowerCase()) ||
          String(record.sno).toLowerCase().includes(value.toLowerCase()) ||
          String(record.position).toLowerCase().includes(value.toLowerCase())
        );
      },
    },

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
        //console.log(position)
        <section className="flex items-center gap-x-2">
          {Array.isArray(position) ? (
            position.map((tag) => {
              let color;
              switch (tag) {
                case "IT":
                  color = "green";
                  break;
                case "employee":
                  color = "blue";
                  break;
                case "Not Assigned":
                  color = "red";
                  break;
                case "HR":
                  color = "cyan";
                  break;
                case "ceo":
                  color = "purple";
                  break;
                case "Leader":
                  color = "orange";
                  break;
                case "BIM":
                  color = "yellow";
                  break;
                case "Admin":
                  color = "magenta";
                  break;
                default:
                  color = "blue";
                  break;
              }

              return (
                <Tag color={color} key={tag}>
                  {tag}
                </Tag>
              );
            })
          ) : (
            <Tag color="red">Not Assigned</Tag>
          )}
        </section>
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
          <Button
            className="text-black"
            type="link"
            onClick={() => EditPencilIcon(record)}
          >
            <FontAwesomeIcon icon={faPen} />
          </Button>

          <Popconfirm
            title="Are you sure to delete this?"
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              style: { backgroundColor: "red", color: "white" },
            }}
            onConfirm={() => DeleteIcon(record)}
          >
            <Button type="link" className="text-[#fd5353]">
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </Popconfirm>
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
  const { account } = useSelector((state) => state.account);
  const { login } = useSelector((state) => state.login);
  const { leavetable } = useSelector((state) => state.leavetable);
  const { productsDetail } = useSelector((state) => state.productsDetail);
  const { employeeleave } = useSelector((state) => state.employeeleave);
  const { employeeleavehistory } = useSelector((state) => state.employeeleavehistory);

  const [empData, setEmpData] = useState([]);
  const [roledetailData, setRoledetailData] = useState([]);
  const [empCounts, setEmpCounts] = useState();
  const [tableData, setTableData] = useState([]);

  // const LoginUserName = employee.filter(data => data.id = );
  //reset table data initial state
  function DataLoading() {
    var numberOfOffice = officeData.filter((off) => off.isdeleted === false);
    var officeNames = numberOfOffice.map((off) => {
      return off.officename;
    });
    if (officeNames.length === 1) {
      var filterOneOffice = empData.filter(
        (off) => off.officeLocationId.officename === officeNames[0]
      );
      console.log(filterOneOffice);
      const counts = filterOneOffice.filter(
        (data) => data.isDeleted === false
      ).length;

      setEmpCounts(counts);
      setTableData(filterOneOffice);
    } else {
      const filterWithoutDeletedData = empData.filter(
        (data) => data.isDeleted === false
      );
      setEmpCounts(filterWithoutDeletedData.length);
      setTableData(empData);
    }
  }
  //check role
  function roleCheck(roleid) {
    var roleDataCheck = roledetailData.filter((role) => role.id === roleid);
    if (roleDataCheck.length > 0) {
      return roleDataCheck[0].rollName;
    } else {
      return "Not Assigned";
    }
  }

  //filter office
  const filterEmployeeDatas =
    tableData && tableData.length > 0
      ? tableData.filter((el) => el.isDeleted === false)
      : [];
  //table data
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
      content: <div>Are you sure to exit this process?</div>,
      onCancel: () => {},
      centered: true,
      onOk: () => setModelOpen(false),
      okButtonProps: { type: "default", danger: true }, // Prevent the default Modal onCancel behavior
      width: 300, // Adjust the width as needed
    });
  };

  //Salary API
  const { salary } = useSelector((state) => state.salary);

  const [employeeSalary, setEmployeeSalary] = useState({
    id: null,
    employeeId: null,
    employeeName: "",
    ctc: "",
    grossSalary: "",
    netSalary: "",
    salaryDate: null,
    isRevised: true,
    createdDate: "",
    createdBy: "",
    modifiedDate: "",
    modifiedBy: "",
    isDeleted: false,
  });
  useEffect(() => {
    dispatch(getSalary());
  }, []);

  const clearFields = () => {
    setEmployeeSalary((pre) => ({
      ...pre,
      id: "",
      employeeId: "",
      gross: "",
      net: "",
      salaryDate: "",
      isRevised: true,
      isDeleted: false,
    }));
  };

  //Salary Modal
  const [SalaryModal, setSalaryModal] = useState(false);
  const SalaryModalOpen = () => {
    setSalaryModal(true);
    clearFields();
  };
  const SalaryModalClose = () => {
    setSalaryModal(false);
  };

  const handleSelectedRows = async (selectedRowKeys) => {
    // Check if selectedRowKeys is not empty
    if (!selectedRowKeys.length) {
      console.log("No rows selected.");
      return;
    }

    // Dynamically loop through each selected key
    for (let key of selectedRowKeys) {
      // Perform your operation with the current key
      console.log("Current key:", key); // Example operation

      // Example: If you need to fetch data for each key
      // const responseData = await fetchDataForKey(key);
      // console.log(responseData);

      // Insert more operations as needed
    }

    // After looping through all keys
    console.log("Finished processing all selected rows.");
  };
  //Post Salary
  const PostSalary = async () => {
    if (
      !employeeSalary.grossSalary ||
      !employeeSalary.netSalary ||
      !employeeSalary.salaryDate
    ) {
      message.error("Please Fill all the Fields!");
      return;
    }
    for (const employeeId of selectedRowKeys) {
      const addSalary = {
        employeeId: employeeId,
        // ctc:employeeSalary.ctc,
        grossSalary: employeeSalary.grossSalary,
        netSalary: employeeSalary.netSalary,
        salaryDate: replaceDate(employeeSalary.salaryDate),
        isRevised: employeeSalary.isRevised,
        // createdDate:employeeSalary.createdDate,
        // createdBy:employeeSalary.createdBy,
        // modifiedDate:employeeSalary.modifiedDate,
        // modifiedBy:employeeSalary.modifiedBy,
        isDeleted: employeeSalary.isDeleted,
      };
      console.log(addSalary);
      await dispatch(postSalary(addSalary));
      dispatch(getSalary());
      SalaryModalClose();
      message.success("Payment Successfull!");
      setSelectedRowKeys([]);
    }
  };

  //new emp id
  const [newempid, setNewempId] = useState("");
  const [Validate, setValidate] = useState({
    firstName: false,
    lastName: false,
    gender: false,
    personalEmail: false,
    officeEmail: false,
    mobileNumber: false,
    dateOfBirth: false,
    maritalStatus: false,
    dateOfJoin: false,
    bloodGroup: false,
    alternateContactNo: false,
    contactPersonName: false,
    relationship: false,
    officeLocationId: false,
    department: false,
    role: false,
  });

  // Modal
  // post methods
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

    // // check the office email
    // else if (validateEmail(EmployeeInput.officeEmail) === false) {
    //    message.error("Office email is not a valid email");
    //   setValidate(pre => ({...pre,officeEmail:true}));
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
      if (
        validateEmail(EmployeeInput.officeEmail) === false ||
        EmployeeInput.officeEmail === ""
      ) {
        setEmployeeInput((pre) => ({ ...pre, officeEmail: null }));
      }
      infoPostProcessBar();
    }
    //infoPostProcessBar();
    // setNewempId(3);
  };
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString(); // "2024-03-12T11:14:02.946Z"
  const TodayDate = currentDate.toISOString().substring(0, 10);
  // Table Delete Icon
  const DeleteIcon = async (data) => {
    // await dispatch(deleteEmployee(data.key));
    //filter
    const employeeData = employee.filter((emp) => emp.id === data.key);
    const cAddress = address.filter(
      (cadd) => cadd.employeeId === data.key && cadd.type === 1
    );
    const pAddress = address.filter(
      (padd) => padd.employeeId === data.key && padd.type === 2
    );
    const ProductsFilter = productsDetail.filter(
      (pro) => pro.employeeId === data.key && pro.isDeleted === false
    );
    const empLeave = employeeleave.filter(
      (leave) => leave.employeeId === data.key && leave.isdeleted === false
    );
    const empLeaveHistory = employeeleavehistory.filter(
      (leaveHis) =>
        leaveHis.employeeId === data.key && leaveHis.isDeleted === false
    );
    const leaderEmployeeFilter = leaderemployee.filter(
      (leaderEmployee) =>
        leaderEmployee.employeeId === data.key &&
        leaderEmployee.isdeleted === false
    );
    const roleFilter = roledetail.filter(
      (role) => role.employeeId === data.key && role.isdeleted === false
    );
    const loginFilter = login.filter(
      (login) => login.employeeId === data.key && login.isDeleted === false
    );
    const accountFilter = account.filter(
      (acc) => acc.employeeId === data.key && acc.isDeleted === false
    );

    const EmpData = employeeData.map((emp) => ({
      id: emp.id,
      firstName: emp.firstName,
      lastName: emp.lastName,
      gender: emp.gender,
      personalEmail: emp.personalEmail,
      officeEmail: emp.officeEmail,
      mobileNumber: emp.mobileNumber,
      dateOfBirth: emp.dateOfBirth,
      dateOfJoin: emp.dateOfJoin,
      bloodGroup: emp.bloodGroup,
      alternateContactNo: emp.alternateContactNo,
      contactPersonName: emp.contactPersonName,
      relationship: emp.relationship,
      maritalStatus: emp.maritalStatus,
      officeLocationId: emp.officeLocationId ? emp.officeLocationId.id : null,
      departmentId: emp.departmentId ? emp.departmentId.id : null,
      lastWorkDate: TodayDate,
      isDeleted: true,
      createdDate: emp.createdDate,
      createdBy: emp.createdDate,
      modifiedDate: formattedDate,
      modifiedBy: LoginUser,
    }));

    const CAddressData = cAddress.map((data) => ({
      id: data.id,
      employeeId: data.employeeId,
      address1: data.address1,
      city: data.city,
      state: data.state,
      country: data.country,
      postalCode: data.postalCode,
      type: data.type,
      createdDate: data.createdDate,
      createdBy: data.createdBy,
      modifiedDate: formattedDate,
      modifiedBy: LoginUser,
      isdeleted: true,
    }));

    const PAddressData = pAddress.map((data) => ({
      id: data.id,
      employeeId: data.employeeId,
      address1: data.address1,
      city: data.city,
      state: data.state,
      country: data.country,
      postalCode: data.postalCode,
      type: data.type,
      createdDate: data.createdDate,
      createdBy: data.createdBy,
      modifiedDate: formattedDate,
      modifiedBy: LoginUser,
      isdeleted: true,
    }));

    const ProductData = ProductsFilter.map((pro) => ({
      id: pro.id,
      accessoriesId: pro.accessoriesId,
      brandId: pro.brandId,
      productName: pro.productName,
      modelNumber: pro.modelNumber,
      serialNumber: pro.serialNumber,
      createdDate: pro.createdDate,
      createdBy: pro.createdBy,
      modifiedDate: formattedDate,
      modifiedBy: LoginUser,
      isDeleted: false,
      isRepair: pro.isRepair,
      isAssigned: false,
      comments: pro.comments,
      officeLocationId: pro.officeLocationId,
      isStorage: pro.isStorage,
      employeeId: null,
    }));

    const LeaveData = empLeave.map((leave) => ({
      id: leave.id,
      employeeId: leave.employeeId,
      sickLeave: leave.sickLeave,
      casualLeave: leave.casualLeave,
      total: leave.total,
      leaveAvailed: leave.leaveAvailed,
      createdDate: leave.createdDate,
      createdBy: leave.createdBy,
      modifiedDate: formattedDate,
      modifiedBy: LoginUser,
      isDeleted: true,
    }));

    const LeaveHistoryData = empLeaveHistory.map((leave) => ({
      id: leave.id,
      employeeId: leave.employeeId,
      leaveType: leave.leaveType,
      fromdate: leave.fromdate,
      todate: leave.todate,
      numberOfDays: leave.numberOfDays,
      comments: leave.comments,
      hrIsApproved: leave.hrIsApproved,
      hrIsRejected: leave.hrIsApproved,
      rejectedComments: leave.rejectedComments,
      isDeleted: true,
      createdDate: leave.createdDate,
      createdBy: leave.createdBy,
      modifiedDate: formattedDate,
      modifiedBy: LoginUser,
      leaderIsApproved: leave.leaderIsApproved,
      leaderIsRejected: leave.leaderIsRejected,
    }));

    const LeaderEmployeeData = leaderEmployeeFilter.map((le) => ({
      id: le.id,
      employeeId: le.employeeId,
      leaderId: le.leaderId,
      hrManagerId: le.hrManagerId,
      createdDate: le.createdDate,
      createdBy: le.createdBy,
      modifiedDate: formattedDate,
      modifiedBy: LoginUser,
      isDeleted: true,
    }));

    const roleDetailData = roleFilter.map((role) => ({
      id: role.id,
      roleId: role.roleId,
      employeeId: role.employeeId,
      createdDate: role.createdDate,
      createdBy: role.createdBy,
      modifiedDate: formattedDate,
      modifiedBy: LoginUser,
      isDeleted: true,
    }));

    const loginData = loginFilter.map((login) => ({
      id: login.id,
      employeeId: login.employeeId,
      userName: login.userName,
      password: login.password,
      isDeleted: true,
      createdDate: login.createdDate,
      createdBy: login.createdBy,
      modifiedDate: formattedDate,
      modifiedBy: LoginUser,
      otp: login.otp,
    }));

    const accountData = accountFilter.map((acc) => ({
      id: acc.accountId,
      employeeId: acc.employeeId,
      bankName: acc.bankName,
      branchName: acc.branchName,
      bankLocation: acc.bankLocation,
      accountNumber: acc.accountNumber,
      ifsc: acc.ifsc,
      isdeleted: true,
      createdDate: acc.createdDate,
      createdBy: acc.createdBy,
      modifiedDate: formattedDate,
      modifiedBy: LoginUser,
    }));

    await dispatch(putEmployees(...EmpData));

    if (CAddressData.length > 0)
      await CAddressData.map((data) => dispatch(putAddress(data)));

    if (PAddressData.length > 0)
      await PAddressData.map((data) => dispatch(putAddress(data)));

    if (ProductData.length > 0)
      await ProductData.map((data) => dispatch(putProductsDetail(data)));

    if (LeaveData.length > 0)
      await LeaveData.map((leave) => dispatch(Putemployeeleave(leave)));

    if (LeaveHistoryData.length > 0)
      await LeaveHistoryData.map((leave) =>
        dispatch(Putemployeeleavehistory(leave))
      );

    if (LeaderEmployeeData.length > 0)
      await LeaderEmployeeData.map((le) => dispatch(putleaderemployee(le)));

    if (roleDetailData.length > 0)
      await roleDetailData.map((role) => dispatch(putRoleDetail(role)));

    if (loginData.length > 0)
      await loginData.map((login) => dispatch(PutLogin(login)));

    if (accountData.length > 0)
      await accountData.map((acc) => dispatch(putaccount(acc)));

    await setFullComponentLoading(!FullComponentLoading);

    await dispatch(getEmployees());
    await dispatch(getrole());
    await dispatch(getDepartment());
    await dispatch(getleaderemployee());
    await dispatch(getRoleDetail());
    await dispatch(getAddress());
    await dispatch(getaccount());
    await dispatch(GetLogin());
    await dispatch(Getleavetable());
    await dispatch(getProductsDetail());
    await dispatch(Getemployeeleave());
    await dispatch(Getemployeeleavehistory());
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
      (await RoleDetailsFilter.length) === 0 ? null : RoleDetailsFilter[0];
    //team
    const TeamFilter = await leaderemployee.filter(
      (leader) => leader.employeeId === data.key
    );
    const TeamData = (await TeamFilter.length) === 0 ? null : TeamFilter[0];

    // address
    const AddressFilter = await address.filter(
      (add) => add.employeeId === data.key
    );

    const AddressData = (await AddressFilter.length) > 0 ? AddressFilter : null;

    const PermanetFilter =
      AddressData.length > 0
        ? await AddressData.filter((per) => per.type === 2)
        : null;
    const PermanetData =
      (await PermanetFilter.length) > 0 ? PermanetFilter[0] : null;

    const CurrentFilter =
      (await AddressData) === null
        ? null
        : await AddressData.filter((per) => per.type === 1);
    const CurrentData =
      (await CurrentFilter) === null ? null : CurrentFilter[0];

    //account
    const AccountFilter = await account.filter(
      (acc) => acc.employeeId === data.key
    );
    const AccountData =
      (await AccountFilter.length) === 0 ? null : AccountFilter[0];

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
      modifiedDate: formattedDate,
      modifiedBy: EData.modifiedBy,
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
      // dateOfBirth: dayjs(EData.dateOfBirth,dateFormat)._i,
      // dateOfJoin: dayjs(EData.dateOfJoin,dateFormat)._i,
      bloodGroup: EData.bloodGroup,
      alternateContactNo: EData.alternateContactNo,
      contactPersonName: EData.contactPersonName,
      relationship: EData.relationship,
      maritalStatus: EData.maritalStatus,
      officeLocationId: EData.officeLocationId.id,
      departmentId: EData.departmentId.id,
      isDeleted: false,
      Role: RoleDetailsData === null ? null : RoleDetailsData.roleId,
    });

    //role details
    setRoleValue({
      id: RoleDetailsData === null ? null : RoleDetailsData.id,
      employeeId: RoleDetailsData === null ? null : RoleDetailsData.employeeId,
      roleId: RoleDetailsData === null ? null : RoleDetailsData.roleId,
      isdeleted: false,
      createdDate:
        RoleDetailsData === null ? null : RoleDetailsData.createdDate,
      createdBy: RoleDetailsData === null ? null : RoleDetailsData.createdBy,
      modifiedDate: formattedDate,
      modifiedBy: RoleDetailsData === null ? null : RoleDetailsData.modifiedBy,
    });

    //team
    await setTeamFData({
      id: TeamData === null ? null : TeamData.id,
      employeeId: TeamData === null ? null : TeamData.employeeId,
      leaderId: TeamData === null ? null : TeamData.leaderId,
      hrManagerId: TeamData === null ? null : TeamData.hrManagerId,
      isdeleted: false,
      createdDate: TeamData === null ? null : TeamData.createdDate,
      createdBy: TeamData === null ? null : TeamData.createdBy,
      modifiedDate: formattedDate,
      modifiedBy: TeamData === null ? null : TeamData.modifiedBy,
    });

    //address
    await setPermanetFAdd({
      id: PermanetData === null ? null : PermanetData.id,
      employeeId: PermanetData === null ? null : PermanetData.employeeId,
      address1: PermanetData === null ? null : PermanetData.address1,
      city: PermanetData === null ? null : PermanetData.city,
      state: PermanetData === null ? null : PermanetData.state,
      country: PermanetData === null ? null : PermanetData.country,
      postalCode: PermanetData === null ? null : PermanetData.postalCode,
      isdeleted: false,
      type: 2,
      createdDate: PermanetData === null ? null : PermanetData.createdDate,
      createdBy: PermanetData === null ? null : PermanetData.createdBy,
      modifiedDate: formattedDate,
      modifiedBy: PermanetData === null ? null : PermanetData.modifiedBy,
    });
    await setCurrentFAdd({
      id: CurrentData === null ? null : CurrentData.id,
      employeeId: CurrentData === null ? null : CurrentData.employeeId,
      address1: CurrentData === null ? null : CurrentData.address1,
      city: CurrentData === null ? null : CurrentData.city,
      state: CurrentData === null ? null : CurrentData.state,
      country: CurrentData === null ? null : CurrentData.country,
      postalCode: CurrentData === null ? null : CurrentData.postalCode,
      isdeleted: false,
      type: 1,
      createdDate: CurrentData === null ? null : CurrentData.createdDate,
      createdBy: CurrentData === null ? null : CurrentData.createdBy,
      modifiedDate: formattedDate,
      modifiedBy: CurrentData === null ? null : CurrentData.modifiedBy,
    });

    //account
    await setAccF({
      id: AccountData === null ? null : AccountData.accountId,
      employeeId: AccountData === null ? null : AccountData.employeeId,
      bankName: AccountData === null ? null : AccountData.bankName,
      branchName: AccountData === null ? null : AccountData.branchName,
      accountNumber: AccountData === null ? null : AccountData.accountNumber,
      bankLocation: AccountData === null ? null : AccountData.bankLocation,
      ifsc: AccountData === null ? null : AccountData.ifsc,
      isdeleted: false,
      createdDate: AccountData === null ? null : AccountData.createdDate,
      createdBy: AccountData === null ? null : AccountData.createdBy,
      modifiedDate: formattedDate,
      modifiedBy: AccountData === null ? null : AccountData.modifiedBy,
    });
  };

  // Employee Inputs
  const filedWidth = "100%";
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

    if (name === "officeEmail") {
      validateEmail(value);
    } else if (name === "personalEmail") {
      pvalidateEmail(value);
    }

    if (name === "mobileNumber") {
      validateMobileNumber(value);
    } else if (name === "alternateContactNo") {
      avalidateMobileNumber(value);
    }
  };
  // gender set
  const GengerDropDown = (data) => {
    setEmployeeInput((prevState) => ({ ...prevState, gender: data }));
    setValidate((pre) => ({ ...pre, gender: false }));
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

    setValidate({
      firstName: false,
      lastName: false,
      gender: false,
      personalEmail: false,
      officeEmail: false,
      mobileNumber: false,
      dateOfBirth: false,
      maritalStatus: false,
      dateOfJoin: false,
      bloodGroup: false,
      alternateContactNo: false,
      contactPersonName: false,
      relationship: false,
      officeLocationId: false,
      department: false,
      role: false,
    });

    setSkipAccount(false);
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
  const AddEmployeeBtn = () => {
    setNewempId("");
    setEditPencilState(false); //post method
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

  //employee leave (employee holiday)
  const [EmployeeLeave, setEmployeeLeave] = useState({
    employeeId: null,
    sickLeave: null,
    casualLeave: null,
    total: null,
    isDeleted: false,
    createdBy: null,
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

  const [LoginData, setLoginData] = useState({
    userName: "",
    password: "",
    isDeleted: false,
    // createdDate:'',
    // createdBy:'',
    // modifiedDate:'',
    // modifiedBy:''
  });

  const [loadings, setLoading] = useState(true);
  const LeaveRef = (id) => {
    return leavetable.map((data) => ({
      employeeId: id,
      sickLeave: data.sickLeave,
      casualLeave: data.casualLeave,
      total: data.total,
      leaveAvailed: data.leaveAvailed,
      isDeleted: false,
    }));
  };

  const newEmployee = async () => {
    try {
      const employeeDatas = await dispatch(postEmployees(EmployeeInput));

      if (employeeDatas && employeeDatas.payload.id) {
        setNewempId(employeeDatas.payload.id);

        const LoginDatas = await generateRandomUsername(
          EmployeeInput.firstName,
          EmployeeInput.lastName,
          employeeDatas.payload.id
        );
        const LeaveData = await LeaveRef(employeeDatas.payload.id);
        // console.log({ employeeId: employeeDatas.payload.id });
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
          postAddress({
            employeeId: employeeDatas.payload.id,
            ...CureentFAdd,
            type: 1,
          })
        );
        await dispatch(
          postAddress({
            employeeId: employeeDatas.payload.id,
            ...PermanetFAdd,
            type: 2,
          })
        );
        //account creation
        await dispatch(
          postaccount({ employeeId: employeeDatas.payload.id, ...AccF })
        );
        //login data (automatically created)
        await dispatch(PostLogin(LoginDatas));
        //leave data (automatically created)
        await dispatch(Postemployeeleave(...LeaveData));

        await dispatch(getRoleDetail());
        await dispatch(getleaderemployee());
        await dispatch(getAddress());
        await dispatch(getaccount());
        await setLoading(false);
        await dispatch(getEmployees());
        await setFullComponentLoading(!FullComponentLoading);
      }
    } catch (error) {
      console.error("Error creating new employee:", error);
      message.error(error);
      await setLoading(false);
    }
  };

  //put employee
  const [FullComponentLoading, setFullComponentLoading] = useState(false);

  const PutEmployee = async () => {
    await dispatch(putEmployees(EmployeeInput)); //employee
    await dispatch(putRoleDetail(RoleValue)); //role
    await dispatch(putleaderemployee(TeamFData)); //leader employee
    await dispatch(putAddress(CureentFAdd)); //address1
    await dispatch(putAddress(PermanetFAdd)); //address2
    await dispatch(putaccount(AccF)); //account
    await setLoading(false);
    setFullComponentLoading(!FullComponentLoading);
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
    dispatch(GetLogin());
    dispatch(Getleavetable());
    dispatch(getProductsDetail());
    dispatch(Getemployeeleave());
    dispatch(Getemployeeleavehistory());
  }, [dispatch, loadings, FullComponentLoading]);

  //table loading
  useEffect(() => {
    setRoledetailData(role);
    setEmpData(employee);
    DataLoading();
  }, [employee, officeData, role, FullComponentLoading]);

  //form edit initial loading screen
  const InitialFormEdit = () => {
    setProcessBar({
      info: "process",
      team: "wait",
      address: "wait",
      account: "wait",
      done: "wait",
    });
  };
  useEffect(() => {
    InitialFormEdit();
  }, [modelOpen]);

  //skip
  const [SkipAccount, setSkipAccount] = useState(false);
  const skipAccount = async () => {
    await setSkipAccount(true);
    if (accFormRef.current) {
      await accFormRef.current.accountValidateData();
      await setSkipAccount(false);
    }
    await setSkipAccount(false);
  };

  //Table Row Selection Check box
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [SelectedIds, setSelectedIds] = useState([]);
  const [TypeCounts, setTypeCounsts] = useState([]);

  const onSelectChange = async (newSelectedRowKeys, x) => {
    console.log(newSelectedRowKeys);
    await setSelectedRowKeys(newSelectedRowKeys);
    await setIsButtonEnabled(newSelectedRowKeys.length > 0);
    await setSelectedIds(newSelectedRowKeys);
    const types = await x.map((obj) => obj.producttype);
    const counts = await {};
    await types.forEach((item) => {
      counts[item] = counts[item] ? counts[item] + 1 : 1;
    });
    const filteredCounts = [];
    for (const key in counts) {
      if (counts[key] >= 1) {
        filteredCounts[key] = counts[key];
      }
    }
    await setTypeCounsts(filteredCounts);
  };

  //Row Selection
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        id: "odd",
        text: "Select Odd Row",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        id: "even",
        text: "Select Even Row",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  const replaceDate = (date) => {
    const parts = date === null ? null : date.split("/");
    const convertedDate = parts === null ? null : parts.join("-");
    return convertedDate;
  };

  //Gross Salary Input
  const grossSalaryChange = (e) => {
    setEmployeeSalary((pre) => ({ ...pre, grossSalary: e.target.value }));
  };

  //Net Salary Input
  const netSalaryChange = (e) => {
    setEmployeeSalary((pre) => ({ ...pre, netSalary: e.target.value }));
  };

  // //Employee Dropdown option
  // const employeeOption = [
  //   { label: 'Select an Employee', value: null },
  //   ...employee.filter(empacc => !empacc.isDeleted).map(emp => ({
  //     label: emp.firstName,
  //     value: emp.id
  //   })),
  // ];

  // //Employee Dropdown
  // const employeeNameDropdowninProduct = (data, value) => {
  //   console.log(value.value);
  //   setEmployeeSalary((pre) => ({ ...pre, employeeId: value.value }));
  // }

  //salary
  const salaryDateChange = (date) => {
    setEmployeeSalary((pre) => ({
      ...pre,
      salaryDate: date ? date.format("YYYY/MM/DD") : null,
    }));
  };

  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className="">
      {/* <Row align="middle">
        <Col span={4}>
          <Statistic
            title="User Count"
            value={empCounts}
            valueStyle={{ color: "#3f8600" }}
            formatter={formatter}
          />
        </Col>
        <Col span={4} style={{ right: "0%" }}>
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
      </Row> */}
      <ul className="flex flex-col md:flex-row justify-between md:items-center gap-y-3 md:gap-y-0">
        <li className="grid grid-flow-col gap-x-10 items-center self-center xs:self-start">
          <Statistic
            className="block text-center w-fit lg:w-[120px]"
            title="User Count"
            value={empCounts}
            valueStyle={{ color: "#3f8600" }}
            formatter={formatter}
          />

          <Input.Search
            className=" w-fit hidden md:block"
            placeholder="Search here...."
            onSearch={(value) => {
              setSearchText(value);
            }}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            style={{ width: `100%` }}
          />
        </li>

        <li className="flex gap-x-2 gap-y-3 md:gap-y-0 flex-col xs:flex-row">
          <Button
            disabled={!isButtonEnabled}
            onClick={SalaryModalOpen}
            type="primary"
            className="bg-blue-500 flex justify-center items-center gap-x-1"
          >
            <FontAwesomeIcon icon={faDollar} className="icon" />{" "}
            <span>Add Payment </span>
          </Button>

          <Button
            onClick={AddEmployeeBtn}
            type="primary"
            className="bg-blue-500 flex justify-center items-center gap-x-2"
          >
            <FontAwesomeIcon icon={faUser} className="icon inline-block" />

            <span className="inline-block">{`Add ${headingValue}`}</span>
          </Button>
        </li>

        <li className="block md:hidden">
          <Input.Search
            className=" w-fit "
            placeholder="Search here...."
            onSearch={(value) => {
              setSearchText(value);
            }}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            style={{ width: `100%` }}
          />
        </li>
      </ul>

      <Divider />

      <div className="w-full overflow-x-scroll sm:overflow-x-hidden">
      <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={Tbdata}
          pagination={{ pageSize: 5 }}
        />
      </div>

      <Modal
        title={[
          <h2 className="text-center pt-2">
            {EditPencilState === false
              ? `Add New ${headingValue}`
              : `Edit Employee Details`}
          </h2>,
        ]}
        className="relative block"
        open={modelOpen}
        centered
        onCancel={handleCancel}
        width={isMobile === true ? undefined : 1000}
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
          processbar.info === "process" ? ( //condition
            <Button key="submit7" type="submit" onClick={informationPostBtn}>
              Next
            </Button>
          ) : processbar.team === "process" ? ( //condition
            <>
              {EditPencilState === false ? (
                <Button
                  key="submit8"
                  type="submit"
                  onClick={teamPostProcessBar}
                >
                  Skip
                </Button>
              ) : (
                ""
              )}
              <Button key="submit8" type="submit" onClick={postTeam}>
                Next
              </Button>
            </>
          ) : processbar.address === "process" ? ( //condition
            <Button key="submit9" type="submit" onClick={postAdd}>
              Next
            </Button>
          ) : processbar.account === "process" ? ( //condition
            <>
              {EditPencilState === false ? (
                <Button key="submit10" type="submit" onClick={skipAccount}>
                  Skip
                </Button>
              ) : (
                ""
              )}

              <Button key="submit10" type="submit" onClick={postAcc}>
                Next
              </Button>
            </>
          ) : (
            ""
          ),
        ]}
        maskClosable={false}
      >
       
          <Steps
            className="w-fit mt-3 md:px-[100px] absolute left-[60px] top-1/2  -translate-x-1/2 -translate-y-1/2 md:-translate-x-0 md:-translate-y-0  z-50 md:left-0 md:w-full md:top-10 md:bg-white md:pt-5 "
            size="small"
            direction={`${isMobile === false ? "horizontal" : "vertical"}`}
            items={[
              {
                title: `${isMobile === true ? "" : "Info"}`,
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
                title: `${isMobile === true ? "" : "Team"}`,
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
                title: `${isMobile === true ? "" : "Address"}`,
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
                title: `${isMobile === true ? "" : "Account"}`,
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
                title: `${isMobile === true ? "" : "Done"}`,
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
          />
          {/* (i)Employee-Details-section */}
          {processbar.info === "process" ? (
            <section className="pt-14 ">
              {/* <div className="mt-4 flex justify-center items-center">
        <FontAwesomeIcon className="text-2xl " icon={faInfoCircle} />
      </div> */}
              {/* <h1 className='font-bold mt-2 text-center'>Employee Details</h1> */}
              <Form form={form} layout="vertical ">
                <ul className="pl-12 md:pl-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    
                    <li>
                    {/* firstName */}
                    <Form.Item
                      name="firstName"
                      label="First Name"
                      className="px-3"
                      validateStatus={
                        Validate.firstName === true ? "error" : ""
                      }
                    >
                      <Input
                        style={{ width: filedWidth }}
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
                      className="px-3"
                      validateStatus={Validate.lastName === true ? "error" : ""}
                    >
                      <Input
                        style={{ width: filedWidth }}
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
                        {
                          message: "Please select your gender!",
                          type: "string",
                        },
                      ]}
                      label="Gender"
                      className="px-3"
                      validateStatus={Validate.gender === true ? "error" : ""}
                    >
                      <Select
                        optionFilterProp="children"
                        placeholder="select gender"
                        style={{ width: filedWidth }}
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
                      // rules={[{ type: "email" }]}
                      className="px-3"
                      label="Personal Email"
                      name="personalEmail"
                      validateStatus={
                        Validate.personalEmail === true ? "error" : ""
                      }
                    >
                      <Input
                        style={{ width: filedWidth }}
                        placeholder="personal email"
                        name="personalEmail"
                        value={EmployeeInput.personalEmail}
                        onChange={EmployeeInputsOnchange}
                      />
                    </Form.Item>

                    {/* officeEmail */}
                    <Form.Item
                      // rules={[{ type: "email" }]}
                      className="px-3"
                      name="officeEmail"
                      label="Office Email (optional)"
                      validateStatus={
                        Validate.officeEmail === true ? "error" : ""
                      }
                    >
                      <Input
                        style={{ width: filedWidth }}
                        placeholder="office email"
                        name="officeEmail"
                        value={EmployeeInput.officeEmail}
                        onChange={EmployeeInputsOnchange}
                      />
                    </Form.Item>
                    </li>

                 <li>
                    {/* mobileNumber */}
                    <Form.Item
                      className="px-3"
                      label="Mobile Number"
                      name="mobileNumber"
                      // rules={[
                      //   { message: "Please enter your mobile number" },
                      //   {
                      //     pattern: /^[0-9]{10}$/, // Adjust the regular expression as needed
                      //     message: "Enter 10-digit number",
                      //   },
                      // ]}
                      validateStatus={
                        Validate.mobileNumber === true ? "error" : ""
                      }
                    >
                      <Input
                        style={{ width: filedWidth }}
                        placeholder="Mobile Number"
                        name="mobileNumber"
                        value={EmployeeInput.mobileNumber}
                        onChange={EmployeeInputsOnchange}
                      />
                    </Form.Item>
                
                    {/* dateOfBirth*/}
                    <Form.Item
                      name="dateOfBirth"
                      className="px-3"
                      label="Date Of Birth"
                      validateStatus={
                        Validate.dateOfBirth === true ? "error" : ""
                      }
                    >
                      <DatePicker
                        style={{ width: filedWidth }}
                        format={dateFormat}
                        onChange={DateOfBirthValue}
                      />
                    </Form.Item>
                    {/* maritalStatus */}
                    <Form.Item
                      name="maritalStatus"
                      className="px-3"
                      label="Marital Status"
                      validateStatus={
                        Validate.maritalStatus === true ? "error" : ""
                      }
                    >
                      <Select
                        optionFilterProp="children"
                        placeholder="select marital status"
                        style={{ width: filedWidth }}
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
                      className="px-3"
                      label="Date Of Join"
                      validateStatus={
                        Validate.dateOfBirth === true ? "error" : ""
                      }
                    >
                      <DatePicker
                        style={{ width: filedWidth }}
                        format={dateFormat}
                        onChange={DateOfJoinValue}
                      />
                    </Form.Item>

                    {/* bloodGroup */}
                    <Form.Item
                      name="bloodGroup"
                      className="px-3"
                      label="Blood Group"
                      validateStatus={
                        Validate.bloodGroup === true ? "error" : ""
                      }
                    >
                      <Select
                        //mode="multiple"
                        //size={size}
                        placeholder="select blood group"
                        onChange={BloodGroupValue}
                        style={{ width: filedWidth }}
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
                    </li>

                 <li>
                    {/* alternateContactNo */}
                    <Form.Item
                      className="px-3"
                      label="Alternate Contact No"
                      name="alternateContactNo"
                      // rules={[
                      //   { message: "Please enter your mobile number" },
                      //   {
                      //     pattern: /^[0-9]{10}$/, // Adjust the regular expression as needed
                      //     message: "Enter 10-digit number",
                      //   },
                      // ]}
                      validateStatus={
                        Validate.alternateContactNo === true ? "error" : ""
                      }
                    >
                      <Input
                        style={{ width: filedWidth }}
                        placeholder="alternate contact no"
                        name="alternateContactNo"
                        value={EmployeeInput.alternateContactNo}
                        onChange={EmployeeInputsOnchange}
                      />
                    </Form.Item>
                  
                    {/* contactPersonName */}
                    <Form.Item
                      name="contactPersonName"
                      className="px-3"
                      label="Contact Person Name"
                      validateStatus={
                        Validate.contactPersonName === true ? "error" : ""
                      }
                    >
                      <Input
                        style={{ width: filedWidth }}
                        placeholder="contact person name"
                        name="contactPersonName"
                        value={EmployeeInput.contactPersonName}
                        onChange={EmployeeInputsOnchange}
                      />
                    </Form.Item>
                    {/* Relationship */}
                    <Form.Item
                      name="relationship"
                      className="px-3"
                      label="Relationship"
                      validateStatus={
                        Validate.relationship === true ? "error" : ""
                      }
                    >
                      <Select
                        optionFilterProp="children"
                        placeholder="select relationship"
                        style={{ width: filedWidth }}
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
                      className="px-3"
                      label="Office Location"
                      validateStatus={
                        Validate.officeLocationId === true ? "error" : ""
                      }
                    >
                      <Select
                        optionFilterProp="children"
                        placeholder="select office location"
                        style={{ width: filedWidth }}
                        onChange={officeLocationDropDown}
                        options={officeOption}
                        value={EmployeeInput.officeLocationId}
                      />
                    </Form.Item>

                    {/* departmentId */}
                    <Form.Item
                      name="departmentId"
                      className="px-3"
                      label="Department"
                      validateStatus={
                        Validate.department === true ? "error" : ""
                      }
                    >
                      <Select
                        optionFilterProp="children"
                        placeholder="select department"
                        style={{ width: filedWidth }}
                        onChange={departmentDropDown}
                        options={departmentOption}
                        value={EmployeeInput.departmentId}
                      />
                    </Form.Item>
                    </li>

              <li>
                    {/* Roll Detail */}
                    <Form.Item
                      name="Role"
                      className="px-3"
                      label="Role"
                      validateStatus={Validate.role === true ? "error" : ""}
                    >
                      <Select
                        optionFilterProp="children"
                        placeholder="select role"
                        style={{ width: filedWidth }}
                        onChange={roleDropDown}
                        options={optionRoles}
                        value={RoleValue.roleId}
                      />
                    </Form.Item>
                    </li>
                </ul>
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
              SkipAccount={SkipAccount}
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
              DisplayLogin={DisplayLogin} //one time login data
            />
          ) : (
            ""
          )}
       
      </Modal>

      <Modal
        title="Pay Salary"
        open={SalaryModal}
        onCancel={SalaryModalClose}
        width={"550px"}
        footer={[
          <Button key="1" onClick={PostSalary}>
            Pay
          </Button>,
          <Button key="2" onClick={() => SalaryModalClose()}>
            Cancel
          </Button>,
        ]}
      >
        <Form form={form}>
          {/* <Form.Item
            label="Employee Name"
            style={{ marginBottom: 0, marginTop: 10 }}
          >
            <Select
              showSearch
              style={{ width: "380px", float: "right" }}
              placeholder="Select Employee Name"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={employeeSalary.employeeId || undefined}
              onChange={employeeNameDropdowninProduct}
            >
              {employeeOption.map((employee) => (
                <Select.Option key={employee.value} value={employee.value}>
                  {employee.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item> */}

          <Form.Item
            label="Gross Salary"
            style={{ marginBottom: 0, marginTop: 10 }}
          >
            <Input
              style={{ width: "380px", float: "right" }}
              placeholder="Gross Salary"
              name="grossSalary"
              value={employeeSalary.grossSalary}
              onChange={grossSalaryChange}
            />
          </Form.Item>

          <Form.Item
            label="Net Salary"
            style={{ marginBottom: 0, marginTop: 10 }}
          >
            <Input
              style={{ width: "380px", float: "right" }}
              placeholder="Net Salary"
              name="netSalary"
              value={employeeSalary.netSalary}
              onChange={netSalaryChange}
            />
          </Form.Item>

          <Form.Item
            label="Salary Date"
            style={{ marginBottom: 0, marginTop: 10 }}
          >
            <DatePicker
              style={{ width: "380px", float: "right" }}
              value={
                employeeSalary.salaryDate
                  ? moment(employeeSalary.salaryDate, "YYYY/MM/DD")
                  : null
              }
              onChange={salaryDateChange}
            ></DatePicker>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Employee;
