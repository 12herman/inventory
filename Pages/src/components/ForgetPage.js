import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { GetLogin } from "../redux/slices/loginSlice";
import { getEmployees } from "../redux/slices/employeeSlice";
import ResetPasswordPage from "./ResetPasswordPage";
import OtpPage from "./OtpPage";
import { PostOtp } from "../redux/slices/otpApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faLeftLong } from "@fortawesome/free-solid-svg-icons";
import Loginpage from "../Loginpage";
// import nodemailer from "nodemailer";
// import { google } from "googleapis";

const ForgetPage = ({goToPreviousSection,goToNextSection,currentSection}) => {
  
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
      goToNextSection2();
      // LoginPage()
      //setBackToLogin(pre => ({...pre,Login:true}));
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
  


  
  useEffect(() => {
    dispatch(GetLogin());
    dispatch(getEmployees());
  }, []);

  
  const [currentSection2,setCurrentSection2] = useState(currentSection);

  const goToNextSection2 = () => {
    if (currentSection2 < 3) {
      setCurrentSection2(currentSection2 + 1);
    }
  };
  const goToPreviousSection2 = () => {
    if (currentSection2 > 1) {
      setCurrentSection2(currentSection2 - 1);
    }
  };
   return (
    <>
    
      
      { currentSection2 === 2 &&
      <>
        <Button onClick={()=>goToPreviousSection()} type="link"><FontAwesomeIcon  icon={faArrowLeft}/></Button>
        <Form
      className="mt-5"
        layout="vertical"
        name="basic"
        
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          name="userName"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input placeholder="User Name" />
        </Form.Item>
        <Form.Item
        >
          <Button className="bg-blue-500 w-full" type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form> 
      </>
      }

      {currentSection2 === 3 && <>
        <Button onClick={()=>goToPreviousSection2()} type="link"><FontAwesomeIcon  icon={faArrowLeft}/></Button>
       <OtpPage currentSection2={currentSection2} UserNamePass={UserNamePass}  CheckAccount={CheckAccount} /></>}

    </>
  );
};
export default ForgetPage;
