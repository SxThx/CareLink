import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Masonry from 'react-masonry-css';
import "./PatientVital.scss";
import { loadPatientVitalsFromExcel } from "@/services/patientVitalsLoader";

// PatientVital component displays patient vitals
// Expects a prop called selectedpatient, the patient id to use as key to load data
// Data is to be parsed from csv via service API (Py script)
const PatientVital = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [vitalsDirectory, setVitalsDirectory] = useState([]);
  const [patientVitals, setPatientVitals] = useState([]);
  const [loadingDirectory, setLoadingDirectory] = useState(true);
  const [vitalsError, setVitalsError] = useState(null);

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
    let cancelled = false;

    const loadVitals = async () => {
      setLoadingDirectory(true);
      setVitalsError(null);
      try {
        const vitals = await loadPatientVitalsFromExcel();
        if (!cancelled) {
          setVitalsDirectory(vitals);
        }
      } catch (error) {
        console.error("Unable to load patient vitals:", error);
        if (!cancelled) {
          setVitalsError(error instanceof Error ? error : new Error("Unknown error"));
          setVitalsDirectory([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingDirectory(false);
        }
      }
    };

    loadVitals();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedPatient || !selectedPatient.nric) {
      setPatientVitals([]);
      return;
    }

    if (!vitalsDirectory.length) {
      setPatientVitals([]);
      return;
    }

    const filtered = vitalsDirectory.filter(
      (vital) => vital.nric && vital.nric.toUpperCase() === selectedPatient.nric.toUpperCase()
    );
    setPatientVitals(filtered);
  }, [selectedPatient, vitalsDirectory]);

  // Pick display identifier for selectedPatient
  const patientDisplayId = selectedPatient
    ? (selectedPatient.id || selectedPatient.nric || "(unknown NRIC)")
    : null;

  const formatDateTime = (value) => {
    if (value === null || value === undefined || value === "") {
      return "";
    }

    let date;
    if (typeof value === "number") {
      const milliseconds = Math.round((value - 25569) * 86400 * 1000);
      date = new Date(milliseconds);
    } else {
      date = new Date(value);
    }

    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleString();
    }

    return value;
  };

  const formatDateOnly = (value) => {
    const formatted = formatDateTime(value);
    if (!formatted) {
      return "";
    }

    const date = new Date(formatted);
    return Number.isNaN(date.getTime()) ? formatted : date.toLocaleDateString();
  };

  const formatTimeOnly = (value) => {
    const formatted = formatDateTime(value);
    if (!formatted) {
      return "";
    }

    const date = new Date(formatted);
    return Number.isNaN(date.getTime()) ? formatted : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatNumber = (value, fractionDigits = null) => {
    if (value === null || value === undefined || value === "") {
      return "";
    }

    const numericValue = typeof value === "number" ? value : Number(value);
    if (Number.isNaN(numericValue)) {
      return value;
    }

    if (fractionDigits !== null && Number.isFinite(numericValue)) {
      return numericValue.toFixed(fractionDigits);
    }

    return numericValue.toString();
  };

  return (
    <div className="PatientVitals" >
      <Masonry
        breakpointCols={{ default: 1, 800: 1 }}
        className="masonryGrid"
        columnClassName="masonryGridColumn"
      >
        <div className="GridItem">
          <h2>Patient Vitals</h2>
          <p className="GridItemDescription">
            Viewing vitals for Patient: <b>{patientDisplayId ?? "(none selected)"}</b>&nbsp;
            (as of {new Date().toLocaleDateString()})
          </p>
          <div className="GridContentContainer">
            {loadingDirectory ? (
              <div>Loading vitals...</div>
            ) : vitalsError ? (
              <div className="VitalsError">Unable to load vitals data from Excel.</div>
            ) : !selectedPatient ? (
              <div>Select a patient to view vitals.</div>
            ) : (
              <table className="VitalsTable">
                <thead>
                  <tr>
                    <th>Vital Date</th>
                    <th>Time</th>
                    <th>Temp<br />(&#8451;)</th>
                    <th>Pulse<br />(/min)</th>
                    <th>RR<br />(/min)</th>
                    <th>SpO2<br />(%)</th>
                    <th>2HPP<br />(mmol/L)</th>
                    <th>BP<br />(Lying)<br />(mm hg)</th>
                    <th>BP<br />(Sitting)<br />(mm hg)</th>
                    <th>BP<br />(Standing)<br />(mm hg)</th>
                    <th>Height<br />(cm)</th>
                    <th>Weight<br />(kg)</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(patientVitals) && patientVitals.length > 0 ? (
                    patientVitals.map((vital) => (
                      <tr key={vital.id}>
                        <td>{formatDateOnly(vital.takenOn || vital.vitalDate)}</td>
                        <td>{formatTimeOnly(vital.takenOn || vital.vitalTime)}</td>
                        <td>{formatNumber(vital.temperature, 1)}</td>
                        <td>{formatNumber(vital.heartRate)}</td>
                        <td>{formatNumber(vital.respiratoryRate)}</td>
                        <td>{formatNumber(vital.oxygenSaturation)}</td>
                        <td>{formatNumber(vital.twoHPP, 1)}</td>
                        <td>{vital.bpLying}</td>
                        <td>{vital.bpSitting}</td>
                        <td>{vital.bpStanding}</td>
                        <td>{formatNumber(vital.height)}</td>
                        <td>{formatNumber(vital.weight)}</td>
                        <td>{vital.remarks}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={14}>No vitals data available.</td>
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

PatientVital.propTypes = {
  selectedpatient: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default PatientVital;
