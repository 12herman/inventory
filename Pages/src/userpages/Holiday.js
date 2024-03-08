import React, { useEffect } from "react";
import { Badge, Calendar, Spin, Tooltip } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Getemployeeleavehistory } from "../redux/slices/EmployeeLeaveHistorySlice";

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
      const dataDay = parseInt(data.date.split("-")[2].split("T")[0], 10);
      return (
        dayOfMonth === dataDay && formattedDate === data.date.split("T")[0]
      );
    });

    const listData = filteredData.map((data) => ({
      type:
        data.isRejected === false && data.isApproved === false
          ? "warning"
          : data.isApproved === true && data.isRejected === false
          ? "success"
          : data.isApproved === false && data.isRejected === true
          ? "error"
          : "warning",
      content:
        data.isRejected === false && data.isApproved === false
          ? "Waiting"
          : data.isApproved === true && data.isRejected === false
          ? "Approved"
          : data.isApproved === false && data.isRejected === true
          ? "Rejected"
          : "Waiting",
      comments: data.comments,
    }));



    return listData || [];
  };

  const getMonthData = (value) => {
    // Logic for month data, adjust as needed
    // For example, return a specific value if the month matches a condition
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
    // <Calendar cellRender={cellRender}/>
    <Calendar />
  ) : (
    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
  );
};

export default Holiday;
