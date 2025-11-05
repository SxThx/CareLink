import React, { useEffect, useState } from "react";
import { getApprovedPartnershipsAPI, deletePartnershipAPI } from "../../../../services/APIs/PartnershipAPI";
import "./Partners.scss";
import {
  showSuccessToast,
  showErrorToast,
  showLoadingToast,
  dismissToast,
} from "../../../Toast/Toast";

const Partnerships = () => {
  const [approvedPartnerships, setApprovedPartnerships] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      showLoadingToast("Fetching partners...");
      try {
        const response = await getApprovedPartnershipsAPI();
        console.log(response);
        setApprovedPartnerships(response.data.partnershipsApprove || []);
        showSuccessToast("Partners loaded successfully.");
      } catch (error) {
        console.error("Error fetching approved partnerships:", error);
        showErrorToast("Failed to load approved partnerships.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRevoke = async (partnershipId) => {
    if (window.confirm("Are you sure you want to revoke this partnership?")) {
      showLoadingToast("Revoking partnership...");
      try {
        const response = await deletePartnershipAPI(partnershipId);
        if (response.status === 200) {
          showSuccessToast(response.message);
          setApprovedPartnerships((prevPartnerships) =>
            prevPartnerships.filter(
              (partnership) => partnership.id !== partnershipId
            )
          );
        } else {
          showErrorToast("Failed to revoke partnership.");
        }
      } catch (error) {
        console.error("Error revoking partnership:", error);
        showErrorToast("Error revoking partnership. Please try again.");
      }
    }
  };

  return (
    <div className="partnerships">
      <h2>Approved Partnerships</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        approvedPartnerships.length > 0 ? (
          <div className="approved-partnerships">
            {approvedPartnerships.map((partnership) => (
              <div key={partnership.id} className="partnership-card">
                <div className="logo">
                  {partnership.company_logo ? (
                    <img
                      src={partnership.company_logo}
                      alt={`${partnership.company_name} logo`}
                      className="company-logo"
                    />
                  ) : (
                    <div className="no-logo">
                      <p>No Logo</p>
                    </div>
                  )}
                </div>
                <div className="info">
                  <h2>{partnership.company_name}</h2>
                  <p>{partnership.company_email}</p>
                </div>
                <button className="rejectBtn" onClick={() => handleRevoke(partnership.id)}>
                  Revoke
                </button>
              </div>
            ))
          }
          </div>
        ) : (
          <p>No approved partnerships</p>
        )
      )}
    </div>
  );
};

export default Partnerships;
