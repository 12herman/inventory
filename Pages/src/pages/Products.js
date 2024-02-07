import React,{useState,useEffect} from 'react';
import { Space, Table, Tag,Modal,Form,Input, message } from 'antd';
import { Button, Col, Row, Statistic,Divider,Select } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faPen, faL } from '@fortawesome/free-solid-svg-icons';
import CountUp  from 'react-countup';
import {useDispatch,useSelector} from 'react-redux'
import { getEmployees } from '../redux/slices/employeeSlice';
import { getaccessories } from '../redux/slices/accessoriesSlice';
import { getconsoles } from '../redux/slices/consoleSlice';
import { getbrand } from '../redux/slices/brandSlice';
import { postconsoles } from '../redux/slices/consoleSlice';
import { getProducts } from '../redux/slices/productSlice';


const formatter = (value) => <CountUp end={value} />;

const columns = [
  {
title:"S.No",
dataIndex:"sno",
key:'sno'
}
  ,
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  // {
  //   title: 'Count',
  //   dataIndex: 'age',
  //   key: 'age',
  // },
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


const Products = ({officeData}) => {

  const dispatch = useDispatch();
  const {employee,loading} = useSelector(state => state.employee);

  const {accessories} = useSelector((state) => state.accessories);

  const {brand} = useSelector((state) => state.brand);

  const {consoles} = useSelector((state) => state.consoles);

  const {products} = useSelector((state) => state.products);

  const [proData,setProData] = useState([]);
  const [proCounts,setProCounts] = useState();

  // console.log("Consoles:",consoles);

  const [system,setSystem] =useState({
    productName:null,//name
    accessoriesId:null,//product type
    brandId:null,//brand
    modelNumber:'',//model
    isdeleted:false,
  });

  

  const [combinedDatas, setCombinedDatas] = useState([]);
  // console.log("Combined Datas:",combinedDatas);

  //Fetching Data from Api to Table
  const consoleData = consoles.length > 0 ? consoles.filter(cnsl => !cnsl.isdeleted) : [];
  // console.log("Consoles Data:", consoleData);
  const data = consoleData.map((consoleItem,i) => {
    const filteraccessoryItem = accessories.filter((accItem) => accItem.id === consoleItem.accessoryId);
   const filterbrandItem = brand.filter((brandItem) => brandItem.id === consoleItem.brandId);

   const accessoryItems = filteraccessoryItem.length > 0 ? filteraccessoryItem[0] : null;
   const brandItems = filterbrandItem.length > 0 ? filterbrandItem[0] : null;

    return {
      sno:i+1,
      key: consoleItem.consolesId,
      name: accessoryItems ? accessoryItems.name : '',
      brand: brandItems ? brandItems.name : '',
      address:  consoleItem.modelNo !== undefined ? consoleItem.modelNo : '',
      
    };
  });       
  
 
//Add Product Button
const addProduct = async () => {
  if(system.productName=== null || 
    system.accessoriesId === null ||
    system.brandId === null ||
    system.modelNumber === null 
  ){
    message.error("fill all the fields")
  }
  else{
    const newProduct ={
      accessoriesId: system.accessoriesId,
      brandId: system.brandId ,
      modelNumber: system.modelNumber,
      productName:system.productName
      }
      try{
        await dispatch(postconsoles(newProduct));
        await dispatch(getconsoles());
        setModalOpen(false);
        clearFields();
      }catch(error){
        console.error("Error adding product:",error)
      }
  }
};

const FilterFalseConsole = consoles.filter(data => data.isdeleted === false);

const updateTableData = () => {
  const updatedData = FilterFalseConsole.map((consoleItem,i) => {
    //const filterAccessoryItem = accessories.find((accItem) => accItem.id === consoleItem.accessoryId);
    // const filterBrandItem = brand.find((brandItem) => brandItem.id === consoleItem.brandId);
    // const accessoryName = filterAccessoryItem ? filterAccessoryItem.name : '';
    // const brandName = filterBrandItem ? filterBrandItem.name : '';
    return {
      sno:i+1,
      key: consoleItem.consolesId,
      name: consoleItem.accessoryName,
      brand: consoleItem.brandName,
      address: consoleItem.modelNo !== undefined ? consoleItem.modelNo : '',
      tags: ['Active'],
    };
  });
   setCombinedDatas(updatedData);
  setProCounts(updatedData.length);
};


useEffect(() => {
  updateTableData();
}, [consoles, accessories, brand]); // Update the table data when consoles, accessories, or brand data changes

  

  // Combine the accessory data and all brand data
  const combinedData = [...data];


  const [empData,setEmpData] = useState([]);
  
  const [modalOpen,setModalOpen] =useState(false);
  const showModal = () =>{
    setModalOpen(true);
    // dispatch(getconsoles());
  } ;

  const clearFields = () => {
    setSystem({
      ...system,
      accessoryId: '',
      accessoryName: '',   
    });
  };

  const handleAddProduct = () => {
    showModal();
  };

  const handleCancel = () => {
    setModalOpen(false);
    clearFields(); // Clear fields when the modal is closed
  };

  useEffect(()=>{
    dispatch(getEmployees());
    dispatch(getaccessories());
    dispatch(getconsoles());
    dispatch(getbrand());
    dispatch(getProducts());
    // console.log(employee.length);
},[dispatch]);

// function DataLoading(){
//   var numberOfOffice = officeData.filter((off) => off.officename);
//   console.log(numberOfOffice);
//   var officeNames = numberOfOffice.map((off) => {
//     return off.officename;
//   });
//   if (officeNames.length ===1){
//     var filterOneOffice =proData.filter((off) => off.officeLocationId.officename ===officeNames[0]);
//     setProCounts(filterOneOffice.length);
    
//   }else{
//     setProCounts(proData.length);
//   }
// };

useEffect(()=>{
setEmpData(employee);
setProData(products);
//DataLoading();
},[employee,products,officeData]);


 //drop down
const productFilter = accessories.filter(acc => acc.isdeleted === false);
const productOption = productFilter.map((pr,i)=>({
  key:i+1,
  label:pr.name ,
  value:pr.id
}));
const brandFilter =brand.filter(brnd => brnd.isdeleted ===false);
const brandOption = brandFilter.map((br,i) => ({
  key:i+1,
  label:br.name,
  value:br.id
}));
const productNameDropDown = (data,value)=>{
  setSystem(pre => ({...pre,accessoriesId:data}));
  console.log(data);
};
const brandDropDown =(data)=>{
  setSystem(pre=>({...pre,brandId:data}))
  console.log(data);
};


 const handleModelNumberChange = (e) => {
  setSystem(pre=>({...pre,modelNumber:e.target.value}))
    // console.log(e.target.valuesdfdsf);
  };
  const ProductNameOnChange = (e) => {
    setSystem(pre=>({...pre,productName:e.target.value}))
      // console.log(e.target.valuesdfdsf);
    };

  return (
    <div>
      <Row justify='space-between' align='middle'>
      <Col><Statistic title="Product Count" value={proCounts} formatter={formatter} /></Col>
      <Col justify='flex-end' style={{right :'1%'}}>
      <Button
            onClick={handleAddProduct}
            type="primary"
            className="bg-blue-500 flex items-center gap-x-1 float-right mb-3 mt-3"
          >
            <span>Add Product</span>
            <FontAwesomeIcon icon={faPlus} className="icon" />
          </Button>
      </Col>
      </Row>
      <Divider/>
      <Table 
      columns={columns}
       dataSource={combinedDatas}
        pagination={{
                pageSize: 6
            }} />
      <Modal
         title="Add Product"
         open={modalOpen}
        onCancel={handleCancel}
         
         footer={[
          <Button danger={true} onClick={handleCancel}>Cancel</Button>,
          <Button onClick={addProduct}>ok</Button>
         ]}
         
      >
      <Form>

      <Form.Item label="Product Name" style={{ marginBottom: 0, marginTop: 10 }}>
            <Input
              style={{ float: 'right', width: '380px' }}
              placeholder="product name"
              name="productName"
              value={system.productName}
              onChange={ProductNameOnChange}
            />
           
            
          </Form.Item>

          <Form.Item label="Product Type" style={{ marginBottom: 0, marginTop: 10 }}>         
            <Select 
            style={{ float: 'right', width: '380px' }}
            placeholder="product type"
              options={productOption}
              value={system.accessoriesId}
              onChange={productNameDropDown}
            />
          </Form.Item>

          {/* Additional form fields for brand name and model number */}
          <Form.Item label="Brand" style={{ marginBottom: 0, marginTop: 10 }}>
            <Select
               style={{ float: 'right', width: '380px' }}
               placeholder="Brand"
               options={brandOption} 
               value={system.brandId}
               onChange={brandDropDown}
            />
          </Form.Item>

          <Form.Item label="Model No" style={{ marginBottom: 0, marginTop: 10 }}>
            <Input
              style={{ float: 'right', width: '380px' }}
              placeholder="Model No."
              name="modelNo"
              value={system.modelNumber}
              onChange={handleModelNumberChange}
            />
           
            
          </Form.Item>
          
          {/* Add more form fields as needed */}
        </Form>
      </Modal>
      
    </div>
    
  );
};

export default Products;