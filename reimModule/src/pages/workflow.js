import React, { useEffect, useState } from "react";
import { Button, Box, Typography, AppBar, Tabs, Tab, OutlinedInput } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { getWorkflowItems, getTableCount } from "api";


const Workflow = ({ id, onBack }) => {
 
  const [worlflowItems, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);


  const columnsworkflow = [
    { field: "reimbursmentId", headerName: "reimbursmentId", flex: 1 },
    { field: "level", headerName: "level", flex: 1 },
    { field: "status", headerName: "status", flex: 1 },
    { field: "BeginDate", headerName: "BeginDate", flex: 1 },
    { field: "EndDate", headerName: "EndDate", flex: 1 },
    { field: "DaysTaken", headerName: "DaysTaken", flex: 1 },
    { field: "Users", headerName: "Users", flex: 1 },
    { field: "ApprovedBy", headerName: "ApprovedBy", flex: 1 },
  ];

  const PAGE_SIZE = 15;

  const loadData = async (isFirstLoad, skip = 0) => {
    try {
      setLoading(true);
      setItems([]);

      if (isFirstLoad) {
        const count = await getTableCount();
        setRowCount(count);
      }

      const _worlflowItems = await getWorkflowItems({
        $top: PAGE_SIZE,
        $skip: skip
      });
      const workflowitemsWithIds = _worlflowItems.map((workflowitem, index) => ({
        ...workflowitem,
        id: index + skip
      }));
      setItems(workflowitemsWithIds);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(true);
  }, []);

  return (
    <Box py={5}>
            <DataGrid
              loading={loading}
              rows={worlflowItems}
              columns={columnsworkflow}
              pageSize={PAGE_SIZE}
              paginationMode="server"
              rowCount={rowCount}
              autoHeight
            />
          </Box>
  );
};
  export default Workflow;
