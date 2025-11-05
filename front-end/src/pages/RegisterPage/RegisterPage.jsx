// src/components/EmptyPage.jsx
import React from "react";
import "./RegisterPage.scss";
import RegisterForm from "../../Components/Forms/RegisterForm/RegisterForm";
import logo from "../../assets/Img/logo.png";

const RegisterPage = () => {
  return (
    <div className="RegisterPage">
      <div className="wrapper">
        <div className="container">
          <img src={logo} alt="" srcset="" />
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
