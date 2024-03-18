import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteDepartment, getDepartment, postDepartment, putDepartment } from "../../redux/slices/departmentSlice";
import { Popconfirm, Table, Modal, Form, Input, message,Divider } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faPlus ,faChevronLeft} from "@fortawesome/free-solid-svg-icons";

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
                        <Button type="link"><FontAwesomeIcon icon={faTrash} color="#fd5353"/></Button>
                    </Popconfirm>

                    <Button type="link"
                        onClick={() => PencelBtn(record)}
                    >
                        <FontAwesomeIcon icon={faPen} color="#000000"/></Button>

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

<ul className="flex flex-col md:flex-row gap-y-3 md:items-center justify-between">
        <li>
          <h2 className="text-xl">Department Settings</h2>
        </li>
        <li className="flex flex-col xs:flex-row gap-x-2 gap-y-3 xs:gap-y-0 mt-5 md:mt-0">
          <Button
            className="flex justify-center items-center gap-x-2"
            type="dashed"
            onClick={() => BackToSetting()}
          >
            <FontAwesomeIcon
              className="text-[10px] inline-block"
              icon={faChevronLeft}
            />
            <span>Back</span>
          </Button>
          <Button
            onClick={() => AddNewBtn(true)}
            type="primary"
            className="bg-blue-500 flex items-center justify-center gap-x-1"
          >
            <span>Add New Role</span>
            <FontAwesomeIcon icon={faPlus} className="icon" />
          </Button>
        </li>
      </ul>

      <Divider />
      <div className="overflow-x-scroll md:overflow-x-hidden mt-7">
            <Table
                style={{ marginTop: 10 }}
                bordered
                columns={columns}
                dataSource={TableDatas}
                pagination={{
                    pageSize: 6
                }}
            />
            </div>
            <Modal
                centered={true}
                title={`Add New ${headingValue}`}
                open={modelOpen}
                onCancel={ModelClose}
                //onOk={handleOk}
                footer={[
                    saveBtn === false ? <Button key="1" onClick={PostMethod}>Add</Button> : <Button key="1" onClick={PutMethod} >Save</Button>,
                    <Button type='default' key="2" danger="red"  onClick={() => ModelClose()}>Close</Button>
                ]}>

                <Form layout="vertical" className="mt-3">
                    {/* deprartmentname */}
                    <Form.Item label={`${headingValue} Name`} >
                        <Input  placeholder='Department name' name='departmentName' value={inputFields.departmentName} onChange={inputValue} />
                    </Form.Item>


                </Form>
            </Modal>

        </>
    )
}
export default DepartmentSettings