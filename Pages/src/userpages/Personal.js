import React from "react";
import { Col, Row } from "antd";
import { Descriptions } from "antd";

const Personal = ({ employee, addressData }) => {
  const EmployeeDetails = employee.map((emp, i) => [
    {
      key: i + 1,
      label: "Name",
      children: emp.firstName + " " + emp.lastName,
    },
    {
      key: i + 2,
      label: "Age",
      children: calculateAge(emp.dateOfBirth),
    },
    {
      key: i + 3,
      label: "Gender",
      children: emp.gender,
    },
    {
      key: i + 4,
      label: "Office Email",
      children: emp.officeEmail,
    },
    {
      key: i + 11,
      label: "Personal Email",
      children: emp.personalEmail,
    },
    {
      key: i + 5,
      label: "Phone",
      children: emp.mobileNumber,
    },
    {
      key: i + 12,
      label: "Alternate Contact Number",
      children: emp.alternateContactNo,
    },
    {
      key: i + 13,
      label: "Alternate Contact PersonName",
      children: emp.contactPersonName,
    },
    {
      key: i + 14,
      label: "Alternate Contact Relationship",
      children: emp.relationship,
    },
    {
      key: i + 15,
      label: "Marital Status",
      children: emp.maritalStatus,
    },
    {
      key: i + 6,
      label: "Blood Group",
      children: emp.bloodGroup,
    },
    {
      key: i + 7,
      label: "Role",
      children: getPosition(emp.roleDetails), // You may need to implement this function
    },
    {
      key: i + 16,
      label: "Department",
      children: getDepartments(emp.departmentId), // You may need to implement this function
    },
    {
      key: i + 17,
      label: "Office Location",
      children: getOfficeLocation(emp.officeLocationId), // You may need to implement this function
    },
    {
      key: i + 8,
      label: "Personal Email",
      children: emp.personalEmail,
    },
    {
      key: i + 9,
      label: "Date of Birth",
      children: formatDate(emp.dateOfBirth),
    },
    {
      key: i + 10,
      label: "Date of Joining",
      children: formatDate(emp.dateOfJoin),
    },
  ]);

  function calculateAge(dateOfBirth) {
    const birthDate = new Date(dateOfBirth);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    return age;
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  function getPosition(roleDetails) {
    if (roleDetails.length > 0) {
      return roleDetails[0].roleName;
    }
    else{
      return "N/A";
    }
  }

  function getDepartments(departmentId) {
    if (departmentId ) {
      return departmentId.departmentName;
    }
    else{
      return "N/A";
    }
  }

  function getOfficeLocation(office){
    if (office ) {
      return office.officename;
    }
    else{
      return "N/A";
    }
  }
  //current address
  const CAddFilter = addressData
    .filter((a) => a.type === 1)
    .map((data, i) => [
      {
        key: i + 1,
        label: "Address",
        children: data.address1,
      },
      {
        key: i + 2,
        label: "City",
        children: data.city,
      },
      {
        key: i + 3,
        label: "Postal Code",
        children: data.postalCode,
      },
      {
        key: i + 4,
        label: "State",
        children: data.state,
      },
      {
        key: i + 5,
        label: "Country",
        children: data.country,
      },
    ]);

      //current address
  const PAddFilter = addressData
  .filter((a) => a.type === 2)
  .map((data, i) => [
    {
      key: i + 1,
      label: "Address",
      children: data.address1,
    },
    {
      key: i + 2,
      label: "City",
      children: data.city,
    },
    {
      key: i + 3,
      label: "Postal Code",
      children: data.postalCode,
    },
    {
      key: i + 4,
      label: "State",
      children: data.state,
    },
    {
      key: i + 5,
      label: "Country",
      children: data.country,
    },
  ]);

  return (
    <div>
      <Row>
        <Col span={24}>
          <Descriptions title="Details" bordered items={EmployeeDetails[0]} />
        </Col>
      </Row>

      <Row className="mt-5">
        <Col span={24}>
          <Descriptions
            title="Current Address"
             bordered
            items={CAddFilter[0]}
          />
        </Col>

        <Col span={24} className="mt-5">
          <Descriptions
            title="Permanent Address"
             bordered
            items={PAddFilter[0]}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Personal;
