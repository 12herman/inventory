import React, { useEffect, useState } from "react";
import { Button, Form, Table, message, Modal, Input, Popconfirm } from "antd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faPen, faL } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from "react-redux";
import { deleterole, getrole, postrole, putrole } from "../../redux/slices/roleSlice";

const RoleSettings = ({ BackToSetting }) => {

    const columns = [
        {
            title: 'S.No',
            dataIndex: 'serialno',
            width: '10%',
        },
        {
            title: 'Roll Name',
            dataIndex: 'rollname',
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
                        onConfirm={() => DeleteMethod(record.key)}
                    >
                        <Button><FontAwesomeIcon icon={faTrash} /></Button>
                    </Popconfirm>

                    <Button
                        onClick={() => PencelBtn(record.key)}
                    >
                        <FontAwesomeIcon icon={faPen} /></Button>

                </div>

            ),
        },
    ]

    const dispatch = useDispatch();
    const { role } = useSelector(state => state.role);
    const [datas, setDatas] = useState([]);
    //input filed value
    const headingValue = "Role";
    const [Role, setRole] = useState({
        id: '',
        rollName: '',
        isdeleted: false,
    });//Modify
    const [putRole, setPutRole] = useState([]);
    const clearFileds = () => { setRole({ rollName: '', isdeleted: false, }) };//Modify
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
        const { value } = e.target;
        setRole({
            rollName: value,
            isdeleted: false
        });
    }

    // Table Data and Column - End
    const RoleDatas = datas.length > 0 ? datas.filter(role => role.isdeleted === false) : [];
    // Table Data and Column
    const TableDatas = RoleDatas.map((role, i) => ({
        key: role.id,
        serialno: i + 1,
        rollname: role.rollName
    }));

    //CURD Method
    //PostMethod
    const PostMethod = async () => {
        try {
            if (!Role.rollName) {
                message.error("Fill the field");
            } else {
                await dispatch(postrole(Role));
                dispatch(getrole());
                message.success(`New ${headingValue} created successfully`);
                ModelClose();
            }
        } catch (error) {
            console.error("Error posting role:", error);
            message.error("Failed to create a new role");
        }
    };

    // pencil icon click
    const PencelBtn = (record) => {
        const PreviousValue = TableDatas.filter(pr => pr.key === record);
        setRole({
            rollName: PreviousValue[0].rollname,
            isdeleted: false
        });
        setPutRole({ id: PreviousValue[0].key, rollName: PreviousValue[0].rollname, isdeleted: false });//Modify
        saveBtnOn();
        ModelOpen();
    }

    //put method
    const PutMethod = async () => {
        const PreviousValue = RoleDatas.filter(el => el.id === putRole.id);
        //console.log(PreviousValue);
        if (!Role.rollName) {
            message.error("Fill the field");
        }
        else {
        const putData = {
            id: PreviousValue[0].id,
            rollname: Role.rollName,
            createdDate:PreviousValue[0].createdDate,
            createdBy:PreviousValue[0].createdBy,
            isdeleted: false
        }
            await dispatch(putrole(putData));
            dispatch(getrole());
            ModelClose();
            message.success("save successfully")
        }

    }

    //Delete
    const DeleteMethod = async (key) => {
        // Soft Delete
         const PreviousValue = RoleDatas.filter(el => el.id === key);
        const DeleteData = {
            id: PreviousValue[0].id,
            rollname: PreviousValue[0].rollName,
            createdDate:PreviousValue[0].createdDate,
            createdBy:PreviousValue[0].createdBy,
            isdeleted: true
        }
        await dispatch(putrole(DeleteData));
        dispatch(getrole());
        message.success("Deleted successfully");
        
        //Hard Delete
        // await dispatch(deleterole(key));
        // dispatch(getrole());
    }

    useEffect(() => {
        dispatch(getrole());
    }, [dispatch]);

    useEffect(() => {
        setDatas(role);
    }, [dispatch, PostMethod, PutMethod, DeleteMethod])

    return (
        <>
            <div className="flex items-center justify-between" >
                <h2>{headingValue} Settings</h2>
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
                    {/* RollName */}
                    <Form.Item label="Roll Name" style={{ marginBottom: 0, marginTop: 10 }}>
                        <Input style={{ float: "right", width: "380px" }} placeholder='role name' name='rollname' value={Role.rollName} onChange={InputDataFilelds} />
                    </Form.Item>


                </Form>
            </Modal >
        </>
    )
}
export default RoleSettings