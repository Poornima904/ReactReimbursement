import React, { useState, useCallback } from "react";
import {
  Button,
  Box,
  Typography,
  Paper,
  IconButton,
  Avatar,
} from "@material-ui/core";
import { debounce } from "lodash";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import ImageIcon from "@material-ui/icons/Image";
import DescriptionIcon from "@material-ui/icons/Description";
import InsertChartIcon from "@material-ui/icons/InsertChart";
import attachmentImage from "../assets/attachmentImage.png";


// Helper function to extract file extension
const getFileExtension = (fileName) => {
  return fileName.split('.').pop().toLowerCase();
};

// Function to return the appropriate icon based on the file extension
const getFileIcon = (fileName) => {
  const extension = getFileExtension(fileName);
  switch (extension) {
    case "pdf":
      return <PictureAsPdfIcon style={{ fontSize: 30, color: "#e57373" }} />; // Red for PDF
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <ImageIcon style={{ fontSize: 30, color: "#64b5f6" }} />; // Blue for images
    case "doc":
    case "docx":
      return <DescriptionIcon style={{ fontSize: 30, color: "#4caf50" }} />; // Green for documents
    case "xls":
    case "xlsx":
      return <InsertChartIcon style={{ fontSize: 30, color: "#ffeb3b" }} />; // Yellow for spreadsheets
    default:
      return <InsertDriveFileIcon style={{ fontSize: 30, color: "#757575" }} />; // Grey for default files
  }
};

const Attachments = () => {
  const [files, setFiles] = useState([]);

  const handleFileUpload = useCallback(
    debounce((event) => {
      const file = event.target.files[0];
      if (file) {
        setFiles((prevFiles) => [
          ...prevFiles,
          {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            lastModifiedDate: file.lastModifiedDate,
            previewUrl: URL.createObjectURL(file),
          },
        ]);
      }
    }, 300),
    []
  ); // Debounce for 300ms

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <Box>
      {/* File Upload Input */}
      <input
        accept="*/*"
        style={{ display: "none" }}
        id="file-upload"
        type="file"
        onChange={handleFileUpload}
      />
      <label htmlFor="file-upload" style={{ marginLeft: "92%" }}>
        <Button variant="contained" color="primary" component="span">
          Upload File
        </Button>
      </label>

      {/* Display Background Image if no files */}
      {files.length === 0 && (
        <Box
          mt={4}
          height={200}
          display="flex"
          alignItems="center"
          justifyContent="center"
          style={{
            backgroundImage: `url(${attachmentImage})`,
            backgroundSize: "contain",  // Use "contain" to ensure the whole image is visible
            backgroundPosition: "center", // Center the image
            backgroundRepeat: "no-repeat", // Prevent the image from repeating
            backgroundColor: "#f0f0f0",
          }}
        >
          <Typography
            variant="h6"
            style={{ color: "#fff", textShadow: "1px 1px 2px rgba(0,0,0,0.7)" }}
          >
            No files uploaded yet
          </Typography>
        </Box>
      )}

      {/* Display Uploaded Files Information */}
      {files.length > 0 && (
        <Paper style={{ marginTop: "16px", padding: "16px" }}>
          <Typography variant="h6" style={{ marginBottom: "16px" }}>
            Uploaded Files
          </Typography>
          {files.map((file, index) => (
            <Box
              key={index}
              mb={2}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              borderBottom="1px solid #ddd"
              pb={1}
            >
              {/* File Icon */}
              <Avatar
                style={{
                  backgroundColor: "#f5f5f5",
                  marginRight: "16px",
                  width: 50,
                  height: 50,
                }}
              >
                {getFileIcon(file.name)}
              </Avatar>

              {/* File Details */}
              <Box display="flex" flexGrow={1}>
                <Typography variant="body1" style={{ marginRight: "16px" }}>
                  <strong>File Name:</strong> {file.name}
                </Typography>
                <Typography variant="body1" style={{ marginRight: "16px" }}>
                  <strong>File Size:</strong> {`${file.size} bytes`}
                </Typography>
                <Typography variant="body1" style={{ marginRight: "16px" }}>
                  <strong>File Type:</strong> {file.type}
                </Typography>
                <Typography variant="body1" style={{ marginRight: "16px" }}>
                  <strong>Last Modified:</strong> {new Date(file.lastModified).toLocaleDateString()}
                </Typography>
              </Box>

              {/* Edit and Remove Icons */}
              <Box>
                <IconButton onClick={() => console.log(`Edit ${file.name}`)}>
                  <EditIcon color="primary" />
                </IconButton>
                <IconButton onClick={() => handleRemoveFile(index)}>
                  <DeleteIcon color="secondary" />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default Attachments;
