import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";
import DefaultProfileImg from "../../assets/Img/DefaultProfileImg.jpg";
import "./ConsoleNavbar.scss";

const ConsoleNavbar = ({ selectedItem, onItemClick }) => {
  const [popoverVisible, setPopoverVisible] = useState(false);
  const popoverRef = useRef(null);
  const iconRef = useRef(null);

  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const { email, username, company_name: company, profile_image: profileImg, role, full_name, designation } = userData;

  const Logout = () => {
    const confirm = window.confirm("Are you sure you want to log out?");
    if (confirm) {
      localStorage.removeItem("tokenExpiry");
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("mockLogin");
      location.href = "/";
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setPopoverVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const togglePopover = () => {
    setPopoverVisible(!popoverVisible);
  };

  const handleSettingsClick = () => {
    onItemClick("Account");
    setPopoverVisible(false);
  };

  return (
    <div className="ConsoleNavbarContainer">
      <div className="NavLeft">{selectedItem}</div>
      <div className="NavRight">
        <div className="ThemeSwitcher">
          <ThemeSwitch />
        </div>
        <div className="profile-icon" ref={iconRef} onClick={togglePopover}>
          {profileImg ? (
            <img src={profileImg} alt="Profile" className="ProfileImage" />
          ) : (
            <FontAwesomeIcon icon={faUserCircle} size="2x" />
          )}
          {popoverVisible && (
            <div className="ProfilePopover" ref={popoverRef}>
              <div className="ProfileInfoContainer">
                <img src={profileImg ? profileImg : DefaultProfileImg} alt="Profile" />
                <div className="userInfo">
                  <p>{full_name}</p>
                  <p>{email}</p>
                  {role !== "super_admin" && <p>{company}</p> }
                </div>
              </div>

              <hr />
              <div className="ProfilePopoverLinks">
                <button onClick={handleSettingsClick}>Settings</button>
                <button onClick={Logout}>Logout</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsoleNavbar;
