// src/components/ResetPasswordForm.jsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faCheck, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./ResetPasswordForm.scss";
import ThemeSwitch from "../../ThemeSwitch/ThemeSwitch";
import { resetPasswordAPI } from "../../../services/APIs/UserAPI";
import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast } from "../../Toast/Toast";

const ResetPasswordForm = () => {

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    showLoadingToast("Loading.....")

    if (formData.password === formData.confirm_password) {

      const resetPasswordPackage = {
        password: formData.password,
        confirm_password: formData.confirm_password,
      };

      try {
        const response = await resetPasswordAPI(resetPasswordPackage);
        if (response.status === 200) {
          showSuccessToast(response.message);
          setTimeout(() => {
            setLoading(false);
            window.location.href = "/login";
            localStorage.removeItem("verificationEmail"),
            localStorage.removeItem("token");
            localStorage.removeItem("mockLogin");
            localStorage.removeItem("forgotPasswordMessage")
            setFormData({
              password: "",
              confirm_password: "",
            });
          }, 1500);
        } else {
          showErrorToast(response.message);
          setTimeout(() => {
            setLoading(false);
            setFormData({
              password: "",
              confirm_password: "",
            });
          }, 1500);
        }
      } catch (error) {
        console.error("Error occurred:", error);
        showErrorToast(
          "An error occurred during password reset: " + error.message
        );
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      showErrorToast("Password and confirm password do not match!");
    }
  };

  return (
    <form className="resetPasswordForm" onSubmit={handleSubmit}>
      <div className="titleContainer">
        <h1>Reset Password</h1>
        <ThemeSwitch />
      </div>

      {/* Password Input */}
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
        <label htmlFor="password">New Password</label>
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="togglePassword"
        >
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </button>
      </div>

      {/* Confirm Password Input */}
      <div className="formGroup passwordGroup">
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirm_password"
          id="confirm_password"
          required
          value={formData.confirm_password}
          onChange={handleChange}
          placeholder=" "
        />
        <label htmlFor="confirm_password">Confirm New Password</label>
        <button
          type="button"
          onClick={toggleConfirmPasswordVisibility}
          className="togglePassword"
        >
          <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
        </button>
      </div>


      <button type="submit" disabled={loading}>
        {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Reset Password"}
      </button>
    </form>
  );
};

export default ResetPasswordForm;
