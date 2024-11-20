import React, { useEffect, useRef, useState } from "react";
import {
  Button, Box, OutlinedInput, Select, MenuItem, TextField, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper
} from "@material-ui/core";

export default function ReimbursementItems({ reimItems, setItems, reimbursmentId, status, reimbursementDate, totalAmount, setTotalAmount, validationErrors }) {
  const [nextItemId, setNextItemId] = useState(10);

  const reimbursementTypes = ["Travel", "Meals", "Supplies", "Accommodation"];
  const reimbursementTypeDefaults = {
    Travel: 500,
    Meals: 200,
    Supplies: 300,
    Accommodation: 1000,
  };

  const handleInputChange = (field, index, value) => {
    const updatedItems = [...reimItems];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    const lastItemValue = reimItems.length > 0 ? reimItems[reimItems.length - 1].item : 0;
    const newItem = {
      id: nextItemId,
      item: Number(lastItemValue) + 10 || 10,
      reimbursementType: "",
      reimbursementDate: "",
      amountToBeReimbursed: "",
      amountEligibleToClaim: ""
    };
    setItems(prevItems => [...prevItems, newItem]);
    setNextItemId(prevId => prevId + 10);

  };

  const handleReimbursementTypeChange = (value, id) => {
    const updatedItems = reimItems.map(item =>
      item.id === id
        ? {
          ...item,
          reimbursementType: value,
          amountEligibleToClaim: reimbursementTypeDefaults[value]
        }
        : item
    );
    setItems(updatedItems);
  };

  const handleAmountToBeReimbursedChange = (e, id) => {
    const value = parseFloat(e.target.value) || 0;
    const updatedItems = reimItems.map(item =>
      item.id === id
        ? {
          ...item,
          amountToBeReimbursed: value > item.amountEligibleToClaim
            ? item.amountEligibleToClaim  // Set to eligible amount if input exceeds it
            : value
        }
        : item
    );

    setItems(updatedItems);
    calculateTotalAmount(updatedItems);
  };

  const calculateTotalAmount = (items) => {
    const total = items.reduce((sum, item) => sum + (Number(item.amountToBeReimbursed) || 0), 0);
    setTotalAmount(total);
  };

  const handleReimbursementDateChange = (e, id) => {
    const updatedItems = reimItems.map(item =>
      item.id === id
        ? { ...item, reimbursementDate: e.target.value }
        : item
    );
    setItems(updatedItems);
  };

  

  return (

    <Box py={5}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Reimbursement Type</TableCell>
              <TableCell>Reimbursement Date</TableCell>
              <TableCell>Amount To Be Reimbursed</TableCell>
              <TableCell>Amount Eligible To Claim</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reimItems.map((item) => (
              <TableRow key={item.id} className="custom-table-row">
                <TableCell className="custom-table-cell" style={{ width: 'auto', whiteSpace: 'nowrap' }}>
                  {item.item}
                </TableCell>
                <TableCell className="custom-table-cell" style={{ width: 'auto', whiteSpace: 'nowrap' }}>
                  <Select
                    value={item.reimbursementType || ""}
                    onChange={(e) => handleReimbursementTypeChange(e.target.value, item.id)}
                  >
                    {reimbursementTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell className="custom-table-cell" style={{ width: 'auto', whiteSpace: 'nowrap' }}>
                  <TextField
                    type="date"
                    value={item.reimbursementDate || ""}
                    onChange={(e) => handleReimbursementDateChange(e, item.id)}
                    className="editable-cell"
                    InputLabelProps={{ shrink: true }}
                    error={!!validationErrors[`item-${item.id}-reimbursementDate`]}
                    helperText={validationErrors[`item-${item.id}-reimbursementDate`]}
                  />
                </TableCell>
                <TableCell className="custom-table-cell" style={{ width: 'auto', whiteSpace: 'nowrap' }}>
                  <OutlinedInput
                    value={item.amountToBeReimbursed || ""}
                    onChange={(e) => handleAmountToBeReimbursedChange(e, item.id)}
                    placeholder="Amount to be reimbursed"
                    className="editable-cell"
                    error={!!validationErrors[`item-${item.id}-amountToBeReimbursed`]}
                    aria-describedby={`item-${item.id}-amountToBeReimbursed-error`}
                  />
                </TableCell>
                <TableCell>{item.amountEligibleToClaim}</TableCell>
              </TableRow>

            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="outlined" color="primary" onClick={handleAddItem} style={{ marginTop: "16px" }}>
        Add Item
      </Button>
    </Box>
  )
}
