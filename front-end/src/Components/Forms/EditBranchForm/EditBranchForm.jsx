import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { updateBranchAPI } from "../../../services/APIs/BranchAPI"; // Adjust import path as needed
import "./EditBranchForm.scss";
import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast } from "../../Toast/Toast";

const EditBranchForm = ({ closeModal, fetchBranches, branch }) => {
  

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    branchName: "",
    branchAddress: "",
  });

  useEffect(() => {
    if (branch) {
      setFormData({
        branchName: branch.branch_name,
        branchAddress: branch.branch_address,
      });
    }
  }, [branch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateBranch = async () => {
    setLoading(true);
    showLoadingToast("Updating...")

    try {
      // Ensure branch.id is available
      if (!branch || !branch.id) {
        throw new Error("Branch ID is missing.");
      }

      const dataToSend = {
        branch_name: formData.branchName,
        branch_address: formData.branchAddress,
        branch_id: branch.id,
      };
      console.log(branch.id,"this is the branch");
      console.log(dataToSend)

      const response = await updateBranchAPI(dataToSend);

      if (response.status === 200) {
        showSuccessToast(response.message);
        fetchBranches(); // Update branch list after successful update
        closeModal(); // Close modal after successful update
      } else {
        showErrorToast(response.message);
      }
    } catch (error) {
      showErrorToast("An error occurred while updating the branch: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleUpdateBranch();
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <div className="modalHeader">
          <h2>Edit Branch</h2>
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
            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Update Branch"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBranchForm;
