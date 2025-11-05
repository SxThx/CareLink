import React, { useEffect, useState } from "react";
import { getAdminSupportAPI, changeSupportMessageStatusAPI } from "../../../../services/APIs/SupportAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./AdminSupport.scss";
import { showLoadingToast, showSuccessToast } from "../../../Toast/Toast";

const AdminSupport = () => {
  const [supportRequests, setSupportRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(8); // Number of requests per page
  const [totalPages, setTotalPages] = useState(1);

  // Define fetchSupportRequests outside of the useEffect so we can call it later
  const fetchSupportRequests = async (status, page, limit) => {
    try {
      setLoading(true);
      showLoadingToast("Loading support requests.....")
      setSupportRequests([]); // Clear requests to prevent old data showing during loading

      const response = await getAdminSupportAPI(status, page, limit);

      if (response.status === 200) {
        showSuccessToast(response.message)
        setSupportRequests(response.data);
      }
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching support requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupportRequests(status, page, limit);
  }, [status, page, limit]); // Dependency array now includes status, page, and limit

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1); // Reset to the first page when changing status
  };

  const handleRequestStatusChange = async (requestId, newStatus) => {
    try {
      setLoading(true);
      showLoadingToast("Changing status.....")
      const response = await changeSupportMessageStatusAPI(requestId, newStatus);
      if (response.status === 200) {
        showSuccessToast(response.message, 1500);
        
        fetchSupportRequests(status, page, limit);
      }
    } catch (error) {
      console.error("Error updating support request status:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={page === number ? "active" : ""}
            onClick={() => setPage(number)}
          >
            {number}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="adminSupport">
      <h2>Support Requests</h2>

      <div className="filter-status">
        <label htmlFor="status">Filter by Status: </label>
        <select id="status" value={status} onChange={handleStatusChange}>
          <option value="all">All</option>
          <option value="Submitted">Submitted</option>
          <option value="In Process">In Process</option>
          <option value="Solved">Solved</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">
          <FontAwesomeIcon icon={faSpinner} spin />
        </div>
      ) : (
        <div className="support-list">
          {supportRequests && supportRequests.length > 0 ? (
            <>
              <div className="card-container">
                {supportRequests.map((request) => (
                  <div className="support-card" key={request.id}>
                    <div className="card-header">
                      <h3>{request.subject}</h3>
                      <p>Ref Id: {request.support_id}</p>
                      <p>Status: {request.status}</p>
                      <p>User: {request.full_name}</p>
                      <p>Company: {request.company_name}</p>
                      <div className="status-dropdown">
                        <label htmlFor={`status-${request.id}`}>Status: </label>
                        <select
                          id={`status-${request.id}`}
                          value={request.status}
                          onChange={(e) => handleRequestStatusChange(request.id, e.target.value)}
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="In Process">In Process</option>
                          <option value="Solved">Solved</option>
                        </select>
                      </div>
                    </div>
                    <div className="card-body">
                      <p>Message: <br /> {request.message}</p>
                      <p>
                        Contact: <br /> {request.company_email} <br />{request.company_contact_number}
                      </p>
                      <p>Created: {new Date(request.created_time).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              {renderPagination()}
            </>
          ) : (
            <p>No support requests found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminSupport;
