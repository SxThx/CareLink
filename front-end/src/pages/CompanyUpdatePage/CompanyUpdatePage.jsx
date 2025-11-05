// src/components/EmptyPage.jsx
import React from "react";
import "./CompanyUpdatePage.scss";
import CompanyUpdateForm from "../../Components/Forms/CompanyUpdateForm/CompanyUpdateForm";
import logo from "../../assets/Img/logo.png";

const CompanyUpdatePage = () => {
  return (
    <div className="CompanyUpdatePage">
      <div className="wrapper">
        <CompanyUpdateForm/>
      </div>
    </div>
  );
};

export default CompanyUpdatePage;
