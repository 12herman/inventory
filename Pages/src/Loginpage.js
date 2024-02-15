import { React, useEffect, useState } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { CheckAuthentication, GetLogin } from "./redux/slices/loginSlice";
import bcrpt from "bcryptjs";
// import { decrypt,compare, encrypt } from "n-krypta";



const Loginpage = () => {
  const dispatch = useDispatch();
  const { login } = useSelector((state) => state.login);

// const onFinish =(value)=>{
//   const CheckUsername  = login.filter(data => data.userName === value.userName);
//   const storedHashedPassword = CheckUsername && CheckUsername.length >=0 ? CheckUsername[0].password : "";
//   const isPasswordValid = bcrpt.compareSync(value.password, storedHashedPassword);
//   isPasswordValid ? console.log("Correct password"): console.log("");
// };

const onFinish = (value) => {
  const CheckUsername = login.filter((data) => data.userName === value.userName);
  const storedHashedPassword = CheckUsername && CheckUsername.length > 0 ? CheckUsername[0].password : "";

  // Hash the entered password for comparison
  // const enteredHashedPassword = bcrpt.hashSync(value.password, 10);
  // const isPasswordValid = bcrpt.compareSync(enteredHashedPassword, storedHashedPassword);
  const isPasswordValid = bcrpt.compareSync(value.password, storedHashedPassword);

  if (isPasswordValid === true) {
    console.log("Correct password");
  } else {  
    console.log("Incorrect password");
  }
};



// Her374
// ALF=
const onFinishFailed =()=>{

};

useEffect(()=>{
  dispatch(GetLogin());
},[]);
  // //login values
  // const onFinish = (values) => {
  //   const userName = values.userName;
  //   const HashedPassword = bcrpt.hashSync(values.password, 10);

  //   window.localStorage.setItem(
  //     "login",
  //     JSON.stringify({ userName, HashedPassword })
  //   );
  // };

  // //login not correct values
  // const onFinishFailed = (errorInfo) => {
  //   console.log("Failed:", errorInfo);
  //   generateRandomUsername("Herman","Joseph");
  // };
  // useEffect(() => {
  //   dispatch(GetLogin());
  // }, []);
  
  // //password readom genorator human readable
  // function generateRandomPassword() {
  //   const charset ="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
  //   let password = "";
  //   for (let i = 0; i < 8; i++) {
  //     const randomIndex = Math.floor(Math.random() * charset.length);
  //     password += charset.charAt(randomIndex);
  //   };
  //   const HashedPassword = bcrpt.hashSync(password, 10); 
  //   return {password,HashedPassword}
  // }
  // // check same value
  // async function generateRandomUsername (firstName, lastName)
  // {
  //   const randomNumbers = Math.floor(10000 + Math.random() * 90000);
  //   const username = await `${firstName}${randomNumbers}`;
  //   const {password,HashedPassword} = generateRandomPassword();

  //   const userNameFl = await login.filter(user => user.userName === username);
  //   const sameName = await userNameFl && userNameFl[0] ? userNameFl[0].userName : '';

  //   if(sameName === username){
  //       generateRandomUsername(firstName, lastName);
  //       console.log("2ed loop");  
  //   }
  //   else{
  //       console.log(sameName);
  //       console.log(username);
  //       console.log(password);
  //       console.log(HashedPassword);
  //   }
  // };

  return (
    <Form
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
        <Button className="bg-blue-500" type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
export default Loginpage;

// Loginpage
