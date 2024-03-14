import { Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
import QosteqLogo from "../Assets/qosteqlogo.webp";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Deletedemployeeleavehistory,
  Getemployeeleavehistory,
  Putemployeeleavehistory,
} from "../redux/slices/EmployeeLeaveHistorySlice";
import { getEmployees } from "../redux/slices/employeeSlice";
import { Spin, Input, Popconfirm, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import ApprovePng from "../Assets/approve_png.png";
import { getleaderemployee } from "../redux/slices/leaderEmployeeSlice";
import {
  Getemployeeleave,
  Putemployeeleave,
} from "../redux/slices/employeeLeaveSlice";

const { TextArea } = Input;

const LeaveConfirmationPage = () => {
  let { id } = useParams();
  const IdArray = id.split("+");

  id = parseInt(IdArray[0], 10);

  const dispatch = useDispatch();
  const { employeeleavehistory } = useSelector(
    (state) => state.employeeleavehistory
  );
  const { employee } = useSelector((state) => state.employee);
  const { employeeleave } = useSelector((state) => state.employeeleave);
  const { leaderemployee } = useSelector((state) => state.leaderemployee);

  useEffect(() => {
    dispatch(Getemployeeleavehistory());
    dispatch(getEmployees());
    dispatch(Getemployeeleave());
    dispatch(getleaderemployee());
  }, []);

  //   const ExistApproveOrReject = employeeleavehistory.filter( data =>data.id === id );
  //   const CheckExit = ExistApproveOrReject.length > 0 ? [ExistApproveOrReject[0].hrIsApproved,
  //                                                         ExistApproveOrReject[0].hrIsRejected,
  //                                                         ExistApproveOrReject[0].leaderIsApproved,
  //                                                         ExistApproveOrReject[0].leaderIsRejected,
  //                                                         ExistApproveOrReject[0].isDeleted] : null;
  // const Active = CheckExit&& CheckExit.length > 0 ? CheckExit.filter(data => data === true) : null;
  // console.log(Active);
  // const Contidation =  typeof(CheckExit) === Object &&
  //                                 (CheckExit.hrIsApproved === true ||
  //                                 CheckExit.hrIsRejected === true ||
  //                                 CheckExit.leaderIsApproved === true ||
  //                                 CheckExit.leaderIsRejected === true ||
  //                                 CheckExit.isDeleted === true) ? true : null ;

  const LHistory = employeeleavehistory.filter(
    (data) =>
      data.id === id &&
      data.hrIsApproved === false &&
      data.hrIsRejected === false &&
      data.leaderIsApproved === false &&
      data.leaderIsRejected === false &&
      data.isDeleted === false
  );
  const EmpId = LHistory.length > 0 ? LHistory[0].employeeId : null;
  const EmpDetails =
    EmpId !== null ? employee.filter((data) => data.id === EmpId) : null;
  const EmpName =
    EmpDetails !== null && EmpDetails.length > 0
      ? EmpDetails[0].firstName + " " + EmpDetails[0].lastName
      : null;
  const type = LHistory.length > 0 ? LHistory[0].leaveType : null;

  //hr
  const hrFilters = leaderemployee.filter((le) => le.employeeId === EmpId);
  const hrIds = hrFilters.length > 0 ? hrFilters[0].hrManagerId : null;
  const hrDataFilters = employee.filter((emp) => emp.id === hrIds);
  const hrName =
    hrDataFilters.length > 0
      ? hrDataFilters[0].firstName + " " + hrDataFilters[0].lastName
      : null;
  //leader
  const leaderFilters = leaderemployee.filter((le) => le.employeeId === EmpId);
  const leaderIds = leaderFilters.length > 0 ? leaderFilters[0].leaderId : null;
  const leaderDataFilter = employee.filter((emp) => emp.id === leaderIds);
  const leaderName =
    leaderDataFilter.length > 0
      ? leaderDataFilter[0].firstName + " " + leaderDataFilter[0].lastName
      : null;

  // console.log(EmpDetails);
  //const { id } = useParams();
  // const filterEmp = employee.filter((emp) =>
  //   filterLeave.some((data) => data.employeeId === emp.id)
  // );
  // const EmpName =
  //   filterEmp.length > 0
  //     ? filterEmp[0].firstName + " " + filterEmp[0].lastName
  //     : null;

  // console.log(LHistory);

  const [loading, setLoading] = useState(true);
  const [leaderBtn, setLeaderBtn] = useState(IdArray[1]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const CurrentDate = new Date();
  const ModifiedDate = CurrentDate.toISOString();

  const employeeLeavesFl =
    employeeleave && LHistory && LHistory.length > 0
      ? employeeleave.filter(
          (data) => data.employeeId === LHistory[0].employeeId
        )
      : null;
  const leaveDatas =
    employeeLeavesFl !== null
      ? employeeLeavesFl.map((data) => ({
          id: data.id,
          employeeId: data.employeeId,
          sickLeave: data.sickLeave,
          casualLeave: data.casualLeave,
          total: data.total,
          leaveAvailed: data.leaveAvailed,
          createdDate: data.createdDate,
          createdBy: data.createdBy,
          modifiedDate: ModifiedDate,
          modifiedBy: "string",
          isDeleted: false,
        }))
      : null;

  //hr approved
  const hrApproved = async () => {
    await dispatch(
      Putemployeeleavehistory({
        ...LHistory[0],
        hrIsApproved: true,
        modifiedBy: hrName,
      })
    );
    await dispatch(
      Putemployeeleave({
        ...leaveDatas[0],
        total: leaveDatas[0].total - LHistory[0].numberOfDays,
        leaveAvailed: leaveDatas[0].leaveAvailed + LHistory[0].numberOfDays,
        ...LeaveType(type),
        modifiedBy: hrName,
      })
    );
    setFinished(true);
  };

  //leader approved
  const LeaderApproved = async () => {
    await dispatch(
      Putemployeeleavehistory({
        ...LHistory[0],
        leaderIsApproved: true,
        modifiedBy: leaderName,
      })
    );
    await dispatch(
      Putemployeeleave({
        ...leaveDatas[0],
        total: leaveDatas[0].total - LHistory[0].numberOfDays,
        leaveAvailed: leaveDatas[0].leaveAvailed + LHistory[0].numberOfDays,
        ...LeaveType(type),
        modifiedBy: leaderName,
      })
    );
    setFinished(true);
  };

  const LeaveType = (type) => {
    if (type === "casualLeave") {
      return {
        casualLeave: leaveDatas[0].casualLeave - LHistory[0].numberOfDays,
      };
    } else {
      return { sickLeave: leaveDatas[0].sickLeave - LHistory[0].numberOfDays };
    }
  };

  const [OpenModal, setOpenModal] = useState(false);
  const [LeaveHistory, setLeaveHistory] = useState({
    Comments: null,
  });

  //leader rejection
  const leaderRejection = async () => {
    await dispatch(
      Putemployeeleavehistory({
        ...LHistory[0],
        leaderIsRejected: true,
        modifiedBy: leaderName,
        rejectedComments: LeaveHistory.Comments,
      })
    );
    await setFinished(true);
    setOpenModal(false);
  };

  //hr rejection
  const hrRejection = async () => {
    await dispatch(
      Putemployeeleavehistory({
        ...LHistory[0],
        hrIsRejected: true,
        modifiedBy: hrName,
        rejectedComments: LeaveHistory.Comments,
      })
    );
    await setFinished(true);
    setOpenModal(false);
  };

  const [Finished, setFinished] = useState(false);

  const DelectRequset = async () => {
    await dispatch(Deletedemployeeleavehistory(id));
    await setFinished(true);
  };

  const confirm = (e) => {
    DelectRequset()
  };
  const cancel = (e) => {
    
  };

  return (
    <>
      {loading === true ? (
        <div className="flex justify-center items-center w-full h-screen">
          <Spin
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 24,
                }}
                spin
              />
            }
          />
        </div>
      ) : employeeleavehistory.length > 0 &&
        LHistory.length > 0 &&
        employee.length > 0 ? (
        LHistory.map((data, i) => {
          return (
            <section className="relative" key={i}>
              <img
                className="w-[60px] absolute left-[60%] -translate-x-1/2 top-[74%] -translate-y-1/2"
                src={QosteqLogo}
              />
              <div className="w-11/12 mx-auto h-screen flex justify-center">
                <ul className="flex flex-col gap-y-2 justify-center items-start">
                  <h3 className="text-lg sm:text-2xl font-bold pb-2">
                    Leave Approval Form
                  </h3>
                  <li className="text-xs sm:text-sm md:text-base">
                    Employee ID: &nbsp; {data.employeeId}
                  </li>
                  <li className="text-xs sm:text-sm md:text-base">
                    Employee Name: &nbsp; {EmpName}
                  </li>
                  <li className="text-xs sm:text-sm md:text-base">
                    Leave Type: &nbsp; {data.leaveType}
                  </li>
                  <li className="text-xs sm:text-sm md:text-base">
                    Date:&nbsp; {data.fromdate.split("T")[0]} ,
                    {data.todate.split("T")[0]}{" "}
                  </li>
                  <li className="text-xs sm:text-sm md:text-base">
                    Number of Days:&nbsp; {data.numberOfDays}{" "}
                  </li>
                  <li className="text-xs sm:text-sm md:text-base">
                    Reson:&nbsp; {data.comments}
                  </li>
                  <li className="grid grid-cols-2 gap-x-2 gap-y-2 mt-3">
                    {leaderBtn === "leader" ? (
                      <>
                        <Button
                          onClick={LeaderApproved}
                          className="text-xs sm:text-sm md:text-base"
                        >
                          Approve
                        </Button>
                        <Button
                          className="text-xs sm:text-sm md:text-base"
                          danger
                          onClick={() => setOpenModal(true)}
                        >
                          Rejected
                        </Button>
                        <Popconfirm
                          className="text-xs sm:text-sm md:text-base col-span-2"
                          title="Delete the task"
                          description="Are you sure to remove this request?"
                          onConfirm={confirm}
                          onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                          okButtonProps={{ className: 'bg-red-500 hover:bg-red-500' , style:{background:'red'}}}

                        >
                          <Button type="primary" danger>
                            Delete Request
                          </Button>
                        </Popconfirm>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={hrApproved}
                          className="text-xs sm:text-sm md:text-base "
                        >
                          Approve
                        </Button>
                        <Button
                          className="text-xs sm:text-sm md:text-base"
                          danger
                          onClick={() => setOpenModal(true)}
                        >
                          Rejected
                        </Button>
                        {/* <Button
                          className="text-xs sm:text-sm md:text-base col-span-2"
                          type="primary"
                          danger
                          onClick={() => DelectRequset()}
                        >
                          Delete Request
                        </Button> */}

                        <Popconfirm
                          className="text-xs sm:text-sm md:text-base col-span-2"
                          title="Delete the task"
                          description="Are you sure to remove this request?"
                          onConfirm={confirm}
                          onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                          okButtonProps={{ className: 'bg-red-500 hover:bg-red-500' , style:{background:'red'}}}

                        >
                          <Button type="primary" danger>
                            Delete Request
                          </Button>
                        </Popconfirm>
                      </>
                    )}
                  </li>
                </ul>
              </div>
            </section>
          );
        })
      ) : Finished === true ? (
        <div className="w-full h-screen flex flex-col justify-center items-center">
          <img className="w-[20%]" src={ApprovePng} />
          <span className="sm:text-sm lg:text-lg pt-2 font-bold">
            This page is Validate successfully
          </span>
        </div>
      ) : (Finished === false && LHistory && LHistory.length <= 0) ||
        LHistory === null ||
        LHistory === undefined ? (
        <div className="w-full h-screen flex flex-col justify-center items-center">
          <img className="w-[20%]" src={ApprovePng} />
          <span className="sm:text-sm lg:text-lg pt-2 font-bold">
            This page is already Validate
          </span>
        </div>
      ) : (
        <></>
      )}

      {/* comment box */}
      <Modal
        open={OpenModal}
        onCancel={() => {
          setOpenModal(false);
          setLeaveHistory((pre) => ({ ...pre, Comments: null }));
        }}
        footer={[
          leaderBtn === "leader" ? (
            <>
              {" "}
              <Button onClick={leaderRejection}>Ok</Button>,
              <Button
                onClick={() => {
                  setOpenModal(false);
                  setLeaveHistory((pre) => ({ ...pre, Comments: null }));
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button onClick={hrRejection}>Ok</Button>,
              <Button
                onClick={() => {
                  setOpenModal(false);
                  setLeaveHistory((pre) => ({ ...pre, Comments: null }));
                }}
              >
                Cancel
              </Button>
            </>
          ),
        ]}
      >
        <span>
          why you are rejecting this leave?{" "}
          <span className="text-gray-400">(optional)</span>
        </span>
        <TextArea
          value={LeaveHistory.Comments}
          className="mt-3"
          onChange={(data) =>
            setLeaveHistory((pre) => ({ ...pre, Comments: data.target.value }))
          }
          rows={3}
        />
      </Modal>
    </>
  );
};
export default LeaveConfirmationPage;
