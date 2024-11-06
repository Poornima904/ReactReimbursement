import { Button, Box, Typography, AppBar, Tabs, Tab, OutlinedInput, Toolbar } from "@material-ui/core";
import { getReimbursementItems, getTableCount } from "api";
import React, { useEffect, useRef, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import Attachments from "./Attachments";
import Workflow from "./workflow";
import Comments from "./Comments";
import "./ObjectPage.css";

const ObjectPage = ({ id, onBack, fromCreate }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [reimItems, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [reimbursementId, setReimbursementId] = useState("");
  const [reimbursementDate, setReimbursementDate] = useState("11-11-2024");
  const [totalAmount, setTotalAmount] = useState("9000");
  const [status, setStatus] = useState("New");

  const generalInfoRef = useRef(null);
  const detailsRef = useRef(null);
  const attachmentsRef = useRef(null);
  const workflowRef = useRef(null);
  const commentsRef = useRef(null);

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
    const refs = [generalInfoRef, detailsRef, attachmentsRef, workflowRef, commentsRef];
    refs[newValue].current.scrollIntoView({ behavior: "smooth", block: "start" });
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
    <Box height="100vh" display="flex" flexDirection="column">
      <Box className="sticky-header">
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

        <AppBar position="static" className="tab-app-bar">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            TabIndicatorProps={{ className: "tab-indicator" }}
          >
            <Tab label="General Information" className="tab-label" />
            <Tab label="Reimbursement Details" className="tab-label" />
            <Tab label="Attachments" className="tab-label" />
            <Tab label="Workflow History" className="tab-label" />
            <Tab label="Comments" className="tab-label" />
          </Tabs>
        </AppBar>
      </Box>

      <Box flexGrow={1} overflow="auto" padding={2} marginTop="16px">
        <Box paddingBottom="80px">

          <Box ref={generalInfoRef} className={`section-box ${activeTab === 0 ? "highlighted-section" : "default-section"}`}>
            <Typography variant="h6"><strong>General Information</strong></Typography>
            <Box display="flex" flexDirection="row" alignItems="center" marginTop={2}>
              <Box marginRight={2}>
                <Typography variant="body1"><strong>Reimbursement Date:</strong></Typography>
                <OutlinedInput value={reimbursementDate} onChange={(e) => setReimbursementDate(e.target.value)} placeholder="Reimbursement Date" />
              </Box>
              <Box marginRight={2}>
                <Typography variant="body1"><strong>Total Amount:</strong></Typography>
                <OutlinedInput value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} placeholder="Total Amount" />
              </Box>
              <Box>
                <Typography variant="body1"><strong>Status:</strong></Typography>
                <OutlinedInput value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
              </Box>
            </Box>
          </Box>

          <Box ref={detailsRef} className={`section-box ${activeTab === 1 ? "highlighted-section" : "default-section"}`}>
            <Typography variant="h6"><strong>Reimbursement Details</strong></Typography>
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

          <Box ref={attachmentsRef} className={`section-box ${activeTab === 2 ? "highlighted-section" : "default-section"}`}>
            <Typography variant="h6"><strong>Attachments</strong></Typography>
            <Attachments />
          </Box>

          <Box ref={workflowRef} className={`section-box ${activeTab === 3 ? "highlighted-section" : "default-section"}`}>
            <Typography variant="h6"><strong>Workflow History</strong></Typography>
            <Workflow />
          </Box>

          <Box ref={commentsRef} className={`section-box ${activeTab === 4 ? "highlighted-section" : "default-section"}`}>
            <Typography variant="h6"><strong>Comments</strong></Typography>
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
