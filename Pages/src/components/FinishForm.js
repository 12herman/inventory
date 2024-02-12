import React, { useState, useEffect,} from "react";
import { Result, Button,Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useDispatch } from "react-redux";
import '../css/finishform.css'
import { postEmployees } from "../redux/slices/employeeSlice";
import { postRoleDetail } from "../redux/slices/roleDetailsSlice";
import { postAddress } from "../redux/slices/addressSlice";
import { postaccount } from "../redux/slices/accountdetailsSlice";
import { postleaderemployee } from "../redux/slices/leaderEmployeeSlice";


const FinishForm =({EmployeeData,RoleData,TeamData,CAddData,PAddData,AccountData,modelclose,newempid,loadings,EditPencilState})=>{

  // const dispatch = useDispatch();
  // const [loading, setLoading] = useState(true);
  // const [EmpId,setEmpId] = useState('');

  const FinishBtn = () => {
    modelclose();
  };

// const newEmployee=  async ()=>{
//   const employeeDatas = await dispatch(postEmployees(EmployeeData));
//   if (employeeDatas && employeeDatas.payload.id) {
//     setEmpId(employeeDatas.payload.id);
//     console.log({ employeeId: employeeDatas.payload.id});
//     //role creation
//     await dispatch(postRoleDetail({employeeId: employeeDatas.payload.id,...RoleData}));
//     //leaderemployee creation
//     await dispatch(postleaderemployee({employeeId:employeeDatas.payload.id,...TeamData}));
//     // address creation
//     await dispatch(postAddress({employeeId:employeeDatas.payload.id,...CAddData}));
//     await dispatch(postAddress({employeeId:employeeDatas.payload.id,...PAddData}));
//     //account creation
//     await dispatch(postaccount({employeeId:employeeDatas.payload.id,...AccountData}));
//     await setLoading(false);
//     };
// }


//   useEffect(() => {
    
//   }, []);

  return (
    <div className="h-[70.022vh] flex justify-center items-center">

    {loadings === true 
          ?  <Spin indicator={<LoadingOutlined style={{ fontSize: 24}} spin/> }/> 
          : <Result
            status="success"
            title={EditPencilState === false ? "Employee is created successfully.": "Employee Updated successfully."}  
            subTitle={
              <span>
                <p className="text-center">
                {EditPencilState === false ? "New employee is created successfully.": "Employee Updated successfully."}  
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
};

export default FinishForm;
