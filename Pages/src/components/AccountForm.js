import React, {
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Form, Input, message, Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLandmark } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";



const AccountForm = forwardRef((props, ref) => {
  
  const widthSize = "810px";
  const [form] = Form.useForm();
  const {
    FormAccF, //account state
    UpdateAccF, //account onchange
    accountPostProcessBar, //process bar
    PostEmployee,
    PostRole,
    PostTeam,
    PostCureenetAdd,
    PostPermenantAdd,
    newEmployee
  } = props;


  //update data
  const accountInputOnchange = (e) => {
    const { name, value } = e.target;
    UpdateAccF({ [name]: value });
    if(name === 'accountNumber'){
      isNaN(value)
      isNaN(value) === false ? setNumberValidate(false): setNumberValidate(true);
    }
  };



  //Post account Data
  const [NumberValidate, setNumberValidate] = useState(false);
  const accountValidateData =  () => {
 
    const accountno = FormAccF.accountNumber;
    if (
      FormAccF.bankName === "" ||
      FormAccF.branchName === "" ||
      FormAccF.bankLocation === "" ||
      FormAccF.accountNumber === "" ||
      FormAccF.ifsc === ""
    ) {
      message.error("Fill all the fields");
    } else if (isNaN(accountno) === true){//true
      setNumberValidate(true);
      message.error("please check the account number");
  }
   else if (
      (!isNaN(accountno) !=
        (!FormAccF.bankName ||
          !FormAccF.branchName ||
          !FormAccF.bankLocation ||
          !FormAccF.accountNumber ||
          !FormAccF.ifsc)) === true
    ) {
      accountPostProcessBar();
      newEmployee();
    }
    //  accountPostProcessBar();
    //  newEmployee();
  };

  //send fn child to parenet
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
            value={FormAccF.bankName}
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
            value={FormAccF.branchName}
            onChange={accountInputOnchange}
          />
        </Form.Item>
        {/* BankLocation */}
        <Form.Item label="Location" style={{ marginBottom: 0, marginTop: 10 }}>
          <Input
            style={{ float: "right", width: widthSize }}
            placeholder="bank location"
            name="bankLocation"
            value={FormAccF.bankLocation}
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
          validateStatus={NumberValidate === true ? "error" : ""}
          help={form.getFieldError("accountNumber")}
          pattern="[0-9]*"
          label="Account No"
          style={{ marginBottom: 0, marginTop: 10 }}
        >
          <Input
            style={{ float: "right", width: widthSize }}
            placeholder="account no"
            name="accountNumber"
            value={FormAccF.accountNumber}
            onChange={accountInputOnchange}
          />
        </Form.Item>

        {/* Ifsc */}
        <Form.Item label="IFSC" style={{ marginBottom: 10, marginTop: 10 }}>
          <Input
            style={{ float: "right", width: widthSize }}
            placeholder="ifsc"
            name="ifsc"
            value={FormAccF.ifsc}
            onChange={accountInputOnchange}
          />
        </Form.Item>
      </Form>
    </section>
  );
});

export default AccountForm;
