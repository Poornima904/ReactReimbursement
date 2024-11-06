import React, { useState } from "react";
import "./App.css";
import AppBar from "components/AppBar";
import MasterPage from "pages/MasterPage";
import ObjectPage from "pages/ObjectPage";
import ObjectCreate from "pages/ObjectCreate"; // Import the new ObjectCreate component

const App = () => {
  const [currentView, setCurrentView] = useState("master");
  const [selectedRowData, setSelectedRowData] = useState(null); // Store selected row data

  // Function to navigate to ObjectPage with selected row data
  const navigateToObjectPage = (rowData) => {
    setSelectedRowData(rowData); // Pass row data to ObjectPage
    setCurrentView("object");
  };

  // Function to navigate to ObjectCreate
  const navigateToObjectCreate = () => {
    setSelectedRowData(null); // Reset selected row data
    setCurrentView("create"); // Switch to ObjectCreate view
  };

  // Function to navigate back to MasterPage
  const navigateToMasterPage = () => {
    setCurrentView("master");
  };

  return (
    <div className="App full-height">
      <AppBar />
      {currentView === "master" ? (
        <MasterPage 
          onRowClick={navigateToObjectPage} 
          onCreateClick={navigateToObjectCreate} 
        />
      ) : currentView === "object" ? (
        <ObjectPage 
          rowData={selectedRowData} 
          onBack={navigateToMasterPage} 
        />
      ) : (
        <ObjectCreate 
          onBack={navigateToMasterPage} fromCreate={true}
        />
      )}
    </div>
  );
};

export default App;
