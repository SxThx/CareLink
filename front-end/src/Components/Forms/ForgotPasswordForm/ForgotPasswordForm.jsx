// src/components/ForgotPasswordForm.jsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./ForgotPasswordForm.scss";
import ThemeSwitch from "../../ThemeSwitch/ThemeSwitch";
import { forgotPasswordAPI } from "../../../services/APIs/UserAPI";
import { dismissToast, showErrorToast, showLoadingToast, showSuccessToast } from "../../Toast/Toast";

const ForgotPasswordForm = () => {

  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    showLoadingToast("Resetting Password...");
    e.preventDefault();

    const forgotPasswordPackage = {
      email: formData.email,
    };

    try {
      const response = await forgotPasswordAPI(forgotPasswordPackage);
      if (response.status === 200) {
        localStorage.setItem("verificationEmail", formData.email);
        dismissToast();
        showSuccessToast(response.message);
        setTimeout(() => {

          localStorage.setItem("forgotPasswordMessage", response.message);
          localStorage.setItem("verificationEmail", formData.email);
          window.location.href = "/OTPVerify";
          setFormData({
            email: "",
          });
        }, 1500);
      } else {
        dismissToast();
        showErrorToast(response.message);
        setTimeout(() => {
          setFormData({
            email: "",
          });
        }, 1500);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      showErrorToast("An error occurred during password reset request: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="forgotPasswordForm" onSubmit={handleSubmit}>
      <div className="titleContainer">
        <h1>Forgot Password</h1>
        <ThemeSwitch />
      </div>

      {/* Email Input */}
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

      <button type="submit" disabled={loading}>
        {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Submit"}
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
