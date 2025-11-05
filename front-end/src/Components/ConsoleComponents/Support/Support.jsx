import React, { useState } from "react";
import SubmittedRequests from "./SubmittedRequests/SubmittedRequests";
import SupportRequest from "./SupportRequest/SupportRequest";


const Partnership = () => {
  const [activeTab, setActiveTab] = useState("add request");

  const renderTabContent = () => {
    switch (activeTab) {
      case "add request":
        return <SupportRequest />;
      case "submitted requests":
        return <SubmittedRequests />;
      default:
        return null;
    }
  };

  return (
    <div className="partnership">
      <div className="tabs">
        <button onClick={() => setActiveTab("add request")} className={activeTab === "add request" ? "active" : ""}>Add a request</button>

        <button onClick={() => setActiveTab("submitted requests")} className={activeTab === "submitted requests" ? "active" : ""}>Submitted requests</button>

      </div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Partnership;
