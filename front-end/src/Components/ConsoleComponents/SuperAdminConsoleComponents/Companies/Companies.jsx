import React, { useState, useEffect, useRef } from "react";
import "./Companies.scss";
import {
  getAllCompanyDataAPI,
  getPendingCompaniesAPI,
  getApprovedCompaniesAPI,
  getRejectedCompaniesAPI,
} from "../../../../services/APIs/UserAPI";
import { addPointsToCompanyAPI,
   deductPointsFromCompanyAPI } from "../../../../services/APIs/TransactionAPI";
import AddPointsModal from "../../../Forms/AddPointsModal/AddPointsModal";
import DeductPointsModal from "../../../Forms/DeductPointsModal/DeductPointsModal";
import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast } from "../../../Toast/Toast";



const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [showBranches, setShowBranches] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeductModalOpen, setIsDeductModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const branchListRef = useRef(null);

  useEffect(() => {
    fetchCompanies();
  }, [selectedStatus, currentPage, rowsPerPage, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (branchListRef.current && !branchListRef.current.contains(event.target)) {
        setShowBranches({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      let response;
      switch (selectedStatus) {
        case "all":
          response = await getAllCompanyDataAPI(currentPage, rowsPerPage, searchTerm);
          break;
        case "pending":
          response = await getPendingCompaniesAPI(currentPage, rowsPerPage, searchTerm);
          break;
        case "approved":
          response = await getApprovedCompaniesAPI(currentPage, rowsPerPage, searchTerm);
          break;
        case "rejected":
          response = await getRejectedCompaniesAPI(currentPage, rowsPerPage, searchTerm);
          break;
        default:
          break;
      }
      console.log(response.data.companies)
      setCompanies(response.data.companies);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setIsLoading(false);

    }
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleBranches = (companyId) => {
    setShowBranches((prevShowBranches) => ({
      ...prevShowBranches,
      [companyId]: !prevShowBranches[companyId],
    }));
  };

  const openAddModal = (companyId) => {
    setSelectedCompanyId(companyId);
    setIsAddModalOpen(true);
  };

  const openDeductModal = (companyId) => {
    setSelectedCompanyId(companyId);
    setIsDeductModalOpen(true);
  };

  const handleAddPoints = async (points) => {
    setLoading(true);
    showLoadingToast("Adding Points.....")
    try {
      const response = await addPointsToCompanyAPI({ companyId: selectedCompanyId, points });
      if (response.status === 200) {
        showSuccessToast(response.message);
        fetchCompanies(); // Refresh the companies list
        setIsAddModalOpen(false); // Close modal after success
      } else {
        alert("Failed to add points: " + response.message);
      }
    } catch (error) {
      console.error("Error adding points:", error);
      alert("Error adding points: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeductPoints = async (points) => {
    setLoading(true);
    showLoadingToast("Deducting Points.....")
    try {
      const response = await deductPointsFromCompanyAPI({ companyId: selectedCompanyId, points });
      if (response.status === 200) {
        showSuccessToast(response.message);
        fetchCompanies(); // Refresh the companies list
        setIsDeductModalOpen(false); // Close modal after success
      } else {
        alert("Failed to deduct points: " + response.message);
      }
    } catch (error) {
      console.error("Error deducting points:", error);
      alert("Error deducting points: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="companies">
      <h2>Companies</h2>
      <p>Manage your companies and their admins.</p>
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
          placeholder="Search by company name, registration number, email, name, or designation"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <table className="companyTable">
        <thead>
          <tr>
            <th>Company Logo</th>
            <th>Company Name</th>
            <th>Points</th>
            <th>Branches</th>
            <th>Business Registration Number</th>
            <th>Company Admin Email</th>
            <th>Name</th>
            <th>Designation</th>
            <th>Approval Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="10">
                <div className="skeleton-container" data-testid="skeleton-loader">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="skeleton-row"></div>
                  ))}
                </div>
              </td>
            </tr>
          ) : (
            companies.map((company) => (
              <React.Fragment key={company.id}>
                <tr>
                  <td>
                    {company.company_logo ? (
                      <img
                        src={company.company_logo}
                        alt="Company Logo"
                        style={{ width: "50px", height: "auto" }}
                      />
                    ) : (
                      <div className="noImage">No Image</div>
                    )}
                  </td>
                  <td>{company.company_name || "N/A"}</td>
                  <td>{company.points || "N/A"}</td>
                  <td>
                    {company.branches && company.branches.length > 0 ? (
                      <div ref={branchListRef}>
                        <button className="branchBtn" onClick={() => toggleBranches(company.id)}>
                          {company.branches.length}
                        </button>
                        {showBranches[company.id] && (
                          <ul className="branchList">
                            {company.branches.map((branch, index) => (
                              <li key={index}>{branch.branch_name}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      "0"
                    )}
                  </td>
                  <td>{company.business_registration_number || "N/A"}</td>
                  <td>{company.admin_email || "N/A"}</td>
                  <td>{company.admin_full_name || "N/A"}</td>
                  <td>{company.admin_designation || "N/A"}</td>
                  <td>{company.admin_approval_status || "N/A"}</td>
                  <td>
                    <button className="addPointsBtn" onClick={() => openAddModal(company.id)}>Add Points</button>
                    <button className="deductPointsBtn" onClick={() => openDeductModal(company.id)}>Deduct Points</button>
                  </td>
                </tr>
              </React.Fragment>
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

      <AddPointsModal
        isOpen={isAddModalOpen}
        closeModal={() => setIsAddModalOpen(false)}
        handleAddPoints={handleAddPoints}
        loading={loading}
      />

      <DeductPointsModal
        isOpen={isDeductModalOpen}
        closeModal={() => setIsDeductModalOpen(false)}
        handleDeductPoints={handleDeductPoints}
        loading={loading}
      />
    </div>
  );
};

export default Companies;
