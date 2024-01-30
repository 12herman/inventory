import React,{useState,useEffect} from 'react';
import { Space, Table, Tag } from 'antd';
import { Button, Col, Row, Statistic,Divider } from 'antd';
import CountUp  from 'react-countup';
import {useDispatch,useSelector} from 'react-redux'
import { getEmployees } from '../redux/slices/employeeSlice';

const formatter = (value) => <CountUp end={value} />;

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Count',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Brand',
    dataIndex: 'brand',
    key: 'brand',
  },
  {
    title: 'Model',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Status',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'Repair') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Edit</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    name: 'Monitor',
    age: 25,
    brand: 'Dell',
    address: '27"',
    tags: ['Active'],
  },
  {
    key: '2',
    name: 'Keyboard',
    age: 10,
    brand: 'hp',
    address: 'Wireless',
    tags: ['Repair'],
  },
  {
    key: '3',
    name: 'Headphone',
    age: 7,
    brand: 'Lenova',
    address: 'Wired',
    tags: ['Active'],
  },
];

const Products = () => {

  const dispatch = useDispatch();
  const {employee,loading} = useSelector(state => state.employee);
  const [empData,setEmpData] = useState([]);
  useEffect(()=>{
    dispatch(getEmployees());
    // console.log(employee.length);
},[]);

useEffect(()=>{
setEmpData(employee);
},[employee]);


 //console.log(empData);

  return (
    <div>
      <Row justify='space-between' align='middle'>
      <Col><Statistic title="Product Count" value={42} formatter={formatter} /></Col>
      <Col justify='flex-end' style={{right :'1%'}}><Button type="primary">Add Product</Button></Col>
      </Row>
      <Divider/>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default Products;