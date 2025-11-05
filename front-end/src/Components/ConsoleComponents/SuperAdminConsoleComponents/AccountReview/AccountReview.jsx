import React, { useState, useEffect } from "react";
import "./AccountReview.scss";
import {
  getAllUsersAPI,
  getPendingUsersAPI,
  getApprovedUsersAPI,
  getRejectedUsersAPI,
  approveUserAPI,
  rejectUserAPI
} from "../../../../services/APIs/UserAPI";
import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast } from "../../../Toast/Toast";


const AccountReview = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    switch (selectedStatus) {
      case "all":
        fetchAllUsers(currentPage, rowsPerPage, searchTerm);
        break;
      case "pending":
        fetchPendingUsers(currentPage, rowsPerPage, searchTerm);
        break;
      case "approved":
        fetchApprovedUsers(currentPage, rowsPerPage, searchTerm);
        break;
      case "rejected":
        fetchRejectedUsers(currentPage, rowsPerPage, searchTerm);
        break;
      default:
        break;
    }
  }, [selectedStatus, currentPage, rowsPerPage, searchTerm]);

  const fetchAllUsers = async (page, limit, searchTerm) => {
    setIsLoading(true);

    try {
      const response = await getAllUsersAPI(page, limit, searchTerm);
      console.log("fetchallusers",response);

      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching all users:", error);
    } finally {
      setIsLoading(false);

    }
  };

  const fetchPendingUsers = async (page, limit, searchTerm) => {
    setIsLoading(true);
    console.log("pending users is running")

    try {
      const response = await getPendingUsersAPI(page, limit, searchTerm);
      console.log(response)
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching pending users:", error);
    } finally {
      setIsLoading(false);

    }
  };

  const fetchApprovedUsers = async (page, limit, searchTerm) => {
    setIsLoading(true);

    try {
      const response = await getApprovedUsersAPI(page, limit, searchTerm);
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching approved users:", error);
    } finally {
      setIsLoading(false);

    }
  };

  const fetchRejectedUsers = async (page, limit, searchTerm) => {
    setIsLoading(true);


    try {
      const response = await getRejectedUsersAPI(page, limit, searchTerm);
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching rejected users:", error);
    } finally {
      setIsLoading(false);

    }
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1); // Reset to first page when status changes
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleApprove = async (userId) => {
    if (window.confirm("Are you sure you want to approve this user?")) {
      try {
        const response = await approveUserAPI({ userId });
        if (response.status === 200) {
          showSuccessToast(response.message);
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === userId ? { ...user, approval_status: "approved" } : user
            )
          );
        }
      } catch (error) {
        console.error("Error approving user:", error);
      }
    }
  };

  const handleReject = async (userId) => {
    if (window.confirm("Are you sure you want to reject this user?")) {
      try {
        const response = await rejectUserAPI({ userId });
        if (response.status === 200) {
          showSuccessToast(response.message);
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === userId ? { ...user, approval_status: "rejected" } : user
            )
          );
        }
      } catch (error) {
        console.error("Error rejecting user:", error);
      }
    }
  };

  const handleRevokeApproval = async (userId) => {
    if (window.confirm("Are you sure you want to revoke the approval for this user?")) {
      try {
        const response = await rejectUserAPI({ userId });
        if (response.status === 200) {
          showSuccessToast(response.message);
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === userId ? { ...user, approval_status: "rejected" } : user
            )
          );
        }
      } catch (error) {
        console.error("Error revoking approval for user:", error);
      }
    }
  };

  const filteredUsers = users.filter(user =>
    (selectedStatus === 'all' || user.approval_status === selectedStatus) &&
    user.role !== 'super_admin' &&
    (
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.company_name && user.company_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.business_registration_number && user.business_registration_number.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="accountReview">
      <h2>Review Accounts</h2>
      <p>Review Accounts, approve, revoke, or reject Accounts.</p>
      <div className="statusFilter">
        <select onChange={handleStatusChange} value={selectedStatus}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <input
          type="text"
          className="searchBar"
          placeholder="Search by email, username, name, company name, or registration number"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <table className="userTable">
        <thead>
          <tr>
            <th>Company Logo</th>
            <th>Company Name</th>
            <th>Business Registration Number</th>
            <th>Email</th>
            <th>Name</th>
            <th>Designation</th>
            <th>Approval Status</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="9">
                <div className="skeleton-container" data-testid="skeleton-loader">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="skeleton-row"></div>
                  ))}
                </div>
              </td>
            </tr>
          ) : (
            filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.company_logo ? <img src={user.company_logo} alt="Company Logo" style={{ width: "50px", height: "auto" }} /> : <div className="noImage">No Image</div>}</td>
                <td>{user.company_name || 'N/A'}</td>
                <td>{user.business_registration_number || 'N/A'}</td>
                <td>{user.email}</td>
                <td>{user.full_name}</td>
                <td>{user.designation}</td>
                <td>{user.approval_status}</td>
                <td>{user.role}</td>
                <td>
                  {user.approval_status === 'pending' && (
                    <>
                      <button className="approveBtn" onClick={() => handleApprove(user.id)}>Approve</button>
                      <button className="rejectBtn" onClick={() => handleReject(user.id)}>Reject</button>
                    </>
                  )}
                  {user.approval_status === 'approved' && (
                    <button className="revokeBtn" onClick={() => handleRevokeApproval(user.id)}>Revoke</button>
                  )}
                  {user.approval_status === 'rejected' && (
                    <button className="approveBtn" onClick={() => handleApprove(user.id)}>Approve</button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <ul className="pageNumbers">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
          <li
            key={number}
            id={number}
            onClick={() => handlePageChange(number)}
            className={currentPage === number ? "current" : ""}
          >
            {number}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccountReview;
