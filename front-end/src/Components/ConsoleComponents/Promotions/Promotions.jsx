import React, { useState, useEffect } from "react";
import SingleCoupons from "./SingleCoupons/SingleCoupons";
import ReusableCoupons from "./ReusableCoupons/ReusableCoupons";
import Redeem from "./Redeem/Redeem";
import { getCompanyBranchesAPI } from "../../../services/APIs/BranchAPI";
import "./Promotions.scss";

const Promotions = () => {
  const [activeTab, setActiveTab] = useState("singleCoupons");
  const [branches, setBranches] = useState([]);

  // Fetch company branches when the component mounts
  const fetchCompanyBranches = async () => {
    try {
      const response = await getCompanyBranchesAPI();
      console.log("fetchBranches response", response);

      if (response.status === 200) {
        setBranches(response.data);
      } else {
        console.log("Error fetching company branches: ", response.message);
      }
    } catch (error) {
      console.error("Error fetching company branches:", error);
    }
  };

  // Use useEffect to fetch branches when the component mounts
  useEffect(() => {
    fetchCompanyBranches();
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "singleCoupons":
        return <SingleCoupons branches={branches} />;
      case "reusableCoupons":
        return <ReusableCoupons branches={branches} />;
        case "redeem":
          return <Redeem/>;
      default:
        return null;
    }
  };

  return (
    <div className="Promotions">
      <div className="tabs">
        <button
          onClick={() => setActiveTab("singleCoupons")}
          className={activeTab === "singleCoupons" ? "active" : ""}
        >
          Normal Coupons
        </button>
        <button
          onClick={() => setActiveTab("reusableCoupons")}
          className={activeTab === "reusableCoupons" ? "active" : ""}
        >
          Reusable Coupons
        </button>
        <button
          onClick={() => setActiveTab("redeem")}
          className={activeTab === "redeem" ? "active" : ""}
        >
          Redeem Coupons
        </button>
      </div>
      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
};

export default Promotions;
