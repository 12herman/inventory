import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faPen,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Form,
  Table,
  message,
  Modal,
  Input,
  Popconfirm,
  Select,
  Divider,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  deletedaccount,
  getaccount,
  postaccount,
  putaccount,
} from "../../redux/slices/accountdetailsSlice";
import { getEmployees } from "../../redux/slices/employeeSlice";

const AccountDetailSettings = ({ BackToSetting }) => {
  const [form] = Form.useForm();
  const columns = [
    {
      title: "S.No",
      dataIndex: "serialno",
      width: "5%",
    },

    {
      title: "Employee",
      dataIndex: "employeeid",
      width: "25%",
    },
    {
      title: "Branch Name",
      dataIndex: "branchname",
      width: "15%",
    },
    {
      title: "Bank",
      dataIndex: "bankname",
      width: "15%",
    },

    {
      title: "Location",
      dataIndex: "bankLocation",
      width: "25%",
    },
    {
      title: "Account No",
      dataIndex: "accountNumber",
      width: "15%",
    },
    {
      title: "IFSC",
      dataIndex: "ifsc",
      width: "20%",
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (text, record) => (
        <div className="flex gap-x-2">
          <Popconfirm
            title="Are you sure to delete this?"
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              style: { backgroundColor: "red", color: "white" },
            }}
            onConfirm={() => Delete(record)}
          >
            <Button type="link">
              <FontAwesomeIcon color="#fd5353" icon={faTrash} />
            </Button>
          </Popconfirm>

          <Button type="link" onClick={() => Edit(record)}>
            <FontAwesomeIcon icon={faPen} color="#000000" />
          </Button>
        </div>
      ),
    },
  ];

  const dispatch = useDispatch();
  const { account } = useSelector((state) => state.account);
  const { employee } = useSelector((state) => state.employee);

  //input filed value
  const headingValue = "Account";
  const [accountInput, setAccountInput] = useState({
    bankName: "",
    branchName: "",
    bankLocation: "",
    accountNumber: "",
    ifsc: "",
  }); //Modify

  const [placeHolderName, setPlaceHolderName] = useState("Select a person"); // dropdown slection
  const [accountId, setAccountId] = useState(""); //Account table Id
  const clearFileds = () => {
    setAccountInput({
      bankName: "",
      branchName: "",
      bankLocation: "",
      accountNumber: "",
      ifsc: "",
    });
  }; //Modify
  // popup-window
  const [modelOpen, setModelOpen] = useState(false);
  const ModelOpen = () => setModelOpen(true);
  const ModelClose = () => setModelOpen(false);
  // save (or) add btn state
  const [saveBtn, setsaveBtn] = useState(false);
  const saveBtnOn = () => setsaveBtn(true);
  const saveBtnOff = () => setsaveBtn(false);
  // add new filed open
  const AddNewBtn = () => {
    setNumberValidate(false);
    setDropDownName(null);
    clearFileds();
    saveBtnOff();
    ModelOpen();
    setPlaceHolderName("Select a person");
  };
  //input data
  const InputDataFilelds = (e) => {
    const { name, value } = e.target;
    setAccountInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // option Name or not equal ids with option fn
  const notEqualObjects = employee.filter(
    (a) => !account.some((b) => a.id === b.employeeId)
  );
  const optionIsFalse = notEqualObjects.filter(
    (notIds) => notIds.isDeleted === false
  );

  const options = [
    ...optionIsFalse.map((emp) => ({
      value: emp.id,
      label: emp.firstName + " " + emp.lastName,
    })),
  ];
  const [dropDownId, setDropDownId] = useState(); //Employee foreginkey
  const [dropDownName, setDropDownName] = useState(null);
  const dropDownValue = (value, label) => {
    setDropDownName(label.label);
    setDropDownId(value);
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  //   const filterAccountData = account.filter(acc => acc.isDeleted === false);
  // compare two api && return the account data && yes it's possible in js not using backend api get method;
  const filterAccountData = account.filter(
    (acc) =>
      acc.isDeleted === false &&
      employee.some((em) => em.id === acc.employeeId && em.isDeleted === false)
  );

  
  const TableDatas =
    filterAccountData.length > 0
      ? filterAccountData.map((data, i) => ({
          key: data.accountId,
          id: data.accountId,
          serialno: i + 1,
          bankname: data.bankName,
          branchname: data.branchName,
          employeeid: `${data.employeeFirstName} ${data.employeeLastName}`,
          employeeName: data.employeeId,
          bankLocation: data.bankLocation,
          accountNumber: data.accountNumber,
          ifsc: data.ifsc,
        }))
      : [];
  // console.log(Tables);

  //Post method
  const [NumberValidate, setNumberValidate] = useState(false);
  const PostMethod = async () => {
    const accountno = accountInput.accountNumber;
    if (
      accountInput.bankName === "" ||
      accountInput.branchName === "" ||
      accountInput.bankLocation === "" ||
      accountInput.accountNumber === "" ||
      accountInput.ifsc === "" ||
      dropDownName === null
    ) {
      message.error("Fill all the fields");
    } else if (isNaN(accountno) === true) {
      //true
      setNumberValidate(true);
      message.error("please check the account number");
    } else if (!isNaN(accountno) === false) {
      //false
      setNumberValidate(false);
    } else if (
      (!isNaN(accountno) !=
        (!accountInput.bankName ||
          !accountInput.branchName ||
          !accountInput.bankLocation ||
          !accountInput.accountNumber ||
          !accountInput.ifsc)) ===
      true
    ) {
      await dispatch(postaccount({ employeeId: dropDownId, ...accountInput }));
      message.success("Successfully Added");
      ModelClose();
      await setNumberValidate(false);
      await dispatch(getaccount());
    }
  };

  //Put method
  // pencil icon click
  const Edit = async (record) => {
    saveBtnOn();
    ModelOpen();
    await setDropDownId(record.employeeName); //Forgin key
    await setAccountId(record.id); //Account Table id
    //    console.log(record);
    const placeholderFilter = employee.filter(
      (emp) => emp.id === record.employeeName
    );
    setPlaceHolderName(
      placeholderFilter[0].firstName + " " + placeholderFilter[0].lastName
    );
    const inputFiledFilter = account.filter(
      (acc) => acc.accountId === record.key
    );
    setAccountInput({
      id: record.key,
      bankName: inputFiledFilter[0].bankName,
      branchName: inputFiledFilter[0].branchName,
      bankLocation: inputFiledFilter[0].bankLocation,
      accountNumber: inputFiledFilter[0].accountNumber,
      ifsc: inputFiledFilter[0].ifsc,
    });
  };
  const PutMethod = async (record) => {
    const accountno = accountInput.accountNumber;
    if (
      accountInput.bankName === "" ||
      accountInput.branchName === "" ||
      accountInput.bankLocation === "" ||
      accountInput.accountNumber === "" ||
      accountInput.ifsc === "" ||
      accountInput.bankName === null ||
      accountInput.branchName === null ||
      accountInput.bankLocation === null ||
      accountInput.ifsc === null
    ) {
      message.error("Fill all the fields");
    } else if (
      isNaN(accountno) === true ||
      accountInput.accountNumber === null
    ) {
      //true
      setNumberValidate(true);
      message.error("please check the account number");
    } else if (!isNaN(accountno) === false) {
      //false
      setNumberValidate(false);
    } else if (
      (!isNaN(accountno) !=
        (!accountInput.bankName ||
          !accountInput.branchName ||
          !accountInput.bankLocation ||
          !accountInput.accountNumber ||
          !accountInput.ifsc)) ===
      true
    ) {
      const filterAcc = await account.filter(
        (data) => data.accountId === accountId
      );

      console.log(filterAcc);
      await dispatch(
        putaccount({
          employeeId: dropDownId,
          ...accountInput,
          isdeleted: false,
          createdDate: filterAcc[0].createdDate,
          createdBy: filterAcc[0].createdBy,
          modifiedBy: filterAcc[0].modifiedBy,
          modifiedDate: filterAcc[0].modifiedDate,
        })
      );
      console.log({ employeeId: dropDownId, ...accountInput });
      message.success("Successfully Updated");
      ModelClose();
      setNumberValidate(false);
      await dispatch(getaccount());
    }
  };

  //Delete
  const Delete = async (recod) => {
    await dispatch(deletedaccount(recod.id));
    await dispatch(getaccount());
    console.log(recod.id);
  };

  useEffect(() => {
    dispatch(getEmployees());
    dispatch(getaccount());
  }, [dispatch]);

  //  useEffect(()=>{
  //     setData(account);
  //  },[dispatch])

  // useEffect(()=>{
  //     setFillAccData(fillAccData);
  // },[account])
  return (
    <>
      <ul className="flex flex-col md:flex-row gap-y-3 md:items-center justify-between">
        <li>
          <h2 className="text-xl">AccountDetail Settings</h2>
        </li>
        <li className="flex flex-col xs:flex-row gap-x-2 gap-y-3 xs:gap-y-0 mt-5 md:mt-0">
          <Button
            className="flex justify-center items-center gap-x-2"
            type="dashed"
            onClick={() => BackToSetting()}
          >
            <FontAwesomeIcon
              className="text-[10px] inline-block"
              icon={faChevronLeft}
            />
            <span>Back</span>
          </Button>
          <Button
            onClick={() => AddNewBtn()}
            type="primary"
            className="bg-blue-500 flex items-center justify-center gap-x-1"
          >
            <span>Add New Office</span>
            <FontAwesomeIcon icon={faPlus} className="icon" />
          </Button>
        </li>
      </ul>

      <Divider />
      <div className="overflow-x-scroll md:overflow-x-hidden mt-7">
        <Table
          style={{ marginTop: 10 }}
          bordered
          columns={columns}
          dataSource={TableDatas}
          pagination={{
            pageSize: 5,
          }}
        />
      </div>
      <Modal
      centered={true}
        title={`Add New ${headingValue}`}
        open={modelOpen}
        onCancel={ModelClose}
        //onOk={handleOk}
        footer={[
          saveBtn === false ? (
            <Button key="1" onClick={PostMethod}>
              Add
            </Button>
          ) : (
            <Button key="1" onClick={PutMethod}>
              Save
            </Button>
          ),
          <Button
            type="text"
            key="2"
            danger="red"
            style={{ border: "0.5px solid red" }}
            onClick={() => ModelClose()}
          >
            Close
          </Button>,
        ]}
      >
        <Form layout="vertical" className="mt-3">
          <Form.Item
          className="mb-2"
            label="Employee"
            
          >
            {saveBtn === true ? (
              <Select
                showSearch
                placeholder={placeHolderName}
                optionFilterProp="children"
                onChange={dropDownValue}
                onSearch={onSearch}
                filterOption={filterOption}
                options={options}
                value={saveBtn === true ? placeHolderName : ""}
                disabled={true}
              />
            ) : (
              <Select
                showSearch
                placeholder={placeHolderName}
                optionFilterProp="children"
                onChange={dropDownValue}
                onSearch={onSearch}
                filterOption={filterOption}
                options={options}
                value={dropDownName}
              />
            )}
          </Form.Item>

          {/* bankname */}
          <Form.Item
          className="mb-2"
            label="Bank Name"
            
          >
            <Input
              placeholder="bank name"
              name="bankName"
              value={accountInput.bankName}
              onChange={InputDataFilelds}
            />
          </Form.Item>

          {/* Address */}
          <Form.Item
          className="mb-2"
            label="Branch Name"
            
          >
            <Input
              placeholder="branch name"
              name="branchName"
              value={accountInput.branchName}
              onChange={InputDataFilelds}
            />
          </Form.Item>

          {/* City */}
          <Form.Item
          className="mb-2"
            label="Location"
            
          >
            <Input
              placeholder="bank location"
              name="bankLocation"
              value={accountInput.bankLocation}
              onChange={InputDataFilelds}
            />
          </Form.Item>

          {/* State */}
          <Form.Item
          className="mb-2"
            rules={[
              {
                type: "number",
                message: "Please enter a valid number!",
              },
            ]}
            validateStatus={NumberValidate ? "error" : ""}
            help={form.getFieldError("accountNumber")}
            pattern="[0-9]*"
            label="Account No"
            
          >
            <Input
              placeholder="account no"
              name="accountNumber"
              value={accountInput.accountNumber}
              onChange={InputDataFilelds}
            />
          </Form.Item>

          {/* Country */}
          <Form.Item
          className="mb-2" label="IFSC" style={{ marginBottom: 10, marginTop: 10 }}>
            <Input
              placeholder="ifsc"
              name="ifsc"
              value={accountInput.ifsc}
              onChange={InputDataFilelds}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default AccountDetailSettings;
