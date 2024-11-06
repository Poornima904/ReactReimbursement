import { Button, Box, Typography, AppBar, Tabs, Tab, OutlinedInput, Toolbar } from "@material-ui/core";
import { getReimbursementItems, getTableCount } from "api";
import React, { useEffect, useRef, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import Attachments from "./Attachments";
import Workflow from "./workflow";
import Comments from "./Comments";

const ObjectCreate = ({ id, onBack, fromCreate }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [reimItems, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rowCount, setRowCount] = useState(0);
    const [reimbursementId, setReimbursementId] = useState(""); // State for reimbursement ID
    const [reimbursementDate, setReimbursementDate] = useState("11-11-2024");
    const [totalAmount, setTotalAmount] = useState("9000");
    const [status, setStatus] = useState("New");

    // Refs for each section
    const generalInfoRef = useRef(null);
    const detailsRef = useRef(null);
    const attachmentsRef = useRef(null);
    const workflowRef = useRef(null);
    const commentsRef = useRef(null);

    const generateRandomId = () => {
        const randomId = `REIM${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
        setReimbursementId(randomId);
    };

    const handleCreate = () => {
        console.log("Creating a new entry...");
        generateRandomId(); // Generate ID when creating a new entry
    };

    const handleDiscardDraft = () => {
        console.log("Discarding the draft...");
        onBack();
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);

        // Scroll the selected section into view
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
        generateRandomId(); // Generate the ID when the component mounts
    }, []);

    return (
        <Box height="100vh" display="flex" flexDirection="column">
            {/* Fixed Header containing Reimbursement ID and Tabs */}
            <Box position="sticky" top={0} zIndex={1} bgcolor="white" boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)">
                {/* Display the reimbursement ID */}
                <Toolbar>
                    <Typography variant="h6">
                        <strong>Reimbursement ID:</strong> {reimbursementId}
                    </Typography>
                </Toolbar>

                {/* Tabs below the reimbursement ID */}
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
            </Box>

            {/* Scrollable Content Area */}
            <Box flexGrow={1} overflow="auto" padding={2} marginTop="16px">
                <Box paddingBottom="80px">
                    <Button variant="outlined" color="primary" onClick={onBack} style={{ position: "absolute", top: "16px", left: "16px", color: "white" }}>
                        Back
                    </Button>

                    {/* General Information */}
                    <Box
                        ref={generalInfoRef}
                        style={{
                            backgroundColor: activeTab === 0 ? "#e0f7fa" : "#f9f9f9",
                            padding: "16px",
                            border: activeTab === 0 ? "2px solid #00796b" : "1px solid #ccc",
                            borderRadius: "4px",
                            marginBottom: "16px",
                           
                        }}
                    >
                        <Typography variant="h6"><strong>General Information</strong></Typography>
                        <Box display="flex" flexDirection="row" alignItems="center" marginTop={2}>
                            <Box marginRight={2}>
                                <Typography variant="body1"><strong>Reimbursement Date:</strong></Typography>
                                <OutlinedInput
                                    value={reimbursementDate}
                                    onChange={(e) => setReimbursementDate(e.target.value)}
                                    placeholder="Reimbursement Date"
                                />
                            </Box>
                            <Box marginRight={2}>
                                <Typography variant="body1"><strong>Total Amount:</strong></Typography>
                                <OutlinedInput
                                    value={totalAmount}
                                    onChange={(e) => setTotalAmount(e.target.value)}
                                    placeholder="Total Amount"
                                />
                            </Box>
                            <Box>
                                <Typography variant="body1"><strong>Status:</strong></Typography>
                                <OutlinedInput
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    placeholder="Status"
                                />
                            </Box>
                        </Box>
                    </Box>


                    {/* Reimbursement Details */}
                    <Box
                        ref={detailsRef}
                        style={{
                            backgroundColor: activeTab === 1 ? "#e0f7fa" : "#f9f9f9",
                            padding: "16px",
                            border: activeTab === 1 ? "2px solid #00796b" : "1px solid #ccc",
                            borderRadius: "4px",
                            marginBottom: "16px",
                           
                        }}
                    >
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

                    {/* Attachments */}
                    <Box
                        ref={attachmentsRef}
                        style={{
                            backgroundColor: activeTab === 2 ? "#e0f7fa" : "#f9f9f9",
                            padding: "16px",
                            border: activeTab === 2 ? "2px solid #00796b" : "1px solid #ccc",
                            borderRadius: "4px",
                            marginBottom: "16px",
                           
                        }}
                    >
                        <Typography variant="h6"><strong>Attachments</strong></Typography>
                        <Attachments />
                    </Box>

                    {/* Workflow History */}
                    <Box
                        ref={workflowRef}
                        style={{
                            backgroundColor: activeTab === 3 ? "#e0f7fa" : "#f9f9f9",
                            padding: "16px",
                            border: activeTab === 3 ? "2px solid #00796b" : "1px solid #ccc",
                            borderRadius: "4px",
                            marginBottom: "16px",
                            
                        }}
                    >
                        <Typography variant="h6"><strong>Workflow History</strong></Typography>
                        <Workflow />
                    </Box>

                    {/* Comments */}
                    <Box
                        ref={commentsRef}
                        style={{
                            backgroundColor: activeTab === 4 ? "#e0f7fa" : "#f9f9f9",
                            padding: "16px",
                            border: activeTab === 4 ? "2px solid #00796b" : "1px solid #ccc",
                            borderRadius: "4px",
                            marginBottom: "16px",
                           
                        }}
                    >
                        <Typography variant="h6"><strong>Comments</strong></Typography>
                        <Comments />
                    </Box>
                </Box>
            </Box>

            {/* Fixed Footer */}
            {fromCreate && (
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
                    <Button variant="outlined" color="primary" onClick={handleCreate} style={{ marginRight: "8px" }}>
                        Create
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleDiscardDraft}>
                        Discard Draft
                    </Button>
                </Box>
            )}
        </Box>
    );
}


export default ObjectCreate;
