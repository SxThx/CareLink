import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faCheck,
  faTimes,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";
import "./RegisterForm.scss";
import ThemeSwitch from "../../ThemeSwitch/ThemeSwitch";
import { registerAPI } from '../../../services/APIs/UserAPI';
import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast } from "../../Toast/Toast";

const RegisterForm = () => {

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    company_name: "",
    business_registration_number: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    full_name: "",
    designation: "",
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
    showLoadingToast("Loading.....");

    if (formData.password === formData.confirm_password) {
      const RegistrationPackage = {
        company_name: formData.company_name,
        business_registration_number: formData.business_registration_number,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirm_password,
        full_name: formData.full_name,
        designation: formData.designation,
      };

      try {
        const response = await registerAPI(RegistrationPackage);
        if (response.status === 200) {
          localStorage.setItem("verificationEmail", formData.email);
          showSuccessToast(response.message);
          setTimeout(() => {
            window.location.href = "/OTPVerify";
            setFormData({
              company_name: "",
              business_registration_number: "",
              username: "",
              email: "",
              password: "",
              confirm_password: "",
            });
          }, 1500);
        } else {
          showErrorToast(response.message);
        }
      } catch (error) {
        console.error("Error occurred:", error);
        showErrorToast(
          "An error occurred during registration: " + error.message
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
    <form className="registerForm" onSubmit={handleSubmit}>
      <div className="titleContainer">
        <div className="title">
        <h1>Register</h1>
        <ThemeSwitch />
        </div>
      <p>Already have an account? <a href="/login">Login Here.</a></p>
      </div>
      <div className="forms">
      <div className="left">
      <div className="formGroup">
        <input
          type="text"
          name="company_name"
          id="company_name"
          required
          value={formData.company_name}
          onChange={handleChange}
          placeholder=" "
        />
        <label htmlFor="company_name">Company Name</label>
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



      </div>
      <div className="right">

      <div className="formGroup">
        <input
          type="text"
          name="business_registration_number"
          id="business_registration_number"
          required
          value={formData.business_registration_number}
          onChange={handleChange}
          placeholder=" "
        />
        <label htmlFor="business_registration_number">Business Registration Number</label>
      </div>

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
          type="text"
          name="designation"
          id="designation"
          required
          value={formData.designation}
          onChange={handleChange}
          placeholder=" "
        />
        <label htmlFor="designation">Designation ( your position )</label>
      </div>



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
        <label htmlFor="confirm_password">Confirm Password</label>
        <button
          type="button"
          onClick={toggleConfirmPasswordVisibility}
          className="togglePassword"
        >
          <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
        </button>
      </div>
      </div>

      </div>




      <button type="submit" disabled={loading}>
        {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Register"}
      </button>
    </form>
  );
};

export default RegisterForm;
