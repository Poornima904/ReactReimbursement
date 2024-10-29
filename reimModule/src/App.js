import React, { useState } from "react";
import "./App.css";
import AppBar from "components/AppBar";
import MasterPage from "pages/MasterPage";
import ObjectPage from "pages/ObjectPage";

const App = () => {
  const [currentView, setCurrentView] = useState("master"); // Tracks which view to show
  const [selectedId, setSelectedId] = useState(null); // Tracks the selected reimbursement ID
  const [fromCreate, setFromCreate] = useState(false); // Track if navigation is from Create button

  // Function to navigate to ObjectPage, optionally with an ID
  const navigateToObjectPage = (id = null, isFromCreate = false) => {
    setSelectedId(id); // Set the selected ID (null if "Create" button clicked)
    setFromCreate(isFromCreate); // Set if navigation is from Create button
    setCurrentView("object"); // Switch to ObjectPage view
  };

  // Function to navigate back to MasterPage
  const navigateToMasterPage = () => {
    setSelectedId(null); // Reset the selected ID
    setFromCreate(false); // Reset fromCreate flag
    setCurrentView("master"); // Switch to MasterPage view
  };

  return (
    <div className="App full-height">
      <AppBar />
      {currentView === "master" ? (
        <MasterPage 
          onRowClick={navigateToObjectPage}  // Pass row navigation function
          onCreateClick={() => navigateToObjectPage(null, true)} // Pass "Create" button navigation
        />
      ) : (
        <ObjectPage 
          id={selectedId} 
          onBack={navigateToMasterPage} 
          fromCreate={fromCreate} // Pass the fromCreate flag
        />
      )}
    </div>
  );
};

export default App;
