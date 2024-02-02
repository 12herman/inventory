import React, { useState, useEffect } from "react";
import { Result, Button,Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useDispatch } from "react-redux";
import { getEmployees } from "../redux/slices/employeeSlice";

export default function FinishForm({ newempid, modelclose
  ,EmployeeInput,
  RoleValue,
  postteamData,
  postCureenetAddData,
  postPermenantAddData,
  postAccount,
}) {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const FinishBtn = () => {
    modelclose();
    dispatch(getEmployees());
  };
console.log(EmployeeInput);
console.log(RoleValue);
console.log(postteamData);
console.log(postCureenetAddData);
console.log(postPermenantAddData);
console.log(postAccount);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer); // Clear the timer on component unmount
  }, []);

  return (
    <div className="h-[70.022vh] flex justify-center items-center">

    {loading === true 
          ?  <Spin indicator={<LoadingOutlined style={{ fontSize: 24}} spin/> }/> 
          : <Result
            status="success"
            title="Employee is created successfully."
            subTitle={
              <span>
                <p className="text-center">
                  New employee is created successfully.
                </p>
                <p className="text-center">Employee Id: {newempid}</p>
              </span>
            }
            extra={[
              <Button key="buy" onClick={FinishBtn}>
                Finish
              </Button>,
            ]}
          />}
         
         
        </div>
  );
}
