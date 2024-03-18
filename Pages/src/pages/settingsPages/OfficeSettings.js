import {
  Button,
  Form,
  Table,
  message,
  Modal,
  Input,
  Popconfirm,
  Divider,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createOffice,
  deleteOfficeAsync,
  getOffice,
  updateOfficeAsync,
} from "../../redux/slices/officeSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faPen,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

const OfficeSettings = ({ BackToSetting }) => {
  const columns = [
    {
      title: "S.No",
      dataIndex: "serialno",
      width: "5%",
    },
    {
      title: "Office Name",
      dataIndex: "officename",
      width: "25%",
    },
    {
      title: "Address",
      dataIndex: "address",
      width: "25%",
    },
    {
      title: "City",
      dataIndex: "city",
      width: "15%",
    },
    {
      title: "State",
      dataIndex: "state",
      width: "20%",
    },
    {
      title: "Country",
      dataIndex: "country",
      width: "40%",
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (text, record) => (
        <div className="flex gap-x-2">
          <Popconfirm
            title="Are you sure to delete this office?"
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              style: { backgroundColor: "red", color: "white" },
            }}
            onConfirm={() => DleteOffice(record.key)}
          >
            <Button type="link">
              <FontAwesomeIcon color="#fd5353" icon={faTrash} />
            </Button>
          </Popconfirm>

          <Button type="link" onClick={() => EditOfficeIcon(record.key)}>
            <FontAwesomeIcon icon={faPen} color="#000000" />
          </Button>
        </div>
      ),
    },
  ];

  const [popupBtnChange, setPopUpBtnChange] = useState(false);
  const [TableofficeData, setTableofficeData] = useState([]);
  const [newOfficePopup, setNewOfficePopup] = useState(false);
  const [officeField, setOfficeFileld] = useState({
    // id: '',
    officename: "",
    address: "",
    city: "",
    state: "",
    country: "",
    isdeleted: false,
  });

  const [officeId, setOfficeId] = useState("");
  const ClearFiled = () => {
    setOfficeFileld({
      // id: '',
      officename: "",
      address: "",
      city: "",
      state: "",
      country: "",
    });
  };

  const dispatch = useDispatch();
  const { office } = useSelector((state) => state.office);

  const handleOk = () => {
    ClearFiled();
    setNewOfficePopup(false);
    setPopUpBtnChange(false);
  };
  const handleCancel = () => {
    ClearFiled();
    setNewOfficePopup(false);
    setPopUpBtnChange(false);
  };

  const officeInputData = (e) => {
    const { name, value } = e.target;
    setOfficeFileld((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createNewOffice = () => {
    if (
      officeField.officename === "" ||
      officeField.address === "" ||
      officeField.city === "" ||
      officeField.country === "" ||
      officeField.state === ""
    ) {
      message.error("Fill all the fields");
    } else {
      dispatch(createOffice(officeField));
      message.success("New office created successfully");
      setNewOfficePopup(false);
      ClearFiled();
      setTableofficeData(office);
    }
  };

  const TbOfficeDataFilter =
    TableofficeData.length > 0
      ? TableofficeData.filter((data) => data.isdeleted === false)
      : [];
  const TbOfficeData = TbOfficeDataFilter.map((office, i) => ({
    key: office.id,
    serialno: i + 1,
    officename: office.officename,
    address: office.address,
    city: office.city,
    state: office.state,
    country: office.country,
    isdeleted: office.isdeleted,
  }));

  const EditOfficeIcon = async (key) => {
    await setOfficeId(key);
    var EditableData = TbOfficeData.filter((x) => x.key === key);
    setOfficeFileld({
      //id: key,
      officename: EditableData[0].officename,
      address: EditableData[0].address,
      city: EditableData[0].city,
      state: EditableData[0].state,
      country: EditableData[0].country,
    });
    setNewOfficePopup(true);
    setPopUpBtnChange(true);
  };

  const EditOffice = async () => {
    if (
      officeField.officename === "" ||
      officeField.address === "" ||
      officeField.city === "" ||
      officeField.country === "" ||
      officeField.state === ""
    ) {
      message.error("Fill all the fields");
    } else {
      //console.log(officeField);
      const filterOff = await office.filter((data) => data.id === officeId);
      const updatedOfficeData = {
        id: officeId,
        officename: officeField.officename,
        address: officeField.address,
        city: officeField.city,
        state: filterOff[0].state,
        country: officeField.country,
        isdeleted: false,
        createdBy: filterOff[0].createdBy,
        createdDate: filterOff[0].createdDate,
        modifiedBy: filterOff[0].modifiedBy,
        modifiedDate: filterOff[0].modifiedDate,
      };
      //console.log(updatedOfficeData);
      dispatch(updateOfficeAsync(updatedOfficeData));
      setOfficeFileld({
        id: "",
        officename: "",
        address: "",
        city: "",
        state: "",
        country: "",
      });
      setNewOfficePopup(false);
      message.success("save successfully");
    }
  };

  const DleteOffice = (key) => {
    // soft Delete
    var DeleteData = office.filter((x) => x.id === key);
    const IsFalseOffice = {
      id: key,
      officename: DeleteData[0].officename,
      address: DeleteData[0].address,
      city: DeleteData[0].city,
      state: DeleteData[0].state,
      country: DeleteData[0].country,
      isdeleted: true,
      modifiedBy: DeleteData[0].modifiedBy,
      modifiedDate: DeleteData[0].modifiedDate,
      createdBy: DeleteData[0].createdBy,
      createdDate: DeleteData[0].createdDate,
    };
    // console.log(IsFalseOffice);
    dispatch(updateOfficeAsync(IsFalseOffice));
    message.success("Office deleted successfully");

    // // Hard Delete
    // dispatch(deleteOfficeAsync(key));
    // message.success("Office deleted successfully")
  };

  useEffect(() => {
    dispatch(getOffice());
  }, [dispatch]);

  useEffect(() => {
    setTableofficeData(office);
  }, [DleteOffice, dispatch, EditOffice]);

  return (
    <>
      <ul className="flex flex-col md:flex-row gap-y-3 md:items-center justify-between">
        <li>
          <h2 className="text-xl">Office Settings</h2>
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
            onClick={() => setNewOfficePopup(true)}
            type="primary"
            className="bg-blue-500 flex items-center justify-center gap-x-1"
          >
            <span>Add New Office</span>
            <FontAwesomeIcon icon={faPlus} className="icon" />
          </Button>
        </li>
      </ul>

      <Divider />

      <div className="overflow-x-scroll md:overflow-x-hidden">
        <Table
        style={{ marginTop: 10 }}
          bordered
          columns={columns}
          dataSource={TbOfficeData}
          pagination={{
              pageSize: 5
          }}
        />
      </div>

      <Modal
      centered={true}
        title="Add New Office"
        open={newOfficePopup}
        onCancel={handleCancel}
        onOk={handleOk}
        footer={[
          popupBtnChange === false ? (
            <Button key="1" onClick={createNewOffice}>
              Add
            </Button>
          ) : (
            <Button key="1" onClick={EditOffice}>
              Save
            </Button>
          ),
          <Button
            type="text"
            key="2"
            danger="red"
            style={{ border: "0.5px solid red" }}
            onClick={handleCancel}
          >
            Close
          </Button>,
        ]}
      >
        <Form layout="vertical" className="mt-3">
          {/* officename */}
          <Form.Item className="mb-2" label="Office Name">
            <Input
              placeholder="office name"
              name="officename"
              value={officeField.officename}
              onChange={officeInputData}
            />
          </Form.Item>

          {/* Address */}
          <Form.Item className="mb-2" label="Address">
            <Input
              placeholder="address"
              name="address"
              value={officeField.address}
              onChange={officeInputData}
            />
          </Form.Item>

          {/* City */}
          <Form.Item className="mb-2" label="City">
            <Input
              placeholder="city"
              name="city"
              value={officeField.city}
              onChange={officeInputData}
            />
          </Form.Item>

          {/* State */}
          <Form.Item className="mb-2" label="State">
            <Input
              placeholder="state"
              name="state"
              value={officeField.state}
              onChange={officeInputData}
            />
          </Form.Item>

          {/* Country */}
          <Form.Item className="mb-2"
            label="Country"
            style={{ marginBottom: 10, marginTop: 10 }}
          >
            <Input
              placeholder="country"
              name="country"
              value={officeField.country}
              onChange={officeInputData}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default OfficeSettings;
