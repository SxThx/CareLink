import React, { useState, useEffect } from "react";
import "./ReusableCoupons.scss";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import {
  getReusableCampaignDetailsAPI,
  publishCampaignAPI,
  addReusableAPI,
  deleteCampaignAPI,
  updateCouponReusableAPI,
  rerunCampaignAPI,
} from "../../../../services/APIs/CouponAPI";
import {
  showSuccessToast,
  showErrorToast,
  showLoadingToast,
} from "../../../Toast/Toast";
import AddReusableCouponModal from "../../../Forms/AddReusableCouponForm/AddReusableCouponModal";
import EditReusableCouponModal from "../../../Forms/EditReusableCouponModal/EditReusableCouponModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faL } from "@fortawesome/free-solid-svg-icons";
import constants from "../../../../utils/constants.json";

Chart.register(ArcElement, Tooltip, Legend);

const ReusableCoupons = ({ branches }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Stat
  const [reusableCampaigns, setReusableCampaigns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const limit = 5; // Number of campaigns per page

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenEditModal = (campaign) => {
    setSelectedCampaign(campaign);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedCampaign(null);
    setIsEditModalOpen(false);
  };

  const fetchReusableCampaignDetails = async (page, limit) => {
    setLoading(true);
    showLoadingToast("Fetching Reusable Campaigns...");
    try {
      const response = await getReusableCampaignDetailsAPI(page, limit);
      console.log("reusable:", response);
      if (response.status === 200) {
        showSuccessToast(response.message);
        setReusableCampaigns(response.data.campaigns);
        setTotalPages(response.data.totalPages);
      } else {
        showErrorToast(response.message);
      }
    } catch (error) {
      console.error("Error fetching reusable campaign details:", error);
      showErrorToast("Failed to fetch reusable campaigns.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReusableCampaignDetails(currentPage, limit);
  }, [currentPage]);

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
        const response = await addReusableAPI(finalFormData);
        console.log("formData:", finalFormData);
        if (response.status === 200) {
          showSuccessToast(response.message, 5000);
          setLoading(false);
          setTimeout(() => {
            handleCloseModal();
            fetchReusableCampaignDetails(currentPage, limit);
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
        console.log("campaignID", typeof campaignId);
        console.log(response);
        if (response.status === 200) {
          showSuccessToast(response.message, 2000);
          setTimeout(() => {
            fetchReusableCampaignDetails(currentPage, limit);
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
    if (campaign.download_count > 0) {
      showErrorToast(
        "The coupon has been downloaded thus changes are no longer possible",
        5000
      );
    } else {
      handleOpenEditModal(campaign); // Open the edit modal
    }
  };

  const handleEditCoupon = async (formData, campaignId, currentPage) => {
    // Handle the update of the coupon here (API call)
    console.log("Edited Form Data: ", formData, campaignId, currentPage);
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
        showLoadingToast("Editing Coupon....");
        try {
          const response = await updateCouponReusableAPI(formData, campaignId);
          if (response.status === 200) {
            showSuccessToast(response.message);
            handleCloseEditModal();
            fetchReusableCampaignDetails(currentPage, limit);
          } else {
            showErrorToast(response.message);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const handleRerun = async (campaignId, currentPage) => {
    console.log(`Editing campaign with ID: ${campaignId}`);
    const confirm = window.confirm(
      `Are you sure you want to launch this campaign? ${10} points will be deducted from your balance!`
    );
    if (confirm) {
      try {
        setLoading(true);
        showLoadingToast("Rerunning Coupon...");
        const response = await rerunCampaignAPI(campaignId);
        if (response.status === 200) {
          showSuccessToast(response.message, 5000);
          setTimeout(() => {
            fetchReusableCampaignDetails(currentPage, limit);
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
  const handleDelete = async (campaignId, download_count, currentPage) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this campaign?"
    );
    if (confirm) {
      if (download_count > 0) {
        showErrorToast(
          "The coupon has been downloaded thus changes are no longer possible",
          5000
        );
      } else {
        try {
          setLoading(true);
          showLoadingToast("Deleting Campaign...");
          const response = await deleteCampaignAPI(campaignId);
          console.log("delete Response", response, `campaignID:${campaignId}`);
          if (response.status === 200) {
            showSuccessToast(response.message);
            setTimeout(() => {
              fetchReusableCampaignDetails(currentPage, limit);
            }, 5000);
          } else {
            showErrorToast(response.message);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
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
    return reusableCampaigns.map((campaign) => (
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
        <td>{campaign.reuse_limit}</td>
        <td>{campaign.reuse_count}</td>
        {/* <td>{campaign.downloadedCoupons}</td>
        <td>{campaign.expiredCoupons}</td>
        <td>{campaign.redeemedCoupons}</td> */}
        <td>{campaign.download_count > 0 ? "Downloaded" : "Unused"}</td>
        <td>
          {campaign.type === "company_wide"
            ? "All Branches"
            : formatBranchString(campaign.branch) || "Specific Branch"}
        </td>
        <td>
          {campaign.expiredCoupons > 0
            ? "Expired"
            : formatBranchStatus(campaign.status)}
        </td>
        <td>
          {campaign.status === "draft" && (
            <button
              className="publishBtn"
              onClick={() => handlePublish(campaign.campaign_id, currentPage)}
            >
              Publish
            </button>
          )}
          {campaign.expiredCoupons > 0 && (
            <button
              className="publishBtn"
              onClick={() => handleRerun(campaign.campaign_id, currentPage)}
            >
              Rerun
            </button>
          )}
          {campaign.expiredCoupons <= 0 && (
            <>
              <button className="editBtn" onClick={() => handleEdit(campaign)}>
                Edit
              </button>
              <button
                className="deleteBtn"
                onClick={() =>
                  handleDelete(
                    campaign.campaign_id,
                    campaign.download_count,
                    currentPage
                  )
                }
              >
                Delete
              </button>
            </>
          )}
        </td>
      </tr>
    ));
  };

  return (
    <div className="ReusableCoupons">
      {/* Render Pie Charts above the table */}
      {/* <div className="chartsContainer">
        {reusableCampaigns.map((campaign) => renderPieChart(campaign))}
      </div> */}
      <AddReusableCouponModal
        isOpen={isModalOpen}
        closeModal={handleCloseModal}
        handleAddCoupon={handleAddCoupon}
        loading={loading}
        branches={branches}
      />

      <EditReusableCouponModal
        isOpen={isEditModalOpen}
        closeModal={handleCloseEditModal}
        campaign={selectedCampaign}
        handleEditCoupon={handleEditCoupon}
        loading={loading}
        branches={branches}
        currentPage={currentPage}
      />

      <div className="tableContainer">
        <h1>Reusable Coupons</h1>
        <p>Coupons that can be reused</p>
        <button className="addCouponButton" onClick={handleOpenModal}>
          <FontAwesomeIcon icon={faCirclePlus} /> Add New Reusable Coupon
        </button>
        <table className="campaignTable">
          <thead>
            <tr>
              <th>Coupon</th>
              <th>Title</th>
              <th>Category</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Reuse Limit</th>
              <th>Redeem Count</th>
              <th>Downloaded</th>
              {/* <th>Expired</th>
              <th>Redeemed</th> */}
              <th>Usable at</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11">
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
            ) : reusableCampaigns.length > 0 ? (
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

export default ReusableCoupons;
