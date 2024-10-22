import { Button, Box, Typography, AppBar, Tabs, Tab, OutlinedInput } from "@material-ui/core";
import { getReimbursementItems, getTableCount } from "api";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";


const ObjectPage = ({ id, onBack }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [reimItems, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue); // Update active tab based on user selection
  };

  const columns = [
    { field: "reimbursmentId", headerName: "Reimbursment ID", width: 250 },
    { field: "item", headerName: "Item", flex: 1 },
    { field: "reimbursmentType", headerName: "Reimbursment Type", flex: 1 },
    { field: "reimbursmentDate", headerName: "Reimbursment Date", flex: 1 },
    { field: "amountToBeReimbursed", headerName: "Amount To Be Reimbursed", flex: 1 },
    { field: "amountEligibleToClaim", headerName: "Amount Eligible To Claim", flex: 1 }
  ];

  //reimbursement item objpage table
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
      {/* Back button and Reimbursement ID */}
      <Button variant="outlined" color="primary" onClick={onBack} style={{ marginRight: "90%" }}>
        Back to List
      </Button>
      <Typography variant="h5" style={{ marginTop: "16px", marginBottom: "16px", marginRight: "85%" }}>
        Reimbursement ID: {id}
      </Typography>

      {/* Tab Navigation */}
      <AppBar position="static">
        <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="General Information" />
          <Tab label="Reimbursement Details" />
          <Tab label="Attachments" />
          <Tab label="Workflow History" />
          <Tab label="Comments" />
        </Tabs>
      </AppBar>

      {/* Tab Content */}
      <Box padding={2} border={1} borderColor="grey.300" borderRadius="4px" marginTop="16px">
        {/* General Information */}
        <Box
          style={{
            backgroundColor: activeTab === 0 ? "#f0f0f0" : "transparent", // Highlight active tab
            padding: activeTab === 0 ? "16px" : "0", // Add padding if active
          }}
        >
          <Typography variant="h6" style={{ marginBottom: "8px", marginRight: "1440px" }}> {/* Align title to the left */}
            <strong>General Information</strong>
          </Typography>

          <Box display="flex" flexDirection="row" alignItems="center" marginTop={2}>
            <Box marginRight={2}> {/* Space between fields */}
              <Typography variant="body1">
                <strong>Reimbursement Date:</strong> {'11-11-2024'}
              </Typography>
            </Box>
            <Box marginRight={2}> {/* Space between fields */}
              <Typography variant="body1">
                <strong>Total Amount:</strong> {'9000'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1">
                <strong>Status:</strong> {'New'}
              </Typography>
            </Box>
          </Box>
        </Box>


        {/* Reimbursement Details-=====================================================================================================-========================== */}
        <Box
          style={{
            backgroundColor: activeTab === 1 ? "#f0f0f0" : "transparent", // Highlight active tab
            padding: activeTab === 1 ? "16px" : "0", // Add padding if active
            marginTop: activeTab === 0 ? "16px" : "0", // Add margin to separate if previous section is shown
          }}
        >
          <Typography variant="h6" style={{ marginBottom: "8px", marginRight: "1430px" }}><strong>Reimbursement Details</strong></Typography>
          {activeTab === 1 && (

            <Typography variant="body1">

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


            </Typography>
          )}
        </Box>

        {/* Attachments============================================================================== */}
        <Box
          style={{
            backgroundColor: activeTab === 2 ? "#f0f0f0" : "transparent", // Highlight active tab
            padding: activeTab === 2 ? "16px" : "0", // Add padding if active
            marginTop: activeTab === 1 || activeTab === 0 ? "16px" : "0", // Add margin to separate if previous section is shown
          }}
        >
          <Typography variant="h6" style={{ marginBottom: "8px", marginRight: "1430px" }}><strong>Attachments</strong>Attachments</Typography>
          {activeTab === 2 && (
            <Typography variant="body1">
              {/* Content for Attachments */}
              Attachments content goes here.
            </Typography>
          )}
        </Box>

        {/* Workflow History */}
        <Box
          style={{
            backgroundColor: activeTab === 3 ? "#f0f0f0" : "transparent", // Highlight active tab
            padding: activeTab === 3 ? "16px" : "0", // Add padding if active
            marginTop: activeTab === 2 || activeTab === 1 || activeTab === 0 ? "16px" : "0", // Add margin to separate if previous section is shown
          }}
        >
          <Typography variant="h6" style={{ marginBottom: "8px", marginRight: "1430px" }}><strong>Workflow History</strong></Typography>
          {activeTab === 3 && (
            <Typography variant="body1">
              {/* Content for Workflow History */}
              Workflow history content goes here.
            </Typography>
          )}
        </Box>

        {/* Comments */}
        <Box
          style={{
            backgroundColor: activeTab === 4 ? "#f0f0f0" : "transparent", // Highlight active tab
            padding: activeTab === 4 ? "16px" : "0", // Add padding if active
            marginTop: activeTab === 3 || activeTab === 2 || activeTab === 1 || activeTab === 0 ? "16px" : "0", // Add margin to separate if previous section is shown
          }}
        >
          <Typography variant="h6" style={{ marginBottom: "8px", marginRight: "1430px" }}><strong>Comments</strong>
          </Typography>
          {activeTab === 4 && (
            <Typography variant="body1">
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

            </Typography>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default ObjectPage;
