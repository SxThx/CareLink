import React, { useEffect, useMemo, useState } from "react";
import "./Dashboard.scss";
import DateTimeDisplay from "#/DateTime/DateTime";
import ProfileIcon from "@/assets/Img/DefaultProfileImg.jpg";
import Masonry from 'react-masonry-css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import QRCodeReader from "../../QrCodeReader/QrCodeReader";

const PATIENT_DIRECTORY = [
  {
    id: "patient-001",
    nric: "S8712345D",
    firstName: "Amelia",
    lastName: "Tan",
    nursingHomeName: "Sunrise Elder Care",
    sex: "F",
    dateOfBirth: "12 Mar 1987",
    emergencyContactName: "Grace Tan",
    emergencyContactNumber: "+65 9123 4567",
    emergencyContactRelationship: "Sister",
  },
  {
    id: "patient-002",
    nric: "S9004567F",
    firstName: "Brandon",
    lastName: "Lim",
    nursingHomeName: "Harbour Lights Nursing Centre",
    sex: "M",
    dateOfBirth: "22 Jul 1990",
    emergencyContactName: "Joshua Lim",
    emergencyContactNumber: "+65 9345 6789",
    emergencyContactRelationship: "Brother",
  },
  {
    id: "patient-003",
    nric: "T0127890J",
    firstName: "Cheryl",
    lastName: "Ng",
    nursingHomeName: "Evergreen Haven",
    sex: "F",
    dateOfBirth: "08 Dec 2001",
    emergencyContactName: "Lydia Ng",
    emergencyContactNumber: "+65 9001 2345",
    emergencyContactRelationship: "Mother",
  },
  {
    id: "patient-004",
    nric: "S7811123L",
    firstName: "David",
    lastName: "Goh",
    nursingHomeName: "Silver Oaks Residence",
    sex: "M",
    dateOfBirth: "30 Nov 1978",
    emergencyContactName: "Karen Goh",
    emergencyContactNumber: "+65 9888 1122",
    emergencyContactRelationship: "Wife",
  },
  {
    id: "patient-005",
    nric: "S8422234M",
    firstName: "Evelyn",
    lastName: "Koh",
    nursingHomeName: "Harmony Care Lodge",
    sex: "F",
    dateOfBirth: "16 May 1984",
    emergencyContactName: "Samuel Koh",
    emergencyContactNumber: "+65 9456 7788",
    emergencyContactRelationship: "Husband",
  },
  {
    id: "patient-006",
    nric: "F9733345P",
    firstName: "Farhan",
    lastName: "Ali",
    nursingHomeName: "Green Meadows Nursing Home",
    sex: "M",
    dateOfBirth: "04 Jan 1997",
    emergencyContactName: "Nur Ali",
    emergencyContactNumber: "+65 9333 4411",
    emergencyContactRelationship: "Sister",
  },
];

const SELECTED_PATIENT_STORAGE_KEY = "selectedPatient";

const getStoredSelectedPatient = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedValue = localStorage.getItem(SELECTED_PATIENT_STORAGE_KEY);
    if (!storedValue) {
      return null;
    }

    const parsed = JSON.parse(storedValue);
    if (
      parsed &&
      parsed.nric &&
      parsed.firstName &&
      parsed.lastName &&
      parsed.nursingHomeName
    ) {
      return parsed;
    }
    return null;
  } catch (error) {
    console.warn("Unable to parse stored patient selection:", error);
    return null;
  }
};

const sanitizeSearchInput = (value) =>
  value.replace(/[^0-9a-zA-Z]/g, "").toUpperCase().slice(0, 4);

const getPatientDisplayName = (patient) =>
  `${patient.firstName} ${patient.lastName}`;

