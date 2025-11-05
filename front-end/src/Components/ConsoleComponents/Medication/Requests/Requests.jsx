import React, { useEffect, useState } from "react";
import { getPendingPartnershipsAPI, getIncomingRequestsAPI, rejectIncomingRequestAPI, cancelPartnershipAPI, acceptIncomingRequestAPI } from "../../../../services/APIs/PartnershipAPI";
import "./Requests.scss";
import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast } from "../../../Toast/Toast";

const Requests = () => {
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      showLoadingToast("Loading requests...");
      const [incomingResponse, pendingResponse] = await Promise.all([
        getIncomingRequestsAPI(),
        getPendingPartnershipsAPI()
      ]);
      setIncomingRequests(incomingResponse.data.partnershipIncomingRequest || []);
      setOutgoingRequests(pendingResponse.data.partnershipsPending || []);
      dismissToast();
      showSuccessToast("Requests loaded successfully.");
    } catch (error) {
      console.error("Error fetching requests:", error);
      showErrorToast("Error fetching requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (partnershipId) => {
    if (window.confirm("Are you sure you want to reject this partnership?")) {
      try {
        const response = await rejectIncomingRequestAPI({ partnershipId });
        if (response.status === 200) {
          showSuccessToast(response.message);
          fetchData();  // Refresh data after successful operation
        }
      } catch (error) {
        console.error("Error rejecting partnership:", error);
        showErrorToast("Error rejecting partnership. Please try again.");
      }
    }
  };

  const handleApprove = async (partnershipId) => {
    if (window.confirm("Are you sure you want to approve this partnership?")) {
      try {
        showLoadingToast("Approving partnership.....")
        const response = await acceptIncomingRequestAPI({ partnershipId });
        if (response.status === 200) {
          showSuccessToast(response.message);
          setIncomingRequests((prevRequests) =>
            prevRequests.filter((request) => request.id !== partnershipId)
          );
        }
      } catch (error) {
        console.error("Error approving partnership:", error);
        showErrorToast(response.message);
      }
    }
  };


  const handleCancelRequest = async (partnershipId) => {
    if (window.confirm("Are you sure you want to cancel this partnership?")) {
      try {
        showLoadingToast("Cancelling request.....")
        const response = await cancelPartnershipAPI({ partnershipId });
        if (response.status === 200) {
          showSuccessToast(response.message);
          // Remove the request from the outgoingRequests list without re-fetching
          setOutgoingRequests(prevRequests =>
            prevRequests.filter(request => request.id !== partnershipId)
          );
        }
      } catch (error) {
        console.error("Error cancelling partnership:", error);
        showErrorToast("Error cancelling partnership. Please try again.");
      }
    }
  };
  

  return (
    <div className="requests">
      <div className="incoming-requests">
        <h2>Incoming Requests</h2>
        {loading ? <p>Loading...</p> : (
          <div className="cards">
            {incomingRequests.length > 0 ? incomingRequests.map((request) => (
              <div key={request.id} className="request-card">
                <div className="right">
                  <div className="logo">
                    {request.company_logo ? (
                      <img src={request.company_logo} className="company-logo"/>
                    ) : (
                      <div className="no-logo"><p>No Logo</p></div>
                    )}
                  </div>
                  <div className="info">
                    <h2>{request.company_name}</h2>
                    <p>{request.company_email}</p>
                  </div>
                </div>
                <div className="left">
                  <button className="approveBtn" onClick={() => handleApprove(request.id)}>
                    Approve
                  </button>
                  <button className="rejectBtn" onClick={() => handleReject(request.id)}>
                    Reject
                  </button>
                </div>
              </div>
            )) : <p>No incoming requests</p>}
          </div>
        )}
      </div>
      <div className="outgoing-requests">
        <h2>Outgoing Requests</h2>
        {loading ? <p>Loading...</p> : (
          <div className="cards">
            {outgoingRequests.length > 0 ? outgoingRequests.map((request) => (
              <div key={request.id} className="request-card">
                <div className="right">
                  <div className="logo">
                    {request.company_logo ? (
                      <img src={request.company_logo} alt={`${request.to_company_name} logo`} className="company-logo"/>
                    ) : (
                      <div className="no-logo"><p>No Logo</p></div>
                    )}
                  </div>
                  <div className="info">
                    <h2>{request.company_name}</h2>
                    <p>{request.company_email}</p>
                  </div>
                </div>
                <div className="left">
                  <button className="rejectBtn" onClick={() => handleCancelRequest(request.id)}>
                    Cancel
                  </button>
                </div>
              </div>
            )) : <p>No outgoing requests</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;
