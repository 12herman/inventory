import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import CountUp  from 'react-countup';
import { Progress,Flex,Button,Timeline,Divider } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { GetHoliday } from '../redux/slices/holidaySlice';
import { Getemployeeleave } from '../redux/slices/employeeLeaveSlice';

const formatter = (value) => <CountUp end={value} />;

const UserDashboard = ({}) => {
    const Id = 164;
    const dispatch = useDispatch();
    const {holiday} = useSelector(state => state.holiday);
    const {employeeleave} = useSelector(state => state.employeeleave);

    useEffect(()=>{
        dispatch(GetHoliday());
        dispatch(Getemployeeleave());
        circleData();
    },[dispatch]);

    
    //leave 
    const LeavesData =  employeeleave.filter(leave => leave.employeeId === Id);
    const [Leaves,setLeaves] = useState({
        total: null,
        sickleave:null,
        casualleave:null,
        leaveavailed:null
    });
    const circleData = ()=>{
        LeavesData.map(leave => {
            setLeaves({
                total: leave.total,
                sickleave:leave.sickLeave,
                casualleave:leave.casualLeave,
                leaveavailed:leave.leaveAvailed
            });
        });
    };


    return (
        <div>
            <Row gutter={16}>
                <Col span={6}>
                    <Card>
                    <Flex justify="space-between" align='center'>
                        <Statistic
                            title="Total Working Days"
                            value={Leaves.total}
                            formatter={formatter} 
                            valueStyle={{
                                color: '#3f8600',
                                fontWeight:'bold',
                            }}
                        />
                        <Progress type="circle" percent={100} status="active" format={() => `${Leaves.total} Days`}/>
                        </Flex>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                    <Flex justify="space-between" align='center'>
                        <Statistic
                            title="Casual Leave"
                            value={Leaves.casualleave}
                            formatter={formatter} 
                            valueStyle={{
                                color: '#3f8600',
                                fontWeight:'bold',
                            }}
                        />
                        <Progress type="circle" percent={80} status="active" format={() => `${Leaves.casualleave} Days`}/>
                        </Flex>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                    <Flex justify="space-between" align='center'>
                        <Statistic
                            title="Sick Leave"
                            value={Leaves.sickleave}
                            formatter={formatter} 
                            valueStyle={{
                                color: '#3f8600',
                                fontWeight:'bold',
                            }}
                        />
                        <Progress type="circle" percent={50} status="active" format={() => `${Leaves.sickleave} Days`} />
                        </Flex>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                    <Flex justify="space-between" align='center'>
                        <Statistic
                            title="Leave Availed"
                            value={Leaves.leaveavailed}
                            formatter={formatter} 
                            valueStyle={{
                                color: '#3f8600',
                                fontWeight:'bold',
                            }}
                        />
                        <Progress type="circle" percent={0} status="active" format={() => `${Leaves.leaveavailed}Days`}/>
                        </Flex>
                    </Card>
                </Col>
            </Row>
            <Button type="primary" style={{marginTop: '20px'}}>Apply for Leave</Button>

            <Divider />
            <h2 style={{textAlign: 'center',marginBottom: '30px'}}>Office Holidays - 2024</h2>

            <Timeline
            mode='right'
      items={[
        {
            label: 'New Year',
            children: '01-01-2024',
        },
        {
            label: 'Pongal',
            children: '15-01-2024',
        },
        {
            label: 'Republic Day',
            children: '26-01-2024',
            dot: <SmileOutlined />,
        },
        {
            label: 'Ramzan',
            children: '11-04-2024',
            color: 'gray',
        },
        {
            label: 'May Day',
            children: '01-05-2024',
            color: 'gray',
        },
        {
            label: 'Bakrid',
            children: '17-06-2024',
            color: 'gray',
          },
          {
            label: 'Independence Day',
            children: '15-08-2024',
            color: 'gray',
          },
      ]}
    />

        </div>
    );
};

export default UserDashboard;
