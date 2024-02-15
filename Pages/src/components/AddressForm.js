import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Form, Input, Checkbox, message, Row, Col } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const filedWidth = "760px";

const AddressForm = forwardRef((props, ref) => {
  const [form] = Form.useForm();
  const {
    addressPostProcessBar, //process bar
    FormCAdd, //cureent add state
    FormPAdd, //permanent add state
    CheckBoxF, //check box state
    UpdateCAdd, //cureent onchange
    UpdatePAdd, //permanent onchange
    UpdateCheckBox, //checkbox onchange
  } = props;

  //onchange
  const inputFiledsChange = (e) => {
    const { name, value, dataset } = e.target;
    const type = dataset.type;
    if (type === "1") {
      UpdateCAdd({ [name]: value });
      //validation
      if (name === "postalCode") {
        isNaN(value) === false
          ? setPNumberValidate(false)
          : setPNumberValidate(true);
      }
    } else if (type === "2") {
      UpdatePAdd({ [name]: value });
      //validation
      if (name === "postalCode") {
        isNaN(value) === false
          ? setCNumberValidate(false)
          : setCNumberValidate(true);
      }
    }
  };

  // check box
  const CheckboxChange = (e) => {
    const isChecked = e.target.checked;
    if (isChecked === true) {
      UpdateCheckBox(true);
      form.setFieldsValue({
        Addaddress1: FormCAdd.address1,
        Addcity: FormCAdd.city,
        Addstate: FormCAdd.state,
        Addcountry: FormCAdd.country,
        AddpostalCode: FormCAdd.postalCode,
      });

      UpdatePAdd({
        address1: FormCAdd.address1,
        city: FormCAdd.city,
        state: FormCAdd.state,
        country: FormCAdd.country,
        postalCode: FormCAdd.postalCode,
        isdeleted: false,
        type: 2,
      });
    } else if (isChecked === false) {
      UpdateCheckBox(false);
      form.setFieldsValue({
        Addaddress1: null,
        Addcity: null,
        Addstate: null,
        Addcountry: null,
        AddpostalCode: null,
      });
      UpdatePAdd({
        address1: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        isdeleted: false,
        type: 2,
      });
    }
  };
  const [CNumberValidate, setCNumberValidate] = useState(false);
  const [PNumberValidate, setPNumberValidate] = useState(false);
  // post address data next btn
  const addredValidateDate = () => {
    if (
      FormCAdd.address1 === "" ||
      FormCAdd.address1 === null ||
      FormCAdd.city === "" ||
      FormCAdd.city === null ||
      FormCAdd.state === "" ||
      FormCAdd.state === null ||
      FormCAdd.country === "" ||
      FormCAdd.country === null ||
      FormCAdd.postalCode === "" ||
      FormCAdd.postalCode === null ||
      FormPAdd.address1 === "" ||
      FormPAdd.address1 === null ||
      FormPAdd.city === "" ||
      FormPAdd.city === null ||
      FormPAdd.state === "" ||
      FormPAdd.state === null ||
      FormPAdd.country === "" ||
      FormPAdd.country === null ||
      FormPAdd.postalCode === "" ||
      FormPAdd.postalCode === null
    ) {
      message.error("fill the all the fields");
    } else if (isNaN(FormPAdd.postalCode) === true) {
      //true
      message.error("please check the postal code");
      setPNumberValidate(true);
    } else if (isNaN(FormCAdd.postalCode) === true) {
      //true
      message.error("please check the postal code");
      setCNumberValidate(true);
    } else {
      addressPostProcessBar();
    }
    //addressPostProcessBar();
  };

  // send fn on child to parent
  useImperativeHandle(ref, () => {
    return {
      addredValidateDate: addredValidateDate,
    };
  });

  return (
    <section className="h-[59.9vh]">
      {/* <div className="mt-2 flex justify-center items-center">
        <FontAwesomeIcon className="text-2xl " icon={faLocationDot} />
      </div> */}
      {/* permanet  Address */}
      <Form form={form} className="mt-5" layout="vertical">
       
        <Row>
          <Col span={12}>
            <h2 className=" px-7 mt-4 text-lg">Permanet Address :</h2>
            <Form.Item
              data-type="1"
              className="px-7"
              style={{ marginBottom: 0, marginTop: 7 }}
              label="Address"
              name="address1"
            >
              <Input
                data-type="1"
                // style={{ width: filedWidth }}
                placeholder="Address"
                name="address1"
                value={FormCAdd.address1}
                onChange={inputFiledsChange}
                defaultValue={FormCAdd.address1}
              />
            </Form.Item>

            <Form.Item
              data-type="1"
              className="px-7"
              style={{ marginBottom: 0, marginTop: 7 }}
              label="City"
              name="city"
            >
              <Input
                data-type="1"
                // style={{ width: filedWidth }}
                placeholder="City"
                name="city"
                value={FormCAdd.city}
                onChange={inputFiledsChange}
                defaultValue={FormCAdd.city}
              />
            </Form.Item>

            <Form.Item
              data-type="1"
              className="px-7"
              style={{ marginBottom: 0, marginTop: 7 }}
              label="State"
              name="state"
            >
              <Input
                data-type="1"
                // style={{ width: filedWidth }}
                placeholder="State"
                name="state"
                value={FormCAdd.state}
                onChange={inputFiledsChange}
                defaultValue={FormCAdd.state}
              />
            </Form.Item>

            <Form.Item
              data-type="1"
              className="px-7"
              style={{ marginBottom: 0, marginTop: 7 }}
              label="Country"
              name="country"
            >
              <Input
                data-type="1"
                // style={{ width: filedWidth }}
                placeholder="Country"
                name="country"
                value={FormCAdd.country}
                onChange={inputFiledsChange}
                defaultValue={FormCAdd.country}
              />
            </Form.Item>

            <Form.Item
              data-type="1"
              className="px-7"
              style={{ marginBottom: 0, marginTop: 7 }}
              label="Postal Code"
              name="postalCode"
              // rules={[
              //   {
              //     type: "number",
              //   },
              // ]}
              validateStatus={PNumberValidate === true ? "error" : ""}
              //help={form.getFieldError("postalCode")}
              pattern="[0-9]*"
            >
              <Input
                data-type="1"
                // style={{ width: filedWidth }}
                placeholder="postal Code"
                name="postalCode"
                value={FormCAdd.postalCode}
                onChange={inputFiledsChange}
                defaultValue={FormCAdd.postalCode}
              />
            </Form.Item>
          </Col>
          
          
          <Col span={12}>
            {/* current Address */}
            <h2 className="mt-4 px-7 text-lg">Current Address :</h2>
            <Form.Item
              data-type="2"
              className="px-7"
              style={{ marginBottom: 0, marginTop: 7 }}
              label="Address"
              name="Addaddress1"
            >
              <Input
                // style={{ width: filedWidth }}
                data-type="2"
                placeholder="Address"
                name="address1"
                value={FormPAdd.address1}
                onChange={inputFiledsChange}
                // disabled={CheckBoxF}
                defaultValue={FormPAdd.address1}
              />
            </Form.Item>

            <Form.Item
              data-type="2"
              className="px-7 "
              style={{ marginBottom: 0, marginTop: 7 }}
              label="City"
              name="Addcity"
            >
              <Input
                // style={{ width: filedWidth }}
                data-type="2"
                placeholder="City"
                name="city"
                value={FormPAdd.city}
                onChange={inputFiledsChange}
                // disabled={CheckBoxF}
                defaultValue={FormPAdd.city}
              />
            </Form.Item>

            <Form.Item
              data-type="2"
              className="px-7"
              style={{ marginBottom: 0, marginTop: 7 }}
              label="State"
              name="Addstate"
            >
              <Input
                // style={{ width: filedWidth }}
                data-type="2"
                placeholder="State"
                name="state"
                value={FormPAdd.state}
                onChange={inputFiledsChange}
                // disabled={CheckBoxF}
                defaultValue={FormPAdd.state}
              />
            </Form.Item>

            <Form.Item
              data-type="2"
              className="px-7"
              style={{ marginBottom: 0, marginTop: 7 }}
              label="Country"
              name="Addcountry"
            >
              <Input
                // style={{ width: filedWidth }}
                data-type="2"
                placeholder="Country"
                name="country"
                value={FormPAdd.country}
                onChange={inputFiledsChange}
                // disabled={CheckBoxF}
                defaultValue={FormPAdd.country}
              />
            </Form.Item>

            <Form.Item
              data-type="2"
              className="px-7 "
              style={{ marginBottom: 0, marginTop: 7 }}
              label="Postal Code"
              name="AddpostalCode"
              // rules={[
              //   {
              //     type: "number",
              //   },
              // ]}
              validateStatus={CNumberValidate === true ? "error" : ""}
              //help={form.getFieldError("postalCode")}
              pattern="[0-9]*"
            >
              <Input
                // style={{ width: filedWidth }}
                data-type="2"
                placeholder="postal Code"
                name="postalCode"
                value={FormPAdd.postalCode}
                onChange={inputFiledsChange}
                // disabled={CheckBoxF}
                defaultValue={FormPAdd.postalCode}
              />
            </Form.Item>
          </Col>
        </Row>
         {/* check-box */}
         <div className="px-7  mt-2">
          <Checkbox
            className="shadow-2xl"
            onChange={CheckboxChange}
            checked={CheckBoxF}
          />
          <span className="px-3 text-red-500">
            cureent address same as permanet address
          </span>
        </div>
      </Form>
    </section>
  );
});

export default AddressForm;
