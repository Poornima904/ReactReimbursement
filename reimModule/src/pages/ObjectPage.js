import { Button, Box, Typography, AppBar, Tabs, Tab, OutlinedInput, Toolbar } from "@material-ui/core";
import { getReimbursementItems, getTableCount } from "api";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import Attachments from "./Attachments";
import Workflow from "./workflow";
import Comments from "./Comments";

const ObjectPage = ({ id, onBack, fromCreate }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [reimItems, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true); // Enable editing mode
  };


  const handleSave = () => {
    console.log("Saving changes...");
    setIsEditing(false); // Exit editing mode
  };


  const handleDiscardDraft = () => {
    console.log("Discarding the draft...");
    setIsEditing(false); // Exit editing mode
    onBack();
  };

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
    <Box padding={2} height="100vh" overflow="hidden" display="flex" flexDirection="column">
      <Box flexGrow={1} overflow="auto" paddingBottom="80px"> {/* Bottom padding to prevent overlap with footer */}
        <Button variant="outlined" color="primary" onClick={onBack} style={{ marginRight: "92%" }}>
          Back
        </Button>
        <Toolbar>
          <Typography variant="h5" style={{ marginTop: "16px", marginBottom: "16px", marginRight: "95%" }}>
            {id}
          </Typography>
          {!isEditing && (
            <Button variant="contained" color="primary" onClick={handleEdit} style={{ right: "2%" }}>
              Edit
            </Button>
          )}
        </Toolbar>

        <AppBar position="static" style={{ backgroundColor: "#f0f0f0", boxShadow: "none" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            TabIndicatorProps={{ style: { backgroundColor: "black" } }}
          >
            <Tab label="General Information" style={{ color: "black" }} />
            <Tab label="Reimbursement Details" style={{ color: "black" }} />
            <Tab label="Attachments" style={{ color: "black" }} />
            <Tab label="Workflow History" style={{ color: "black" }} />
            <Tab label="Comments" style={{ color: "black" }} />
          </Tabs>
        </AppBar>

        <Box padding={2} border={1} borderColor="grey.300" borderRadius="4px" marginTop="16px">
          {/* General Information */}
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
              <Box marginRight={2}>
                <Typography variant="body1"><strong>Status:</strong> {'New'}</Typography>
              </Box>
          
            </Box>
          </Box>

          {/* Reimbursement Details */}
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

          {/* Attachments */}
          <Box
            style={{
              backgroundColor: activeTab === 2 ? "#f0f0f0" : "transparent",
              padding: "16px",
              marginTop: "16px"
            }}
          >
            <Typography variant="h6" style={{ marginRight: "95%" }}><strong>Attachments</strong></Typography>
            <Attachments />
          </Box>

          {/* Workflow History */}
          <Box
            style={{
              backgroundColor: activeTab === 3 ? "#f0f0f0" : "transparent",
              padding: "16px",
              marginTop: "16px"
            }}
          >
            <Typography variant="h6" style={{ marginRight: "90%" }}><strong>Workflow History</strong></Typography>
            <Workflow />
          </Box>

          {/* Comments */}
          <Box
            style={{
              backgroundColor: activeTab === 4 ? "#f0f0f0" : "transparent",
              padding: "16px",
              marginTop: "16px"
            }}
          >
            <Typography variant="h6" style={{ marginRight: "95%" }}><strong>Comments</strong></Typography>
            <Comments />
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      {isEditing && (
        <Box
          position="fixed"
          bottom={0}
          left={0}
          width="100%"
          display="flex"
          justifyContent="flex-end"
          bgcolor="#f0f0f0"
          padding={2}
          boxShadow="0px -2px 4px rgba(0, 0, 0, 0.2)"
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            style={{
              marginRight: "8px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              transition: "background-color 0.3s ease, transform 0.3s ease"
            }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleDiscardDraft}
            style={{
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              transition: "background-color 0.3s ease, transform 0.3s ease"
            }}
          >
            Discard Draft
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ObjectPage;
