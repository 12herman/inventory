import { React, useEffect, useState } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { CheckAuthentication, GetLogin } from "./redux/slices/loginSlice";
import bcrpt from "bcryptjs";
import ForgetPages from "./components/ForgetPage";
// import nodemailer from 'nodemailer';
// import { decrypt,compare, encrypt } from "n-krypta";
// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'josephherman810@gmail.com',
//     pass: 'hava saes oxpa iphm'
//   }
// });


const Loginpage = () => {
  const dispatch = useDispatch();
  const { login } = useSelector((state) => state.login);


//decrption method
const onFinish = (value) => {
  const CheckUsername = login.filter((data) => data.userName === value.userName);
  const storedHashedPassword = CheckUsername && CheckUsername.length > 0 ? CheckUsername[0].password : "";
  const isPasswordValid = bcrpt.compareSync(value.password, storedHashedPassword);

  if (isPasswordValid === true) {
    console.log("Correct password");

  } else {  
    console.log("Incorrect password");
  }
};

//error not enter the value
const onFinishFailed =()=>{
  
};
//Elcin525
//q0Xg
//hava saes oxpa iphm
useEffect(()=>{
  dispatch(GetLogin());
},[]);

const [ForgetPage,setForgetPage] = useState(false);

  return (
   <>
    {ForgetPage === false ?  <Form
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

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      {/* <Form.Item
      name="remember"
      valuePropName="checked"
      wrapperCol={{
       offset: 8,
        span: 16,
      }}
    >
      <Checkbox>Remember me</Checkbox>
    </Form.Item> */}
     <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
    
    <Button onClick={()=>setForgetPage(true)} type="text" className="text-[12px] text-blue-500">Forget Password</Button>
      </Form.Item>

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
    :
     <ForgetPages key={2}/>
    }
   </>
  );
};
export default Loginpage;

// Loginpage
