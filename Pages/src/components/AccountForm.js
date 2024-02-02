import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Form, Input, message,Spin  } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLandmark } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { getaccount, postaccount, putaccount } from "../redux/slices/accountdetailsSlice";

const AccountForm = forwardRef((props, ref) => {
  
  //Api
  const dispatch = useDispatch();
  // const { account } = useSelector(state => state.account);
  // useEffect(()=>{
  //   dispatch(getaccount());
  // },[])

  const widthSize = "810px";
  const { newempid, accountPostProcessBar,receiveAccountData } = props;
  const [form] = Form.useForm();

  //Account fields
  const [accountInput, setAccountInput] = useState({
    employeeId:newempid,
    bankName: null,
    branchName: null,
    bankLocation: null,
    accountNumber: null,
    ifsc: null,
    isdeleted: false,
  });
  const accountInputOnchange = (e) => {
    const { name, value } = e.target;
    setAccountInput((pro) => ({ ...pro, [name]: value }));
  };

  //Post account Data
  const [NumberValidate, setNumberValidate] = useState(false);
  const accountValidateData = async () => {
   
    const accountno = accountInput.accountNumber;
    if (
      accountInput.bankName === null ||
      accountInput.branchName === null ||
      accountInput.bankLocation === null ||
      accountInput.accountNumber === null ||
      accountInput.ifsc === null
    ) {
      message.error("Fill all the fields");
    } else if (isNaN(accountno) === true){//true
      setNumberValidate(true);
      message.error("please check the account number");
  }
  else if(!isNaN(accountno) === false){ //false
      setNumberValidate(false)
  } else if (
      (!isNaN(accountno) !=
        (!accountInput.bankName ||
          !accountInput.branchName ||
          !accountInput.bankLocation ||
          !accountInput.accountNumber ||
          !accountInput.ifsc)) === true
    ) {
      accountPostProcessBar();
      setNumberValidate(false);
      await dispatch(postaccount(accountInput));
      await dispatch(getaccount());

    }
    // receiveAccountData(accountInput);
    // accountPostProcessBar();
  };

  useImperativeHandle(ref, () => {
    return {
      accountValidateData: accountValidateData,
    };
  });

  return (
    <section>
      <div className="mt-5 flex justify-center items-center">
        <FontAwesomeIcon className="text-2xl " icon={faLandmark} />
      </div>

      <Form form={form} className="h-[60.9vh] mt-5 px-5">
        {/* bankname */}
        <Form.Item label="Bank Name" style={{ marginBottom: 0, marginTop: 10 }}>
          <Input
            style={{ float: "right", width: widthSize }}
            placeholder="bank name"
            name="bankName"
            value={accountInput.bankName}
            onChange={accountInputOnchange}
          />
        </Form.Item>
        {/* Branch Name */}
        <Form.Item
          label="Branch Name"
          style={{ marginBottom: 0, marginTop: 10 }}
        >
          <Input
            style={{ float: "right", width: widthSize }}
            placeholder="branch name"
            name="branchName"
            value={accountInput.branchName}
            onChange={accountInputOnchange}
          />
        </Form.Item>
        {/* BankLocation */}
        <Form.Item label="Location" style={{ marginBottom: 0, marginTop: 10 }}>
          <Input
            style={{ float: "right", width: widthSize }}
            placeholder="bank location"
            name="bankLocation"
            value={accountInput.bankLocation}
            onChange={accountInputOnchange}
          />
        </Form.Item>

        {/* AccountNo */}
        <Form.Item
          rules={[
            {
              type: "number",
              message: "Please enter a valid number!",
            },
          ]}
          validateStatus={ NumberValidate ===true ? "error" : ""}
          help={form.getFieldError("accountNumber")}
          pattern="[0-9]*"
          label="Account No"
          style={{ marginBottom: 0, marginTop: 10 }}
        >
          <Input
            style={{ float: "right", width: widthSize }}
            placeholder="account no"
            name="accountNumber"
            value={accountInput.accountNumber}
            onChange={accountInputOnchange}
          />
        </Form.Item>

        {/* Ifsc */}
        <Form.Item label="IFSC" style={{ marginBottom: 10, marginTop: 10 }}>
          <Input
            style={{ float: "right", width: widthSize }}
            placeholder="ifsc"
            name="ifsc"
            value={accountInput.ifsc}
            onChange={accountInputOnchange}
          />
        </Form.Item>
      </Form>
    </section>
  );
});

export default AccountForm;
