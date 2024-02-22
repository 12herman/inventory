import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { GetLogin } from "../redux/slices/loginSlice";
import { getEmployees } from "../redux/slices/employeeSlice";
import ResetPasswordPage from "./ResetPasswordPage";
import OtpPage from "./OtpPage";
import { PostOtp } from "../redux/slices/otpApiSlice";
// import nodemailer from "nodemailer";
// import { google } from "googleapis";

const ForgetPage = () => {
  
  //Dispath method
  const dispatch = useDispatch();
  const { login } = useSelector((state) => state.login);
  const {employee} = useSelector(state => state.employee)
  const[CheckAccount,setCheckAccount] = useState({id:null,email:null});
  const [UserNamePass,setUserNamePass] = useState(undefined);



  const onFinish = async (value) => {
    //id
    const id = login.filter((data) => data.userName === value.userName);
    const Logindatas = id.length >= 0 ? id[0]: undefined;
    //user_name
    const UserName = Logindatas === undefined ? undefined : Logindatas.userName;

    if(UserName === undefined || UserName === null){
      message.error("user name is wrong");
    }
    else{
      setUserNamePass(UserName);
      setRestPage(true);
    };
    // const EmpId = Logindatas === undefined ? undefined : Logindatas.employeeId;
    // //user_email
    // const EmpData = Logindatas === undefined ? undefined :await employee.filter(data=>  data.id === EmpId); 
    // const UserOfficeEmail = EmpData === undefined ? undefined : EmpData[0].officeEmail;
    // const UserPersonalEmail = EmpData === undefined ? undefined : EmpData[0].personalEmail;
    // //change to password reset pagges
    // if(UserOfficeEmail===  value.userEmail &&  UserName === value.userName|| 
    //   UserPersonalEmail === value.userEmail &&  UserName === value.userName
    //   ){
    //     await setCheckAccount({id:EmpId,email:await UserOfficeEmail === undefined ||  UserOfficeEmail === null ? UserPersonalEmail : UserOfficeEmail,});
    //     setRestPage(true);
    //   }
    //   else{
    //     console.log("Wrong username or password");
    //   }

    // try{
    // await setLoading(true);
    // const otp =  await dispatch(PostOtp(value));
    //  if(otp.error)
    //  {
    //   await setLoading(false);
      
    //  }
    //  else{
    //   await setLoading(false);
      
    //  };
    // }
    // catch(err){console.log(err);}
    
  };
  const onFinishFailed = () => {};
  
  const [RestPage,setRestPage] = useState(false);

  
  
  useEffect(() => {
    dispatch(GetLogin());
    dispatch(getEmployees());
  }, []);

 
   return (
    <>
      {RestPage === false ?  <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="userName"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* <Form.Item
          label="Useremail"
          name="userEmail"
          rules={[
            {
              required: true,
              message: "Please input your useremail!",
            },
          ]}
        >
          <Input />
        </Form.Item> */}

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button className="bg-blue-500" type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form> 
      :<OtpPage UserNamePass={UserNamePass}  CheckAccount={CheckAccount} />
      }

    </>
  );
};
export default ForgetPage;
