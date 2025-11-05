import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faSpinner,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  showSuccessToast,
  showErrorToast,
  showLoadingToast,
  dismissToast,
} from "../../Toast/Toast"; 

import "./AddCompanyMemberForm.scss";
import { addCompanyMemberAPI } from "../../../services/APIs/UserAPI";

const AddCompanyMemberForm = ({ closeModal, fetchCompanyMembers, branches }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    designation: "",
    branchId: "",
    scope: "branch",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Disable branch scope if there are no branches
  useEffect(() => {
    if (!branches || branches.length === 0) {
      setFormData((prevData) => ({
        ...prevData,
        scope: "company",
      }));
    }
  }, [branches]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    showLoadingToast("Adding member, please wait...");

    const addMemberPackage = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      confirm_password: formData.confirmPassword,
      full_name: formData.full_name,
      designation: formData.designation,
      branch_id: formData.scope === "branch" ? formData.branchId : null,
    };

    try {
      const response = await addCompanyMemberAPI(addMemberPackage);
      if (response.status === 200) {
        dismissToast();
        showSuccessToast(response.message);
        setTimeout(() => {
          closeModal();
          fetchCompanyMembers();
          setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            full_name: "",
            designation: "",
            branchId: "",
            scope: branches && branches.length > 0 ? "branch" : "company",
          });
        }, 1500);
      } else {
        dismissToast();
        showErrorToast(response.message);
        setTimeout(() => {
          setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            full_name: "",
            designation: "",
            branchId: "",
            scope: branches && branches.length > 0 ? "branch" : "company",
          });
        }, 1500);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      dismissToast();
      showErrorToast("An error occurred while adding the member: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <div className="modalHeader">
          <h2>Add Company Member</h2>
          <button className="closeModalButton" onClick={closeModal}>
            <FontAwesomeIcon icon={faTimesCircle} />
          </button>
        </div>
        <form className="addCompanyMemberForm" onSubmit={handleSubmit}>
          <div className="forms">
            <div className="left">
              <div className="formGroup">
                <input
                  type="text"
                  name="username"
                  id="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder=" "
                />
                <label htmlFor="username">Username</label>
              </div>
              <div className="formGroup">
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=" "
                />
                <label htmlFor="email">Email</label>
              </div>
              <div className="formGroup passwordGroup">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder=" "
                />
                <label htmlFor="password">Password</label>
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="togglePassword"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              <div className="formGroup select">
                <select
                  name="scope"
                  id="scope"
                  required
                  value={formData.scope}
                  onChange={handleChange}
                  disabled={!branches || branches.length === 0}
                >
                  <option value="branch">Branch Use</option>
                  <option value="company">Company-Wide</option>
                </select>
                <label htmlFor="scope">Member Scope</label>
              </div>
            </div>
            <div className="right">
              <div className="formGroup">
                <input
                  type="text"
                  name="full_name"
                  id="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder=" "
                />
                <label htmlFor="full_name">Full Name</label>
              </div>
              <div className="formGroup">
                <input
                  type="text"
                  name="designation"
                  id="designation"
                  required
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder=" "
                />
                <label htmlFor="designation">Designation</label>
              </div>
              <div className="formGroup passwordGroup">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder=" "
                />
                <label htmlFor="confirmPassword">Confirm Password</label>
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="togglePassword"
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              <div className="formGroup select">
                <select
                  name="branchId"
                  id="branchId"
                  required={formData.scope === "branch"}
                  value={formData.scope === "branch" ? formData.branchId : ""}
                  onChange={handleChange}
                  disabled={formData.scope === "company"}
                >
                  <option value="" disabled>Select Branch</option>
                  {branches &&
                    branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.branch_name}
                      </option>
                    ))}
                </select>
                <label htmlFor="branchId">Branch</label>
              </div>
            </div>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Add Member"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCompanyMemberForm;