const Dashboard = ({ onItemClick, onPatientSelectionChange }) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const username = userData.username;
  const name = userData.full_name;
  const email = userData.email;
  const profileImg = userData.profile_image;
  const designation = userData.designation;
  const role = userData.role;
  const companyName = userData.role !== "super_admin" ? userData.company_name : null;

  const [searchDigits, setSearchDigits] = useState(() => sanitizeSearchInput(""));
  const [selectedPatient, setSelectedPatient] = useState(() => getStoredSelectedPatient());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (selectedPatient) {
      localStorage.setItem(
        SELECTED_PATIENT_STORAGE_KEY,
        JSON.stringify(selectedPatient)
      );
    } else {
      localStorage.removeItem(SELECTED_PATIENT_STORAGE_KEY);
    }
  }, [selectedPatient]);

  useEffect(() => {
    if (typeof onPatientSelectionChange === "function") {
      onPatientSelectionChange(Boolean(selectedPatient));
    }
  }, [selectedPatient, onPatientSelectionChange]);

  const filteredPatients = useMemo(() => {
    const query = sanitizeSearchInput(searchDigits);

    if (!query) {
      return [];
    }

    return PATIENT_DIRECTORY.filter((patient) =>
      patient.nric.slice(-query.length).toUpperCase() === query
    );
  }, [searchDigits]);

  const handleSearchChange = (event) => {
    setSearchDigits(sanitizeSearchInput(event.target.value));
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
  };

  const handleClearSelection = () => {
    setSelectedPatient(null);
  };

  const handleClearSearch = () => {
    setSearchDigits("");
  };

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
          <div className="GridItem patientSearch">
            <h2>Patient Quick Search</h2>
            <p className="GridItemDescription">
              Search for patients using the last four digits of their NRIC.
            </p>
            <div className="GridContentContainer PatientSearchContent">
              <div className="inputGroup">
                <label htmlFor="patient-search-input">Last 4 digits of NRIC</label>
                <div className="inputRow">
                  <input
                    id="patient-search-input"
                    type="text"
                    inputMode="text"
                    maxLength={4}
                    value={searchDigits}
                    onChange={handleSearchChange}
                    placeholder="e.g. 123D"
                  />
                  {searchDigits && (
                    <button
                      type="button"
                      className="clearSearchButton"
                      onClick={handleClearSearch}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="resultsList">
                {searchDigits.length === 4 ? (
                  filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => {
                      const isSelected = selectedPatient?.id === patient.id;
                      const lastFour = patient.nric.slice(-4).toUpperCase();
                      const displayName = getPatientDisplayName(patient);
                      return (
                        <button
                          type="button"
                          key={patient.id}
                          className={`resultItem ${isSelected ? "selected" : ""}`}
                          onClick={() => handleSelectPatient(patient)}
                        >
                          <span className="name">{displayName}</span>
                          <span className="meta">
                            NRIC ending {lastFour} | Nursing Home: {patient.nursingHomeName}
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <p className="placeholder">No patients found with those digits.</p>
                  )
                ) : (
                  <p className="placeholder">Enter all four digits to see matches.</p>
                )}
              </div>

            </div>
          </div>
          <div className="GridItem patientDetails">
            <h2>Patient Details</h2>
            <p className="GridItemDescription">
              Review the selected patient&apos;s profile and emergency contacts.
            </p>
            <div className="GridContentContainer PatientDetailsContent">
              {selectedPatient ? (
                <div className="detailsCard">
                  <div className="detailsHeader">
                    <h3>{getPatientDisplayName(selectedPatient)}</h3>
                    <button
                      type="button"
                      className="clearSelectionButton"
                      onClick={handleClearSelection}
                    >
                      Remove
                    </button>
                  </div>
                  <dl>
                    <div>
                      <dt>NRIC</dt>
                      <dd>{selectedPatient.nric}</dd>
                    </div>
                    <div>
                      <dt>Nursing Home</dt>
                      <dd>{selectedPatient.nursingHomeName}</dd>
                    </div>
                    <div>
                      <dt>Sex</dt>
                      <dd>{selectedPatient.sex}</dd>
                    </div>
                    <div>
                      <dt>Date of Birth</dt>
                      <dd>{selectedPatient.dateOfBirth}</dd>
                    </div>
                    <div>
                      <dt>Emergency Contact</dt>
                      <dd>
                        {selectedPatient.emergencyContactName} (
                        {selectedPatient.emergencyContactRelationship})
                      </dd>
                    </div>
                    <div>
                      <dt>Contact Number</dt>
                      <dd>{selectedPatient.emergencyContactNumber}</dd>
                    </div>
                  </dl>
                </div>
              ) : (
                <div className="emptyState">
                  <p>Select a patient from the search to view their details here.</p>
                </div>
              )}
            </div>
          </div>
          {/* <div className="GridItem">

            <div className="GridContentContainer">

              <div className="Accinfo">
                <h2>Something Wong</h2>
                <p>Age: 25</p>
                <p>Sex: Male</p>
              </div>
              <button className="goToAccount" onClick={handleGoToAccount}>More Information</button>
            </div>
          </div> */}

        </Masonry>
      </div>
    </div>
  );
};

export default Dashboard;
