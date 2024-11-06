import React, { useEffect, useRef, useState } from "react";
import { Button, Box, Typography, AppBar, Tabs, Tab, OutlinedInput, Toolbar, Select, MenuItem, FormControl, InputLabel } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import Attachments from "./Attachments";
import Workflow from "./workflow";
import Comments from "./Comments";
import { getReimbursementItems, getTableCount } from "api";
import "./ObjectCreate.css";

const ObjectCreate = ({ id, onBack, fromCreate }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [reimItems, setItems] = useState([]);
    const [nextItemId, setNextItemId] = useState(10); // Start ID at 10, increments by 10
    const [reimbursementId, setReimbursementId] = useState("");
    const [reimbursementDate, setReimbursementDate] = useState("");
    const [totalAmount, setTotalAmount] = useState("");
    const [status, setStatus] = useState("");
    const [editingItemId, setEditingItemId] = useState(null); // Track the item being edited

    const reimbursementTypes = ["Travel", "Meals", "Supplies", "Accommodation"];
    const reimbursementTypeDefaults = {
        Travel: 500,
        Meals: 200,
        Supplies: 300,
        Accommodation: 1000,
    };
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
    };

    const handleDiscardDraft = () => {
        console.log("Discarding the draft...");
        onBack();
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        const refs = [generalInfoRef, detailsRef, attachmentsRef, workflowRef, commentsRef];
    refs[newValue].current.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const handleAddItem = () => {
        const newItem = {
            id: nextItemId,
            item: nextItemId,
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
        setEditingItemId(null); // Close dropdown after selection
    };

    const handleAmountToBeReimbursedChange = (e, id) => {
        const updatedItems = reimItems.map(item =>
            item.id === id
                ? { 
                    ...item, 
                    amountToBeReimbursed: e.target.value 
                }
                : item
        );
        setItems(updatedItems);
    };

    const columns = [
        { field: "item", headerName: "Item", width: 100, editable: false },
        {
            field: "reimbursementType",
            headerName: "Reimbursement Type",
            width: 200,
            renderCell: (params) => {
                const isEditing = params.row.id === editingItemId;
                return isEditing ? (
                    <Select
                        value={params.value || ""}
                        onChange={(e) => handleReimbursementTypeChange(e.target.value, params.row.id)}
                        autoWidth
                        onBlur={() => setEditingItemId(null)} // Close dropdown on blur
                    >
                        {reimbursementTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                ) : (
                    <Box onClick={() => setEditingItemId(params.row.id)}>
                        {params.value || "Select Type"}
                    </Box>
                );
            },
        },
        { field: "reimbursementDate", headerName: "Reimbursement Date", flex: 1, editable: true },
        { 
            field: "amountToBeReimbursed", 
            headerName: "Amount To Be Reimbursed", 
            flex: 1, 
            editable: true, 
            renderEditCell: (params) => (
                <OutlinedInput
                    value={params.value || ""}
                    onChange={(e) => handleAmountToBeReimbursedChange(e, params.id)}
                    placeholder="Amount to be reimbursed"
                />
            )
        },
        {
            field: "amountEligibleToClaim",
            headerName: "Amount Eligible To Claim",
            flex: 1,
            editable: false,
            renderCell: (params) => (
                <Typography variant="body1">{params.value}</Typography>
            ),
        }
    ];

    useEffect(() => {
        generateRandomId();  // Generate random ID for reimbursement
    }, []);

    return (
        <Box height="100vh" display="flex" flexDirection="column">
            <Box className="sticky-header">
                <Toolbar>
                    <Typography variant="h6">
                        <strong>Reimbursement ID:</strong> {reimbursementId}
                    </Typography>
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
                    <Button variant="outlined" color="primary" onClick={onBack} style={{ position: "absolute", top: "16px", left: "16px", color: "white" }}>
                        Back
                    </Button>

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
                                rows={reimItems}
                                columns={columns}
                                pageSize={5}
                                autoHeight
                                disableSelectionOnClick
                            />
                            <Button variant="outlined" color="primary" onClick={handleAddItem} style={{ marginTop: "16px" }}>
                                Add Item
                            </Button>
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

            <Box position="fixed" bottom="0" left="0" right="0" className="footer">
                <Button variant="contained" color="secondary" onClick={handleDiscardDraft} style={{ position: "absolute", left: "16px" }}>Discard Draft</Button>
                <Button variant="contained" color="primary" onClick={handleCreate} style={{ position: "absolute", right: "16px" }}>Create</Button>
            </Box>
        </Box>
    );
};

export default ObjectCreate;
