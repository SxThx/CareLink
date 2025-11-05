import React, { useEffect, useState } from "react";
import { getUserSupportAPI } from "../../../../services/APIs/SupportAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./SubmittedRequests.scss";

const SubmittedRequests = () => {
  const [supportRequests, setSupportRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(8); // Number of requests per page
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchSupportRequests = async () => {
      try {
        setLoading(true);
        setSupportRequests([]); // Clear requests to prevent old data showing during loading

        const response = await getUserSupportAPI(status, page, limit);

        if (response.data) {
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

    fetchSupportRequests();
  }, [status, page, limit]); // Dependency array now includes status, page, and limit

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    console.log(status)
    setPage(1); // Reset to the first page when changing status
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
    <div className="submittedRequests">
      <h2>Submitted Support Requests</h2>

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
                    </div>
                    <div className="card-body">
                      <p>Message: <br /> {request.message}</p>
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

export default SubmittedRequests;
