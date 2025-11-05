import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { editCompanyDetailsAPI } from "../../../services/APIs/CompanyAPI"; // Adjust import path as needed
import "./EditCompanyDetailsForm.scss";
import { RefreshUserData } from "../../../utils/RefreshUserData";
import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast } from "../../Toast/Toast";

const EditCompanyDetailsForm = ({ closeModal, fetchCompanies, company }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyContactNumber: "",
    companyEmail: "",
    companyAddress: "",
  });

  useEffect(() => {
    if (company) {
      setFormData({
        companyContactNumber: company.company_contact_number,
        companyEmail: company.company_email,
        companyAddress: company.company_address,
      });
    }
  }, [company]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateCompany = async () => {
    setLoading(true);
    showLoadingToast("Updating...");

    try {
      // Ensure company.id is available
      if (!company || !company.company_id) {
        throw new Error("Company ID is missing.");
      }

      const dataToSend = {
        company_contact_number: formData.companyContactNumber,
        company_email: formData.companyEmail,
        company_address: formData.companyAddress,
        company_id: company.company_id,
      };

      const response = await editCompanyDetailsAPI(dataToSend);

      if (response.status === 200) {
        showSuccessToast(response.message);
        fetchCompanies(); // Update company list after successful update
        closeModal(); // Close modal after successful update
        RefreshUserData();
      } else {
        showErrorToast(response.message);
      }
    } catch (error) {
      showErrorToast("An error occurred while updating the company: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleUpdateCompany();
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <div className="modalHeader">
          <h2>Edit Company</h2>
          <button className="closeModalButton" onClick={closeModal}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <form className="CompanyForm" onSubmit={handleSubmit}>
          <div className="formGroup">
            <input
              type="text"
              name="companyContactNumber"
              id="companyContactNumber"
              required
              value={formData.companyContactNumber}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="companyContactNumber">Contact Number</label>
          </div>
          <div className="formGroup">
            <input
              type="email"
              name="companyEmail"
              id="companyEmail"
              required
              value={formData.companyEmail}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="companyEmail">Email</label>
          </div>
          <div className="formGroup">
            <input
              type="text"
              name="companyAddress"
              id="companyAddress"
              required
              value={formData.companyAddress}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="companyAddress">Address</label>
          </div>
          <button className="addBtn" type="submit" disabled={loading}>
            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Update Company"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCompanyDetailsForm;
