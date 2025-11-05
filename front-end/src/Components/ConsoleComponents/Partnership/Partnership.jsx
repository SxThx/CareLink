import React, { useState } from "react";
import Explore from "./Explore/Explore";
import Requests from "./Requests/Requests";
import Partnerships from "./Partners/Partners";
import "./Partnership.scss";

const Partnership = () => {
  const [activeTab, setActiveTab] = useState("explore");

  const renderTabContent = () => {
    switch (activeTab) {
      case "explore":
        return <Explore />;
      case "requests":
        return <Requests />;
      case "partnerships":
        return <Partnerships />;
      default:
        return null;
    }
  };

  return (
    <div className="partnership">
      <div className="tabs">
        <button onClick={() => setActiveTab("explore")} className={activeTab === "explore" ? "active" : ""}>Explore</button>
        <button onClick={() => setActiveTab("requests")} className={activeTab === "requests" ? "active" : ""}>Requests</button>
        <button onClick={() => setActiveTab("partnerships")} className={activeTab === "partnerships" ? "active" : ""}>Partnerships</button>
      </div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Partnership;
