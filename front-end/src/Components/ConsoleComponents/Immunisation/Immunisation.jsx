import { useState, useEffect } from "react";
import Masonry from 'react-masonry-css';
import {
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import "./Immunisation.scss";

const Immunisation = () => {
  const [immunisationRecords, setImmunisationRecords] = useState([]);
  const [isRecordsLoading, setIsRecordsLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Sync selected patient from localStorage (set by Dashboard)
  useEffect(() => {
    function getSelectedPatientFromStorage() {
      try {
        const stored = localStorage.getItem("selectedPatient");
        return stored ? JSON.parse(stored) : null;
      } catch (e) {
        return null;
      }
    }

    setSelectedPatient(getSelectedPatientFromStorage());

    // Keep in sync with any changes (Dashboard will update localStorage)
    const syncPatient = (event) => {
      if (event.key === "selectedPatient") {
        setSelectedPatient(event.newValue ? JSON.parse(event.newValue) : null);
      }
    };
    window.addEventListener("storage", syncPatient);
    return () => window.removeEventListener("storage", syncPatient);
  }, []);

  useEffect(() => {
    if (!selectedPatient) {
      setImmunisationRecords([]);
      setIsRecordsLoading(false);
      return;
    }
    setIsRecordsLoading(true);
    // Replace with a real API call keyed by selectedPatient.id/nric/etc.
    setTimeout(() => {
      // Dummy example immunisation records
      const immunisationRecords = [
        {
          immunisationType: "Influenza Vaccine",
          immunisationDate: new Date().toLocaleDateString(),
        },
        {
          immunisationType: "Pneumonia Vaccine",
          immunisationDate: new Date(Date.now() - 3600_000).toLocaleDateString(),
        }
      ];
      setImmunisationRecords(immunisationRecords);
      setIsRecordsLoading(false);
    }, 500);
  }, [selectedPatient]);

  // Pick display identifier for selectedPatient
  const patientDisplayId = selectedPatient
    ? (selectedPatient.id || selectedPatient.nric || "(unknown NRIC)")
    : null;

  return (
    <div className="ImmunisationRecords" >
      <Masonry
        breakpointCols={{ default: 1, 800: 1 }}
        className="masonryGrid"
        columnClassName="masonryGridColumn"
      >
        <div className="GridItem">
          <h2>Immunisation Records</h2>
          <p className="GridItemDescription">
            Viewing immunisation records for Patient: <b>{patientDisplayId ?? "(none selected)"}</b>&nbsp;
          </p>
          <div className="GridContentContainer">
            {isRecordsLoading ? (
              <div>Loading immunisation records...</div>
            ) : (
              <table className="ImmunisationTable">
                <thead>
                  <tr>                    
                    <th>Immunisation Type</th>
                    <th>Immunisation Date</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(immunisationRecords) && immunisationRecords.length > 0 ? (
                    immunisationRecords.map((immunisation, i) => (
                      <tr key={i}>
                        <td>{immunisation.immunisationType}</td>
                        <td>{immunisation.immunisationDate}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={14}>No immunisation data available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </Masonry>
    </div>
  );
};

export default Immunisation;
