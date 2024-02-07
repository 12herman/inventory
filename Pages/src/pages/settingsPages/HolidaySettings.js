import React, { useEffect, useState } from "react";
import {
  Popconfirm,
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
} from "antd";
import en_US from "antd/lib/locale/en_US";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { DeleteHoliday, GetHoliday, PostHoliday, PutHoliday } from "../../redux/slices/holidaySlice";
import { getOffice } from "../../redux/slices/officeSlice";
import moment, { months } from 'moment'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const dateFormat = 'YYYY-MM-DD';

const HolidaySetting = ({ BackToSetting }) => {
    const [form] = Form.useForm(); 
  //API Get
  //get
  const dispatch = useDispatch();
  const { holiday } = useSelector((state) => state.holiday);
  const { office } = useSelector((state) => state.office);
  useEffect(() => {
    dispatch(GetHoliday());
    dispatch(getOffice());
  }, []);

  const dateFormat = "YYYY-MM-DD";
  const locale = en_US;

  //open,close popup "modal"
  const [FormPopUp, setFormPopUp] = useState(false);
  const ClosePopUp = () => {setFormPopUp(false);setFormInData({
    officeLocationId: null,
    holidayName: null,
    date: "",
    isDeleted: false,
  }) };
  const OpenPopUp = () => setFormPopUp(true);

  //create,edit "btn" change
  const [FormChangeBtn, setFormChangeBtn] = useState(false);
  const AddBtnChange = () => setFormChangeBtn(false);
  const SaveBtnChange = () => setFormChangeBtn(true);

  //form fields
  const [FormInData, setFormInData] = useState({
    officeLocationId: null,
    holidayName: null,
    date: "",
    isDeleted: false,
  });
  const clearFormInData=()=> {
    setFormInData({officeLocationId: null,
        holidayName: null,
        date: "",
        isDeleted: false,});
        form.setFieldsValue({
          DatePicker:  "",
        });
  };
  const FormOnChange = (e) => {
    const { name, value } = e.target;
    setFormInData((pre) => ({ ...pre, [name]: value }));
  }; //input fields
  const OfficeDropDownChange = (e) => {
    setFormInData((pre) => ({ ...pre, officeLocationId: e }));
  }; //office dropdown
  const DateSelect = (e,dateString) => {
    setFormInData((pre) => ({ ...pre, date: dateString }));
  };
  //table
  //office list
  const officeOption = office
    .filter((data) => data.isdeleted === false)
    .map((data, i) => ({
      label: data.officename,
      value: data.id,
    }));
    const filterHolidayData =holiday.filter(data=> data.isdeleted === false);
    const HolidayData= filterHolidayData.map((data,i)=>({
                            SerialNo:i+1,
                           key:data.id,
                           officeLocationId:data.officelocation,
                           holidayName:data.holidayName,
                           date:data.date
                        }));

  const widthSize = "370px";
  //pick id's
  const [IdSelect, setIdSelect] = useState(null);
  const columns = [
    {
      title: "S.No",
      dataIndex: "SerialNo",
      width: "10%",
    },
    {
      title: "office",
      dataIndex: "officeLocationId",
      // width:'0%',
    },
    {
      title: "holidayName",
      dataIndex: "holidayName",
      // width:'60%',
    },
    {
      title: "date",
      dataIndex: "date",
      // width:'60%',
    },
    {
      title: "Operation",
      dataIndex: "operation",
      //width:'30%',
      render: (text, record) => (
        <div className="flex gap-x-2">
          <Popconfirm
            title="Are you sure to delete this?"
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              style: { backgroundColor: "red", color: "white" },
            }}
            onConfirm={() => {Delete(record.key) }}
          >
            <Button>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </Popconfirm>
          <Button onClick={()=>PencilIconClick(record.key)}>
            <FontAwesomeIcon icon={faPen} />
          </Button>
        </div>
      ),
    },
  ];
  //open form
  const AddBtn = () => {
    OpenPopUp(); //open popup
    AddBtnChange(); //add btn enable
    clearFormInData();
    form.resetFields();
  };
  //API CURD
  //post
  const Post = async () => {
    if(FormInData.officeLocationId === null ||
        FormInData.date === "" ||
        FormInData.holidayName=== null
        ){
            message.error("fill all the fields");
        }
        else{
            console.log(FormInData);
           await dispatch(PostHoliday(FormInData));
           await dispatch(GetHoliday());
           await ClosePopUp();
           await message.success("created successfully");
        }
    
  };
  const PencilIconClick = async(id)=>{
const EditData =await filterHolidayData.filter(data=> data.id === id);
const currentDate = new Date();
const formattedDate = currentDate.toISOString().slice(0, 19);
   await setFormInData(
        {officeLocationId: EditData[0].officelocationId,
        holidayName: EditData[0].holidayName,
        date:await moment(EditData[0].date)._i ,
        isDeleted: false,
        createdDate:EditData[0].createdDate,
        modifiedDate:formattedDate,
        id:EditData[0].id
        // modifiedBy:'',
        // createdBy:''
    });
    form.setFieldsValue({
      DatePicker:  moment(moment(EditData[0].date)._i),
    });
    await SaveBtnChange();
   await OpenPopUp();
  };

  //put
  const Put = async() => {
    if(FormInData.officeLocationId === null ||
        FormInData.date === "" ||
        FormInData.holidayName=== null
        ){
            message.error("fill all the fields");
        }
        else{
            console.log(FormInData);
            await dispatch(PutHoliday(FormInData));
            await dispatch(GetHoliday());
            await ClosePopUp();
            await message.success("updated successfully");
        }
   
  };
  //delete
  const Delete = async (id) => {
   await dispatch(DeleteHoliday(id));
   await dispatch(GetHoliday());
  };
  return (
    <>
      <div className="flex items-center justify-between">
        <h2>Holiday Settings </h2>
        <Button style={{ float: "right" }} onClick={() => BackToSetting()}>
          {" "}
          Back
        </Button>
      </div>
      <Button
        onClick={() => AddBtn()}
        type="primary"
        className="bg-blue-500 flex items-center gap-x-1 float-right mb-3 mt-3"
      >
        {" "}
        <span>Add Holiday</span>{" "}
        <FontAwesomeIcon icon={faPlus} className="icon" />{" "}
      </Button>
      <Table
        style={{ marginTop: 10 }}
        bordered
        columns={columns}
        dataSource={HolidayData}
        pagination={{
          pageSize: 6,
        }}
      />

      <Modal
        title="Add New Holiday"
        open={FormPopUp}
        onCancel={ClosePopUp}
        footer={[
          FormChangeBtn === false ? (
            <Button key="1" onClick={Post}>
              Add
            </Button>
          ) : (
            <Button key="1" onClick={Put}>
              Save
            </Button>
          ),
          <Button
            type="text"
            key="2"
            danger="red"
            style={{ border: "0.5px solid red" }}
            onClick={() => ClosePopUp()}
          >
            Close
          </Button>,
        ]}
      >
        <Form form={form}>
          {/* RollName */}
          <Form.Item
            label="Holiday Name"
            style={{ marginBottom: 0, marginTop: 10 }}>
            <Input
              style={{ float: "right", width: widthSize }}
              placeholder="holiday name"
              name="holidayName"
              value={FormInData.holidayName}
              onChange={FormOnChange}
            />
          </Form.Item>

          <Form.Item  name="DatePicker" label="Date" style={{ marginBottom: 0, marginTop: 10 }} >
            <DatePicker
              style={{ float: "right", width: widthSize }}
              format={dateFormat}
              onChange={DateSelect}
               value={FormInData.date}
              
            />
          </Form.Item>

          <Form.Item label="Office" style={{ marginBottom: 0, marginTop: 10 }}>
            <Select
              style={{ float: "right", width: widthSize }}
              placeholder="office location"
              name="officeLocationId"
              value={FormInData.officeLocationId}
              onChange={OfficeDropDownChange}
              options={officeOption}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default HolidaySetting;
