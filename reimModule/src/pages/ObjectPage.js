import { Button, Box, Typography, AppBar, Tabs, Tab, OutlinedInput } from "@material-ui/core";
import { getReimbursementItems, getTableCount } from "api";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import Attachments from "./Attachments";
import Workflow from "./workflow";

const ObjectPage = ({ id, onBack }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [reimItems, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const columns = [
    { field: "reimbursmentId", headerName: "Reimbursment ID", width: 250 },
    { field: "item", headerName: "Item", flex: 1 },
    { field: "reimbursmentType", headerName: "Reimbursment Type", flex: 1 },
    { field: "reimbursmentDate", headerName: "Reimbursment Date", flex: 1 },
    { field: "amountToBeReimbursed", headerName: "Amount To Be Reimbursed", flex: 1 },
    { field: "amountEligibleToClaim", headerName: "Amount Eligible To Claim", flex: 1 }
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

      const _reimItems = await getReimbursementItems({
        $top: PAGE_SIZE,
        $skip: skip
      });
      const reimitemsWithIds = _reimItems.map((reimItem, index) => ({
        ...reimItem,
        id: index + skip
      }));
      setItems(reimitemsWithIds);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(true);
  }, []);

  return (
    <div style={{ padding: "16px" }}>
      <Button variant="outlined" color="primary" onClick={onBack} style={{ marginRight: "92%" }}>
        Back
      </Button>
      <Typography variant="h5" style={{ marginTop: "16px", marginBottom: "16px", marginRight: "95%" }}>
        {id}
      </Typography>

      <AppBar position="static" style={{ backgroundColor: "#f0f0f0", boxShadow: "none" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{ style: { backgroundColor: "black" } }} // Sets the indicator color to black
        >
          <Tab label="General Information" style={{ color: "black" }} />
          <Tab label="Reimbursement Details" style={{ color: "black" }} />
          <Tab label="Attachments" style={{ color: "black" }} />
          <Tab label="Workflow History" style={{ color: "black" }} />
          <Tab label="Comments" style={{ color: "black" }} />
        </Tabs>
      </AppBar>

      <Box padding={2} border={1} borderColor="grey.300" borderRadius="4px" marginTop="16px" >
        {/* General Information========================================================================= */}
        <Box
          style={{
            backgroundColor: activeTab === 0 ? "#f0f0f0" : "transparent",
            padding: "16px",
            marginRight: "70%"
          }}
        >
          <Typography variant="h6" style={{ marginRight: "60%" }}><strong>General Information</strong></Typography>
          <Box display="flex" flexDirection="row" alignItems="center" marginTop={2}>
            <Box marginRight={2}>
              <Typography variant="body1"><strong>Reimbursement Date:</strong> {'11-11-2024'}</Typography>
            </Box>
            <Box marginRight={2}>
              <Typography variant="body1"><strong>Total Amount:</strong> {'9000'}</Typography>
            </Box>
            <Box>
              <Typography variant="body1"><strong>Status:</strong> {'New'}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Reimbursement Details========================================================================= */}
        <Box
          style={{
            backgroundColor: activeTab === 1 ? "#f0f0f0" : "transparent",
            padding: "16px",
            marginTop: "16px"
          }}
        >
          <Typography variant="h6" style={{ marginRight: "88%" }}><strong>Reimbursement Details</strong></Typography>
          <Box py={5}>
            <DataGrid
              loading={loading}
              rows={reimItems}
              columns={columns}
              pageSize={PAGE_SIZE}
              paginationMode="server"
              rowCount={rowCount}
              autoHeight
            />
          </Box>
        </Box>

        {/* Attachments========================================================================= */}
        <Box
          style={{
            backgroundColor: activeTab === 2 ? "#f0f0f0" : "transparent",
            padding: "16px",
            marginTop: "16px"
          }}
        >
          <Typography variant="h6" style={{ marginRight: "95%" }}><strong>Attachments</strong></Typography>
          <Typography variant="body1">
           
            <Attachments/>      {/* adding file named Attachments.js*/}
            </Typography>
        </Box>

        {/* Workflow History========================================================================= */}
        <Box
          style={{
            backgroundColor: activeTab === 3 ? "#f0f0f0" : "transparent",
            padding: "16px",
            marginTop: "16px"
          }}
        >
          <Typography variant="h6" style={{ marginRight: "90%" }}><strong>Workflow History</strong></Typography>
          <Workflow/>
          
          
        </Box>

        {/* Comments========================================================================= */}
        <Box
          style={{
            backgroundColor: activeTab === 4 ? "#f0f0f0" : "transparent",
            padding: "16px",
            marginTop: "16px"
          }}
        >
          <Typography variant="h6" style={{ marginRight: "95%" }}><strong>Comments</strong></Typography>
          <Button
            variant="contained"
            color="primary"
            style={{ marginBottom: "4px", marginLeft: "85%" }}
            onClick={() => console.log("Comment History clicked")}
          >
            Comment History
          </Button>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box flexGrow={1} mr={2}>
              <OutlinedInput
                placeholder="Add a comment..."
                multiline
                rows={3}
                fullWidth
                variant="outlined"
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default ObjectPage;