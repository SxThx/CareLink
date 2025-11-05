// components/Branch/AddBranchForm.js
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { addBranchAPI } from "../../../services/APIs/BranchAPI"; // Adjust import path as needed
import "./BranchForm.scss";
import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast } from "../../Toast/Toast";

const AddBranchForm = ({ closeModal, fetchBranches }) => {

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    branchName: "",
    branchAddress: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddBranch = async () => {
    setLoading(true);
    showLoadingToast("Adding branch....")

    try {
      const dataToSend = {
        branch_name: formData.branchName,
        branch_address: formData.branchAddress,
      };

      const response = await addBranchAPI(dataToSend);

      if (response.status === 200) {
        showSuccessToast(response.message);
        fetchBranches(); // Update branch list after successful addition
        closeModal(); // Close modal after successful addition
      } else {
        showErrorToast(response.message);
      }
    } catch (error) {
      showErrorToast("An error occurred while adding the branch: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleAddBranch();
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <div className="modalHeader">
          <h2>Add Branch</h2>
          <button className="closeModalButton" onClick={closeModal}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <form className="BranchForm" onSubmit={handleSubmit}>
          <div className="formGroup">
            <input
              type="text"
              name="branchName"
              id="branchName"
              required
              value={formData.branchName}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="branchName">Branch Name</label>
          </div>
          <div className="formGroup">
            <input
              type="text"
              name="branchAddress"
              id="branchAddress"
              required
              value={formData.branchAddress}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="branchAddress">Address</label>
          </div>
        
          <button className="addBtn" type="submit" disabled={loading}>
            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Add Branch"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBranchForm;
