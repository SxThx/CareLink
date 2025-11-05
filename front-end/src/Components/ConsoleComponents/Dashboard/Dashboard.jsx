import React, { useEffect, useMemo, useState } from "react";
import "./Dashboard.scss";
import DateTimeDisplay from "#/DateTime/DateTime";
import ProfileIcon from "@/assets/Img/DefaultProfileImg.jpg";
import Masonry from 'react-masonry-css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import QRCodeReader from "../../QrCodeReader/QrCodeReader";
import { loadPatientDirectoryFromExcel } from "@/services/patientDirectoryLoader";

const FALLBACK_PATIENT_DIRECTORY = [
  {
    id: "P-001",
    patientId: "P-001",
    reportDate: "2024-10-05",
    nric: "S8712345D",
    firstName: "Amelia",
    lastName: "Tan",
    fullName: "Amelia Tan",
    nursingHomeName: "Sunrise Elder Care",
    sex: "F",
    dateOfBirth: "1987-03-12",
    age: 37,
    mfecNumber: "MFEC-001",
    emergencyContactName: "Grace Tan",
    emergencyContactNumber: "+65 9123 4567",
    emergencyContactRelationship: "Sister",
    sourceFile: "fallback",
  },
  {
    id: "P-002",
    patientId: "P-002",
    reportDate: "2024-10-05",
    nric: "S9004567F",
    firstName: "Brandon",
    lastName: "Lim",
    fullName: "Brandon Lim",
    nursingHomeName: "Harbour Lights Nursing Centre",
    sex: "M",
    dateOfBirth: "1990-07-22",
    age: 34,
    mfecNumber: "MFEC-002",
    emergencyContactName: "Joshua Lim",
    emergencyContactNumber: "+65 9345 6789",
    emergencyContactRelationship: "Brother",
    sourceFile: "fallback",
  },
  {
    id: "P-003",
    patientId: "P-003",
    reportDate: "2024-10-05",
    nric: "T0127890J",
    firstName: "Cheryl",
    lastName: "Ng",
    fullName: "Cheryl Ng",
    nursingHomeName: "Evergreen Haven",
    sex: "F",
    dateOfBirth: "2001-12-08",
    age: 23,
    mfecNumber: "MFEC-003",
    emergencyContactName: "Lydia Ng",
    emergencyContactNumber: "+65 9001 2345",
    emergencyContactRelationship: "Mother",
    sourceFile: "fallback",
  },
  {
    id: "P-004",
    patientId: "P-004",
    reportDate: "2024-10-05",
    nric: "S7811123L",
    firstName: "David",
    lastName: "Goh",
    fullName: "David Goh",
    nursingHomeName: "Silver Oaks Residence",
    sex: "M",
    dateOfBirth: "1978-11-30",
    age: 46,
    mfecNumber: "MFEC-004",
    emergencyContactName: "Karen Goh",
    emergencyContactNumber: "+65 9888 1122",
    emergencyContactRelationship: "Wife",
    sourceFile: "fallback",
  },
  {
    id: "P-005",
    patientId: "P-005",
    reportDate: "2024-10-05",
    nric: "S8422234M",
    firstName: "Evelyn",
    lastName: "Koh",
    fullName: "Evelyn Koh",
    nursingHomeName: "Harmony Care Lodge",
    sex: "F",
    dateOfBirth: "1984-05-16",
    age: 40,
    mfecNumber: "MFEC-005",
    emergencyContactName: "Samuel Koh",
    emergencyContactNumber: "+65 9456 7788",
    emergencyContactRelationship: "Husband",
    sourceFile: "fallback",
  },
  {
    id: "P-006",
    patientId: "P-006",
    reportDate: "2024-10-05",
    nric: "F9733345P",
    firstName: "Farhan",
    lastName: "Ali",
    fullName: "Farhan Ali",
    nursingHomeName: "Green Meadows Nursing Home",
    sex: "M",
    dateOfBirth: "1997-01-04",
    age: 28,
    mfecNumber: "MFEC-006",
    emergencyContactName: "Nur Ali",
    emergencyContactNumber: "+65 9333 4411",
    emergencyContactRelationship: "Sister",
    sourceFile: "fallback",
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

const getPatientDisplayName = (patient) => {
  if (!patient) {
    return "";
  }

  if (patient.fullName) {
    return patient.fullName;
  }

  const nameParts = [patient.firstName, patient.lastName].filter(Boolean);
  if (nameParts.length > 0) {
    return nameParts.join(" ");
  }

  return patient.nric || patient.patientId || "Unknown Patient";
};

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
  const [patientDirectory, setPatientDirectory] = useState([]);
  const [directoryLoading, setDirectoryLoading] = useState(true);
  const [directoryError, setDirectoryError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadDirectory = async () => {
      setDirectoryLoading(true);
      setDirectoryError(null);
      try {
        const loadedPatients = await loadPatientDirectoryFromExcel();
        if (cancelled) {
          return;
        }
        if (Array.isArray(loadedPatients) && loadedPatients.length > 0) {
          setPatientDirectory(loadedPatients);
        } else {
          setPatientDirectory(FALLBACK_PATIENT_DIRECTORY);
        }
      } catch (error) {
        console.error("Unable to load patient directory:", error);
        if (!cancelled) {
          setDirectoryError(error instanceof Error ? error : new Error("Unknown error"));
          setPatientDirectory(FALLBACK_PATIENT_DIRECTORY);
        }
      } finally {
        if (!cancelled) {
          setDirectoryLoading(false);
        }
      }
    };

    loadDirectory();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!patientDirectory.length) {
      return;
    }

    if (!selectedPatient) {
      return;
    }

    const match = patientDirectory.find(
      (patient) => patient.nric && patient.nric === selectedPatient.nric
    );

    if (!match) {
      setSelectedPatient(null);
    } else if (selectedPatient.id !== match.id) {
      setSelectedPatient(match);
    }
  }, [patientDirectory, selectedPatient]);

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

    if (!patientDirectory.length) {
      return [];
    }

    return patientDirectory.filter(
      (patient) =>
        patient.nric &&
        patient.nric.slice(-query.length).toUpperCase() === query
    );
  }, [searchDigits, patientDirectory]);

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
                {directoryLoading ? (
                  <p className="placeholder">Loading patient directory...</p>
                ) : directoryError ? (
                  <p className="placeholder errorMessage">
                    Unable to load the patient directory. Showing fallback data.
                  </p>
                ) : searchDigits.length === 4 ? (
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
                  {selectedPatient.patientId && (
                    <div>
                      <dt>Patient ID</dt>
                      <dd>{selectedPatient.patientId}</dd>
                    </div>
                  )}
                  {selectedPatient.mfecNumber && (
                    <div>
                      <dt>MFEC No.</dt>
                      <dd>{selectedPatient.mfecNumber}</dd>
                    </div>
                  )}
                  {selectedPatient.reportDate && (
                    <div>
                      <dt>Report Date</dt>
                      <dd>{selectedPatient.reportDate}</dd>
                    </div>
                  )}
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
                  {typeof selectedPatient.age === "number" && (
                    <div>
                      <dt>Age</dt>
                      <dd>{selectedPatient.age}</dd>
                    </div>
                  )}
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
                  {selectedPatient.sourceFile && (
                    <div>
                      <dt>Source File</dt>
                      <dd>{selectedPatient.sourceFile}</dd>
                    </div>
                  )}
                  </dl>
                </div>
              ) : (
                <div className="emptyState">
                  <p>Select a patient from the search to view their details here.</p>
                </div>
              )}
            </div>
          </div>
          {/* Comment Box and Send Button */}
          <div className="GridItem commentBox">
            <h2>Comment Box</h2>
            <p className="GridItemDescription">
              Add a comment to the selected patient.
            </p>
            <div className="GridContentContainer CommentBoxContent">
          <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <input
              type="text"
              placeholder="Add a comment..."
              value={""}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            />
            <button
              onClick={() => {}}
              style={{
                padding: "8px 18px",
                borderRadius: "4px",
                background: "#1976d2",
                color: "#fff",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              disabled={false}
            >
              Send comment
            </button>
            </div>
            </div>
            </div>
        </Masonry>
      </div>
    </div>
  );
};

export default Dashboard;
