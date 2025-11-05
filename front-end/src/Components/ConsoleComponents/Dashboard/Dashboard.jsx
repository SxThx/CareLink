import React from "react";
import "./Dashboard.scss";
import DateTimeDisplay from "#/DateTime/DateTime";
import ProfileIcon from "@/assets/Img/DefaultProfileImg.jpg";
import Masonry from 'react-masonry-css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import QRCodeReader from "../../QrCodeReader/QrCodeReader";

const Dashboard = ({ onItemClick }) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const username = userData.username;
  const name = userData.full_name;
  const email = userData.email;
  const profileImg = userData.profile_image;
  const designation = userData.designation;
  const role = userData.role;
  const companyName = userData.role !== "super_admin" ? userData.company_name : null;

  let approval_status;
  if (userData.approval_status === "approved") {
    approval_status = (
      <div className="enabled">
        <FontAwesomeIcon icon={faCheck} /><p>Approved</p>
      </div>
    );
  } else {
    approval_status = (
      <div className="disabled">
        <FontAwesomeIcon icon={faTimes} /><p>Rejected</p>
      </div>
    );
  }

  const handleGoToAccount = () => {
    onItemClick("Account");
  };

  const handleGoToCompany = () => {
    onItemClick("Company");
  };

  const breakpointColumnsObj = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <div className="dashboard">
      <div className="subHeading">
        <h2>Welcome back {name}</h2>
        <DateTimeDisplay />
      </div>
      <div className="dashboardContainer">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="masonryGrid"
          columnClassName="masonryGridColumn"
        >
          <div className="GridItem">
            <h2>Your Account Information</h2>
            <p className="GridItemDescription">
              A summary of your account information
            </p>
            <div className="GridContentContainer">
              <div className="ProfileImageInfo">
                <img className="profileImageIcon profileOnly" src={profileImg ? profileImg : ProfileIcon} alt="Profile" />
              </div>
              <div className="Accinfo">
                <h2>{name}</h2>
                <p>Name: {name}</p>
                <p>Username: {username}</p>
                <p>Email: {email}</p>
                {companyName && <p>Company: {companyName}</p>}
                {userData.role !== "super_admin" && (
  <p>Designation: {designation}</p>
)}
                {userData.role !== "super_admin" && (
                  <p className="statusOf2fa">Approval Status:{approval_status}</p>
                )}
              </div>
              <button className="goToAccount" onClick={handleGoToAccount}>More Information</button>
            </div>
          </div>
          {/* <div className="GridItem">
            <h2>Your Account Information</h2>
            <p className="GridItemDescription">
              A summary of your account information
            </p>
            <div className="GridContentContainer">
              <QRCodeReader/>
            </div>
          </div> */}
                          {userData.role !== "super_admin" && (

                    <div className="GridItem">
            <h2>Company Information</h2>
            <p className="GridItemDescription">
            Your Company's Information
            </p>
            <div className="GridContentContainer">
              <div className="ProfileImageInfo">
              <img className="profileImageIcon profileOnly" src={userData.company_logo ? userData.company_logo
                 : ProfileIcon} alt="Profile" />
              </div>
              <div className="Accinfo">
                <h2>{companyName}</h2>
                <p>Business Registration Number: {userData.business_registration_number}</p>
                <p>Company Contact Number: {userData.company_contact_number}</p>
                <p>Admin Email: {email}</p>
                <p>Address: {userData.company_address}</p>
              </div>
              <button className="goToAccount" onClick={handleGoToCompany}>More Information</button>
            </div>
          </div>
)}
        </Masonry>
      </div>
    </div>
  );
};

export default Dashboard;
