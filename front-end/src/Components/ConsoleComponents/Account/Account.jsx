import React from "react";
import Masonry from 'react-masonry-css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./Account.scss";
import ProfileIcon from "@/assets/Img/DefaultProfileImg.jpg";
import PasswordChangeForm from "../../Forms/PasswordChangeForm/PasswordChangeForm";
import ProfileImageUploader from "../../Forms/ProfileImageUpload/ProfileImageUploader";

const Account = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const username = userData.username;
  const email = userData.email;
  const profileImg = userData.profile_image;
  const companyName = userData.role !== "super_admin" ? userData.company_name : null;
  const name = userData.full_name;
  const designation = userData.designation;

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

  const breakpointColumnsObj = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1
  };



  return (
    <div className="Account">

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
                <img className="profileImageIcon" src={profileImg ? profileImg : ProfileIcon} alt="Profile" />
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
            </div>
          </div>
          <div className="GridItem">
            <h2>Change Password</h2>
            <p className="GridItemDescription">
              Change your account's password here
            </p>
            <div className="GridContentContainer">
              <PasswordChangeForm/>
            </div>
          </div>

          <div className="GridItem">
            <h2>Profile Image</h2>
            <p className="GridItemDescription">
              Upload or change your profile image here
            </p>
            <div className="GridContentContainer">
              <ProfileImageUploader/>
            </div>
          </div>        </Masonry>
      </div>
  );
};

export default Account;
