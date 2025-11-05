import React, { useState, useEffect } from "react";
import {
  getCompanyBranchesAPI,
  deleteBranchAPI,
} from "../../../services/APIs/BranchAPI";
import AddBranchForm from "../../Forms/AddBranchForm/AddBranchForm";
import EditBranchForm from "../../Forms/EditBranchForm/EditBranchForm";
import EditCompanyDetailsForm from "../../Forms/EditCompanyDetailsForm/EditCompanyDetailsForm";
import ProfileIcon from "@/assets/Img/DefaultProfileImg.jpg";
import "./Brand.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faEdit, faSpinner } from "@fortawesome/free-solid-svg-icons";
import CompanyLogoUpload from "../../Forms/CompanyLogoUpload/CompanyLogoUpload";
import { RefreshUserData } from "../../../utils/RefreshUserData";
import { getUserDataAPI } from "../../../services/APIs/UserAPI";
import { showLoadingToast, showSuccessToast, showErrorToast, showErrorToastWithoutDismiss, showLoadingToastWithoutDismiss, showSuccessToastWithoutDismiss, dismissToast, dismissToastById } from "../../Toast/Toast";


const Brand = ({ companyId }) => {

  const [branches, setBranches] = useState([]);
  const [isCompanyLoading, setIsCompanyLoading] = useState(true);
  const [isBranchesLoading, setIsBranchesLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null); // To handle the branch for editing
  const [isAdding, setIsAdding] = useState(true); // Track whether we're adding or editing
  const [companyInfo, setCompanyInfo] = useState({}); // State for company information
  const [isEditingCompany, setIsEditingCompany] = useState(false); // State for editing company details

  const setInfo = async () => {
    setIsCompanyLoading(true);
    const companyLoadingToast = showLoadingToastWithoutDismiss("Fetching Company Data.....")
    try {
      const response = await getUserDataAPI();
      if (response.status === 200) {
        dismissToastById(companyLoadingToast);
        showSuccessToastWithoutDismiss("Company Data fetched successfully!")
        setCompanyInfo(response.data)
      } else {
        console.error(response.message)
        showErrorToastWithoutDismiss("Something went wrong");
      }
    } catch (error) {
      console.error(response.message)
    } finally {
      setIsCompanyLoading(false);
    }

  }

  const fetchBranches = async () => {
    setIsBranchesLoading(true);
    const branchLoadingToast = showLoadingToastWithoutDismiss("Loading information...")
    try {
      const response = await getCompanyBranchesAPI(companyId);
      if (response.status === 200) {
        dismissToastById(branchLoadingToast);
        showSuccessToastWithoutDismiss(response.message)
        setBranches(response.data);
      } else {
        console.error(response.message)
        showErrorToastWithoutDismiss("Something went wrong");
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setIsBranchesLoading(false);
    }
  };

  const handleDeleteBranch = async (branchId) => {
    if (window.confirm("Are you sure you want to delete this branch?")) {
      try {
        const response = await deleteBranchAPI(branchId);
        if (response.status === 200) {
          fetchBranches();
        } else {
          console.error("Error deleting branch:", response.message);
        }
      } catch (error) {
        console.error("Error deleting branch:", error);
      }
    }
  };

  const openModal = (branch = null) => {
    setSelectedBranch(branch);
    setIsAdding(!branch); // Determine if we're adding or editing
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBranch(null);
    setIsEditingCompany(false); // Reset editing company state
  };

  useEffect(() => {
    fetchBranches();
    setInfo();
  }, [companyId]);

  const handleLogoUploadSuccess = () => {
    console.log("handleLogoUploadSuccess is running")
    RefreshUserData(); // Refresh local storage data
    setInfo();
  };

  return (
    <div className="Brand">
      <div className="brandContainer">
        <div className="brandInformation">
          <h2>Company Information</h2>
          <p className="GridItemDescription">
            Your Company's Information
          </p>
          {isCompanyLoading ? (
                    <div className="loading">
                    <FontAwesomeIcon icon={faSpinner} spin /> 
                  </div>
          ): (

          <div className="brandCard">
            <img
              className="brandLogo"
              src={companyInfo.company_logo ? companyInfo.company_logo : ProfileIcon}
              alt="Profile"
            />
            <h2>{companyInfo.company_name}</h2>
            <p>
              Points: {companyInfo.business_registration_number}
            </p>
            <p>
              Business Registration Number: {companyInfo.business_registration_number}
            </p>
            <p>Company Contact Number: {companyInfo.company_contact_number}</p>
            <p>Email: {companyInfo.company_email}</p>
            <p>Description: {companyInfo.company_description}</p>
            <p>Address: {companyInfo.company_address}</p>
            <button className="editCompanyBtn" onClick={() => setIsEditingCompany(true)}>
              <FontAwesomeIcon icon={faEdit} /> Edit Company
            </button>
          </div>
          )}
        </div>
        
        <div className="updateLogo">
          <h2>Company Logo</h2>
          <p className="GridItemDescription">
            Upload, Change, or Update your company's logo
          </p>
          <div className="content">
            <CompanyLogoUpload onSuccess={handleLogoUploadSuccess} />
          </div>
        </div>

        <div className="branchInformation">
          <h2>Branch Information</h2>
          <p className="GridItemDescription">
            Your Company's Branch Information
          </p>
          <button className="addBranchBtn" onClick={() => openModal()}>
            <FontAwesomeIcon icon={faPlusCircle} /><p>Add Branch</p>
          </button>
          {isModalOpen &&
            (isAdding ? (
              <AddBranchForm
                closeModal={closeModal}
                fetchBranches={fetchBranches}
              />
            ) : (
              <EditBranchForm
                closeModal={closeModal}
                fetchBranches={fetchBranches}
                branch={selectedBranch}
              />
            ))}
          {isEditingCompany && (
            <EditCompanyDetailsForm
              closeModal={closeModal}
              fetchCompanies={setInfo} // Fetch updated company info
              company={companyInfo}
            />
          )}
          {isBranchesLoading ? (
                  <div className="loading">
                  <FontAwesomeIcon icon={faSpinner} spin /> 
                </div>
          ) : (
            <table className="branchTable">
              <thead>
                <tr>
                  <th>Branch Name</th>
                  <th>Branch Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {branches.map((branch) => (
                  <tr key={branch.id}>
                    <td>{branch.branch_name}</td>
                    <td>{branch.branch_address}</td>
                    <td>
                      <button className="editBtn" onClick={() => openModal(branch)}>Edit</button>
                      <button className="deleteBtn" onClick={() => handleDeleteBranch(branch.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Brand;
