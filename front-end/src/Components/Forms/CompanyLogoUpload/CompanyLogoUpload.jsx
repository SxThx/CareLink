import React, { useState, useRef } from "react";
import "./CompanyLogoUpload.scss";
import { imageToBase64 } from "../../../utils/Base64Encoder";
import { updateCompanyLogoAPI } from "../../../services/APIs/CompanyAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast } from "../../Toast/Toast";
import { RefreshUserData } from "../../../utils/RefreshUserData";

const CompanyLogoUpload = ({ onSuccess }) => { // Destructure onSuccess prop

  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleImage(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleImage(file);
  };

  const handleImage = (file) => {
    imageToBase64(file)
      .then(base64 => {
        setImage(base64); // Set the converted Base64 string as the image source
      })
      .catch(error => {
        console.error("Error converting image to Base64:", error);
        setImage(null); // Optionally clear the image if there was an error
        showErrorToast(error.message); // Display the error message to the user
      });
  };

  const removeImage = (event) => {
    event.stopPropagation();
    setImage(null); // Clear the image state
  };

  const handleClick = () => {
    fileInputRef.current.click(); // Trigger the file input click
  };

  const handleUpload = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    setLoading(true);
    showLoadingToast("Uploading...");
    if (!image) {
      showErrorToast("Please select an image to upload.");
      return;
    }

    const isConfirmed = window.confirm("Are you sure you want to upload this image as your profile picture?");

    if (isConfirmed) {
      try {
        const imageUploadPackage = {
          companyLogo: image
        };
        const response = await updateCompanyLogoAPI(imageUploadPackage);

        if (response.status === 200) {
          showSuccessToast(response.message);
          setImage(null);
          onSuccess(); // Call the onSuccess prop after successful upload
        } else {
          showErrorToast(response.message);
        }
      } catch (error) {
        console.error("Error occurred:", error);
        showErrorToast("An error occurred while uploading the image: " + error.message);
      } finally {
        setLoading(false);
      }
    } else {
      setImage(null);
      setLoading(false);
    }
  };

  return (
    <div className="ProfileImageUploader">
      <div
        className={`DropArea ${image ? "with-image" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
      >
        {image ? (
          <>
            <img src={image} alt="Preview" />
            <div className="ButtonContainer">
              <button
                disabled={loading}
                className="UploadBtn"
                type="button"
                onClick={handleUpload}
              >
                {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Upload"}
              </button>
              <button className="RemoveBtn" type="button" onClick={removeImage}>
                Remove Image
              </button>
            </div>
          </>
        ) : (
          <p>Click or Drag & Drop to Upload</p>
        )}
      </div>
      <input
        type="file"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*" // Accept only image files
      />
    </div>
  );
};

export default CompanyLogoUpload;
