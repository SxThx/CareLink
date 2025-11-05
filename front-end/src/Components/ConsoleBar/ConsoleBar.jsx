import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faUser,
  faTags,
  faBuilding,
  faChevronCircleRight,
  faChevronCircleLeft,
  faExternalLinkAlt,
  faSignOutAlt,
  faUserCog,
  faWallet,
  faHandshake,
  faHeadset
} from "@fortawesome/free-solid-svg-icons";
import SiteLogo from "../../assets/Img/logo.png";
import DashboardComponent from "#/ConsoleComponents/Dashboard/Dashboard";
import PatientVitalComponent from "#/ConsoleComponents/PatientVital/PatientVital";
import MedicationComponent from "../ConsoleComponents/Medication/Medication";
import ImmunisationComponent from "../ConsoleComponents/Immunisation/Immunisation";
import ConsoleNavbar from "../ConsoleNavbar/ConsoleNavbar";
import { Link } from "react-router-dom";
import "./ConsoleBar.scss";

const ConsoleBar = () => {
  const [showText, setShowText] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Dashboard");
  const [hasSelectedPatient, setHasSelectedPatient] = useState(() => {
    try {
      const stored = localStorage.getItem("selectedPatient");
      return Boolean(stored);
    } catch (error) {
      console.warn("Unable to read stored patient selection:", error);
      return false;
    }
  });
  const selectedComponentRef = useRef(null);

  const userRole = JSON.parse(localStorage.getItem("userData")).role;

  const toggleText = () => {
    setShowText(!showText);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

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

  const renderSelectedComponent = () => {
    switch (selectedItem) {
      case "Dashboard":
        return (
          <DashboardComponent
            onItemClick={handleItemClick}
            onPatientSelectionChange={setHasSelectedPatient}
          />
        );
      case "Patient Vitals":
        return <PatientVitalComponent />;
      case "Medication":
        return <MedicationComponent />;
      case "Immunisation":
        return <ImmunisationComponent />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const handleSelectedComponentClick = () => {
      if (showText) {
        toggleText();
      }
    };

    const selectedComponentCurrent = selectedComponentRef.current;
    if (selectedComponentCurrent) {
      selectedComponentCurrent.addEventListener(
        "click",
        handleSelectedComponentClick
      );
    }

    return () => {
      if (selectedComponentCurrent) {
        selectedComponentCurrent.removeEventListener(
          "click",
          handleSelectedComponentClick
        );
      }
    };
  }, [showText]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "selectedPatient") {
        setHasSelectedPatient(Boolean(event.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (!hasSelectedPatient && selectedItem !== "Dashboard") {
      setSelectedItem("Dashboard");
    }
  }, [hasSelectedPatient, selectedItem]);

  const shouldDisableNavigation = !hasSelectedPatient;

  const protectedNavItem = (label, icon, onClick, isHidden) => {
    if (shouldDisableNavigation && !isHidden) {
      return (
        <li className="disabled">
          <FontAwesomeIcon icon={icon} /> {showText && label}
        </li>
      );
    }

    return (
      <li
        className={selectedItem === label ? "selected" : ""}
        onClick={() => onClick(label)}
      >
        <FontAwesomeIcon icon={icon} /> {showText && label}
      </li>
    );
  };

  return (
    <div className="AdminConsoleBody">
      <div className={`admin-sidebar ${showText ? "show-text" : ""}`}>
        <div className="title">
          <img
            className={`Logo ${showText ? "show-text" : ""}`}
            src={SiteLogo}
            alt=""
          />
          <button
            className={`toggle-button ${showText ? "right" : "left"}`}
            onClick={toggleText}
          >
            {showText ? (
              <FontAwesomeIcon icon={faChevronCircleLeft} size="2x" />
            ) : (
              <FontAwesomeIcon icon={faChevronCircleRight} size="2x" />
            )}
          </button>
        </div>

        <ul>
          <li
            className={selectedItem === "Dashboard" ? "selected" : ""}
            onClick={() => handleItemClick("Dashboard")}
          >
            <FontAwesomeIcon icon={faChartBar} /> {showText && "Dashboard"}
          </li>
          {shouldDisableNavigation ? null : (
            <li
              className={selectedItem === "Patient Vitals" ? "selected" : ""}
              onClick={() => handleItemClick("Patient Vitals")}
            >
              <FontAwesomeIcon icon={faUser} /> {showText && "Patient Vitals"}
            </li>
          )}
          {userRole === "super_admin" ? (
            <>
              {shouldDisableNavigation
                ? null
                : protectedNavItem("Medication", faUserCog, handleItemClick, false)}
              {shouldDisableNavigation
                ? null
                : protectedNavItem("Immunisation", faWallet, handleItemClick, false)}
            </>
          ) : (
            <>
              {shouldDisableNavigation
                ? null
                : protectedNavItem("Promotions", faTags, handleItemClick, false)}
              {userRole !== "company_editor" && !shouldDisableNavigation && (
                <>
                  <li
                    className={
                      selectedItem === "Admin Management" ? "selected" : ""
                    }
                    onClick={() => handleItemClick("Admin Management")}
                  >
                    <FontAwesomeIcon icon={faUserCog} />{" "}
                    {showText && "Admin Management"}
                  </li>
                  <li
                    className={selectedItem === "Immunisation" ? "selected" : ""}
                    onClick={() => handleItemClick("Immunisation")}
                  >
                    <FontAwesomeIcon icon={faWallet} /> {showText && "Immunisation"}
                  </li>
                  <li
                    className={selectedItem === "Partnership" ? "selected" : ""}
                    onClick={() => handleItemClick("Partnership")}
                  >
                    <FontAwesomeIcon icon={faHandshake} /> {showText && "Partnership"}
                  </li>
                  <li
                    className={selectedItem === "Support" ? "selected" : ""}
                    onClick={() => handleItemClick("Support")}
                  >
                    <FontAwesomeIcon icon={faHeadset} /> {showText && "Support"}
                  </li>
                </>

                
              )}
              {shouldDisableNavigation
                ? null
                : protectedNavItem("Company", faBuilding, handleItemClick, false)}
            </>
          )}
        </ul>

        <div className="Links">
          <Link to="/">
            <button className="site-button">
              <FontAwesomeIcon icon={faExternalLinkAlt} />
              {showText && "Go to Site"}
            </button>
          </Link>
          <button onClick={Logout} className="logout-button">
            <FontAwesomeIcon icon={faSignOutAlt} />
            {showText && "Logout"}
          </button>
        </div>
      </div>
      <div
        ref={selectedComponentRef}
        className={`SelectedComponent ${showText ? "show-text" : ""}`}
      >
        <ConsoleNavbar
          selectedItem={selectedItem}
          onItemClick={handleItemClick}
        />

        <div className="ComponentRender">{renderSelectedComponent()}</div>
      </div>
    </div>
  );
};

export default ConsoleBar;
