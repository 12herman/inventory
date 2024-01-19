import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import { Button, Form, Table, message, Modal, Input, Popconfirm,Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getaccount } from "../../redux/slices/accountdetailsSlice";
import { getEmployees } from "../../redux/slices/employeeSlice";

const AccountDetailSettings = ({ BackToSetting }) => {


    const columns = [
        {
            title: 'S.No',
            dataIndex: 'serialno',
            width: '5%',
        },
        {
            title: 'Id',
            dataIndex: 'employeeName',
            width: '5%',
        },
        {
            title: 'Employee',
            dataIndex: 'employeeid',
            width: '25%',
        },
        {
            title: 'Bank',
            dataIndex: 'bankname',
            width: '15%',
        },

        {
            title: 'Location',
            dataIndex: 'bankLocation',
            width: '25%',
        },
        {
            title: 'Account No',
            dataIndex: 'accountNumber',
            width: '15%',
        },
        {
            title: 'IFSC',
            dataIndex: 'ifsc',
            width: '20%',
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (text, record) => (

                <div className="flex gap-x-2">
                    <Popconfirm
                        title="Are you sure to delete this?"
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
                        onConfirm={() => Delete(record.key)}
                    >
                        <Button><FontAwesomeIcon icon={faTrash} /></Button>
                    </Popconfirm>

                    <Button onClick={() => Edit(record.key)}><FontAwesomeIcon icon={faPen} /></Button>

                </div>

            ),
        },
    ];

    const dispatch = useDispatch();
    const { account } = useSelector(state => state.account);
    const { employee } = useSelector(state => state.employee);

    const [datas, setDatas] = useState([]);
    const [emdata, setEmdata] = useState([]);

    //input filed value
    const headingValue = "Account";
    const [accountInput, setAccountInput] = useState({
        bankName: "",
        branchName: "",
        bankLocation: "",
        accountNumber: "",
        ifsc: ""
    });//Modify
    const [putAccount, setPutAccount] = useState([]);
    const clearFileds = () => {
        setAccountInput({
            bankName: "",
            branchName: "",
            bankLocation: "",
            accountNumber: "",
            ifsc: ""
        })
    };//Modify
    // popup-window
    const [modelOpen, setModelOpen] = useState(false);
    const ModelOpen = () => setModelOpen(true);
    const ModelClose = () => setModelOpen(false);
    // save (or) add btn state
    const [saveBtn, setsaveBtn] = useState(false);
    const saveBtnOn = () => setsaveBtn(true);
    const saveBtnOff = () => setsaveBtn(false);
    // add new filed open
    const AddNewBtn = () => {
        clearFileds();
        saveBtnOff();
        ModelOpen();
    }
    //input data 
    const InputDataFilelds = (e) => {
        const { name, value } = e.target;
        setAccountInput((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        dispatch(getEmployees());
        dispatch(getaccount());
        setEmdata(employee);
        setDatas(account);
    }, [dispatch])

    console.log(datas);
    console.log(emdata);

let notem =[]
    const TableDatas = datas.map((data, i) => {
        const employee = emdata.find(emp => emp.id === data.employeeId);
        const notDefinedEmp = emdata.find(emp => !datas.some(data => data.employeeId === emp.id));
        if (notDefinedEmp) {
            notem.push(notDefinedEmp);
          }
        return {
            key: data.id,
            serialno: i + 1,
            bankname: data.bankName,
            employeeid: employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee',
            employeeName: data.employeeId,
            bankLocation: data.bankLocation,
            accountNumber: data.accountNumber,
            ifsc: data.ifsc,
        };
    });

   

    const PostMethod = () => { };
    const PutMethod = () => { };
    const Edit = () => {
        console.log("Edit");
    };
    const Delete = () => {
        console.log("Delete");
    }

    const options = [];
    for (let i = 10; i < 36; i++) {
        options.push({
            value: i.toString(36) + i,
            label: i.toString(36) + i,
        });
    }
    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };
    return (
        <>
            <div className="flex items-center justify-between" >
                <h2>AccountDetail Settings</h2>
                <Button style={{ float: "right" }} onClick={() => BackToSetting()}> Back</Button>
            </div>
            <Button onClick={() => AddNewBtn()} type='primary' className='bg-blue-500 flex items-center gap-x-1 float-right mb-3 mt-3'> <span>Add New Role</span> <FontAwesomeIcon icon={faPlus} className='icon' /> </Button>
            <Table
                style={{ marginTop: 10 }}
                bordered
                columns={columns}
                dataSource={TableDatas}
                pagination={{
                    pageSize: 6
                }}
            />

            <Modal
                title={`Add New ${headingValue}`}
                open={modelOpen}
                onCancel={ModelClose}
                //onOk={handleOk}
                footer={[
                    saveBtn === false ? <Button key="1" onClick={PostMethod}>Add</Button> : <Button key="1" onClick={PutMethod} >Save</Button>,
                    <Button type='text' key="2" danger="red" style={{ border: "0.5px solid red" }} onClick={() => ModelClose()}>Close</Button>
                ]}>

                <Form>
                <Form.Item label="Employee" style={{ marginBottom: 0, marginTop: 10 }}>
                <Select
                
                            mode="tags"
                            style={{
                                float: "right", width: "380px"
                            }}
                            onChange={handleChange}
                            tokenSeparators={[',']}
                            options={options}
                        />
                    </Form.Item>
                    
                    {/* officename */}
                    <Form.Item label="Bank Name" style={{ marginBottom: 0, marginTop: 10 }}>
                        <Input style={{ float: "right", width: "380px" }} placeholder='bank name' name='bankName' value={accountInput.bankName} onChange={InputDataFilelds} />
                    </Form.Item>

                    {/* Address */}
                    <Form.Item label="Branch Name" style={{ marginBottom: 0, marginTop: 10 }}>
                        <Input style={{ float: "right", width: "380px" }} placeholder='branch name' name='branchName' value={accountInput.branchName} onChange={InputDataFilelds} />
                    </Form.Item>

                    {/* City */}
                    <Form.Item label="Location" style={{ marginBottom: 0, marginTop: 10 }}>
                        <Input style={{ float: "right", width: "380px" }} placeholder='bank location' name='bankLocation' value={accountInput.bankLocation} onChange={InputDataFilelds} />
                    </Form.Item>

                    {/* State */}
                    <Form.Item label="Account No" style={{ marginBottom: 0, marginTop: 10 }}>
                        <Input style={{ float: "right", width: "380px" }} placeholder='account no' name='accountNumber' value={accountInput.accountNumber} onChange={InputDataFilelds} />
                    </Form.Item>

                    {/* Country */}
                    <Form.Item label="IFSC" style={{ marginBottom: 10, marginTop: 10 }}>
                        <Input style={{ float: "right", width: "380px" }} placeholder='ifsc' name='ifsc' value={accountInput.ifsc} onChange={InputDataFilelds} />
                    </Form.Item>
                </Form>
            </Modal >
        </>
    )
}
export default AccountDetailSettings