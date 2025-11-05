// src/components/EmptyPage.jsx
import React from "react";
import "./OTPInputPage.scss";
import OTPInput from "../../Components/Forms/OTPInput/OTPInput";
import logo from "../../assets/Img/logo.png";

const OTPInputPage = () => {
  return (
    <div className="OTPInputPage">
      <div className="wrapper">
        <div className="container">
          <img src={logo} alt="" srcset="" />
          <OTPInput/>
        </div>
      </div>
    </div>
  );
};

export default OTPInputPage;
