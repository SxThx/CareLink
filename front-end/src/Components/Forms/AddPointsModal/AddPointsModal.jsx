import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimesCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./AddPointsModal.scss";

const AddPointsModal = ({ isOpen, closeModal, handleAddPoints, loading }) => {
  const [points, setPoints] = useState(0);

  const handleChange = (e) => {
    setPoints(e.target.value);
  };

  const handleSubmit = () => {
    handleAddPoints(points);
  };

  return isOpen ? (
    <div className="modalOverlay">
      <div className="modalContent">
        <div className="modalHeader">
          <h2>Add Points</h2>
          <button className="closeModalButton" onClick={closeModal}>
            <FontAwesomeIcon icon={faTimesCircle} />
          </button>
        </div>
        <div className="modalBody">
          <div className="formGroup">
            <input
              type="number"
              name="points"
              id="points"
              value={points}
              onChange={handleChange}
              placeholder="Enter points"
              required
            />
            <label htmlFor="points">Points</label>
          </div>
          <button className="addBtn" onClick={handleSubmit} disabled={loading}>
            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Add Points"}
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default AddPointsModal;
