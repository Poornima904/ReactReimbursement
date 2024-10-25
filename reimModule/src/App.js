import React, { useState } from "react";
import "./App.css";
import AppBar from "components/AppBar";
import MasterPage from "pages/MasterPage";
import ObjectPage from "pages/ObjectPage";

const App = () => {
  const [currentView, setCurrentView] = useState("master"); // Tracks which view to show
  const [selectedId, setSelectedId] = useState(null); // Tracks the selected reimbursement ID

  // Function to navigate to ObjectPage
  const navigateToObjectPage = (id) => {
    setSelectedId(id); // Set the selected ID
    setCurrentView("object"); // Switch to ObjectPage view
  };

  // Function to navigate back to MasterPage
  const navigateToMasterPage = () => {
    setSelectedId(null); // Reset the selected ID
    setCurrentView("master"); // Switch to MasterPage view
  };

  return (
    <div className="App full-height">
      <AppBar />
      {currentView === "master" ? (
        <MasterPage onRowClick={navigateToObjectPage} /> // Pass navigation function to MasterPage
      ) : (
        <ObjectPage id={selectedId} onBack={navigateToMasterPage} /> 
       
      )}
    </div>
  );
};

export default App;
