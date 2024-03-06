import React from 'react';
import { Col, Row } from 'antd';
import { Descriptions } from 'antd';

const Bank = ({Id,account}) => {
  const AccountData = account.map((acc,i) => [
    {
      key: i+1,
      label: 'Account Holder Name',
      children: acc.employeeFirstName + " " + acc.employeeLastName,
    },
    {
      key: i+2,
      label: 'Account Number',
      children: acc.accountNumber === null ? "-" : acc.accountNumber,
    },
    {
      key: i+3,
      label: 'Bank Name',
      children: acc.bankName === null ? "-" : acc.bankName,
    },
    {
      key: i+4,
      label: 'Branch',
      children: acc.branchName === null ? "-" : acc.branchName,
    },
    {
      key: i+5,
      label: 'IFSC Code',
      children:acc.ifsc === null ? "-" : acc.ifsc,
    },
    {
      key: i+6,
      label: 'Bank Location',
      children:acc.bankLocation === null ? "-" : acc.bankLocation,
    }
  ]);
//   console.log(AccountData[0]);
// console.log(account);
  return (
    <div>
      <Row>
        <Col span={24}><Descriptions
          title="Account Details"
          bordered
          layout='vertical'
          items={AccountData[0]}
        /></Col>
      </Row>
    </div>
  );
};

export default Bank;