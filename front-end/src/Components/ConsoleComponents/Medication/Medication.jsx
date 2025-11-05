import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Masonry from 'react-masonry-css';
import "./Medication.scss";

// PatientVital component displays patient vitals
// Expects a prop called selectedpatient, the patient id to use as key to load data
// Data is to be parsed from csv via service API (Py script)
const Medication = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medication, setMedication] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function getSelectedPatientFromStorage() {
      const stored = localStorage.getItem("selectedPatient");
      return stored ? JSON.parse(stored) : null;
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
      setMedication([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    // Replace with a real API call keyed by selectedPatient.id/nric/etc.
    setTimeout(() => {
      // Dummy example vitals
      const medication = [
        {
          orderStartDate: new Date().toLocaleDateString(),
          medication: "Paracetamol",
          type: "Tablet",
          doseFrequency: "500mg (Twice daily)",
          quantityDuration: "14 (7 days)",
          route: "Oral",
          specialInstructions: "Take after food"
        },
        {
          orderStartDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          medication: "Amoxicillin",
          type: "Capsule",
          doseFrequency: "250mg (Three times daily)",
          quantityDuration: "21 (7 days)",
          route: "Oral",
          specialInstructions: ""
        }
      ];
      setMedication(medication);
      setLoading(false);
    }, 500);
  }, [selectedPatient]);

  // Pick display identifier for selectedPatient
  const patientDisplayId = selectedPatient
    ? (selectedPatient.id || selectedPatient.nric || "(unknown NRIC)")
    : null;

  return (
    <div className="Medication" >
      <Masonry
        breakpointCols={{ default: 1, 800: 1 }}
        className="masonryGrid"
        columnClassName="masonryGridColumn"
      >
        <div className="GridItem">
          <h2>Medication</h2>
          <p className="GridItemDescription">
            Viewing medication for Patient: <b>{patientDisplayId ?? "(none selected)"}</b>&nbsp;
            (as of {new Date().toLocaleDateString()})
          </p>
          <div className="GridContentContainer">
            {loading ? (
              <div>Loading medication...</div>
            ) : (
              <table className="MedicationTable">
                <thead>
                  <tr>
                    <th>Order Start Date</th>
                    <th>Medication</th>
                    <th>Type</th>
                    <th>Dose(Freq)</th>
                    <th>Qty(Duration)</th>
                    <th>Route</th>
                    <th>Special Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(medication) && medication.length > 0 ? (
                    medication.map((medication, i) => (
                      <tr key={i}>
                        <td>{medication.orderStartDate}</td>
                        <td>{medication.medication}</td>
                        <td>{medication.type}</td>
                        <td>{medication.doseFrequency}</td>
                        <td>{medication.quantityDuration}</td>
                        <td>{medication.route}</td>
                        <td>{medication.specialInstructions}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={14}>No medication data available.</td>
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

Medication.propTypes = {
  selectedpatient: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default Medication;
