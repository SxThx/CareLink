import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimesCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import "./AddSingleCouponModal.scss";
import { imageToBase64 } from "../../../utils/Base64Encoder";

const AddSingleCouponModal = ({
  isOpen,
  closeModal,
  handleAddCoupon,
  loading,
  branches,
}) => {
  console.log(branches)

  const [formData, setFormData] = useState({
    coupon_title: "",
    coupon_description: "",
    terms_conditions: "",
    amount_of_coupons: 0,
    promotion_type: "Standard",
    promotion_category: "1 for 1",
    coupon_category: "Food",
    start_date: "",
    end_date: "",
    type: "company_wide",
    branch: [],
    coupon_design_image: null,
    status: "draft",
  });

  const [image, setImage] = useState(null); // Local state for image
  const [loadingImage, setLoadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "file") {
      if (name === "coupon_design_image") {
        handleImage(e.target.files[0]);
      } else {
        setFormData({ ...formData, [name]: e.target.files[0] });
      }
    } else if (type === "checkbox") {
      if (name === "promotion_category") {
        // Handle promotion category checkboxes
        const selectedCategories = checked
          ? [...formData.promotion_category, value]
          : formData.promotion_category.filter((item) => item !== value);
        setFormData({ ...formData, promotion_category: selectedCategories });
      } else if (name === "branch") {
        // Handle branch checkboxes
        const branchValue = Number(value); // Convert value to number
        const selectedBranches = checked
          ? [...formData.branch, branchValue]
          : formData.branch.filter((item) => item !== branchValue);
        setFormData({ ...formData, branch: selectedBranches });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleImage(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleImage = (file) => {
    setLoadingImage(true);
    imageToBase64(file)
      .then((base64) => {
        setImage(base64); // Set the converted Base64 string as the image source
        setFormData((prevData) => ({
          ...prevData,
          coupon_design_image: base64, // Add Base64 image data to formData
        }));
      })
      .catch((error) => {
        console.error("Error converting image to Base64:", error);
        setImage(null); // Optionally clear the image if there was an error
      })
      .finally(() => {
        setLoadingImage(false);
      });
  };

  const removeImage = (event) => {
    event.stopPropagation();
    setImage(null); // Clear the image state
    setFormData((prevData) => ({
      ...prevData,
      coupon_design_image: null, // Clear image data from formData
    }));
  };

  const handleClick = () => {
    fileInputRef.current.click(); // Trigger the file input click
  };

  const handleSubmit = () => {
    handleAddCoupon(formData);
    setFormData({
      coupon_title: "",
      coupon_description: "",
      terms_conditions: "",
      amount_of_coupons: 0,
      promotion_type: "Standard",
      promotion_category: "1 for 1",
      coupon_category: "Food",
      start_date: "",
      end_date: "",
      type: "company_wide",
      branch: [],
      coupon_design_image: null,
      status: "draft",
    });
    setImage(null);
  };

  return isOpen ? (
    <div className="couponModalOverlay">
      <div className="modalContent">
        <div className="modalHeader">
          <h2>Add Coupon</h2>
          <button className="closeModalButton" onClick={closeModal}>
            <FontAwesomeIcon icon={faTimesCircle} />
          </button>
        </div>
        <div className="modalBody">
          <div className="container">
            <div className="left">
              {/* Form fields */}
              <div className="formGroup">
                <input
                  type="text"
                  name="coupon_title"
                  value={formData.coupon_title}
                  onChange={handleChange}
                  placeholder=""
                  required
                />
                <label htmlFor="coupon_title">Coupon Title</label>
              </div>
              <div className="formGroup">
                <input
                  type="number"
                  name="amount_of_coupons"
                  value={formData.amount_of_coupons}
                  onChange={handleChange}
                  placeholder=""
                  required
                />
                <label htmlFor="amount_of_coupons">Amount of Coupons</label>
              </div>
              <div className="formGroup">
                <label className="textAreaLabel" htmlFor="coupon_description">
                  Coupon Description
                </label>
                <textarea
                  name="coupon_description"
                  value={formData.coupon_description}
                  onChange={handleChange}
                  placeholder="Description of coupon"
                  required
                />
              </div>
              <div className="formGroup">
                <label className="textAreaLabel" htmlFor="terms_conditions">
                  Terms and Conditions
                </label>
                <textarea
                  name="terms_conditions"
                  value={formData.terms_conditions}
                  onChange={handleChange}
                  placeholder="Terms and Conditions of the coupon"
                  required
                />
              </div>
              <div className="formGroup">
                <label htmlFor="promotion_type">Promotion Type</label>
                <select
                  name="promotion_type"
                  value={formData.promotion_type}
                  onChange={handleChange}
                >
                  <option value="Standard">Standard</option>
                  <option value="Time-based">Time-based</option>
                  <option value="Quantity-based">Quantity-based</option>
                  <option value="Flash Deals">Flash Deals</option>
                </select>
              </div>
              <div className="formGroup">
                <label htmlFor="promotion_category">Promotion Category</label>
                <select
                  name="promotion_category"
                  value={formData.promotion_category} // This will now be a single value, not an array
                  onChange={handleChange}
                >
                  <option value="1 for 1">1 for 1</option>
                  <option value="20% off">20% off</option>
                  <option value="50% off">50% off</option>
                  <option value="Lunch special">Lunch special</option>
                  <option value="Dinner special">Dinner special</option>
                </select>
              </div>
            </div>
            <div className="middle">
              {/* Form fields */}
              <div className="formGroup">
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="start_date">Start Date</label>
              </div>
              <div className="formGroup">
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="end_date">End Date</label>
              </div>
              <div className="formGroup">
                <label htmlFor="coupon_category">Coupon Category</label>
                <select
                  name="coupon_category"
                  value={formData.coupon_category}
                  onChange={handleChange}
                >
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Clothes">Clothes</option>
                </select>
              </div>
              {branches && branches.length > 0 && (
  <div className="formGroup">
    <label htmlFor="type">Type</label>
    <select
      name="type"
      value={formData.type}
      onChange={handleChange}
    >
      <option value="company_wide">Company Wide</option>
      <option value="branch_specific">Branch Specific</option>
    </select>
  </div>
)}


              <div className="formGroup">
                <label htmlFor="status">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              {formData.type === "branch_specific" && (
                <div className="formGroup">
                  <label className="branchLabel" htmlFor="branch">
                    Branch
                  </label>
                  <div className="multiSelect">
                    {branches &&
                      branches.map((branch) => (
                        <div className="multi" key={branch.id}>
                          <input
                            type="checkbox"
                            name="branch"
                            value={branch.id}
                            checked={formData.branch.includes(branch.id)}
                            onChange={handleChange}
                          />
                          <span>{branch.branch_name}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
            <div className="right">
              <div className="formGroup">
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
                          className="RemoveBtn"
                          type="button"
                          onClick={removeImage}
                        >
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
                  name="coupon_design_image"
                  onChange={handleChange}
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                />
              </div>
              <button
                className="submitButton"
                type="button"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  "Add Coupon"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default AddSingleCouponModal;
