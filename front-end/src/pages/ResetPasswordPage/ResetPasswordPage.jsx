// src/components/EmptyPage.jsx
import React from "react";
import "./ResetPasswordPage.scss";
import ResetPasswordForm from "../../Components/Forms/ResetPasswordForm/ResetPasswordForm";
import logo from "../../assets/Img/logo.png";

const ResetPasswordPage = () => {
  return (
    <div className="ResetPasswordPage">
      <div className="wrapper">
        <div className="container">
          <img src={logo} alt="" srcset="" />
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
