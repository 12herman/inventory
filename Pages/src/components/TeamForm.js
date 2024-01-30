import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { Form, Input, Select, Switch, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { getEmployees } from '../redux/slices/employeeSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import { postRoleDetail } from '../redux/slices/roleDetailsSlice';
import { postleaderemployee } from '../redux/slices/leaderEmployeeSlice';

const filedWidth = "760px";


const TeamForm = forwardRef((props, ref) => {
  const { newempid,teamPostProcessBar } = props
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const { employee } = useSelector(state => state.employee);

  useEffect(() => {
    dispatch(getEmployees());
  }, []);

  //employee filter
  const employeeFalseFilter = employee.filter(em => em.isDeleted === false);
  //employee name
  const newEmpNameFilter = employeeFalseFilter.filter(emp => emp.id === newempid);

  // employee data
  const empOptions = employeeFalseFilter.map(emp => ({
    value: emp.id,
    label: `${emp.firstName} ${emp.lastName}`
  }));
  const empName = newEmpNameFilter && newEmpNameFilter[0] ? newEmpNameFilter[0].firstName + " " + newEmpNameFilter[0].lastName : '';
  //var empName;
  // employees role data
  const employeeRoleData = employeeFalseFilter.filter(emp => emp.roleDetails && emp.roleDetails.length > 0);
  //leader data
  const leaderData = employeeRoleData.filter(leader => leader.roleDetails && leader.roleDetails[0].roleId === 71);
  const leaderOption = leaderData.map(le => ({
    value: le.id,
    label: le.firstName + " " + le.lastName
  }));

  //hr data
  const hrData = employeeRoleData.filter(leader => leader.roleDetails && leader.roleDetails[0].roleId === 70);
  const hrOption = hrData.map(hr => ({
    value: hr.id,
    label: hr.firstName + " " + hr.lastName
  }));

  const [EnableEmp, setEnableEmp] = useState(false);
  //enable all emp
  const enableAllemp = () => {
    setEnableEmp(!EnableEmp);
    setLeaderEmp({
      employeeId: newempid,
      leaderId: null,
      hrManagerId: null
    });
  };

  useEffect(() => {
    if (form) {
      form.resetFields();
    }
  }, [EnableEmp]);


  //leader employee filed value
  const [leadeEmp, setLeaderEmp] = useState({
    employeeId: newempid,
    leaderId: null,
    hrManagerId: null
  });
  const leaderIdOnchange = (id) => {
    setLeaderEmp(pre => ({ ...pre, leaderId: id }));
  };
  const hridOnchange = (id) => {
    setLeaderEmp(pre => ({ ...pre, hrManagerId: id }));
  };


  // post leader employee details
  const teamValidateData = async () => {
    if (leadeEmp.hrManagerId === null
      || leadeEmp.leaderId ===null
      || leadeEmp.employeeId === null) {
      message.error("Fill all the fields");
    } else {
      await dispatch(postleaderemployee(leadeEmp));
      await teamPostProcessBar();
    }
  };

  useImperativeHandle(ref, () => {
    return {
      teamValidateData: teamValidateData,
    }
  });

  return (
    <section >
      <div className='mt-5 flex justify-center items-center'><FontAwesomeIcon className='text-2xl ' icon={faPeopleGroup} /></div>

      <Form form={form} className='h-[60.9vh] mt-5'>

        <Form.Item style={{ marginBottom: 0, marginTop: 10, }} className='px-7' label="Employee Name">
          <h2 className={`px-5 w-[${filedWidth}]`}>{empName}</h2>
        </Form.Item >

        <Form.Item style={{ marginBottom: 0, marginTop: 10, }} className='px-7' label="All employee List">
          <Switch className={`mx-5 w-[${filedWidth}]`} size="small" checked={EnableEmp} style={{ background: `${EnableEmp === false ? "rgba(0, 0, 0, 0.45)" : "#4096ff"}` }} trackBgDisabled onClick={enableAllemp} onChange={enableAllemp} />
        </Form.Item>

        <Form.Item name="leader" style={{ marginBottom: 0, marginTop: 10, }} className='px-7' label="Leader">
          <Select
            name="leaderId"
            onChange={leaderIdOnchange}
            showSearch
            placeholder="select Leader"
            style={{ float: "right", width: filedWidth }}
            options={EnableEmp === false ? leaderOption : empOptions}
            value={leadeEmp.leaderId} />

        </Form.Item>

        <Form.Item name="hr" style={{ marginBottom: 0, marginTop: 15, }} className='px-7' label="HR Manager">
          <Select
            name="hrManagerId"
            onChange={hridOnchange}
            showSearch
            placeholder="select HR"
            style={{ float: "right", width: filedWidth }}
            options={EnableEmp === false ? hrOption : empOptions}
            value={leadeEmp.hrManagerId} />

        </Form.Item>
      </Form>

    </section>
  )
});

export default TeamForm