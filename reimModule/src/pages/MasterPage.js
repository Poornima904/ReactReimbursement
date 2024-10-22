import React, { useEffect, useState } from "react";
import { Container, Box, Toolbar, Button, Typography, TextField } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { getTableData, getTableCount } from "api";

const columns = [
  { field: "reimbursmentId", headerName: "Reimbursment ID", width: 250 },
  { field: "reimbursementDate", headerName: "Reimbursement Date", flex: 1 },
  { field: "totalAmount", headerName: "Total Amount", flex: 1 },
];

const PAGE_SIZE = 15;

export default function MasterPage({ onRowClick }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [filterValues, setFilterValues] = useState({
    reimbursmentId: "",
    reimbursementDate: "",
    totalAmount: ""
  });

  const loadData = async (isFirstLoad, skip = 0) => {
    try {
      setLoading(true);
      setItems([]);

      if (isFirstLoad) {
        const count = await getTableCount();
        setRowCount(count);
      }

      const _items = await getTableData({
        $top: PAGE_SIZE,
        $skip: skip,
        ...filterValues // Apply filter values to the request if needed
      });
      const itemsWithIds = _items.map((item, index) => ({
        ...item,
        id: index + skip
      }));
      setItems(itemsWithIds);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(true);
  }, []);

  return (
    <Container disableGutters>
      <Box mb={2}>
        <Toolbar></Toolbar>
        <Toolbar>
          <TextField
            label="Reimbursement ID"
            variant="outlined"
            name="reimbursmentId"
            value={filterValues.reimbursmentId}
            onChange={(e) => setFilterValues({ ...filterValues, reimbursmentId: e.target.value })}
            style={{ marginRight: "8px" }}
          />
          <TextField
            label="Reimbursement Date"
            variant="outlined"
            name="reimbursementDate"
            type="date"
            value={filterValues.reimbursementDate}
            onChange={(e) => setFilterValues({ ...filterValues, reimbursementDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            style={{ marginRight: "8px" }}
          />
          <TextField
            label="Total Amount"
            variant="outlined"
            name="totalAmount"
            value={filterValues.totalAmount}
            onChange={(e) => setFilterValues({ ...filterValues, totalAmount: e.target.value })}
            style={{ marginRight: "8px" }}
          />
          <Button variant="contained" color="primary" onClick={() => loadData(true)}>
            Apply Filters
          </Button>
        </Toolbar>
      </Box>

      <Toolbar>
        <Typography variant="h6" style={{ flex: 1 }}>
          Reimbursement Records
        </Typography>
        <Button variant="contained" color="primary" onClick={() => console.log("Create button clicked")}>
          Create
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => loadData(true)} style={{ marginLeft: "8px" }}>
          Refresh
        </Button>
      </Toolbar>

      <Box height="80vh" py={5}>
        <DataGrid
          loading={loading}
          rows={items}
          columns={columns}
          pageSize={PAGE_SIZE}
          paginationMode="server"
          rowCount={rowCount}
          onRowClick={(params) => onRowClick(params.row.reimbursmentId)} // Trigger the onRowClick prop
        />
      </Box>
    </Container>
  );
}
