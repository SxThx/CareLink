import React, { useState, useEffect } from "react";
import "./SingleCoupons.scss";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import AddSingleCouponModal from "../../../Forms/AddSingleCouponForm/AddSingleCouponModal";
import EditSingleCouponModal from "../../../Forms/EditSingleCouponModal/EditSingleCouponModal";
import {
  getAllCampaignDetailsAPI,
  publishCampaignAPI,
  deleteCampaignAPI,
  updateCouponSingleAPI,
  rerunCampaignAPI,
} from "../../../../services/APIs/CouponAPI";
import {
  showSuccessToast,
  showErrorToast,
  showLoadingToast,
} from "../../../Toast/Toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { addSingleAPI } from "../../../../services/APIs/CouponAPI";
import { format } from "path";
import constants from "../../../../utils/constants.json";

Chart.register(ArcElement, Tooltip, Legend); // Register the necessary chart components

const SingleCoupons = ({ branches }) => {
  console.log(branches, "branches from single coupons");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [singleCampaigns, setSingleCampaigns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; // Number of campaigns per page
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddCoupon = async (formData) => {
    const confirm = window.confirm(
      `Are you sure you want to launch this campaign? ${10} points will be deducted from your balance!`
    );
    if (confirm) {
      console.log("Form Data Submitted: ", formData);
      setLoading(true);
      showLoadingToast("Adding Coupon.....");
      const finalFormData = { ...formData };
      if (finalFormData.type === "company_wide") {
        finalFormData.branch = null; // Remove branch from formData
      }
      try {
        const response = await addSingleAPI(finalFormData);
        console.log("formData:", finalFormData);
        if (response.status === 200) {
          showSuccessToast(response.message, 5000);
          setLoading(false);
          setTimeout(() => {
            handleCloseModal();
            fetchAllCampaignDetails(currentPage, limit);
          }, 5000);
        } else {
          showErrorToast(response.message);
          handleCloseModal();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchAllCampaignDetails = async (page, limit) => {
    setLoading(true);
    showLoadingToast("Fetching Campaigns...");
    try {
      const response = await getAllCampaignDetailsAPI(page, limit);
      console.log(response);
      if (response.status === 200) {
        showSuccessToast(response.message);
        setSingleCampaigns(response.data.campaigns);
        setTotalPages(response.data.totalPages);
      } else {
        showErrorToast(response.message);
      }
    } catch (error) {
      console.error("Error fetching campaign details:", error);
      showErrorToast("Failed to fetch campaigns.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCampaignDetails(currentPage, limit);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePublish = async (campaignId, currentPage) => {
    // console.log(campaignId, currentPage)
    const confirm = window.confirm(
      "Are you sure you want to publish this campaign?"
    );
    if (confirm) {
      setLoading(true);
      showLoadingToast("Publishing Campaign...");
      try {
        const new_status = "published";
        const response = await publishCampaignAPI(campaignId, new_status);
        console.log(response);
        if (response.status === 200) {
          showSuccessToast(response.message, 2000);
          setTimeout(() => {
            fetchAllCampaignDetails(currentPage, limit);
          }, 2000);
        } else {
          showErrorToast(response.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (campaign) => {
    if (campaign.amount_of_coupons === campaign.unusedCoupons) {
      console.log(campaign);
      setSelectedCampaign(campaign); // Store the selected campaign for
      console.log(selectedCampaign);
      setIsEditModalOpen(true); // Open the edit modal
    } else {
      showErrorToast(
        "You cannot edit this campaign because some coupons have already been downloaded or redeemed.",
        5000
      );
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false); // Close the edit modal
  };

  const handleEditCoupon = async (formData, campaignId, currentPage) => {
    console.log("Edited Form Data: ", formData, campaignId, currentPage);
    if (!formData.type) {
      formData.type = "company_wide";
    }

    if (formData.type === "branch_specific" && formData.branch.length <= 0) {
      showErrorToast(
        "Please select at least 1 branch if type is branch specific!",
        3000
      );
    } else {
      const confirm = window.confirm(
        "Are you sure you want to edit this campaign?"
      );
      if (confirm) {
        setLoading(true);
        showLoadingToast("Editing Coupon...");
        try {
          const response = await updateCouponSingleAPI(formData, campaignId);
          if (response.status === 200) {
            showSuccessToast(response.message);
            handleCloseEditModal(); // Close the modal after editing
            fetchAllCampaignDetails(currentPage, limit);
          } else {
            showErrorToast(response.message);
          }
        } catch (error) {
          console.error(error);
          showErrorToast("Failed to edit coupon.");
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const handleRerun = async (campaignId, currentPage) => {
    console.log(`Editing campaign with ID: ${campaignId}`);
    const confirm = window.confirm(
      `Are you sure you want to rerun this campaign? ${10} points will be deducted from your balance!`
    );
    if (confirm) {
      try {
        setLoading(true);
        showLoadingToast("Rerunning Coupon...");
        const response = await rerunCampaignAPI(campaignId);
        if (response.status === 200) {
          showSuccessToast(response.message, 5000);
          setTimeout(() => {
            fetchAllCampaignDetails(currentPage, limit);
          }, 5000);
        } else {
          showErrorToast(response.message);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (campaign, currentPage) => {
    console.log(`Deleting campaign with ID: ${campaign.campaign_id}`);
    const confirm = window.confirm(
      "Are you sure you want to delete this campaign?"
    );
    if (confirm) {
      if (campaign.amount_of_coupons === campaign.unusedCoupons) {
        try {
          setLoading(true);
          showLoadingToast("Deleting Campaign...");
          const response = await deleteCampaignAPI(campaign.campaign_id);
          if (response.status === 200) {
            showSuccessToast(response.message);
            fetchAllCampaignDetails(currentPage, limit);
          } else {
            showErrorToast(response.message);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else if (
        campaign.downloadedCoupons > 0 ||
        campaign.redeemedCoupons > 0 ||
        campaign.expiredCoupons > 0
      ) {
        showErrorToast(
          "You cannot delete this campaign because some coupons has already been downloaded or redeemed.",
          5000
        );
      }
    }
  };

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={currentPage === number ? "active" : ""}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </li>
        ))}
      </ul>
    );
  };

  const renderPieChart = (campaign) => {
    const data = {
      labels: ["Unused", "Downloaded", "Expired", "Redeemed"],
      datasets: [
        {
          label: "Coupons",
          data: [
            campaign.unusedCoupons,
            campaign.downloadedCoupons,
            campaign.expiredCoupons,
            campaign.redeemedCoupons,
          ],
          backgroundColor: [
            "#36A2EB", // Blue for Unused
            "#FFCE56", // Yellow for Downloaded
            "#FF6384", // Red for Expired
            "#4BC0C0", // Green for Redeemed
          ],
          hoverOffset: 4,
        },
      ],
    };

    return (
      <div className="chartWrapper" key={campaign.campaign_id}>
        <h4>{campaign.coupon_title}</h4>
        <Pie data={data} />
      </div>
    );
  };

  const formatBranchString = (branchString) => {
    // Check if the string contains colons (which indicates "ID:Name" format)
    if (branchString.includes(":")) {
      // Split the string by commas to separate each "ID:Name" pair
      const formatted = branchString
        .split(",")
        .map((part) => part.split(":")[1].trim()) // Get the name part after the colon
        .join(", "); // Join the names with a comma and space
      return formatted;
    }

    // If there are no colons, return the original string
    return branchString;
  };

  const formatBranchStatus = (branchString) => {
    if (!branchString) return "";
    return branchString.charAt(0).toUpperCase() + branchString.slice(1);
  };

  const renderTableRows = () => {
    return singleCampaigns.map((campaign) => (
      <tr key={campaign.campaign_id}>
        <td>
          {campaign.coupon_design_image ? (
            <img
              src={campaign.coupon_design_image}
              alt="Profile"
              style={{ width: "50px", height: "auto" }}
            />
          ) : (
            <div className="noImage">No Image</div>
          )}
        </td>
        <td>{campaign.coupon_title}</td>
        <td>{campaign.promotion_category}</td>
        <td>
          {campaign.start_date
            ? new Date(campaign.start_date).toLocaleDateString("en-GB")
            : "N/A"}
        </td>
        <td>
          {campaign.end_date
            ? new Date(campaign.end_date).toLocaleDateString("en-GB")
            : "N/A"}
        </td>
        <td>{campaign.amount_of_coupons}</td>
        <td>{campaign.unusedCoupons}</td>
        <td>{campaign.downloadedCoupons}</td>
        <td>{campaign.expiredCoupons}</td>
        <td>{campaign.redeemedCoupons}</td>
        <td>
          {campaign.type === "company_wide"
            ? "All Branches"
            : formatBranchString(campaign.branch) || "Specific Branch"}
        </td>
        <td>
          {campaign.amount_of_coupons === campaign.expiredCoupons
            ? "Expired"
            : formatBranchStatus(campaign.status)}
        </td>
        <td>
          {campaign.status === "draft" &&
            campaign.amount_of_coupons !== campaign.expiredCoupons && (
              <button
                className="publishBtn"
                onClick={() => handlePublish(campaign.campaign_id, currentPage)}
              >
                Publish
              </button>
            )}
          {campaign.amount_of_coupons !== campaign.expiredCoupons && (
            <>
              <button className="editBtn" onClick={() => handleEdit(campaign)}>
                Edit
              </button>
              <button
                className="deleteBtn"
                onClick={() => handleDelete(campaign, currentPage)}
              >
                Delete
              </button>
            </>
          )}
          {campaign.amount_of_coupons === campaign.expiredCoupons && (
            <button
              className="publishBtn"
              onClick={() => handleRerun(campaign.campaign_id, currentPage)}
            >
              Rerun
            </button>
          )}
        </td>
      </tr>
    ));
  };

  return (
    <div className="SingleCoupons">
      <AddSingleCouponModal
        isOpen={isModalOpen}
        closeModal={handleCloseModal}
        handleAddCoupon={handleAddCoupon}
        loading={loading}
        branches={branches}
      />

      <EditSingleCouponModal
        isOpen={isEditModalOpen} // Pass the state to control modal visibility
        closeModal={handleCloseEditModal} // Pass the close modal handler
        campaign={selectedCampaign} // Pass the selected campaign to edit
        handleEditCoupon={handleEditCoupon} // Pass the handler to process edited data
        loading={loading}
        branches={branches}
        currentPage={currentPage}
      />

      {/* Render Pie Charts above the table */}
      <div className="chartsContainer">
        {singleCampaigns.map((campaign) => renderPieChart(campaign))}
      </div>

      <div className="tableContainer">
        <h1>Normal Coupons</h1>
        <p>Normal single-use Coupons</p>
        <button className="addCouponButton" onClick={handleOpenModal}>
          <FontAwesomeIcon icon={faCirclePlus} /> Add New Coupon
        </button>
        <table className="campaignTable">
          <thead>
            <tr>
              <th>Coupon</th>
              <th>Title</th>
              <th>Category</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Total</th>
              <th>Unused</th>
              <th>Downloaded</th>
              <th>Expired</th>
              <th>Redeemed</th>
              <th>Usable at</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="13">
                  <div
                    className="skeleton-container"
                    data-testid="skeleton-loader"
                  >
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className="skeleton-row"></div>
                    ))}
                  </div>
                </td>
              </tr>
            ) : singleCampaigns.length > 0 ? (
              renderTableRows()
            ) : (
              <tr>
                <td colSpan="13">No campaigns available.</td>
              </tr>
            )}
          </tbody>
        </table>
        {renderPagination()}
      </div>
    </div>
  );
};

export default SingleCoupons;
