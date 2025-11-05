import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Masonry from 'react-masonry-css';
import "./PatientVital.scss";

// PatientVital component displays patient vitals
// Expects a prop called selectedpatient, the patient id to use as key to load data
// Data is to be parsed from csv via service API (Py script)
const PatientVital = () => {
  const [patientVitals, setPatientVitals] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setPatientVitals([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    // Replace with a real API call keyed by selectedPatient.id/nric/etc.
    setTimeout(() => {
      // Dummy example vitals
      const vitals = [
        {
          takenOn: new Date().toLocaleString(),
          temperature: 36.7,
          heartRate: 76,
          respiratoryRate: 18,
          oxygenSaturation: 98,
          type: "Manual",
          levelOfO2: "Normal",
          twoHPP: 7.5,
          bpLying: "120/75",
          bpSitting: "122/77",
          bpStanding: "119/74",
          height: 172,
          weight: 68,
          remarks: "Stable"
        },
        {
          takenOn: new Date(Date.now() - 3600_000).toLocaleString(),
          temperature: 37.1,
          heartRate: 80,
          respiratoryRate: 19,
          oxygenSaturation: 99,
          type: "Auto",
          levelOfO2: "Normal",
          twoHPP: 7.2,
          bpLying: "124/78",
          bpSitting: "125/79",
          bpStanding: "123/76",
          height: 172,
          weight: 69,
          remarks: ""
        }
      ];
      setPatientVitals(vitals);
      setLoading(false);
    }, 500);
  }, [selectedPatient]);

  // Pick display identifier for selectedPatient
  const patientDisplayId = selectedPatient
    ? (selectedPatient.id || selectedPatient.nric || "(unknown NRIC)")
    : null;

  return (
    <div className="PatientVitals" >
      <Masonry
        breakpointCols={{ default: 2, 800: 1 }}
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
            {loading ? (
              <div>Loading vitals...</div>
            ) : (
              <table className="VitalsTable">
                <thead>
                  <tr>
                    <th>Taken On</th>
                    <th>Temp<br />(&#8451;)</th>
                    <th>PR<br /> (/min)</th>
                    <th>RR<br /> (/min)</th>
                    <th>SpO2 (%)</th>
                    <th>Type</th>
                    <th>Level<br />of O2</th>
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
                    patientVitals.map((vital, i) => (
                      <tr key={i}>
                        <td>{vital.takenOn}</td>
                        <td>{vital.temperature}</td>
                        <td>{vital.heartRate}</td>
                        <td>{vital.respiratoryRate}</td>
                        <td>{vital.oxygenSaturation}</td>
                        <td>{vital.type}</td>
                        <td>{vital.levelOfO2}</td>
                        <td>{vital.twoHPP}</td>
                        <td>{vital.bpLying}</td>
                        <td>{vital.bpSitting}</td>
                        <td>{vital.bpStanding}</td>
                        <td>{vital.height}</td>
                        <td>{vital.weight}</td>
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
