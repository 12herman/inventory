import React, { useEffect, useState } from "react";
import { Form, Input, Button, Col, Row, Tag, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
// import { PostEmailtApi } from "../redux/slices/otpApiSlice";
import ResetPasswordPage from "./ResetPasswordPage";
import { PostOtp } from "../redux/slices/otpApiSlice";
import { GetLogin } from "../redux/slices/loginSlice";
import CryptoJS from "crypto-js";

export default function OtpPage({ CheckAccount, UserNamePass,currentSection2, }) {
  // radom generator
  function generateRandomPassword() {
    const charset = "123456789";
    let random = "";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      random += charset.charAt(randomIndex);
    }
    return random;
  }

  const dispatch = useDispatch();
  const { login } = useSelector((state) => state.login);
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    dispatch(GetLogin());
    let intervalId;

    if (isRunning) {
      intervalId = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount < 30) {
            return prevCount + 1;
          } else {
            clearInterval(intervalId);
            setIsRunning(false);
            setOtpReset((pre) => ({ ...pre, disablebtn: false, radom: null }));
            return 0;
          }
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isRunning]);

  const handleButtonClick = () => {
    if (!isRunning) {
      setCount(0);
      setIsRunning(true);
    }
  };

  const [OtpReset, setOtpReset] = useState({
    disablebtn: false,
    radom: null,
    passwordpage: false,
  });

  const [LoginId,setLoginId] = useState(undefined);

  const key = CryptoJS.enc.Utf8.parse("1123453454543454");
  const iv = CryptoJS.enc.Utf8.parse("1123453454543454");

  async function decryptString(encryptedText, key) {
    const bytes = CryptoJS.AES.decrypt(encryptedText, key, { iv: iv });
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedText;
  }


  // submit btn go to new password pages
  const onFinish = async (e) => {
    const LoginFilter = login.filter((data) => data.userName === UserNamePass);
    const HassOTP = LoginFilter ? LoginFilter[0].otp : undefined;
    const LoId = LoginFilter ? LoginFilter[0].id : undefined;
  
    const DecryptOTP = await decryptString(HassOTP, key);
    if (e.otp === DecryptOTP) {
     await setOtpReset((pre) => ({ ...pre, passwordpage: true }));
     await setLoginId(LoId);
    //  goToNextSection()
    goToNextSection3();
    } else {
      message.error("OTP is Wrong");
    }
  };

  const onFinishFailed = () => {};

  //send btn
  const ResetOTP = async () => {
    handleButtonClick();
    setOtpReset((pre) => ({ ...pre, disablebtn: true }));
    await dispatch(PostOtp({ userName: UserNamePass }));
    await dispatch(GetLogin());
  };

  const [currentSection3,setCurrentSection3]= useState(currentSection2);

  const goToNextSection3 = () => {
    if (currentSection3 < 4) {
      setCurrentSection3(currentSection3 + 1);
    }
  };
  const goToPreviousSection3 = () => {
    if (currentSection3 > 1) {
      setCurrentSection3(currentSection3 - 1);
    }
  };

  return (
    <>

      {currentSection3 === 3 && (
        <div>
          <h2 className="mt-5 text-center text-gray-600 text-xs">
            click the send button get the opt{" "}
            <Tag
              color="blue"
              className={count === 0 ? "hidden" : "inline-block w-fit"}
            >
              {count === 0 ? "" : count < 10 ? `0${count}` : `${count}`}
            </Tag>
          </h2>
          <section>
            <Form
              //layout="vertical"
              name="basic"
              // labelCol={{
              //   span: 8,
              // }}
              // wrapperCol={{
              //   span: 16,
              // }}
              className=" mt-5 flex flex-col justify-center items-center"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                
                name="otp"
                rules={[
                  {
                    required: true,
                    message: "Please input your otp!",
                  },
                ]}
              >
                <Input className="w-full" placeholder="Enter the OTP" />
              </Form.Item>

              <Row >
                <Col>
                  <Form.Item
                    // wrapperCol={{
                    //   offset: 8,
                    //   span: 16,
                    // }}
                  >
                    <Button
                      onClick={ResetOTP}
                      disabled={OtpReset.disablebtn}
                      className=" mr-1"
                      type="dashed"
                    >
                      {OtpReset.disablebtn === false ? "Send" : "Resend"}
                    </Button>
                  </Form.Item>
                </Col>

                <Col>
                  <Form.Item
                    // wrapperCol={{
                    //   offset: 8,
                    //   span: 16,
                    // }}
                  >
                    <Button
                      className="bg-blue-500"
                      type="primary"
                      htmlType="submit"
                    >
                      Submit
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </section>
        </div>
      )  
        
      }

      {currentSection3 === 4 && 
                <>

                <ResetPasswordPage LoginId={LoginId} data={CheckAccount} />

                </>}
                
    </>
  );
}
