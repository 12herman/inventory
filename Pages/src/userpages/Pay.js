import React, { useEffect, useRef, useState } from "react";
import { Table, Space, Modal, Button } from "antd";
import LogoImg from "../Assets/qosteqlogo.webp";
import { useMediaQuery } from "react-responsive";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { PostPdf, downloadPdf } from "../redux/slices/pdfGeneratorSlice";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas'

const Pay = ({ Id, salary, employee }) => {
  const isMobile = useMediaQuery({ maxWidth: 1024 });

  const Tdata = salary.map((data) => ({
    salaryDate: data.salaryDate.split("T")[0],
    grossSalary: data.grossSalary,
    netSalary: data.netSalary,
    action: data.id,
  }));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paySlipData, setPaySlipData] = useState({
    ...employee[0],
    salaryDate: "2024-03-18",
    grossSalary: 30000,
    netSalary: 25000,
    action: 4,
  });
  

  const showModal = (data) => {
    setIsModalOpen(true);
    setPaySlipData({ ...employee[0], ...data });
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "salaryDate",
      key: "salaryDate",
    },
    {
      title: "Gross Salary",
      dataIndex: "grossSalary",
      key: "grossSalary",
    },
    {
      title: "Net Salary",
      dataIndex: "netSalary",
      key: "netSalary",
    },
    {
      title: "Pay Slip",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => showModal(record)}>View</Button>
        </Space>
      ),
    },
  ];
  const monthNames = [
    "hi",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  function numberToWords(number) {
    const units = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "Ten",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    function convertLessThanOneThousand(n) {
      let result = "";

      if (n >= 100) {
        result += units[Math.floor(n / 100)] + " Hundred ";
        n %= 100;
      }

      if (n >= 20) {
        result += tens[Math.floor(n / 10)] + " ";
        n %= 10;
      }

      if (n > 0) {
        if (n < 10) {
          result += units[n] + " ";
        } else {
          result += teens[n - 10] + " ";
        }
      }

      return result;
    }

    if (number === 0) {
      return "Zero";
    }

    let result = "";
    let place = 0;

    while (number > 0) {
      if (number % 1000 !== 0) {
        result =
          convertLessThanOneThousand(number % 1000) +
          ["", "Thousand", "Million", "Billion"][place] +
          " " +
          result;
      }
      number = Math.floor(number / 1000);
      place++;
    }
    return result.trim();
  }



  const [PaySlipApiData,setPaySlipApiData] = useState({
    OfficeAddress: paySlipData == null? "-": paySlipData.officeLocationId.address + ","+ paySlipData.officeLocationId.city + ","+ paySlipData.officeLocationId.state + ","+ paySlipData.officeLocationId.country+".",
    PaySlipMonth: paySlipData === null ? "-": monthNames[
                                                paySlipData.salaryDate.split("-")[1] ===
                                                `0${paySlipData.salaryDate.split("-")[1].split(0)[1]}`
                                                  ? paySlipData.salaryDate.split("-")[1].split(0)[1]
                                                  : paySlipData.salaryDate.split("-")[1]
                                              ] + " " + paySlipData.salaryDate.split("-")[0],
    Name: paySlipData === null? "-": paySlipData.firstName + " " + paySlipData.lastName,
    DepartmentName:paySlipData == null ? "-": paySlipData.departmentId.departmentName,
    DateOfJoining:paySlipData == null ? "-": paySlipData.dateOfJoin.split("-")[2] +"/" +paySlipData.dateOfJoin.split("-")[1] +"/" + paySlipData.dateOfJoin.split("-")[0],
    NetSalary: paySlipData == null ? "-" : paySlipData.netSalary.toLocaleString("en-IN"),
    AccountNo:paySlipData == null ? "-" : paySlipData.accountDetails[0].accountNumber,
    SalaryWords: numberToWords(paySlipData.netSalary)
  });

useEffect(()=>{
  setPaySlipApiData(pre=>({...pre, OfficeAddress: paySlipData == null? "-": paySlipData.officeLocationId.address + ","+ paySlipData.officeLocationId.city + ","+ paySlipData.officeLocationId.state + ","+ paySlipData.officeLocationId.country+".",
  PaySlipMonth: paySlipData === null ? "-": monthNames[
                                              paySlipData.salaryDate.split("-")[1] ===
                                              `0${paySlipData.salaryDate.split("-")[1].split(0)[1]}`
                                                ? paySlipData.salaryDate.split("-")[1].split(0)[1]
                                                : paySlipData.salaryDate.split("-")[1]
                                            ] + " " + paySlipData.salaryDate.split("-")[0],
  Name: paySlipData === null? "-": paySlipData.firstName + " " + paySlipData.lastName,
  DepartmentName:paySlipData == null ? "-": paySlipData.departmentId.departmentName,
  DateOfJoining:paySlipData == null ? "-": paySlipData.dateOfJoin.split("-")[2] +"/" +paySlipData.dateOfJoin.split("-")[1] +"/" + paySlipData.dateOfJoin.split("-")[0],
  NetSalary: paySlipData == null ? "-" : paySlipData.netSalary.toLocaleString("en-IN"),
  AccountNo:paySlipData == null ? "-" : paySlipData.accountDetails[0].accountNumber,
  SalaryWords: numberToWords(paySlipData.netSalary)}));

},[paySlipData,isModalOpen])

const [PdfFile,setPdfFile] = useState('hidden');

const pdfDownload = async () => {
  await setPdfFile('block ');
  const capture = document.querySelector('.pdf-content');
 await html2canvas(capture,{
  scale: 0.5, // Adjust scale to reduce image resolution and size
  logging: false, // Disable logging to improve performance
}).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'px', 'a4');
    const imgWidth = 380; // A4 page width in mm
    const imgHeight = canvas.height * imgWidth / canvas.width;
    const offsetX = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
    const offsetY = (pdf.internal.pageSize.getHeight() - imgHeight) / 4;

    pdf.addImage(imgData, 'PNG', offsetX, offsetY, imgWidth, imgHeight);
    pdf.save('receipt.pdf');
  });
  await setPdfFile('hidden');
  await handleOk();
  
};





  
  return (
    <div className="overflow-x-auto md:overflow-x-hidden bg-white">
      <Table dataSource={Tdata} columns={columns} />
      <Modal
      closeIcon={false}
        footer={[
          <Button onClick={handleCancel} >Cancel</Button>,
          <Button onClick={pdfDownload}>
            <ul className="flex justify-center items-center gap-x-1">
              <li>
                <FontAwesomeIcon icon={faDownload} />
              </li>
              <li className="hidden sm:block">Download</li>
            </ul>
          </Button>,
        ]}
        width={isMobile === false ? 1000 : undefined}
        centered={true}
        title=""
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div  className=" w-11/12 mx-auto flex flex-col gap-y-5 px-5 my-5">
          <div className="qosteq-details">
            <ul className="flex lg:justify-between lg:items-center flex-col-reverse lg:flex-row">
              <li>
                <h2 className="text-sm lg:text-2xl font-semibold">
                  QOSTEQ IT PRIVATELIMITED
                </h2>
                <span className="uppercase text-xs lg:text-sm">
                  {/* 4/229 FIRST STREET MUTHAMMAL COLONY Tuticorin Tamil Nadu 628002
                India */}
                  {paySlipData == null
                    ? "-"
                    : paySlipData.officeLocationId.address}
                  ,
                  {paySlipData == null
                    ? "-"
                    : paySlipData.officeLocationId.city}
                  ,
                  {paySlipData == null
                    ? "-"
                    : paySlipData.officeLocationId.state}
                  ,
                  {paySlipData == null
                    ? "-"
                    : paySlipData.officeLocationId.country}
                  .
                </span>
              </li>
              <li>
                <img src={LogoImg} className="w-[150px] lg:w-full" />
              </li>
            </ul>
            <span className="block border border-b-1 border-gray-100 mt-2 lg:mt-0"></span>
          </div>

          <div className="employee-details">
            <ul className="flex justify-between mt-2 lg:mt-5 flex-col lg:flex-row items-start">
              <li>
                <span className="block font-semibold">
                  Payslip for the month of{" "}
                  {paySlipData === null
                    ? "-"
                    : monthNames[
                        paySlipData.salaryDate.split("-")[1] ===
                        `0${paySlipData.salaryDate.split("-")[1].split(0)[1]}`
                          ? paySlipData.salaryDate.split("-")[1].split(0)[1]
                          : paySlipData.salaryDate.split("-")[1]
                      ]}{" "}
                  {paySlipData.salaryDate.split("-")[0]}
                </span>
                <span className="block font-semibold mt-3">
                  {" "}
                  {paySlipData === null
                    ? "-"
                    : paySlipData.firstName + " " + paySlipData.lastName}
                </span>
                <span className="block">
                  {/* 3D Modeller | IT | | Date of Joining: 16/08/2023 */}
                  {paySlipData == null
                    ? "-"
                    : paySlipData.departmentId.departmentName}{" "}
                  | Date of Joining:{" "}
                  {paySlipData == null
                    ? "-"
                    : paySlipData.dateOfJoin.split("-")[2] +
                      "/" +
                      paySlipData.dateOfJoin.split("-")[1] +
                      "/" +
                      paySlipData.dateOfJoin.split("-")[0]}
                </span>
              </li>
              <li className=" lg:text-right flex flex-col gap-y-2 mt-3 lg:mt-0">
                <span className="block font-semibold">Employee Net Pay</span>
                <span className="block font-semibold text-xl lg:text-3xl">
                  ₹
                  {paySlipData == null
                    ? "-"
                    : paySlipData.netSalary.toLocaleString("en-IN")}
                </span>
                <span className="block text-[8px] xs:text-[10px] lg:text-[12px] lg:text-sm">
                  Paid Days: 29 | LOP Days: 0
                </span>
              </li>
            </ul>
            <span className="border border-dashed border-b-1 border-gray-100 block mt-5"></span>
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 mt-2 lg:mt-5 text-gray-500 text-[12px] lg:text-sm">
              <li>
                Banck Account No :{" "}
                {paySlipData == null
                  ? "-"
                  : paySlipData.accountDetails[0].accountNumber}
              </li>
              <li>UAN :</li>
            </ul>
            <span className="border border-dashed border-b-1 border-gray-100 block mt-2 lg:mt-5"></span>
          </div>

          <div className="payment-table lg:flex justify-normal gap-x-20 items-start ">
            <ul className="table-1 grid grid-cols-3 mt-2">
              <li className="uppercase text-[8px] xs:text-[10px] lg:text-xs font-bold ">
                Earnings
              </li>
              <li className="uppercase text-[8px] xs:text-[10px] lg:text-xs font-bold text-right ">
                Amount
              </li>
              <li className="uppercase text-[8px] xs:text-[10px] lg:text-xs font-bold text-right ">
                Ytd
              </li>
              <li className="border border-b-1 border-gray-200 block mt-2 col-span-3"></li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] mt-2">
                Basic
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] text-right mt-2 font-bold">
                ₹ 10,000.00
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] text-right mt-2">
                ₹ 10,000.00
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] mt-2">
                House Rent Allowance
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] text-right mt-2 font-bold">
                ₹ 10,000.00
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] text-right mt-2">
                ₹ 10,000.00
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] mt-2">
                Transport Allowance{" "}
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] text-right mt-2 font-bold">
                ₹ 10,000.00
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] text-right mt-2">
                ₹ 10,000.00
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] mt-2">
                Travelling Allowance{" "}
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] text-right mt-2 font-bold">
                ₹ 10,000.00
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] text-right mt-2">
                ₹ 10,000.00
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] mt-2">
                LTA{" "}
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] text-right mt-2 font-bold">
                ₹ 10,000.00
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] text-right mt-2">
                ₹ 10,000.00
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] mt-2">
                Fixed Allowance{" "}
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] text-right mt-2 font-bold">
                ₹ 10,000.00
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] text-right mt-2">
                ₹ 10,000.00
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] border  border-b-1 border-gray-200 block mt-2 col-span-3"></li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] mt-2 font-bold">
                GrossEarnings
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] text-right mt-2 font-bold">
                ₹
                {paySlipData == null
                  ? "-"
                  : paySlipData.netSalary.toLocaleString("en-IN")}
                .00
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] text-right mt-2"></li>
            </ul>

            <ul className="table-2 grid grid-cols-3 mt-10 lg:mt-2">
              <li className="uppercase text-[8px] xs:text-[10px] lg:text-xs font-bold">
                DEDUCTIONS
              </li>
              <li className="uppercase text-[8px] xs:text-[10px] lg:text-xs font-bold text-right">
                AMOUNT
              </li>
              <li className="uppercase text-[8px] xs:text-[10px] lg:text-xs font-bold text-right">
                Ytd
              </li>
              <li className="border border-b-1 border-gray-200 block mt-2 col-span-3"></li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] mt-2">
                EPF Contribution
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] text-right mt-2 font-bold">
                ₹ 10,000.00
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] text-right mt-2">
                ₹ 10,000.00
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] mt-2">
                Professional Tax{" "}
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] text-right mt-2 font-bold">
                ₹ 10,000.00
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] text-right mt-2">
                ₹ 10,000.00
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] mt-2">
                Income Tax
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] text-right mt-2 font-bold">
                ₹ 10,000.00
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] text-right mt-2">
                ₹ 10,000.00
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] border  border-b-1 border-gray-200 block mt-2 col-span-3"></li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] mt-2 font-bold">
                Total Deductions
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] text-right mt-2 font-bold">
                ₹ 10,000.00
              </li>
              <li className="text-[8px] xs:text-[10px] lg:text-[12px] text-right mt-2"></li>
            </ul>
          </div>

          <div className="footer-amount">
            <ul className="flex flex-col gap-y-1 justify-center items-center py-5 bg-blue-50 mt-5 px-5 lg:px-0">
              <li className="font-medium text-center text-[10px] lg:text-sm">
                Total{" "}
                <span className="font-bold">
                  ₹
                  {paySlipData == null
                    ? "-"
                    : paySlipData.netSalary.toLocaleString("en-IN")}
                  .00
                </span>{" "}
                <span className="block md:inline">
                  (Indian Rupee {numberToWords(paySlipData.netSalary)} only)
                </span>
              </li>
              <li className="text-[10px] lg:text-xs text-center">
                **Total Net Payable = Gross Earnings - Total Deductions
              </li>
            </ul>
            <span className="block text-center text-[8px] lg:text-[10px]  mt-1 ">
              -- This is a system generated payslip, hence the signature is not
              required. --
            </span>
          </div>
        </div>
      </Modal>











