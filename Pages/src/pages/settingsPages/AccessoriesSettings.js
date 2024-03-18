import { Button, Popconfirm,Table,message,Modal,Form,Input,Divider } from "antd";
import React, { useEffect,useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faPen, faL ,faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from "react-redux";
import { getaccessories, postaccessories,putaccessories,deleteaccessories } from "../../redux/slices/accessoriesSlice";


const AccessoriesSettings = ({BackToSetting})=>{
    //console.log(BackToSetting );
    const columns = [
        {
            title:'S.No',
            dataIndex:'SerialNo',
            width:'10%',
        },
        {
            title:'Name',
            dataIndex:'AccessoryName',
            width:'60%',
        },
        {
            title:'Operation',
            dataIndex:'operation',
            width:'30%',
            render: (text,record) => (
                <div className="flex gap-x-2">
                    <Popconfirm
                       title="Are you sure to delete this?"
                       okText="Yes"
                       cancelText="No"
                       okButtonProps={{style: {backgroundColor: "red" ,color:"white"}}}
                       onConfirm={() => DeleteMethod(record)}
                    >
                    
                       <Button type="link"><FontAwesomeIcon icon={faTrash} color="#fd5353" /></Button>
                    </Popconfirm>
                    <Button type="link"
                        onClick={() => PencelBtn(record.key)}
                    >
                        <FontAwesomeIcon icon={faPen} color="#000000"/></Button>
                </div>
            )
        }
    ];

    const dispatch =useDispatch();
    const{accessories} = useSelector(state => state.accessories);
    //const [accessoryData,setAccessoryData] =useState([]);

    //Input Field Value
    const headingValue = "Accessory";
    const [accessory,setAccessory] = useState({
        id:"",
        Name:"",
        isdeleted:false,
    });

    //Modify
    const [putAccessory,setPutAccessory] = useState([]);
    const clearFields = () =>{setAccessory({Name:"",isdeleted:false,})};

    //Pop-Up Window
    const [modalOpen,setModalOpen] = useState(false);
    const ModalOpen = () => setModalOpen(true);
    const ModalClose = () => setModalOpen(false);

    //Save or Add Button State
    const [saveBtn,setsaveBtn] = useState(false);
    const saveBtnOn = () => setsaveBtn(true);
    const saveBtnOff = () => setsaveBtn(false);

    //Add New Field
    const AddNewBtn = () => {
        clearFields();
        saveBtnOff();
        ModalOpen();
    }

    //Input Data
    const InputDataFields = (e) => {
        const {value} = e.target;
        setAccessory({
            Name:value,
            isdeleted:false
        });
    }

    //Table Data and Column
    const AccessoryDatas= accessories.length > 0 ? accessories.filter(accry => accry.isdeleted ===false) : [];

    //Table Data and Column
    const TableDatas =AccessoryDatas.map((accry,i) => ({
        key:accry.id,
        SerialNo:i + 1,
        AccessoryName:accry.name     
    }));

    //CRUD Method
    //PostMethod
    const PostMethod = async () => {
        try{
            if(!accessory.Name) {
                message.error("Fill the Fields")
            }else {
                await dispatch(postaccessories(accessory));
                dispatch(getaccessories());
                message.success(`New ${headingValue} created successfully!`);
                ModalClose();
            }
        } catch(error){
            console.error("Error posting accessory:",error);
            message.error("Failed to create a new accessory");
        }
    };

    //Pencil Icon Click for Edit 
    const PencelBtn = (record) => {
        const PreviousValue = TableDatas.filter(pr => pr.key === record);
        console.log("Previous Value:",PreviousValue);
        setAccessory({
            id: record,
            Name: PreviousValue[0].AccessoryName,
            isdeleted: false
        });
        setPutAccessory({ id: PreviousValue[0].key, Name: PreviousValue[0].AccessoryName, isdeleted: false });//Modify
        saveBtnOn();
        ModalOpen();
    }

    //PutMethod
    const PutMethod = async () => {
        if(!accessory.Name) {
            message.error("Fill the Fields");
        }
        else {
            const putData ={
                id:putAccessory.id,
                Name:accessory.Name,
                isdeleted:putAccessory.isdeleted
            }
            await dispatch(putaccessories(putData));
            dispatch(getaccessories());
            ModalClose();
            message.success("Saved Successfully")
        }
    }

    //Delete Method
    const DeleteMethod = async (key) => {
        
        console.log(key.key);
        // Soft Delete
        const PreviousValue = TableDatas.filter(pr => pr.key === key.key);
        // console.log("Previous Value:",PreviousValue);
       
        const DeleteData = {
            id: PreviousValue[0].key,
            Name: PreviousValue[0].AccessoryName,
            isdeleted: true
        }
        //  console.log("Delete Data:",DeleteData);
        await dispatch(putaccessories(DeleteData));
         await   dispatch(getaccessories());
        message.success("Deleted successfully");
        
        //Hard Delete
    //     await dispatch(deleteaccessories(key.key));
    //    await dispatch(getaccessories());

    }

    useEffect(() =>{
        dispatch(getaccessories());
    },[dispatch]);

    // useEffect(() => {
    //     setAccessoryData(accessories);
    // },[dispatch,PostMethod,PutMethod,DeleteMethod])
   
return(
    <>
 <ul className="flex flex-col md:flex-row gap-y-3 md:items-center justify-between">
        <li>
          <h2 className="text-xl">Accessories Settings</h2>
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
            onClick={() => AddNewBtn()}
            type="primary"
            className="bg-blue-500 flex items-center justify-center gap-x-1"
          >
            <span>Add New Accessory</span>
            <FontAwesomeIcon icon={faPlus} className="icon" />
          </Button>
        </li>
      </ul>

       {/* <div className="flex items-center justify-between" >
       <h2> </h2>
        <Button style={{float:"right"}} onClick={()=>BackToSetting()}> Back</Button>
       </div>
       <Button onClick={() => AddNewBtn()} type='primary' className='bg-blue-500 flex items-center gap-x-1 float-right mb-3 mt-3'> <span>Add New Accessory</span> <FontAwesomeIcon icon={faPlus} className='icon' /> </Button> */}
       <Divider />

       <div className="overflow-x-scroll md:overflow-x-hidden">
       <Table
                style={{ marginTop: 10 }}
                bordered
                columns={columns}
                dataSource={TableDatas}
            pagination={{
                pageSize: 5
            }}
            />
            </div>
            <Modal
            centered={true}
                title={`Add New ${headingValue}`}
                open={modalOpen}
                onCancel={ModalClose}
                //onOk={handleOk}
                footer={[
                    saveBtn === false ? <Button key="1" onClick={PostMethod}>Add</Button> : <Button key="1" onClick={PutMethod} >Save</Button>,
                    <Button type='text' key="2" danger="red" style={{ border: "0.5px solid red" }} onClick={() => ModalClose()}>Close</Button>
                ]}>

                <Form className="mt-3">
                    {/* RollName */}
                    <Form.Item label="Name" className="mb-2">
                        <Input  placeholder='Accessory Name' name='name' value={accessory.Name} onChange={InputDataFields} />
                    </Form.Item>
                </Form>
            </Modal>

    </>
)
}
export default AccessoriesSettings