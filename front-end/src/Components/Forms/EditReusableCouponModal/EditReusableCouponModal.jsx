import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./EditReusableCouponModal.scss";
import { imageToBase64 } from "../../../utils/Base64Encoder";

const EditReusableCouponModal = ({
  isOpen,
  closeModal,
  campaign, // Existing coupon details
  handleEditCoupon, 
  loading,
  branches,
  currentPage
}) => {

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const parseBranchStringToArray = (branchData) => {
    if (!branchData) return [];
    if (Array.isArray(branchData)) return branchData;
    // If branchData is a string like "1,2,3"
    return branchData
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((item) => !isNaN(item)); // Ensure all items are numbers
  };

  const [formData, setFormData] = useState({
    coupon_title: campaign?.coupon_title || "",
    coupon_description: campaign?.coupon_description || "",
    terms_conditions: campaign?.terms_conditions || "",
    reuse_limit: campaign?.reuse_limit || 0,
    promotion_type: campaign?.promotion_type || "Standard",
    promotion_category: campaign?.promotion_category || "1 for 1",
    coupon_category: campaign?.coupon_category || "Food",
    start_date: campaign?.start_date ? formatDateForInput(campaign.start_date) : "",
    end_date: campaign?.end_date ? formatDateForInput(campaign.end_date) : "",
    type: campaign?.type || "company_wide",
    branch: parseBranchStringToArray(campaign?.branch),
    coupon_design_image: campaign?.coupon_design_image || null,
    status: campaign?.status || "draft",
  });

  const [image, setImage] = useState(campaign?.coupon_design_image || null);
  const [loadingImage, setLoadingImage] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (campaign) {
      setFormData({
        coupon_title: campaign.coupon_title,
        coupon_description: campaign.coupon_description,
        terms_conditions: campaign.terms_conditions,
        reuse_limit: campaign.reuse_limit,
        promotion_type: campaign.promotion_type,
        promotion_category: campaign.promotion_category,
        coupon_category: campaign.coupon_category,
        start_date: campaign.start_date ? formatDateForInput(campaign.start_date) : "",
        end_date: campaign.end_date ? formatDateForInput(campaign.end_date) : "",
        type: campaign.type,
        branch: parseBranchStringToArray(campaign.branch),
        coupon_design_image: campaign.coupon_design_image,
        status: campaign.status,
      });
      setImage(campaign.coupon_design_image);
    }
  }, [campaign]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "file") {
      handleImage(e.target.files[0]);
    } else if (type === "checkbox") {
      const branchValue = Number(value);
      const selectedBranches = checked
        ? [...formData.branch, branchValue]
        : formData.branch.filter((item) => item !== branchValue);
      setFormData({ ...formData, branch: selectedBranches });
    } else if (name === "branch") {
        const branchValue = Number(value);
        const selectedBranches = checked
          ? [...formData.branch, branchValue]
          : formData.branch.filter((item) => item !== branchValue);
        setFormData({ ...formData, branch: selectedBranches });
      } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImage = (file) => {
    setLoadingImage(true);
    imageToBase64(file)
      .then((base64) => {
        setImage(base64);
        setFormData({ ...formData, coupon_design_image: base64 });
      })
      .catch((error) => {
        console.error("Error converting image to Base64:", error);
        setImage(null);
      })
      .finally(() => {
        setLoadingImage(false);
      });
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const removeImage = (event) => {
    event.stopPropagation();
    setImage(null);
    setFormData({ ...formData, coupon_design_image: null });
  };

  const handleSubmit = () => {
    handleEditCoupon(formData, campaign.campaign_id, currentPage);
  };

  return isOpen ? (
    <div className="couponModalOverlay">
      <div className="modalContent">
        <div className="modalHeader">
          <h2>Edit Reusable Coupon</h2>
          <button className="closeModalButton" onClick={closeModal}>
            <FontAwesomeIcon icon={faTimesCircle} />
          </button>
        </div>
        <div className="modalBody">
          <div className="container">
            <div className="left">
              <div className="formGroup">
                <input
                  type="text"
                  name="coupon_title"
                  value={formData.coupon_title}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="coupon_title">Coupon Title</label>
              </div>
              <div className="formGroup">
                <input
                  type="number"
                  name="reuse_limit"
                  value={formData.reuse_limit}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="reuse_limit">Reuse Limit</label>
              </div>
              <div className="formGroup">
                <label className="textAreaLabel" htmlFor="coupon_description">
                  Coupon Description
                </label>
                <textarea
                  name="coupon_description"
                  value={formData.coupon_description}
                  onChange={handleChange}
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
                  value={formData.promotion_category}
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
                            checked={
                              Array.isArray(formData.branch) &&
                              formData.branch.includes(branch.id)
                            }
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
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default EditReusableCouponModal;
