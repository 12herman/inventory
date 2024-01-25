import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteDepartment, getDepartment, postDepartment, putDepartment } from "../../redux/slices/departmentSlice";
import { Popconfirm, Table, Modal, Form, Input, message } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

const DepartmentSettings = ({ BackToSetting }) => {

    const headingValue = "Department";
    const [inputFields, setInputFilelds] = useState({
        departmentName: '',
        isdeleted: false
    });
    const [updateFields,setUpdateFields] = useState('');
   
    const inputValue = (e) => {
        setInputFilelds({
            departmentName: e.target.value,
            isdeleted: false
        })
    }
    const clearFileds = () => {
        setInputFilelds("");
    };
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
    const columns = [
        {
            title: 'S.No',
            dataIndex: 'serialno',
            width: '10%',
        },
        {
            title: 'Department',
            dataIndex: 'departmentName',
            width: '60%',
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            width: '30%',
            render: (text, record) => (

                <div className="flex gap-x-2">
                    <Popconfirm
                        title="Are you sure to delete this?"
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
                        onConfirm={() => Deletebtn(record)}
                    >
                        <Button><FontAwesomeIcon icon={faTrash} /></Button>
                    </Popconfirm>

                    <Button
                        onClick={() => PencelBtn(record)}
                    >
                        <FontAwesomeIcon icon={faPen} /></Button>

                </div>

            ),
        },
    ];



    const dispatch = useDispatch();
    const { department } = useSelector(state => state.department);
    useEffect(() => {
        dispatch(getDepartment());
    }, [dispatch])

    //Table datas
    const filterData = department.filter(data => data.isdeleted === false);
    const TableDatas = filterData.length > 0 ? filterData.map((data, i) => ({
        key: data.id,
        serialno: i + 1,
        departmentName: data.departmentName,
    })) : [];


    // Curd Methods
    //Post
    const PostMethod = async () => {
        if (!inputFields.departmentName) {
            message.error("Fill all the fields");
        }
        else {
            await dispatch(postDepartment({ departmentName: inputFields.departmentName, isdeleted: false }));
            await dispatch(getDepartment());
            clearFileds();
            ModelClose();
            message.success("Successfully Added");
        }
    };
    //Put
    const PencelBtn = async (record) => {
        await setInputFilelds({
            departmentName: record.departmentName,
            isdeleted: false
        });
        // await setDataId(record)
        console.log(record);
        setUpdateFields(record.key)
        saveBtnOn();
        ModelOpen();
    };
    const PutMethod = async () => {
        if (inputFields.departmentName === "") {
            message.error("Fill all the fields");
        }
        else
        {
            const filterDepartment =await department.filter(de=> de.id === updateFields);
            await dispatch(putDepartment({id:updateFields,...inputFields,
                createdBy:filterDepartment[0].createdBy,
                createdDate:filterDepartment[0].createdDate,
                modifiedBy:filterDepartment[0].modifiedBy,
                modifiedDate:filterDepartment[0].modifiedDate
            }));
            await dispatch(getDepartment());
            ModelClose();
            clearFileds();
        }
        
    };
    //Delete
    const Deletebtn = async (record) => {
        // soft delete
        const flDep= await department.filter((de,i)=> de.id === record.key);
            await dispatch(putDepartment(
                {id:record.key,
                    departmentName:flDep[0].departmentName,
                    isdeleted:true,
                    createdBy:flDep[0].createdBy,
                    createdDate:flDep[0].createdDate,
                    modifiedBy:flDep[0].modifiedBy,
                    modifiedDate:flDep[0].modifiedDate}));
        await dispatch(getDepartment());

        //Hard delete
        // await dispatch(deleteDepartment(record.key));
        // await dispatch(getDepartment());
    };


    return (
        <>
            <div className="flex items-center justify-between" >
                <h2>Department Settings</h2>
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

                <Form >
                    {/* deprartmentname */}
                    <Form.Item label={`${headingValue} Name`} style={{ marginBottom: 0, marginTop: 10 }}>
                        <Input style={{ float: "right", width: "345px" }} placeholder='Department name' name='departmentName' value={inputFields.departmentName} onChange={inputValue} />
                    </Form.Item>


                </Form>
            </Modal >

        </>
    )
}
export default DepartmentSettings