<section style={{overflow:"hidden"}}>
   <div className={`w-[1024px] absolute -top-[10000px] ${PdfFile}`}>
      <div
      className="pdf-content"
  style={{
    width: "90%",
    margin: "0 auto",
    fontFamily: "Arial, Helvetica, sans-serif"
  }}
>
  <table width="100%" style={{ marginTop: "5rem" }}>
    <tbody>
      <tr
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          listStyleType: "none",
          padding: 0
        }}
      >
        <th width="80%">
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: 600,
              margin: 0,
              textAlign: "start"
            }}
          >
            QOSTEQ IT PRIVATELIMITED
          </h2>
          <p
            style={{
              textTransform: "uppercase",
              fontSize: "1rem",
              textAlign: "justify",
              fontWeight: 500
            }}
          >
           {paySlipData == null
                    ? "-"
                    : paySlipData.officeLocationId.address}
                  ,
                  {paySlipData == null
                    ? "-"
                    : paySlipData.officeLocationId.city}
                  ,
                  {paySlipData == null
                    ? "-"
                    : paySlipData.officeLocationId.state}
                  ,
                  {paySlipData == null
                    ? "-"
                    : paySlipData.officeLocationId.country}
                  .
          </p>
        </th>
        <th width="20%">
          <img
            src={LogoImg}
            alt="Company Logo"
            style={{ width: "auto", height: 110 }}
          />
        </th>
      </tr>
    </tbody>
  </table>
  <hr
    style={{ border: "1px solid #e5e7eb", marginTop: 50, marginBottom: 20 }}
  />
  <div>
    <table width="100%">
      <tbody>
        <tr>
          <th width="50%">
            <span style={{ display: "block", textAlign: "start" }}>
              Payslip for the month of {" "} {paySlipData === null
                    ? "-"
                    : monthNames[
                        paySlipData.salaryDate.split("-")[1] ===
                        `0${paySlipData.salaryDate.split("-")[1].split(0)[1]}`
                          ? paySlipData.salaryDate.split("-")[1].split(0)[1]
                          : paySlipData.salaryDate.split("-")[1]
                      ]}{" "}
                  {paySlipData.salaryDate.split("-")[0]}
            </span>
            <span
              style={{
                display: "block",
                textAlign: "start",
                fontSize: "1.5rem",
                padding: "10px 0 5px 0"
              }}
            >
              {" "}
                  {paySlipData === null
                    ? "-"
                    : paySlipData.firstName + " " + paySlipData.lastName}
            </span>
            <span
              style={{
                display: "block",
                textAlign: "start",
                fontWeight: 200,
                fontSize: "0.9rem"
              }}
            >
              {paySlipData == null
                    ? "-"
                    : paySlipData.departmentId.departmentName}{" "}
                  | Date of Joining:{" "}
                  {paySlipData == null
                    ? "-"
                    : paySlipData.dateOfJoin.split("-")[2] +
                      "/" +
                      paySlipData.dateOfJoin.split("-")[1] +
                      "/" +
                      paySlipData.dateOfJoin.split("-")[0]}
            </span>
          </th>
          <th width="50%">
            <span
              style={{
                display: "block",
                textAlign: "end",
                fontSize: "0.9rem",
                fontWeight: 600
              }}
            >
              {" "}
              Employee Net Pay
            </span>
            <span
              style={{
                display: "block",
                textAlign: "end",
                fontSize: "2.5rem",
                padding: "8px 0"
              }}
            >
              ₹
                  {paySlipData == null
                    ? "-"
                    : paySlipData.netSalary.toLocaleString("en-IN")}
            </span>
            <span
              style={{
                display: "block",
                textAlign: "end",
                fontWeight: 200,
                fontSize: "0.9rem",
                color: "#6b7280"
              }}
            >
              Paid Days: 29 | LOP Days: 0
            </span>
          </th>
        </tr>
      </tbody>
    </table>
    <hr
      style={{
        border: "1px dashed #e5e7eb",
        marginTop: "1.25rem",
        marginBottom: 10,
        borderBottomWidth: "0.0625rem",
        borderColor: "#d1d5db"
      }}
    />
  </div>
  <div>
    <table
      style={{
        gap: 0,
        color: "#6b7280",
        fontSize: "0.9rem",
        fontWeight: 200,
        padding: "10px 0"
      }}
      width="100%"
    >
      <tbody>
        <tr>
          <th
            width="50%"
            style={{ textAlign: "start", fontSize: "1rem", fontWeight: 500 }}
          >
            Banck Account No :{" "}
                {paySlipData == null
                  ? "-"
                  : paySlipData.accountDetails[0].accountNumber}
          </th>
          <th
            width="50%"
            style={{ textAlign: "start", fontSize: "1rem", fontWeight: 500 }}
          >
            UAN :
          </th>
        </tr>
      </tbody>
    </table>
    <hr
      style={{ border: "1px solid #e5e7eb", marginTop: 50, marginBottom: 20 }}
    />
  </div>
  <table style={{ gap: 0, marginTop: 20 }} width="100%">
    <tbody>
      <tr>
        <th width="50%" style={{ textAlign: "start" }}>
          <div>
            <table
              style={{
                width: "100%",
                marginTop: "1rem",
                borderCollapse: "collapse"
              }}
            >
              <tbody>
                <tr
                  style={{
                    textTransform: "uppercase",
                    fontSize: "0.9rem",
                    fontWeight: 600
                  }}
                >
                  <th
                    style={{
                      textAlign: "left",
                      paddingBottom: 22,
                      fontSize: "0.9rem",
                      fontStyle: "italic"
                    }}
                  >
                    Earnings
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      paddingBottom: 22,
                      fontSize: "0.9rem",
                      fontStyle: "italic"
                    }}
                  >
                    Amount
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      paddingBottom: 22,
                      fontSize: "0.9rem",
                      fontStyle: "italic"
                    }}
                  >
                    YTD
                  </th>
                </tr>
                <tr
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 200,
                    borderTop: "1px solid #e5e7eb"
                  }}
                >
                  <td style={{ paddingTop: 22 }}>Basic</td>
                  <td
                    style={{
                      textAlign: "right",
                      fontWeight: 600,
                      paddingTop: 22
                    }}
                  >
                    ₹ 10,000.00
                  </td>
                  <td style={{ textAlign: "right", paddingTop: 22 }}>
                    ₹ 10,000.00
                  </td>
                </tr>
                <tr style={{ fontSize: "0.9rem", fontWeight: 200 }}>
                  <td style={{ paddingTop: 22 }}>House Rent Allowance</td>
                  <td
                    style={{
                      textAlign: "right",
                      fontWeight: 600,
                      paddingTop: 22
                    }}
                  >
                    ₹ 10,000.00
                  </td>
                  <td style={{ textAlign: "right", paddingTop: 22 }}>
                    ₹ 10,000.00
                  </td>
                </tr>
                <tr style={{ fontSize: "0.9rem", fontWeight: 200 }}>
                  <td style={{ paddingTop: 22 }}>Conveyance Allowance</td>
                  <td
                    style={{
                      textAlign: "right",
                      fontWeight: 600,
                      paddingTop: 22
                    }}
                  >
                    ₹ 10,000.00
                  </td>
                  <td style={{ textAlign: "right", paddingTop: 22 }}>
                    ₹ 10,000.00
                  </td>
                </tr>
                <tr style={{ fontSize: "0.9rem", fontWeight: 200 }}>
                  <td style={{ paddingTop: 22 }}>Transport Allowance</td>
                  <td
                    style={{
                      paddingTop: 22,
                      textAlign: "right",
                      fontWeight: 600
                    }}
                  >
                    ₹ 10,000.00
                  </td>
                  <td style={{ paddingTop: 22, textAlign: "right" }}>
                    ₹ 10,000.00
                  </td>
                </tr>
                <tr style={{ fontSize: "0.9rem", fontWeight: 200 }}>
                  <td style={{ paddingTop: 22 }}>Travelling Allowance</td>
                  <td
                    style={{
                      paddingTop: 22,
                      textAlign: "right",
                      fontWeight: 600
                    }}
                  >
                    ₹ 10,000.00
                  </td>
                  <td style={{ paddingTop: 22, textAlign: "right" }}>
                    ₹ 10,000.00
                  </td>
                </tr>
                <tr style={{ fontSize: "0.9rem", fontWeight: 200 }}>
                  <td style={{ paddingTop: 22 }}>LTA</td>
                  <td
                    style={{
                      paddingTop: 22,
                      textAlign: "right",
                      fontWeight: 600
                    }}
                  >
                    ₹ 10,000.00
                  </td>
                  <td style={{ paddingTop: 22, textAlign: "right" }}>
                    ₹ 10,000.00
                  </td>
                </tr>
                <tr style={{ fontSize: "0.9rem", fontWeight: 200 }}>
                  <td style={{ paddingTop: 22, paddingBottom: 22 }}>
                    Fixed Allowance
                  </td>
                  <td
                    style={{
                      paddingTop: 22,
                      paddingBottom: 22,
                      textAlign: "right",
                      fontWeight: 600
                    }}
                  >
                    ₹ 10,000.00
                  </td>
                  <td
                    style={{
                      paddingTop: 22,
                      paddingBottom: 22,
                      textAlign: "right"
                    }}
                  >
                    ₹ 10,000.00
                  </td>
                </tr>
                <tr
                  style={{ borderTop: "1px solid #e5e7eb", fontSize: "0.9rem" }}
                >
                  <td style={{ fontWeight: 600, paddingTop: 22 }}>
                    Gross Earnings
                  </td>
                  <td style={{ textAlign: "right", paddingTop: 22 }}>
                    ₹  {paySlipData == null
                  ? "-"
                  : paySlipData.netSalary.toLocaleString("en-IN")}
                .00
                  </td>
                  <td style={{ textAlign: "right", paddingTop: 22 }} />
                </tr>
              </tbody>
            </table>
          </div>
        </th>
        <th width="100%" style={{ textAlign: "start", paddingLeft: 30 }}>
          <div>
            <table
              width="100%"
              style={{ marginTop: "0.875rem", borderCollapse: "collapse" }}
            >
              <tbody>
                <tr
                  style={{
                    textTransform: "uppercase",
                    fontSize: "0.9rem",
                    fontWeight: 600
                  }}
                >
                  <th
                    style={{
                      textAlign: "left",
                      paddingBottom: 22,
                      fontSize: "0.9rem",
                      fontStyle: "italic"
                    }}
                  >
                    DEDUCTIONS
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      paddingBottom: 22,
                      fontSize: "0.9rem",
                      fontStyle: "italic"
                    }}
                  >
                    Amount
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      paddingBottom: 22,
                      fontSize: "0.9rem",
                      fontStyle: "italic"
                    }}
                  >
                    YTD
                  </th>
                </tr>
                <tr
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 200,
                    borderTop: "1px solid #e5e7eb"
                  }}
                >
                  <td style={{ paddingTop: 22 }}>EPF Contribution</td>
                  <td
                    style={{
                      textAlign: "right",
                      fontWeight: 600,
                      paddingTop: 22
                    }}
                  >
                    ₹ 10,000.00
                  </td>
                  <td style={{ textAlign: "right", paddingTop: 22 }}>
                    ₹ 10,000.00
                  </td>
                </tr>
                <tr style={{ fontSize: "0.9rem", fontWeight: 200 }}>
                  <td style={{ paddingTop: 22 }}>Professional Tax</td>
                  <td
                    style={{
                      textAlign: "right",
                      fontWeight: 600,
                      paddingTop: 22
                    }}
                  >
                    ₹ 10,000.00
                  </td>
                  <td style={{ textAlign: "right", paddingTop: 22 }}>
                    ₹ 10,000.00
                  </td>
                </tr>
                <tr style={{ fontSize: "0.9rem", fontWeight: 200 }}>
                  <td style={{ paddingTop: 22 }}>Income Tax</td>
                  <td
                    style={{
                      textAlign: "right",
                      fontWeight: 600,
                      paddingTop: 22
                    }}
                  >
                    ₹ 10,000.00
                  </td>
                  <td style={{ textAlign: "right", paddingTop: 22 }}>
                    ₹ 10,000.00
                  </td>
                </tr>
                <tr style={{ fontSize: "0.9rem", fontWeight: 200 }}>
                  <td style={{ paddingTop: 22 }}>&nbsp;</td>
                  <td
                    style={{
                      textAlign: "right",
                      fontWeight: 600,
                      paddingTop: 22
                    }}
                  >
                    &nbsp;
                  </td>
                  <td style={{ textAlign: "right", paddingTop: 22 }}>&nbsp;</td>
                </tr>
                <tr style={{ fontSize: "0.9rem", fontWeight: 200 }}>
                  <td style={{ paddingTop: 22 }}>&nbsp;</td>
                  <td
                    style={{
                      textAlign: "right",
                      fontWeight: 600,
                      paddingTop: 22
                    }}
                  >
                    &nbsp;
                  </td>
                  <td style={{ textAlign: "right", paddingTop: 22 }}>&nbsp;</td>
                </tr>
                <tr style={{ fontSize: "0.9rem", fontWeight: 200 }}>
                  <td style={{ paddingTop: 22 }}>&nbsp;</td>
                  <td
                    style={{
                      textAlign: "right",
                      fontWeight: 600,
                      paddingTop: 22
                    }}
                  >
                    &nbsp;
                  </td>
                  <td style={{ textAlign: "right", paddingTop: 22 }}>&nbsp;</td>
                </tr>
                <tr style={{ fontSize: "0.9rem", fontWeight: 200 }}>
                  <td style={{ paddingTop: 22, paddingBottom: 22 }}>&nbsp;</td>
                  <td
                    style={{
                      textAlign: "right",
                      fontWeight: 600,
                      paddingTop: 22,
                      paddingBottom: 22
                    }}
                  >
                    &nbsp;
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      paddingTop: 22,
                      paddingBottom: 22
                    }}
                  >
                    &nbsp;
                  </td>
                </tr>
                <tr
                  style={{ borderTop: "1px solid #e5e7eb", fontSize: "0.9rem" }}
                >
                  <td style={{ fontWeight: 600, paddingTop: 22 }}>
                    Total Deductions
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      fontWeight: 600,
                      paddingTop: 22
                    }}
                  >
                    ₹ 0.00
                  </td>
                  <td style={{ textAlign: "right", paddingTop: 22 }} />
                </tr>
              </tbody>
            </table>
          </div>
        </th>
      </tr>
    </tbody>
  </table>
  <div className="footer-amount" style={{ marginTop: "4rem" }}>
    <ul
      style={{
        listStyle: "none",
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
        justifyContent: "center",
        alignItems: "center",
        padding: "1.25rem 0",
        backgroundColor: "#f0f5ff",
        marginTop: "1.25rem",
        paddingLeft: 0
      }}
    >
      <li style={{ fontWeight: 400, textAlign: "center", fontSize: "1.2rem" }}>
        Total <span style={{ fontWeight: "bold" }}>₹
                  {paySlipData == null
                    ? "-"
                    : paySlipData.netSalary.toLocaleString("en-IN")}
                  .00</span>
        (Indian Rupee  {numberToWords(paySlipData.netSalary)} only)
      </li>
      <li style={{ fontSize: "0.8rem", textAlign: "center", marginBottom: 25 }}>
        **Total Net Payable = Gross Earnings - Total Deductions
      </li>
    </ul>
    <span
      style={{
        display: "block",
        textAlign: "center",
        fontSize: "0.725rem",
        marginTop: "0.0625rem"
      }}
    >
      -- This is a system generated payslip, hence the signature is not
      required. --
    </span>
  </div>
</div>
</div>
</section>

  
    </div>
  );
};

export default Pay;
