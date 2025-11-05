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
      // Based on: Vital Date	Time	Temperature (°C)	Pulse Rate (/min)	Respiratory Rate (/min)	SpO2 (%)	2HPP (mmol/ L)	BP (Lying) (mm hg)	BP (Sitting) (mm hg)	BP (Standing) (mm hg)	Height (cm)	Weight (kg)	Remarks
      const vitals = [
        {
          vitalDate: "22/11/2025",
          time: "10:00:00",
          temperature: 36.7,
          pulseRate: 76,
          respiratoryRate: 18,
          spO2: 98,
          twoHPP: 7.5,
          bpLying: "120/75",
          bpSitting: "122/77",
          bpStanding: "119/74",
          height: 172,
          weight: 68,
          remarks: "Stable"
        },
        {
          vitalDate: "20/10/2025",
          time: "14:00:00",
          temperature: 37.1,
          pulseRate: 80,
          respiratoryRate: 19,
          spO2: 99,
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
            {loading ? (
              <div>Loading vitals...</div>
            ) : (
              <table className="VitalsTable">
                <thead>
                  <tr>
                    <th>Vital Date</th>
                    <th>Time</th>
                    <th>Temperature (&#8451;)</th>
                    <th>Pulse Rate (/min)</th>
                    <th>Respiratory Rate (/min)</th>
                    <th>SpO2 (%)</th>
                    <th>2HPP (mmol/ L)</th>
                    <th>BP (Lying) (mm hg)</th>
                    <th>BP (Sitting) (mm hg)</th>
                    <th>BP (Standing) (mm hg)</th>
                    <th>Height (cm)</th>
                    <th>Weight (kg)</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(patientVitals) && patientVitals.length > 0 ? (
                    patientVitals.map((vital, i) => (
                      <tr key={i}>
                        <td>{vital.vitalDate}</td>
                        <td>{vital.time}</td>
                        <td>{vital.temperature}</td>
                        <td>{vital.pulseRate}</td>
                        <td>{vital.respiratoryRate}</td>
                        <td>{vital.spO2}</td>
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
                      <td colSpan={13}>No vitals data available.</td>
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
