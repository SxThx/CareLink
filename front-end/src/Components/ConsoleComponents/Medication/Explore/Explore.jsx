import React, { useEffect, useState } from "react";
import { getCompaniesExcludingUserWithSearch, addPartnershipAPI, acceptIncomingRequestAPI} from "../../../../services/APIs/PartnershipAPI";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faEdit, faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./Explore.scss";
import { debounce } from "lodash"; // Import lodash for debounce
import {
  showSuccessToast,
  showErrorToast,
  showLoadingToast,
  dismissToast,
} from "../../../Toast/Toast";

const Explore = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit] = useState(6);
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const userCompanyId = userData.company_id;

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        showLoadingToast("Loading companies...");
        const response = await getCompaniesExcludingUserWithSearch(page, limit, searchTerm);
        const updatedCompanies = response.data.companies.map(company => {
          if (company.status === 'partnered') {
            return { ...company, relationship: 'partnered' };
          } else if (company.to_company_id === userCompanyId && company.status === 'pending') {
            return { ...company, relationship: 'incoming' };
          } else if (company.from_company_id === userCompanyId && company.status === 'pending') {
            return { ...company, relationship: 'outgoing' };
          }
          return { ...company, relationship: 'none' };
        });

        setCompanies(updatedCompanies);
        setTotalPages(response.data.totalPages);
        dismissToast();
        showSuccessToast("Companies loaded successfully.");
      } catch (error) {
        console.error("Error fetching companies:", error);
        showErrorToast("Error fetching companies. Please try again.");
        dismissToast();
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [searchTerm, page, limit]);

  // Debounced search handler
  const debouncedSearch = debounce((value) => {
    setSearchTerm(value);
  }, 500);

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleAddPartnership = async (companyId) => {
    if (window.confirm("Are you sure you want to add this partnership?")) {
      try {
        showLoadingToast("Adding partnership...");
        const response = await addPartnershipAPI({ to_company_id: companyId });
        if (response.status === 200) {
          showSuccessToast("Partnership request sent successfully.");
          setCompanies(prevCompanies => prevCompanies.map(company => {
            if (company.id === companyId) {
              return { ...company, relationship: 'outgoing' };
            }
            return company;
          }));
        } else {
          showErrorToast("Failed to send partnership request.");
        }
      } catch (error) {
        console.error("Error adding partnership:", error);
        showErrorToast("Error adding partnership. Please try again.");
      }
    }
  };

  
  const handleApprove = async (partnershipId, companyId) => {
    if (window.confirm("Are you sure you want to approve this partnership?")) {
      try {
        showLoadingToast("Approving partnership...");
        const response = await acceptIncomingRequestAPI({ partnershipId });
        if (response.status === 200) {
          showSuccessToast(response.message);

          setCompanies(prevCompanies => prevCompanies.map(company => {
            if (company.id === companyId) {
              return { ...company, relationship: 'partnered' };
            }
            return company;
          }));

        }
      } catch (error) {
        console.error(response.message);
        showErrorToast(response.message);
      }
    }
  };

  const renderButton = (company) => {
    switch (company.relationship) {
      case 'incoming':
        return <button className="approve-btn" onClick={() => handleApprove(company.pId, company.id)}>Approve Request</button>;
      case 'outgoing':
        return <button className="pending-btn" disabled>Request Sent</button>;
      case 'partnered':
        return <button className="partnered-btn">Partnered</button>;
      default:
        return <button className="add-partnership-btn" onClick={() => handleAddPartnership(company.id)}>Add Partnership</button>;
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
    <div className="explore">
      <h2>Explore Companies</h2>
      <input
        type="text"
        placeholder="Search companies..."
        onChange={handleSearchChange}
        className="searchBar"
      />
      {loading ? (
        <div className="loading">
        <FontAwesomeIcon icon={faSpinner} spin /> 
      </div>
      ) : (
        <>
          <div className="company-cards">
            {companies.map((company) => (
              <div key={company.id} className="company-card">
                {company.company_logo ? (
                  <img
                    src={company.company_logo}
                    alt={`${company.company_name} logo`}
                    className="company-logo"
                  />
                ) : (
                  <div className="no-logo">
                    <p>No Logo</p>
                    </div>
                )}
                <div className="info">
                <h3>{company.company_name}</h3>
                <p>{company.company_description}</p>
                </div>
                {renderButton(company)}
              </div>
            ))}
          </div>
          {totalPages > 1 && renderPagination()}
        </>
      )}
    </div>
  );
};

export default Explore;
