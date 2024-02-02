import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { Form, Input, Checkbox, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { getAddress, postAddress } from "../redux/slices/addressSlice";

const filedWidth = "760px";

const AddressForm = forwardRef((props, ref) => {

  const dispatch = useDispatch();
  
  useEffect(()=>{
    dispatch(getAddress());
  },[]);

  const [form] = Form.useForm();
  // Address inputs
  // type 1 -current address
  // type 2 - permanet address
  const { newempid, addressPostProcessBar,receiveCurrentAddData,receivePermenantAddData } = props;
  const [currentAddFields, setCurrentAddFields] = useState({
    employeeId: newempid,
    address1: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    isdeleted: false,
    type: 1,
  });
  const [addressFields, setAddressFields] = useState({
    employeeId: newempid,
    address1: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    isdeleted: false,
    type: 2,
  });

  const inputFiledsChange = (e) => {
    const { name, value, dataset } = e.target;
    const type = dataset.type;
    if (type === "1") {
      setCurrentAddFields((pre) => ({ ...pre, [name]: value }));
    } else if (type === "2") {
      setAddressFields((pre) => ({ ...pre, [name]: value }));
    }
  };
  const [check, setCheck] = useState(false);
  // check box
  const CheckboxChange = (e) => {
    const isChecked = e.target.checked;
    if (isChecked === true) {
      setCheck(true);
      form.setFieldsValue({
        Addaddress1: currentAddFields.address1,
        Addcity: currentAddFields.city,
        Addstate: currentAddFields.state,
        Addcountry: currentAddFields.country,
        AddpostalCode: currentAddFields.postalCode,
      });
      setAddressFields((prev) => ({
        ...prev,
        address1: currentAddFields.address1,
        city: currentAddFields.city,
        state: currentAddFields.state,
        country: currentAddFields.country,
        postalCode: currentAddFields.postalCode,
      }));
    } else if (isChecked === false) {
      setCheck(false);
      form.setFieldsValue({
        Addaddress1: null,
        Addcity: null,
        Addstate: null,
        Addcountry: null,
        AddpostalCode: null,
      });
      setAddressFields((prev) => ({
        ...prev,
        address1: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
      }));
    }
  };

  // post address data next btn
  const addredValidateDate = async () => {
    
    if (
      currentAddFields.address1 === "" ||
      currentAddFields.city === "" ||
      currentAddFields.state === "" ||
      currentAddFields.country === "" ||
      currentAddFields.postalCode === "" ||
      addressFields.address1 === "" ||
      addressFields.city === "" ||
      addressFields.state === "" ||
      addressFields.country === "" ||
      addressFields.postalCode === ""
    ) {
      message.error("fill the all the fields");
    } else {
      await dispatch(postAddress(currentAddFields));
      await dispatch(postAddress(addressFields));
      await dispatch (getAddress());
      await addressPostProcessBar();
    }
  //   receiveCurrentAddData(currentAddFields);
  //   receivePermenantAddData(addressFields);
  //  addressPostProcessBar();
  };



  // send fn on child to parent
  useImperativeHandle(ref, () => {
    return {
      addredValidateDate: addredValidateDate,
    };
  });



  return (
    <section>
      <div className="mt-5 flex justify-center items-center">
        <FontAwesomeIcon className="text-2xl " icon={faLocationDot} />
      </div>
      {/* cureent Address */}
      <Form form={form} className="mt-10">
        <h2 className=" px-7 mt-10 text-lg">Current Address :</h2>
        <Form.Item
          data-type="1"
          className="px-7"
          style={{ marginBottom: 0, marginTop: 10 }}
          label="Address"
          name="address1"
        >
          <Input
            data-type="1"
            style={{ float: "right", width: filedWidth }}
            placeholder="Address"
            name="address1"
            value={currentAddFields.address1}
            onChange={inputFiledsChange}
          />
        </Form.Item>

        <Form.Item
          data-type="1"
          className="px-7"
          style={{ marginBottom: 0, marginTop: 10 }}
          label="City"
          name="city"
        >
          <Input
            data-type="1"
            style={{ float: "right", width: filedWidth }}
            placeholder="City"
            name="city"
            value={currentAddFields.city}
            onChange={inputFiledsChange}
          />
        </Form.Item>

        <Form.Item
          data-type="1"
          className="px-7"
          style={{ marginBottom: 0, marginTop: 10 }}
          label="State"
          name="state"
        >
          <Input
            data-type="1"
            style={{ float: "right", width: filedWidth }}
            placeholder="State"
            name="state"
            value={currentAddFields.state}
            onChange={inputFiledsChange}
          />
        </Form.Item>

        <Form.Item
          data-type="1"
          className="px-7"
          style={{ marginBottom: 0, marginTop: 10 }}
          label="Country"
          name="country"
        >
          <Input
            data-type="1"
            style={{ float: "right", width: filedWidth }}
            placeholder="Country"
            name="country"
            value={currentAddFields.country}
            onChange={inputFiledsChange}
          />
        </Form.Item>

        <Form.Item
          data-type="1"
          className="px-7"
          style={{ marginBottom: 0, marginTop: 10 }}
          label="Postal Code"
          name="postalCode"
        >
          <Input
            data-type="1"
            style={{ float: "right", width: filedWidth }}
            placeholder="postal Code"
            name="postalCode"
            value={currentAddFields.postalCode}
            onChange={inputFiledsChange}
          />
        </Form.Item>

        {/* check-box */}
        <div className="px-7 mt-3 ">
          <Checkbox className="shadow-2xl" onChange={CheckboxChange} />
          <span className="px-3 text-red-500">
            cureent address same as permanet address
          </span>
        </div>

        {/* permanet Address */}
        <h2 className="mt-5 px-7 text-lg">Permanet Address :</h2>
        <Form.Item
          data-type="2"
          className="px-7"
          style={{ marginBottom: 0, marginTop: 10 }}
          label="Address"
          name="Addaddress1"
        >
          <Input
            style={{ float: "right", width: filedWidth }}
            data-type="2"
            placeholder="Address"
            name="address1"
            value={addressFields.address1}
            onChange={inputFiledsChange}
            disabled={check}
          />
        </Form.Item>

        <Form.Item
          data-type="2"
          className="px-7"
          style={{ marginBottom: 0, marginTop: 10 }}
          label="City"
          name="Addcity"
        >
          <Input
            style={{ float: "right", width: filedWidth }}
            data-type="2"
            placeholder="City"
            name="city"
            value={addressFields.city}
            onChange={inputFiledsChange}
            disabled={check}
          />
        </Form.Item>

        <Form.Item
          data-type="2"
          className="px-7"
          style={{ marginBottom: 0, marginTop: 10 }}
          label="State"
          name="Addstate"
        >
          <Input
            style={{ float: "right", width: filedWidth }}
            data-type="2"
            placeholder="State"
            name="state"
            value={addressFields.state}
            onChange={inputFiledsChange}
            disabled={check}
          />
        </Form.Item>

        <Form.Item
          data-type="2"
          className="px-7"
          style={{ marginBottom: 0, marginTop: 10 }}
          label="Country"
          name="Addcountry"
        >
          <Input
            style={{ float: "right", width: filedWidth }}
            data-type="2"
            placeholder="Country"
            name="country"
            value={addressFields.country}
            onChange={inputFiledsChange}
            disabled={check}
          />
        </Form.Item>

        <Form.Item
          data-type="2"
          className="px-7"
          style={{ marginBottom: 0, marginTop: 10 }}
          label="Postal Code"
          name="AddpostalCode"
        >
          <Input
            style={{ float: "right", width: filedWidth }}
            data-type="2"
            placeholder="postal Code"
            name="postalCode"
            value={addressFields.postalCode}
            onChange={inputFiledsChange}
            disabled={check}
          />
        </Form.Item>
      </Form>
    </section>
  );
});

export default AddressForm;
