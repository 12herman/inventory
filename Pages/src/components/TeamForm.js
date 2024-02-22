import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Form, Select, Switch, message,Row,Col,Tag, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";


const filedWidth = "100%";
const TeamForm = forwardRef((props, ref) => {
  //props data
  const {
    EmpApi, //employee api
    TeamFData, //input value
    UpdatedTeamFData, //previous value
    teamPostProcessBar, //next process fn
    EmployeeInput, //name
  } = props;

  // employee name
  const EmployeeName = EmployeeInput.firstName + " " + EmployeeInput.lastName;

  // previous datas
  const getEmployeeName = (employeeId) => {
    if (typeof employeeId === "number") {
      const employee = EmpApi.find((emp) => emp.id === employeeId);
      return employee ? `${employee.firstName} ${employee.lastName}` : null;
    } else {
      return null;
    }
  };
  let hrname = getEmployeeName(TeamFData.hrManagerId);
  let leadername = getEmployeeName(TeamFData.leaderId);

  // all employee data
  const empOptions = Array.isArray(EmpApi)
    ? EmpApi.map((emp) => ({
        value: emp.id,
        label: `${emp.firstName} ${emp.lastName}`,
      }))
    : [];
  const [EnableEmp, setEnableEmp] = useState(false);
  //enable all emp
  const enableAllemp = () => {
    setEnableEmp(!EnableEmp);
  };

  //leader id
  const leaderData = Array.isArray(EmpApi)
    ? EmpApi.filter(
        (leader) => leader.roleDetails && leader.roleDetails[0].roleId === 71 && leader.isDeleted === false
      )
    : [];
  const leaderOption = leaderData.map((le) => ({
    value: le.id,
    label: le.firstName + " " + le.lastName,
  }));

  //hr id
  const hrData = Array.isArray(EmpApi)
    ? EmpApi.filter(
        (leader) => leader.roleDetails && leader.roleDetails[0].roleId === 70 && leader.isDeleted === false
      )
    : [];
  const hrOption = hrData.map((hr) => ({
    value: hr.id,
    label: hr.firstName + " " + hr.lastName,
  }));

  //select the updated value
  const leaderIdOnchange = (id, data) => {
    UpdatedTeamFData({ leaderId: id });
  };
  const hridOnchange = (id) => {
    UpdatedTeamFData({ hrManagerId: id });
  };

  // validation
  const teamValidateData =  () => {
  
    if (TeamFData.hrManagerId === null
      || TeamFData.leaderId ===null 
      ||TeamFData.hrManagerId === ""
      || TeamFData.leaderId ==="" ) {
      message.error("Fill all the fields");
    } else {
       teamPostProcessBar();
    }
    //teamPostProcessBar();
  };

  //send the fn child to parent method
  useImperativeHandle(ref, () => {
    return {
      teamValidateData: teamValidateData,
    };
  });

  return (
    <section className="h-[59.9vh] relative">
      <div className="mt-2 flex justify-center items-center">
        <FontAwesomeIcon className="text-2xl " icon={faPeopleGroup} />
      </div>

      <Form className=" mt-5 " layout="vertical">
        <span className="flex mb-2 justify-center items-center">
        <h2 className="px-7 text-2xl"><Tag color="blue">{EmployeeName}</Tag></h2>
        {/* <Form.Item
          style={{ marginBottom: 0, marginTop: 10 }}
           className="px-7"
          label="Employee Name"
        >
          <h2 >{EmployeeName}</h2>
        </Form.Item> */}
        </span>
        {/* <Form.Item style={{ marginBottom: 0, marginTop: 10, }} className='px-7' label="All employee List">
          <Switch className={`mx-5 w-[${filedWidth}]`} size="small" checked={EnableEmp} style={{ background: `${EnableEmp === false ? "rgba(0, 0, 0, 0.45)" : "#4096ff"}` }} trackBgDisabled onClick={enableAllemp} onChange={enableAllemp} />
        </Form.Item> */}
        <Row>
        <Col span={12}>
        <Form.Item
          name="leader"
          style={{ marginBottom: 0, marginTop: 10 }}
          className="px-7"
          label="Leader"
        >
          <Select
            name="leaderId"
            onChange={leaderIdOnchange}
            showSearch
            placeholder="select Leader"
            // style={{ float: "right", width: filedWidth }}
            options={EnableEmp === false ? leaderOption : empOptions}
            value={TeamFData.leaderId}
            defaultValue={leadername}
          />
        </Form.Item>
        </Col>

        <Col span={12}>
        <Form.Item
          name="hr"
          style={{ marginBottom: 0, marginTop: 15 }}
          className="px-7"
          label="HR Manager"
        >
          <Select
            name="hrManagerId"
            onChange={hridOnchange}
            showSearch
            placeholder="select HR"
            // style={{ float: "right", width: filedWidth }}
            options={EnableEmp === false ? hrOption : empOptions}
            defaultValue={hrname}
          />
        </Form.Item>
        </Col>
        </Row>
        
      </Form>
      
    </section>
  );
});

export default TeamForm;
