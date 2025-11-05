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
  faTools,
  faUserCog,
  faWallet,
  faMoneyBill,
  faExchangeAlt,
  faMoneyCheck,
  faMoneyCheckAlt,
  faHandshake,
  faHand,
  faHeadset
} from "@fortawesome/free-solid-svg-icons";
import SiteLogo from "../../assets/Img/logo.png";
import DashboardComponent from "#/ConsoleComponents/Dashboard/Dashboard";
import AccountComponent from "#/ConsoleComponents/Account/Account";
import BrandComponent from "../ConsoleComponents/Brand/Brand";
import PromotionsComponent from "../ConsoleComponents/Promotions/Promotions";
import AdminManagementComponent from "../ConsoleComponents/AdminManagement/AdminManagement";
import AccountReviewComponent from "../ConsoleComponents/SuperAdminConsoleComponents/AccountReview/AccountReview";
import CompaniesComponent from "../ConsoleComponents/SuperAdminConsoleComponents/Companies/Companies";
import TransactionsComponent from "../ConsoleComponents/Transactions/Transactions";
import PartnershipComponent from "../ConsoleComponents/Partnership/Partnership";
import ConsoleNavbar from "../ConsoleNavbar/ConsoleNavbar";
import SupportComponent from "../ConsoleComponents/Support/Support"
import AdminSupportComponent from "../ConsoleComponents/SuperAdminConsoleComponents/AdminSupport/AdminSupport";
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
      case "Account":
        return <AccountComponent />;
      case "Promotions":
        return <PromotionsComponent />;
      case "Company":
        return <BrandComponent />;
      case "Admin Management":
        return <AdminManagementComponent />;
      case "Account Review":
        return <AccountReviewComponent />;
      case "Companies":
        return <CompaniesComponent />;
      case "Transactions":
        return <TransactionsComponent />;
        case "Partnership":
          return <PartnershipComponent />;
          case "Support":
            return <SupportComponent />;
            case "Admin Support":
              return <AdminSupportComponent />;
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
              className={selectedItem === "Account" ? "selected" : ""}
              onClick={() => handleItemClick("Account")}
            >
              <FontAwesomeIcon icon={faUser} /> {showText && "Account"}
            </li>
          )}
          {userRole === "super_admin" ? (
            <>
              {shouldDisableNavigation
                ? null
                : protectedNavItem("Account Review", faUserCog, handleItemClick, false)}
              {shouldDisableNavigation
                ? null
                : protectedNavItem("Companies", faBuilding, handleItemClick, false)}
              {shouldDisableNavigation
                ? null
                : protectedNavItem("Admin Support", faHeadset, handleItemClick, false)}
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
                    className={selectedItem === "Transactions" ? "selected" : ""}
                    onClick={() => handleItemClick("Transactions")}
                  >
                    <FontAwesomeIcon icon={faWallet} /> {showText && "Transactions"}
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
