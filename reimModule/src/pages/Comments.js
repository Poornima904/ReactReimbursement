import React, { useEffect, useState } from "react";
import { Button, Box, OutlinedInput, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Divider, Avatar } from "@material-ui/core";

const Comments = () => {
    const [open, setOpen] = useState(false);
    const [comment, setComment] = useState("");
    const [history, setHistory] = useState([
        { id: 1, text: "Initial comment", date: "2023-10-20", user: "Alice", avatar: "/path/to/alice-avatar.jpg" },
        { id: 2, text: "Follow-up comment", date: "2023-10-25", user: "Bob", avatar: "/path/to/bob-avatar.jpg" },
        // Add more comments with avatar URLs as needed
    ]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSaveComment = () => {
        const newComment = {
            id: history.length + 1,
            text: comment,
            date: new Date().toISOString().slice(0, 10), // format date as YYYY-MM-DD
            user: "CurrentUser", // replace with actual user data if available
            avatar: "/path/to/currentuser-avatar.jpg", // Add your avatar path here
        };
        setHistory([newComment, ...history]); // add new comment at the beginning
        setComment("");
        setOpen(false);
    };

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                style={{ marginBottom: "4px", marginLeft: "85%" }}
                onClick={handleClickOpen}
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
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </Box>
            </Box>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Comment History</DialogTitle>

                <DialogContent dividers style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {history.length > 0 ? (
                        history.map((entry) => (
                            <Box key={entry.id} display="flex" mb={2} alignItems="flex-start">
                                <Avatar alt={entry.user} src={entry.avatar} style={{ marginRight: 8 }} />
                                <Box>
                                    <Typography variant="body1"><strong>{entry.user}</strong></Typography>
                                    <Typography variant="body2" color="textSecondary">{entry.date}</Typography>
                                    <Typography variant="body2">{entry.text}</Typography>
                                    <Divider style={{ margin: "10px 0" }} />
                                </Box>
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary">No comment history available.</Typography>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleSaveComment} color="primary" variant="contained">
                        Save
                    </Button>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>


                    <Button>hrloo</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Comments;
