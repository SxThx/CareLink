import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast } from "../../Toast/Toast";
import "./LoginForm.scss";
import ThemeSwitch from "../../ThemeSwitch/ThemeSwitch";
import { loginAPI } from "../../../services/APIs/UserAPI";

const USE_MOCK_LOGIN =
  (() => {
    if (typeof import.meta !== "undefined" && import.meta.env && "VITE_USE_MOCK_LOGIN" in import.meta.env) {
      return import.meta.env.VITE_USE_MOCK_LOGIN !== "false";
    }
    return true;
  })();

const MOCK_USERS = [
  {
    email: "admin@carelink.com",
    password: "Admin123!",
    token: "mock-token-super-admin",
    userData: {
      username: "carelink_admin",
      full_name: "CareLink Admin",
      email: "admin@carelink.com",
      role: "super_admin",
      designation: "Super Administrator",
      approval_status: "approved",
      profile_image: "",
      company_name: "CareLink HQ",
      company_logo: "",
      company_description: "Primary CareLink administration account used for offline access.",
      company_contact_number: "555-0101",
      company_address: "123 CareLink Way, Sample City",
      company_email: "contact@carelink.com",
      business_registration_number: "CL-0001",
      company_id: "mock-company-1",
    },
    successMessage: "Logged in as CareLink Admin (offline mode).",
  },
  {
    email: "manager@carelink.com",
    password: "Manager123!",
    token: "mock-token-company-admin",
    userData: {
      username: "demo_manager",
      full_name: "Morgan Manager",
      email: "manager@carelink.com",
      role: "company_admin",
      designation: "Operations Manager",
      approval_status: "approved",
      profile_image: "",
      company_name: "CareLink Partners",
      company_logo: "",
      company_description: "Demo partner company for testing the console without a backend.",
      company_contact_number: "555-0202",
      company_address: "456 Partner Avenue, Example City",
      company_email: "partners@carelink.com",
      business_registration_number: "CL-0002",
      company_id: "mock-company-2",
    },
    successMessage: "Logged in as CareLink Partner Admin (offline mode).",
  },
];

const findMockUser = (email, password) =>
  MOCK_USERS.find(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase() && user.password === password
  );

const completeMockLogin = (mockUser) => {
  const tokenExpiry = new Date().getTime() + 3600 * 1000;
  localStorage.setItem("token", mockUser.token);
  localStorage.setItem("tokenExpiry", tokenExpiry);
  localStorage.setItem("userData", JSON.stringify(mockUser.userData));
  localStorage.setItem("mockLogin", "true");
  localStorage.removeItem("verificationEmail");
  dismissToast();
  showSuccessToast(mockUser.successMessage || "Logged in successfully (offline mode).");
  setTimeout(() => {
    window.location.href = "/admin";
  }, 1200);
};

const getFriendlyErrorMessage = (errorOrResponse) => {
  if (!errorOrResponse) {
    return "Unable to login. Please check your credentials.";
  }

  if (errorOrResponse instanceof Error) {
    return "Unable to reach the login service. Try the demo credentials above or check the server connection.";
  }

  if (typeof errorOrResponse === "object" && errorOrResponse.message) {
    return errorOrResponse.message;
  }

  return "Unable to login. Please check your credentials.";
};

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    showLoadingToast("Login Initiated, Loading......")

    const loginPackage = {
      email: formData.email,
      password: formData.password,
    };

    const mockUser = USE_MOCK_LOGIN ? findMockUser(formData.email, formData.password) : null;

    try {
      const response = await loginAPI(loginPackage);
      if (response.status === 200) {
        localStorage.setItem("token", response.token);
        localStorage.removeItem("mockLogin");
        dismissToast();

        showSuccessToast(response.message); // Show success toast
        setTimeout(() => {
          localStorage.setItem("verificationEmail", formData.email);
          window.location.href = "/OTPVerify";
        }, 1500);
        return;
      }

      if (mockUser) {
        completeMockLogin(mockUser);
        return;
      } else {
        dismissToast();
        const errorMessage = getFriendlyErrorMessage(response);
        showErrorToast(errorMessage); // Show error toast
      }
    } catch (error) {
      if (mockUser) {
        completeMockLogin(mockUser);
        return;
      }
      console.error("Error occurred:", error);
      dismissToast();
      showErrorToast(getFriendlyErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    window.location.href = "/forgotPassword";
  };

  return (
    <form className="loginForm" onSubmit={handleSubmit}>
      <div className="titleContainer">
        <div className="title">
          <h1>Login</h1>
          <ThemeSwitch />
        </div>
        <p>
          Don't have an account yet? <a href="/register">Register Here.</a>
        </p>
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
      <button
        type="button"
        className="forgotPasswordButton"
        onClick={handleForgotPassword}
      >
        Forgot Password?
      </button>

      <button type="submit" disabled={loading}>
        {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
