import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Table, Space, Col, Input, Divider, Button, Row, Modal, Form, Select, DatePicker, message, Upload, Alert } from 'antd';
import { UploadOutlined, DownloadOutlined, InboxOutlined } from '@ant-design/icons';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from 'react-redux';
import { getSalary, postSalary } from '../redux/slices/salarySlice';
import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';


const { Dragger } = Upload;


const Salary = ({ excelData, fileName }) => {
  // const [excelFileName,setExcelFileName] = useState(null);
  const [xlFileResponse, setxlFileResponse] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const props = {
    name: 'file',
    accept: 'multipart/form-data',
    multiple: true,
    action: 'https://localhost:7129/api/XlSalary/api/excel/upload',
    onChange(info) {
      const { status } = info.file;
      console.log(info.file);

      if (status !== 'uploading') {
        console.log(info.file.response);
        // console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
        
      } else if (status === 'error') {
        if (info.file.response) {
          const Names = info.file.response.unmatchedEmployees.map(name => `${name}`);
          setUploadError(`Unmatched Employee Id " ${Names.join(', ')} ",Please Update Employee Id.`);
          // setxlFileResponse(info.file.response);
        }
        // setUploadError(`${info.file.name} file upload failed.`);
        //  message.error(`${info.file.response.unmatchedEmployees
        //  } file upload failed.`);
        else {
          // Render generic error message if response is not available
          setUploadError(`${info.file.name} file upload failed.`);
        }
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { salary } = useSelector(state => state.salary);

  const { employee } = useSelector((state) => state.employee);

  const [tableDATA, setTableDATA] = useState();

  const [employeeSalary, setEmployeeSalary] = useState({
    id: null,
    employeeId: null,
    employeeName: "",
    ctc: "",
    grossSalary: "",
    netSalary: "",
    salaryDate: null,
    isRevised: true,
    createdDate: "",
    createdBy: "",
    modifiedDate: "",
    modifiedBy: "",
    isDeleted: false
  });
  useEffect(() => {
    dispatch(getSalary());
    setTableDATA(salary);
  }, []);

  const clearFields = () => {
    setEmployeeSalary(pre => ({
      ...pre,
      id: "",
      employeeId: "",
      gross: "",
      net: "",
      salaryDate: "",
      isRevised: true,
      isDeleted: false,
    }));
  };

  const [SalaryModal, setSalaryModal] = useState(false);
  const SalaryModalOpen = () => {
    setSalaryModal(true);
    clearFields();
  };
  const SalaryModalClose = () => { setSalaryModal(false) };

  const [excelModal, setExcelModal] = useState(false);
  const OpenExcelModal = () => { setExcelModal(true) };
  const CloseExcelModal = () => {
    setExcelModal(false);
    setUploadError(null);
    setxlFileResponse(null);
  };

  const [searchText, setSearchText] = useState("");
  const columns = [
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      key: 'name',
      render: (text) => <a>{text}</a>,
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return (
          String(record.employeeName)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.grossSalary)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.netSalary).toLowerCase().includes(value.toLowerCase()) ||
          String(record.salaryDate)
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      },
    },
    {
      title: 'Gross Salary',
      dataIndex: 'grossSalary',
      key: 'grossSalary',
      sorter: {
        compare: (a, b) => {
          const grossA = moment(a.grossSalary);
          const grossB = moment(b.grossSalary);
          return grossA - grossB;
        },
        multiple: 3,
      },
    },
    {
      title: 'Net Salary',
      dataIndex: 'netSalary',
      key: 'net',
      sorter: {
        compare: (a, b) => {
          const netA = moment(a.netSalary);
          const netB = moment(b.netSalary);
          return netA - netB;
        },
        multiple: 3,
      },
    },
    {
      title: 'Salary Date',
      dataIndex: 'salaryDate',
      key: 'salaryDate',
      sorter: {
        compare: (a, b) => {
          const dateA = moment(a.salaryDate);
          const dateB = moment(b.salaryDate);
          return dateA - dateB;
        },
        multiple: 3,
      },
    },
  ];

  //Import Excel Modal Ok Button Function
  const handleOkButtonClick = async () => {
    try {
      const filterFiles = xlFileResponse.length > 0 ? xlFileResponse : null;

      const newDatas = filterFiles === null ? null : xlFileResponse.map(data => ({
        employeeId: data.employeeId,
        ctc: data.ctc,
        grossSalary: data.grossSalary,
        netSalary: data.netSalary,
        salaryDate: data.salaryDate,
        isRevised: true,
        createdDate: formattedDate,
        createdBy: data.createdBy,
        modifiedDate: formattedDate,
        modifiedBy: data.modifiedBy,
        isDeleted: false
      }));
      for (const data of newDatas) {
        await dispatch(postSalary(data));
      }
      await dispatch(getSalary());
      setUploadError(null);
      setExcelModal(false);
    } catch (error) {
      console.error('Error posting salary:', error);
      // Handle the error, display a user-friendly message, retry logic, etc.
      // You might want to set an error state or display a notification to the user
    }
  };

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 19);

  const replaceDate = (date) => {
    const parts = date === null ? null : date.split("/");
    const convertedDate = parts === null ? null : parts.join("-");
    return convertedDate;
  };

  const replaceTime = (date) => {
    const DateAndTime = date === null ? null : date.split('T');
    return DateAndTime && DateAndTime.length > 0 ? DateAndTime[0] : null
  };

  const FilterData = salary && salary.length > 0 ? salary.filter(item => item.isDeleted === false) : [];

  //Displaying Table Data
  const TableData = FilterData.map((sl, i) => ({
    key: sl.id,
    employeeName: sl.employeeName,
    grossSalary: sl.grossSalary,
    netSalary: sl.netSalary,
    salaryDate: replaceTime(sl.salaryDate),

  }));

  useEffect(() => {
    dispatch(getSalary());
  }, [dispatch])

  const ExporttoExcel = () => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    // Check if excelData is available
    if (!tableDATA) {
      message.error("No data available for export");
    } else {
      const ws = XLSX.utils.json_to_sheet(tableDATA);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, "ExcelExport" + fileExtension);
    }
  };

  //Pay Salary Button Function
  const PostSalary = async () => {
    if (
      !employeeSalary.grossSalary ||
      !employeeSalary.netSalary ||
      !employeeSalary.salaryDate
    ) {
      message.error("Please Fill all the Fields!")
    } else {
      const addSalary = {
        employeeId: employeeSalary.employeeId,
        // ctc:employeeSalary.ctc,
        grossSalary: employeeSalary.grossSalary,
        netSalary: employeeSalary.netSalary,
        salaryDate: replaceDate(employeeSalary.salaryDate),
        isRevised: employeeSalary.isRevised,
        // createdDate:employeeSalary.createdDate,
        // createdBy:employeeSalary.createdBy,
        // modifiedDate:employeeSalary.modifiedDate,
        // modifiedBy:employeeSalary.modifiedBy,
        isDeleted: employeeSalary.isDeleted
      };
      try {
        await dispatch(postSalary(addSalary));
        dispatch(getSalary());
        SalaryModalClose();
        message.success("Payment Successfull!");
      } catch (error) {
        console.error('Error posting salary:', error);
      }
    }

  };

  //Gross Salary Input
  const grossSalaryChange = (e) => {
    setEmployeeSalary((pre) => ({ ...pre, grossSalary: e.target.value }));
  };

  //Net Salary Input
  const netSalaryChange = (e) => {
    setEmployeeSalary((pre) => ({ ...pre, netSalary: e.target.value }));
  };

  //Employee Dropdown option
  const employeeOption = [
    { label: 'Select an Employee', value: null },
    ...employee.filter(empacc => !empacc.isDeleted).map(emp => ({
      label: emp.firstName,
      value: emp.id
    })),
  ];

  //Employee Dropdown
  const employeeNameDropdowninProduct = (data, value) => {
    console.log(value.value);
    setEmployeeSalary((pre) => ({ ...pre, employeeId: value.value }));
  }

  //salary
  const salaryDateChange = (date) => {
    setEmployeeSalary((pre) => ({
      ...pre,
      salaryDate: date ? date.format('YYYY/MM/DD') : null,
    }));
  };

  return (
    <>
      <Row justify="space-between" align="middle" gutter={12} className="flex justify-between items-center">
        <Col span={10} >
          <Input.Search
            className="block w-fit"
            placeholder="Search here...."
            onSearch={(value) => {
              setSearchText(value);
            }}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
        </Col>

        <Col justify="flex-end" style={{ left: "20%" }} >
          <Button onClick={(e) => ExporttoExcel(fileName)} type="primary" className="bg-blue-500 flex items-center gap-x-1 float-right mb-3 mt-3" icon={<UploadOutlined />} >
            Export Excel
          </Button>
        </Col>

        <Col justify="flex-end" style={{ left: "10%" }} >
          <Button onClick={OpenExcelModal} type="primary" className="bg-blue-500 flex items-center gap-x-1 float-right mb-3 mt-3" icon={<DownloadOutlined />} >
            Import Excel
          </Button>
        </Col>

        <Col justify="flex-end" style={{ right: "0%" }} >
          <Button
            onClick={SalaryModalOpen}
            type="primary"
            className="bg-blue-500 flex items-center gap-x-1 float-right mb-3 mt-3"
          >
            <FontAwesomeIcon icon={faPlus} className="icon" />{" "}
            <span >Pay Salary</span>
          </Button>
        </Col>

      </Row>
      <Divider />
      <div>
        <Table dataSource={TableData} columns={columns} pagination={{ pageSize: 6, }} onChange={onChange} />
      </div>

      <Modal
        title="Pay Salary"
        open={SalaryModal}
        onCancel={SalaryModalClose}
        width={"550px"}
        footer={[
          <Button key="1"
            onClick={PostSalary}
          >
            Pay
          </Button>,
          <Button key="2"
            onClick={() => SalaryModalClose()}
          >
            Cancel
          </Button>
        ]}
      >
        <Form form={form}>

          <Form.Item
            label="Employee Name"
            style={{ marginBottom: 0, marginTop: 10 }}
          >
            <Select
              showSearch
              style={{ width: "380px", float: "right" }}
              placeholder="Select Employee Name"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={employeeSalary.employeeId || undefined}
              onChange={employeeNameDropdowninProduct}
            >
              {employeeOption.map((employee) => (
                <Select.Option key={employee.value} value={employee.value}>
                  {employee.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Gross Salary"
            style={{ marginBottom: 0, marginTop: 10 }}
          >
            <Input
              style={{ width: "380px", float: "right" }}
              placeholder="Gross Salary"
              name="grossSalary"
              value={employeeSalary.grossSalary}
              onChange={grossSalaryChange}
            />
          </Form.Item>

          <Form.Item
            label="Net Salary"
            style={{ marginBottom: 0, marginTop: 10 }}
          >
            <Input
              style={{ width: "380px", float: "right" }}
              placeholder="Net Salary"
              name="netSalary"
              value={employeeSalary.netSalary}
              onChange={netSalaryChange}
            />

          </Form.Item>

          <Form.Item
            label="Salary Date"
            style={{ marginBottom: 0, marginTop: 10 }}
          >
            <DatePicker style={{ width: "380px", float: "right" }} value={employeeSalary.salaryDate ? moment(employeeSalary.salaryDate, 'YYYY/MM/DD') : null} onChange={salaryDateChange}></DatePicker>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={excelModal}
        onCancel={CloseExcelModal}
        // width={1000}
        footer={[
          <Button key="1"
            onClick={() => handleOkButtonClick()}
          >
            Ok
          </Button>,
          <Button key="2"
            onClick={() => CloseExcelModal()}
          >
            Cancel
          </Button>
        ]}
      >

        <div className='px-4 pt-5'>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibited from uploading company data or other
              banned files.
            </p>
          </Dragger>
        </div>
        <Divider />
        {uploadError && <Alert message={uploadError} type="error" />}
      </Modal>
    </>
  );
};

export default Salary;