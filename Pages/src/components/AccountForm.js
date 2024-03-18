import React, {
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Form, Input, message, Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLandmark } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";



const AccountForm = forwardRef((props, ref,) => {
  
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
    newEmployee,
    EditPencilState,
    PutEmployee,
    SkipAccount
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
    if( SkipAccount === true){
      accountPostProcessBar();
      newEmployee();
    }
    else if (
      FormAccF.bankName === "" || FormAccF.bankName === null ||
      FormAccF.branchName === "" || FormAccF.branchName === null ||
      FormAccF.bankLocation === "" || FormAccF.bankLocation === null ||
      FormAccF.accountNumber === "" ||   FormAccF.accountNumber === null ||
      FormAccF.ifsc === "" || FormAccF.ifsc === null 
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
          !FormAccF.ifsc )) === true && EditPencilState ===false
    ) {
      accountPostProcessBar();
      newEmployee();
    }
    else if (
      (!isNaN(accountno) !=
        (!FormAccF.bankName ||
          !FormAccF.branchName ||
          !FormAccF.bankLocation ||
          !FormAccF.accountNumber ||
          !FormAccF.ifsc)) === true && EditPencilState===true
    ) {
       accountPostProcessBar();
      PutEmployee();
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
    <section className="mt-[85px] pl-12 md:pl-0">
      {/* <div className=" mt-2 flex justify-center items-center">
        <FontAwesomeIcon className="text-2xl " icon={faLandmark} />
      </div> */}
      <h2 className="px-5 mt-[62px] text-lg">Bank Details</h2>
      
      <Form layout="vertical" form={form} className=" mt-3 px-5">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-x-5">
        {/* bankname */}
        <Form.Item label="Bank Name" style={{ marginBottom: 0, marginTop: 10 }}>
          <Input
            // style={{ float: "right", width: widthSize }}
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
            // style={{ float: "right", width: widthSize }}
            placeholder="branch name"
            name="branchName"
            value={FormAccF.branchName}
            onChange={accountInputOnchange}
          />
        </Form.Item>
        {/* BankLocation */}
        <Form.Item label="Location" style={{ marginBottom: 0, marginTop: 10 }}>
          <Input
            // style={{ float: "right", width: widthSize }}
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
            // style={{ float: "right", width: widthSize }}
            placeholder="account no"
            name="accountNumber"
            value={FormAccF.accountNumber}
            onChange={accountInputOnchange}
          />
        </Form.Item>

        {/* Ifsc */}
        <Form.Item label="IFSC" style={{ marginBottom: 10, marginTop: 10 }}>
          <Input
            // style={{ float: "right", width: widthSize }}
            placeholder="ifsc"
            name="ifsc"
            value={FormAccF.ifsc}
            onChange={accountInputOnchange}
          />
        </Form.Item>

         {/* Ifsc */}
         <Form.Item className="invisible" label="IFSC" style={{ marginBottom: 10, marginTop: 10 }}>
          <Input
            // style={{ float: "right", width: widthSize }}
            placeholder="ifsc"
            name="ifsc"
            value={FormAccF.ifsc}
            onChange={accountInputOnchange}
          />
        </Form.Item>
         {/* Ifsc */}
         <Form.Item className="invisible" label="IFSC" style={{ marginBottom: 10, marginTop: 10 }}>
          <Input
            // style={{ float: "right", width: widthSize }}
            placeholder="ifsc"
            name="ifsc"
            value={FormAccF.ifsc}
            onChange={accountInputOnchange}
          />
        </Form.Item>
         {/* Ifsc */}
         <Form.Item className="invisible pt-[52px]" label="IFSC" style={{ marginBottom: 10, marginTop: 10 }}>
          <Input
            // style={{ float: "right", width: widthSize }}
            placeholder="ifsc"
            name="ifsc"
            value={FormAccF.ifsc}
            onChange={accountInputOnchange}
          />
        </Form.Item>
     
        
        
       
        </div>
      </Form>
    </section>
  );
});

export default AccountForm;
