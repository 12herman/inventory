import React from 'react';
import { Descriptions,Row,Col } from 'antd';



const System = ({products,Id}) => {
 
  const ProductsFilter = products.length > 0 ? products.filter(pro => pro.employeeId === Id && pro.isRepair === false && pro.isStorage === true && pro.isDeleted ===false) : null;

const items= ProductsFilter === null 
? [] : ProductsFilter.map(data => ({
  key: data.id,
  label: data.accessoryName,
  children: <ul className='flex flex-col gap-y-1'>
<li>Name: &nbsp; { data.productName}</li>
  <li>Model Number :&nbsp; { data.modelNumber} </li>
  <li>Serial Number:&nbsp;{ data.serialNumber}</li>
  </ul>
}));


  return (
    <div>
    {
      items === null? "Hi" :
      <Row>
        <Col span={24}><Descriptions
          title="Accessories"
          bordered
          layout='vertical'
          items={items}
        /></Col>
      </Row>
    }
    
    </div>
  );
};

export default System;