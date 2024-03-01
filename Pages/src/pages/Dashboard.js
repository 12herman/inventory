import React, { useEffect, useState } from 'react';
import {  faHouse, faUser, faDesktop, faWarehouse, faScrewdriverWrench,  } from  '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Col, Row, Statistic } from 'antd';
import CountUp  from 'react-countup';
import {useDispatch,useSelector} from 'react-redux';
import { getEmployees } from '../redux/slices/employeeSlice';
import { fetchOfficeData } from '../redux/slices/officeSlice';
import { getProductsDetail } from '../redux/slices/productsDetailSlice';

const formatter = (value) => <CountUp end={value} />;

const Dashboard = ({officeData}) => {

const dispatch = useDispatch();
const {employee,loading} = useSelector(state => state.employee);

const [empData,setEmpData] = useState([]);

const [empCounts,setEmpCounts] = useState();

const { productsDetail } = useSelector((state) => state.productsDetail);

const [proData, setProData] = useState([]);

const [proCounts, setProCounts] = useState();

const [storagelocData, setProLocData] = useState();

const [storageLocationCount, setstorageLocationCount] = useState([]);

const [repairData,setRepairData] = useState([]);

const [repairCount,setRepairCount] = useState();


useEffect(()=>{
    dispatch(getEmployees());
    dispatch(getProductsDetail());
},[]);
console.log(productsDetail);
useEffect(()=>{
        setEmpData(employee);
        setProData(productsDetail);
        setProLocData(productsDetail);
        setRepairData(productsDetail);
        DataLoading();
},[employee,officeData,productsDetail]);


function DataLoading() {
    var numberOfOffice = officeData.filter((off) => off.officename);
    var officeNames = numberOfOffice.map((off) => {
      return off.officename;
    });

    if (officeNames.length === 1) {
        //Employee Count
      var filterOneOffice = empData.filter((off) => off.officeLocationId.officename === officeNames[0]);
      setEmpCounts(filterOneOffice.length);

      //Product Count
      const filterProductOneOffice = proData ? proData.filter(products => products.isDeleted === false && products.officeName === officeNames[0]) : 0;
      setProCounts(filterProductOneOffice.length);

      //Storage Count
      const filterStorageOneOffice = storagelocData ? storagelocData.filter(system => system.isDeleted === false && system.officeName === officeNames[0] && system.isStorage ===true) : 0;
      setstorageLocationCount(filterStorageOneOffice.length);

      //Repair Count
      const filterRepairOneOffice = repairData ? repairData.filter(repair => repair.isDeleted ===false && repair.officeName === officeNames[0] && repair.isRepair ===true):0;
      console.log(filterRepairOneOffice);
      setRepairCount(filterRepairOneOffice.length);
    } else {
      setEmpCounts(empData.length);

      const filterAllOffice = proData ? proData.filter(products => products.isDeleted === false) : 0;
      setProCounts(filterAllOffice.length);

      const filterAllStorageOffice = storagelocData ? storagelocData.filter(storage => storage.isDeleted ===false && storage.isStorage ===true) :0;
      setstorageLocationCount(filterAllStorageOffice.length);  

      const filterAllRepairOffice = repairData ? repairData.filter(repair => repair.isDeleted ===false && repair.isRepair===true):0;
      setRepairCount(filterAllRepairOffice.length);
    }
  }

    return (
        <div>
            <Row gutter={16}>
                <Col span={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="Employee"
                            value={empCounts === undefined ? 1 : empCounts}
                            formatter={formatter} 
                            valueStyle={{
                                color: '#1677ff',
                            }}
                            prefix={<FontAwesomeIcon icon ={faUser} style={{ marginRight: '8px' }}/>}
                           
                        />

                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="Products"
                            value={proCounts === undefined ? 1 : proCounts}
                            formatter={formatter} 
                            valueStyle={{
                                color: '#1677ff',
                            }}
                            prefix={<FontAwesomeIcon icon ={faDesktop} style={{ marginRight: '8px' }}/>}
                        />

                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="Storage"
                            value={storageLocationCount === undefined ? 1 : storageLocationCount}
                            formatter={formatter} 
                            valueStyle={{
                                color: '#1677ff',
                            }}
                            prefix={<FontAwesomeIcon icon ={faWarehouse} style={{ marginRight: '8px' }}/>}
                        />

                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="Repair"
                            value={repairCount === undefined ? 1 : repairCount}
                            formatter={formatter} 
                            valueStyle={{
                                color: '#1677ff',
                            }}
                            prefix={<FontAwesomeIcon icon ={faScrewdriverWrench} style={{ marginRight: '8px' }}/>}
                        />

                    </Card>
                </Col>
            </Row>
        </div>


    );
};
export default Dashboard;
