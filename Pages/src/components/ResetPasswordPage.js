import React, { useEffect, useState } from "react";
import { Form, Input, Button, Space, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { GetLogin, PutLogin } from "../redux/slices/loginSlice";
import bcrpt from "bcryptjs";
import { LockOutlined } from '@ant-design/icons'; 

export default function ResetPasswordPage({ data ,LoginId}) {

  const [form] = Form.useForm();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [PasswordData, setPasswordData] = useState({
    newpassword: null,
    confirmpassword: null,
  });
  const [FillPass,setFillPass] = useState('');
  const dispatch = useDispatch();
  const { login } = useSelector((state) => state.login);

  


  useEffect(() => {
    dispatch(GetLogin());
  }, []);

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 19);

  const dataFilter= async (id,pass) =>{
    
    const filterIds = await login.filter((emp) => emp.id === id);
    
    const Data = await filterIds.map((x) => ({
      id: x.id,
      employeeId: x.employeeId,
      userName: x.userName,
      password: pass,
      isDeleted: false,
      createdDate: x.createdDate,
      createdBy: x.createdBy,
      modifiedDate: formattedDate,
      modifiedBy: x.modifiedBy,
    }));

    const FinalData = Data ? Data[0]:'';
   await dispatch(PutLogin(FinalData));
  };

  


//rest btn
  const onFinish = async (values) => {
    const password = values.confirmPassword;
    const HashedPassword = bcrpt.hashSync(password, 10);
    await dataFilter(LoginId,HashedPassword);
    console.log(HashedPassword);
    form.resetFields();
  };

  return (
    <>
      

      <Form
      form={form}
      name="passwordForm"
      onFinish={onFinish}
      initialValues={{ remember: true }}
      layout="vertical"
    >
      <Form.Item
        name="newPassword"
        label="New Password"
        rules={[
          {
            required: true,
            message: 'Please input your new password!',
          },
          {
            min: 6,
            message: 'Password must be at least 6 characters long.',
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="New Password"
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="Confirm Password"
        dependencies={['newPassword']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your new password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The two passwords do not match!'));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="Confirm Password"
        />
      </Form.Item>

      <Form.Item>
        <Space direction="vertical">
          <Button type="dashed" htmlType="submit">
            Reset Password
          </Button>
        </Space>
      </Form.Item>
    </Form>
    </>
  );
}
