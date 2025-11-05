// src/components/OTPInput.jsx
import React, { useState, useRef } from "react";
import ThemeSwitch from "../../ThemeSwitch/ThemeSwitch";
import "./OTPInput.scss";
import { verifyOtpAPI } from "../../../services/APIs/UserAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast } from "../../Toast/Toast"; // Adjust the import path


const OTPInput = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, "");
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").split("").slice(0, 6);
    const newOtp = [...otp];
    pasteData.forEach((char, i) => {
      if (!/[0-9]/.test(char)) return;
      newOtp[i] = char;
      inputs.current[i].value = char;
    });
    setOtp(newOtp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    showLoadingToast("Verifying.....")
    const otpValue = otp.join("");
    const email = localStorage.getItem("verificationEmail");
    try {
      const response = await verifyOtpAPI({ code: otpValue, email });

      if (response.status === 200) {
        if (
          localStorage.getItem("forgotPasswordMessage") ===
          "Password reset initiated! Please check your email to verify your request."
        ) {
          const tokenExpiry = new Date().getTime() + 3600 * 1000; // 1 hour from now
          localStorage.setItem("token", response.token);
          localStorage.setItem("tokenExpiry", tokenExpiry);

          setLoading(false);
          dismissToast();
          showSuccessToast(response.message);
          localStorage.removeItem("forgotPasswordMessage");
          window.location.href = "/resetPassword";
        } else {
          const tokenExpiry = new Date().getTime() + 3600 * 1000; // 1 hour from now
          localStorage.setItem("token", response.token);
          localStorage.setItem("tokenExpiry", tokenExpiry);
          localStorage.removeItem("verificationEmail");
          setLoading(false);
          dismissToast();
          showSuccessToast(response.message);
          setTimeout(() => {
            window.location.href = "/admin";
          }, 1500);
        }
      } else {
        setLoading(false);
        dismissToast();
        showErrorToast(response.message);
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      setLoading(false);
      window.alert(
        "An error occurred during OTP verification: " + error.message
      );
    } 
    
  };

  return (
    <form className="otpForm" onSubmit={handleSubmit}>
      <div className="titleContainer">
        <h1>OTP Verification</h1>
        <ThemeSwitch />
      </div>
      <div className="otpContainer" onPaste={handlePaste}>
        {otp.map((_, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={otp[index]}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputs.current[index] = el)}
            required
          />
        ))}
      </div>
      <button type="submit" disabled={loading}>
        {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Verify OTP"}
      </button>
    </form>
  );
};

export default OTPInput;
