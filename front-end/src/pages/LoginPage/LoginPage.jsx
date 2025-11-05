// src/components/EmptyPage.jsx
import React from "react";
import "./LoginPage.scss";
import LoginForm from "../../Components/Forms/LoginForm/LoginForm";
import logo from "../../assets/Img/logo.png";

const LoginPage = () => {
  return (
    <div className="LoginPage">
      <div className="wrapper">
        <div className="container">
          <img src={logo} alt="" srcset="" />
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
