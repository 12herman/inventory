import React, { useEffect } from "react";
import { Badge, Calendar, Spin, Tooltip } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Getemployeeleavehistory } from "../redux/slices/EmployeeLeaveHistorySlice";
import { logDOM } from "@testing-library/react";

const Holiday = ({ Id }) => {

  const { employeeleavehistory } = useSelector(
    (state) => state.employeeleavehistory
  );

  const filterLeave = employeeleavehistory.filter(
    (data) => data.employeeId === Id
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(Getemployeeleavehistory());
  }, []);

  //set date
  const getListData = (value) => {
    const dayOfMonth = value.date();
    const formattedDate = value.format("YYYY-MM-DD");

    const filteredData = filterLeave.filter((data) => {
      if (data.fromdate && data.todate) {
          const fromDateDay = parseInt(data.fromdate.split("-")[2].split("T")[0], 10);
          const toDateDay = parseInt(data.todate.split("-")[2].split("T")[0], 10);
          return (
              dayOfMonth >= fromDateDay && dayOfMonth <= toDateDay &&
              formattedDate >= data.fromdate.split("T")[0] && formattedDate <= data.todate.split("T")[0]
          );
      }
      return false;
  });

    const listData = filteredData.map((data) => ({
      type:
        data.leaderIsRejected === false && data.leaderIsApproved === false &&  data.hrIsApproved === false && data.hrIsRejected === false
          ? "warning"
          : data.leaderIsApproved === true || data.hrIsApproved === true
          ? "success"
          : data.hrIsRejected === true || data.leaderIsRejected === true
          ? "error"
          : "warning",
      content:
        data.leaderIsRejected === false && data.leaderIsApproved === false && data.hrIsApproved ===false && data.hrIsRejected ===false
          ? "Waiting"
          : data.leaderIsApproved === true || data.hrIsApproved === true
          ? "Approved"
          : data.hrIsRejected === true || data.leaderIsRejected === true
          ? "Rejected"
          : "Waiting",
      comments: data.comments,
    }));
    return listData || [];
  };
 
  const getMonthData = (value) => {
    if (value.month() === 0) {
      return 1394;
    }
    return null;
  };

  const monthCellRender = (value) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Tooltip title={item.comments}>
              <Badge status={item.type} text={item.content} />
            </Tooltip>
          </li>
        ))}
      </ul>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };
  
  return employeeleavehistory.length > 0 ? (
    <Calendar  cellRender={cellRender}/>
  ) : (
    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
  );
};

export default Holiday;
