import { React, useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { CheckAuthentication, GetLogin } from "./redux/slices/loginSlice";
import bcrpt from "bcryptjs";
import ForgetPages from "./components/ForgetPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faInstagram } from "@fortawesome/free-brands-svg-icons";
import loginBgImg from "./Assets/login-bg-img.png";
import { getEmployees } from "./redux/slices/employeeSlice";
import OtpPage from "./components/OtpPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import Accessories from "./pages/Accessories";
import User from "./userpages/User";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import SlideOne from './Assets/slider/slide-1.png';
import SlideTwo from './Assets/slider/slide-2.png';
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
  const { employee } = useSelector((state) => state.employee);

  //decrption method
  const onFinish = async (value) => {
    const CheckUsername = await login.filter(
      (data) => data.userName === value.userName
    );
    const EmpId =
      (await CheckUsername) && CheckUsername.length > 0
        ? CheckUsername[0].employeeId
        : "";
    const storedHashedPassword =
      (await CheckUsername) && CheckUsername.length > 0
        ? CheckUsername[0].password
        : "";
    const isPasswordValid = await bcrpt.compareSync(
      value.password,
      storedHashedPassword
    );
    setEmployeeId(EmpId);
    const filterEmployee = await employee.filter(
      (emp) =>
        emp.id === EmpId &&
        emp.isDeleted === false &&
        emp.roleDetails[0].roleName === "Admin"
    );

   
    const admin = filterEmployee.length > 0 ? true : false;
    
    if (isPasswordValid === true && admin === true) {
      message.success("Login Admin page successfully");
      setUserLogin(true);
    } else if (isPasswordValid === true && admin === false) {
      message.success("Login Employee page successfully");
      setUserLogin(false);
    } else {
      message.error("Incorrect password or Username");
    }
    
  };

  //error not enter the value
  const onFinishFailed = () => {};
  //Elcin525
  //Herman
  //hava saes oxpa iphm
  useEffect(() => {
    dispatch(GetLogin());
    dispatch(getEmployees());
  }, []);
  const [currentSection, setCurrentSection] = useState(1);

  const goToNextSection = () => {
    if (currentSection < 3) {
      setCurrentSection(currentSection + 1);
    }
  };

  const goToPreviousSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

 const [UserLogin,setUserLogin] = useState(null);
const [EmployeeId,setEmployeeId] = useState(null);
  return (
    UserLogin === null ? 
  <div className="login-bg">
    <div className="w-full h-screen flex justify-center items-center">
    
    <section className="grid grid-cols-1 lg:grid-cols-2 items-center bg-white rounded-lg py-10 w-[70%]">
      
     
      <div className=" justify-self-center">
      
        <h2 className="text-3xl lg:text-5xl font-black text-center ">
          Qosteq
        </h2>
        <h3 className="text-2xl font-bold text-center mt-3">Payroll</h3>
        <h3 className="text-xl font-black text-center mt-3">Login</h3>
        
        {currentSection === 1 && (
          <Form
            name="basic"
            className="mt-5"
            // labelCol={{
            //   span: 8,
            // }}
            // wrapperCol={{
            //   span: 16,
            // }}
            // style={{
            //   maxWidth: 600,
            // }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item className="mb-2"
              // label="Username"
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

            <Form.Item className="mb-2"
              // label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item className="mb-2">
              <Button
                onClick={() => goToNextSection ()}
                type="link"
                className="text-[12px] sm:text-blue-500 p-0"
              >
                Forget Password?
              </Button>
            </Form.Item>

            <Form.Item className="mb-2">
              <Button
                className="bg-blue-500 w-full"
                type="primary"
                htmlType="submit"
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        ) 
       
        }

       { currentSection === 2 && (<ForgetPages currentSection={currentSection} goToPreviousSection={goToPreviousSection} goToNextSection={goToNextSection} key={2} />)}

        <span className=" w-full flex justify-center items-center mt-10">
          <hr className="w-[70%]"></hr>
        </span>
        <span className="text-xs text-gray-500 text-center block mt-5">
          Contact Us
        </span>

        {/* social-media */}
        <ul className="flex items-center justify-center gap-x-10 mt-5">
          <li>
            <FontAwesomeIcon icon={faFacebookF} />
          </li>
          <li>
            <FontAwesomeIcon icon={faInstagram} />
          </li>
          <li>
            <FontAwesomeIcon icon={faEnvelope} />
          </li>
        </ul>
    
      </div>

<div className=" hidden lg:block ">
<span className="w-full">
<Swiper
 
 
  loop={true}
  autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
       
        modules={[Autoplay, Pagination, Navigation]}
      spaceBetween={50}
      slidesPerView={1}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
      <SwiperSlide><img  className="p-10" src={SlideOne}/></SwiperSlide>
      <SwiperSlide><img className="p-10" src={SlideTwo}/></SwiperSlide>
      {/* <SwiperSlide>Slide 3</SwiperSlide>
      <SwiperSlide>Slide 4</SwiperSlide> */}
    </Swiper>
</span>
</div>
    </section>

    {/* <div
      className="-z-20 sm:z-0 w-[5%] sm:w-[30%] lg:w-[60%] h-[90%] bg-blue-500 absolute top-[50%] -translate-y-1/2"
      style={{ borderRadius: "0 500px 500px 0" }}
    ></div>
    <img
      className=" w-[40%] bottom-0 sm:w-[20%] lg:w-[40%] absolute sm:top-[50%] sm:-translate-y-1/2"
      src={loginBgImg}
    ></img> */}
    </div>
 </div> 
  : UserLogin === true ? <Accessories Id ={EmployeeId} Employees ={employee}/> : <User Id ={EmployeeId}/>
  );
};
export default Loginpage;

// Loginpage
