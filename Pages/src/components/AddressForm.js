import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { Form,Input } from 'antd'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen, faInfoCircle, faLocationDot, faLandmark, faCircleCheck, faPeopleGroup, faL } from "@fortawesome/free-solid-svg-icons"

const { form } = Form;
const filedWidth = "760px";

const AddressForm = forwardRef((props, ref) => {

    // Address inputs
    // type 1 - permanet address
    // type 2 -current address
    const { newempid } = props;
    const [addressFields, setAddressFields] = useState({
        employeeId: newempid,
        address1: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        isdeleted: false,
        type:1
    });
    const [currentAddFields,setCurrentAddFields] = useState({
        employeeId: newempid,
        address1: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        isdeleted: false,
        type:2
    });

    const AddressInputsOnchange = (e) => {
        const { name, value } = e.target;
        const type = e.currentTarget.getAttribute('data-type'); 
        setAddressFields(pre => ({ ...pre, [name]: value, type}));
    };

    const cureentInputsOnchange = (e)=>{
        const {name,value}= e.target;
        const type = e.currentTarget.getAttribute('data-type'); 
        setCurrentAddFields(pre => ({...pre,[name]:value, type}));
    };



    return (
        <section >
            <div className='mt-5 flex justify-center items-center'><FontAwesomeIcon className='text-2xl ' icon={faLocationDot} /></div>

            <Form form={form} className='h-[60.9vh] mt-5'>
            <h2 className='mt-5 px-7 text-lg'>Permanet Address :</h2>
                {/* permanet Address */}
                <Form.Item className='px-7' style={{ marginBottom: 0, marginTop: 10 }} label="Address" name="address1">
                    <Input style={{ float: "right", width: filedWidth }} data-type="1" placeholder="Address" name="address1" value={addressFields.address1} onChange={AddressInputsOnchange}/>
                </Form.Item>

                <Form.Item className='px-7' style={{ marginBottom: 0, marginTop: 10 }} label="City" name="city">
                    <Input style={{ float: "right", width: filedWidth }} data-type="1" placeholder="City" name="city" value={addressFields.city} onChange={AddressInputsOnchange}/>
                </Form.Item>

                <Form.Item className='px-7' style={{ marginBottom: 0, marginTop: 10 }} label="State" name="state">
                    <Input style={{ float: "right", width: filedWidth }} data-type="1" placeholder="State" name="state" value={addressFields.city} onChange={AddressInputsOnchange}/>
                </Form.Item>

                <Form.Item className='px-7' style={{ marginBottom: 0, marginTop: 10 }} label="Country" name="country">
                    <Input style={{ float: "right", width: filedWidth }} data-type="1" placeholder="Country" name="country" value={addressFields.country} onChange={AddressInputsOnchange}/>
                </Form.Item>

                <Form.Item className='px-7' style={{ marginBottom: 0, marginTop: 10 }} label="Postal Code" name="postalCode">
                    <Input style={{ float: "right", width: filedWidth }} data-type="1" placeholder="postal Code" name="postalCode" value={addressFields.country} onChange={AddressInputsOnchange}/>
                </Form.Item>

                <h2 className='mt-10 px-7 text-lg'>Current Address :</h2>
                {/* cureent Address */}
                <Form.Item className='px-7' style={{ marginBottom: 0, marginTop: 10 }} label="Address" name="address1">
                    <Input data-type="2" style={{ float: "right", width: filedWidth }} placeholder="Address" name="address1" value={currentAddFields.address1} onChange={cureentInputsOnchange}/>
                </Form.Item>

                <Form.Item className='px-7' style={{ marginBottom: 0, marginTop: 10 }} label="City" name="city">
                    <Input data-type="2" style={{ float: "right", width: filedWidth }} placeholder="City" name="city" value={currentAddFields.city} onChange={cureentInputsOnchange}/>
                </Form.Item>

                <Form.Item className='px-7' style={{ marginBottom: 0, marginTop: 10 }} label="State" name="state">
                    <Input data-type="2" style={{ float: "right", width: filedWidth }} placeholder="State" name="state" value={currentAddFields.city} onChange={cureentInputsOnchange}/>
                </Form.Item>

                <Form.Item className='px-7' style={{ marginBottom: 0, marginTop: 10 }} label="Country" name="country">
                    <Input data-type="2" style={{ float: "right", width: filedWidth }} placeholder="Country" name="country" value={currentAddFields.country} onChange={cureentInputsOnchange}/>
                </Form.Item>

                <Form.Item className='px-7' style={{ marginBottom: 0, marginTop: 10 }} label="Postal Code" name="postalCode">
                    <Input data-type="2" style={{ float: "right", width: filedWidth }} placeholder="postal Code" name="postalCode" value={currentAddFields.country} onChange={cureentInputsOnchange}/>
                </Form.Item>

            </Form>

        </section>
    )
});

export default AddressForm