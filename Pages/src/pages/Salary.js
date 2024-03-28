import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Table,Input,Divider,Button,Modal,Form,Select,DatePicker,message, Upload,Alert} from 'antd';
import { UploadOutlined, DownloadOutlined, InboxOutlined} from '@ant-design/icons';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from 'react-redux';
import { getSalary, postSalary } from '../redux/slices/salarySlice';
import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';

const { Dragger } = Upload;

const Salary = ({fileName, officeData }) => {

  const [File, setFile] = useState(null);
  const [xlFileResponse, setxlFileResponse] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [key, setKey] = useState(0);
 
  const [messageapi, contextHolder] = message.useMessage();
  const errors =() =>{
    messageapi.open({
      type:'error',
      content:'Invalid Excel!'
    });
  }
  const props = {
    key: key,
    name: 'file',
    action: 'https://localhost:7129/api/XlSalary/api/excel/upload',
    onChange(info) {
      console.log(info);
      const { status } = info.file;
      if (status !== 'uploading') {
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
        setxlFileResponse(info.file.response);
        setFile(info.file.name);
        setUploadError(false);
      }
      else if (status === 'error') {
        if (info.file.response) {
          const Names = info.file.response.unmatchedEmployees.map(name => `${name}`);
          setUploadError(`This Employee Name(s) have do not have Employee Id " ${Names.join(', ')} ",Please Add Employee Id.`);
        }
        else {
          setUploadError(`${info.file.name} file upload failed.`);
        }
      }
      if (status === 'removed') {
        setUploadError(null);
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

  const [salaryData, setSalaryData] = useState([]);

  const [tableDATA, setTableDATA] = useState([]);

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
    setKey(prevKey => prevKey + 1);
  };

  const [SalaryModal, setSalaryModal] = useState(false);

  const SalaryModalOpen = () => {
    setSalaryModal(true);
    clearFields();
  };

  const SalaryModalClose = async () => {
    setSalaryModal(false);
    await setEmployeeSalary((pre) => ({ ...pre, grossSalary: "", netSalary: ""}));
  };

  const [excelModal, setExcelModal] = useState(false);
  const OpenExcelModal = () => {
    setExcelModal(true);
    setKey(prevKey => prevKey + 1);
  };

  const CloseExcelModal = () => {
    setExcelModal(false);
    setUploadError(null);
    setxlFileResponse(null);
    setFile(null);
    setKey(prevKey => prevKey + 1);
  };

  const [searchText, setSearchText] = useState(" ");

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

      const existingDates = TableData.map(item =>replaceTime(item.salaryDate));
      // console.log(existingDates);
      const matchingDataExists = newDatas.some(data => existingDates.includes(data.salaryDate));
      // console.log(matchingDataExists);
      
      if(matchingDataExists){
        setUploadError("Some Datas are already exists in the table!");
      }else{
        for (const data of newDatas) {
          await dispatch(postSalary(data));
        };
        await dispatch(getSalary());
        setUploadError(null);
        setExcelModal(false);
      } 
      }
      catch (error) {
      {errors()}
      console.error('Invalid Excel!', error);
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

  const FilterData = tableDATA && tableDATA.length > 0 ? tableDATA.filter(item => item.isDeleted === false) : [];

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
    if (!salary) {
      message.error("No data available for export");
    } else {
      const ws = XLSX.utils.json_to_sheet(salary);
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
        await setEmployeeSalary((pre) => ({ ...pre, grossSalary: "", netSalary: "" }));
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
    setEmployeeSalary((pre) => ({ ...pre, employeeId: value.value }));
  }

  //salary
  const salaryDateChange = (date) => {
    setEmployeeSalary((pre) => ({
      ...pre,
      salaryDate: date ? date.format('YYYY/MM/DD') : null,
    }));
  };

  function DataLoading() {
    var numberOfOffice = officeData.filter((off) => off.isdeleted === false);
    var officeNames = numberOfOffice.map((off) => {
      return off.officename;
    });
    if (officeNames.length === 1) {
      const filterOneOffice = salary ? salary.filter((salary) => salary.isDeleted === false && salary.officeName === officeNames[0]) : 0;
      setTableDATA(filterOneOffice);
    } else {
      const filterAllOffice = salary ? salary.filter((salary) => salary.isDeleted === false) : 0;
      setTableDATA(filterAllOffice);
    }
  };

  useEffect(() => {
    setSalaryData(salary);
    DataLoading();
  }, [salary, officeData]);

  return (
    <>
    {contextHolder}
      <ul className="flex flex-col lg:flex-row justify-between lg:items-center gap-y-3 gap-x-2 2xl:gap-x-0 xl:gap-y-0">
        <li className="grid grid-flow-col gap-x-10 items-center self-center xs:self-start">
          <Input.Search
            className=" w-fit hidden md:block"
            placeholder="Search here...."
            onSearch={(value) => {
              setSearchText(value);
            }}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
        </li>

        <li className="flex flex-col  xmm:flex-row gap-x-2 gap-y-3 lg:gap-y-0">
          <Button onClick={(e) => ExporttoExcel(fileName)} type="primary"
            className="bg-blue-500 flex justify-center items-center gap-x-1 w-full xs:w-fit"
            icon={<UploadOutlined />} >
            Export Excel
          </Button>

          <Button onClick={OpenExcelModal} type="primary"
            className="bg-blue-500 flex justify-center items-center gap-x-1 w-full xs:w-fit"
            icon={<DownloadOutlined />} >
            Import Excel
          </Button>

          <Button
            onClick={SalaryModalOpen}
            type="primary"
            className="bg-blue-500 sm:col-span-2  md:col-span-1 flex justify-center items-center gap-x-1 w-full xs:w-fit"
          >
            <FontAwesomeIcon icon={faPlus} className="icon" />{" "}
            <span >Pay Salary</span>
          </Button>
        </li>

        <li className="block md:hidden">
          <Input.Search
            className=" block w-full "
            placeholder="Search here...."
            onSearch={(value) => {
              setSearchText(value);
            }}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />

        </li>
      </ul>
      <Divider />
      <div className="w-full overflow-x-scroll sm:overflow-x-hidden">
        <Table dataSource={TableData} columns={columns} pagination={{ pageSize: 6, }} onChange={onChange} />
      </div>

      <Modal
        centered={true}
        title="Pay Salary"
        open={SalaryModal}
        onCancel={SalaryModalClose}
        footer={[
          <Button key="1"
            onClick={PostSalary}
          >
            Pay
          </Button>,
          <Button key="2"
            danger="red"
            style={{ border: "0.5px solid red" }}
            onClick={() => SalaryModalClose()}
          >
            Cancel
          </Button>
        ]}
        xs={20}
        xl={4}
      >
        <Form form={form} className="grid grid-cols-1 gap-y-0" layout="vertical">
          <Form.Item
            label="Employee Name"
            style={{ marginBottom: 0, marginTop: 10 }}
          >
            <Select
              showSearch
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
            <DatePicker
              style={{ width: "470px" }}
              value={employeeSalary.salaryDate ? moment(employeeSalary.salaryDate, 'YYYY/MM/DD') : null} onChange={salaryDateChange}></DatePicker>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        centered={true}
        open={excelModal}
        onCancel={CloseExcelModal}
        footer={[
          <Button key="1"
            onClick={() => handleOkButtonClick()}
          >
            Ok
          </Button>,
          <Button key="2"
            danger="red"
            style={{ border: "0.5px solid red" }}
            onClick={() => CloseExcelModal()}
          >
            Cancel
          </Button>
        ]}
        xs={20}
        xl={4}
      >

        <div className='px-4 pt-5'>
          <Dragger {...props} maxCount={1}>
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