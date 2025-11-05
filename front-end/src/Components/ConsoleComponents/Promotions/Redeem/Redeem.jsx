import React, { useState, useRef } from "react";

import { redeemAPI } from "../../../../services/APIs/CouponAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast } from "../../../Toast/Toast"; // Adjust the import path
import "./Redeem.scss"; // Add your styles for this component

const Redeem = () => {
  const [code, setCode] = useState(new Array(12).fill(""));
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^a-zA-Z0-9]/g, "");
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 11) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").split("").slice(0, 12);
    const newCode = [...code];
    pasteData.forEach((char, i) => {
      if (!/[a-zA-Z0-9]/.test(char)) return;
      newCode[i] = char;
      inputs.current[i].value = char;
    });
    setCode(newCode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    showLoadingToast("Verifying...");
    const codeValue = code.join("");
    
    try {
      const response = await redeemAPI(codeValue);
      if (response.status === 200) {
        setLoading(false);
        dismissToast();
        showSuccessToast(response.message);
        // Redirect or perform any additional actions after successful redemption
      } else {
        setLoading(false);
        dismissToast();
        showErrorToast(response.message);
      }
    } catch (error) {
      console.error("Error during coupon redemption:", error);
      setLoading(false);
      dismissToast();
      showErrorToast("An error occurred during coupon redemption.");
    }
  };

  return (
    <form className="redeemForm" onSubmit={handleSubmit}>
      <div className="titleContainer">
        <h1>Redeem Coupon</h1>
      </div>
      <div className="codeContainer" onPaste={handlePaste}>
        {code.map((_, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={code[index]}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputs.current[index] = el)}
            required
          />
        ))}
      </div>
      <button type="submit" disabled={loading}>
        {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Redeem Code"}
      </button>
    </form>
  );
};

export default Redeem;
