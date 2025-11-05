// src/components/EmptyPage.jsx
import React from "react";
import "./ForgotPasswordPage.scss";
import ForgotPasswordForm from "../../Components/Forms/ForgotPasswordForm/ForgotPasswordForm";
import logo from "../../assets/Img/logo.png";

const ForgotPasswordPage = () => {
  return (
    <div className="ForgotPasswordPage">
      <div className="wrapper">
        <div className="container">
          <img src={logo} alt="" srcset="" />
          <ForgotPasswordForm/>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
