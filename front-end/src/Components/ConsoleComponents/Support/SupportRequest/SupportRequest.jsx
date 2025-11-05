import React, { useState } from "react";
import "./SupportRequest.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faEdit, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { addSupportAPI } from "../../../../services/APIs/SupportAPI";
import { showSuccessToast, showErrorToast, showLoadingToast } from "../../../Toast/Toast";

const SupportRequest = () => {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    const confirm = window.confirm("Are you sure you want to submit this support request?")
    if (confirm) {
        e.preventDefault();
        setLoading(true);
        showLoadingToast("Submitting Request.....")
        try {
          const response = await addSupportAPI(formData)
         if (response.status === 200) {
             showSuccessToast(response.message);
             setFormData({
                subject: "",
                message: ""
            });
         } else {
            showErrorToast(response.message)
         }
          setLoading(false);
        } catch (error) {
          console.error("Error submitting the form:", error);
          setLoading(false);
        }
    }
  };

  return (
      <div className="supportRequest">
    <form className="supportRequestForm" onSubmit={handleSubmit}>

        <h2>Submit a Support Request</h2>

      <div className="formGroup">
        <input
          type="text"
          name="subject"
          id="subject"
          value={formData.subject}
          onChange={handleInputChange}
          placeholder=" "
          required
        />
        <label htmlFor="subject">Subject</label>
      </div>

      <div className="formGroup">
        <textarea
          name="message"
          id="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Type your message here"
          required
        />
        <label htmlFor="message">Message</label>
      </div>

      <div className="buttons">

      <button type="submit" disabled={loading}>
            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Submit Request"}
          </button>
      </div>

    </form>

      </div>
  );
};

export default SupportRequest;
