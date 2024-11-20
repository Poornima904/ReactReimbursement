import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@material-ui/core";
import { getTableData } from "api";


const columns = [
  { field: "reimbursmentId", headerName: "Reimbursement ID", width: 250 },
  { field: "reimbursementDate", headerName: "Reimbursement Date", flex: 1 },
  { field: "totalAmount", headerName: "Total Amount", flex: 1 },
];

export default function MasterPage({ onRowClick, onCreateClick }) {
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [filterValues, setFilterValues] = useState({
    reimbursmentId: "",
    reimbursementDate: "",
    totalAmount: "",
  });

  const loadData = async () => {
    try {
      const data = await getTableData(); // Fetch all data once
      setAllItems(data); // Store all items for local filtering
      setItems(data); // Display all items initially
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    loadData(true);
  }, []);


  const applyFilters = () => {
    const filteredItems = allItems.filter((item) => {
      const matchesReimbursmentId = filterValues.reimbursmentId
        ? item.reimbursmentId
            .toLowerCase()
            .includes(filterValues.reimbursmentId.toLowerCase())
        : true;
      const matchesDate = filterValues.reimbursementDate
        ? item.reimbursementDate === filterValues.reimbursementDate
        : true;
      const matchesTotalAmount = filterValues.totalAmount
        ? item.totalAmount.toString() === filterValues.totalAmount
        : true;
      return matchesReimbursmentId && matchesDate && matchesTotalAmount;
    });

    setItems(filteredItems);
  };

  return (
    <Container disableGutters>
      <Box
        sx={{
          bgcolor: "#f5f5f5",
          p: 2,
          borderRadius: 6,
          mb: 2,
          mt: 2,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 18, 
        }}
      >
       <TextField
          label="Reimbursement ID"
          variant="outlined"
          value={filterValues.reimbursmentId}
          onChange={(e) => setFilterValues({ ...filterValues, reimbursmentId: e.target.value })}
          sx={{ flex: 1 }}
        />
        <TextField
          label="Reimbursement Date"
          variant="outlined"
          type="date"
          value={filterValues.reimbursementDate}
          onChange={(e) => setFilterValues({ ...filterValues, reimbursementDate: e.target.value })}
          InputLabelProps={{ shrink: true }}
          sx={{ flex: 1 }}
        />
        <TextField
          label="Total Amount"
          variant="outlined"
          value={filterValues.totalAmount}
          onChange={(e) => setFilterValues({ ...filterValues, totalAmount: e.target.value })}
          sx={{ flex: 1 }}
        />
       <Button variant="contained" color="primary" onClick={applyFilters}>
          Apply Filters
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => loadData(true)} style={{left:"31%"}}>
          Refresh
        </Button>
        <Button variant="contained" color="primary" onClick={onCreateClick} style={{left:"31%"}}>
          Create
        </Button>
      </Box>


      <Box
        component={Paper}
        elevation={3}
        sx={{
          overflow: "hidden",
          borderRadius: 6,
          border: "2px solid #3f51b5", 
          padding: 1,

        }}
      >
        <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.field} style={{ width: column.width, fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
                    {column.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index} hover onClick={() => onRowClick(item.reimbursmentId)} style={{ cursor: "pointer" }}>
                  <TableCell>{item.reimbursmentId}</TableCell>
                  <TableCell>{item.reimbursementDate}</TableCell>
                  <TableCell>{item.totalAmount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}
