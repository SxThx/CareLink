import React, { useState, useEffect } from "react";
import { getCompanyMembersAPI, deleteCompanyMemberAPI } from "../../../services/APIs/UserAPI";
import { getCompanyBranchesAPI } from "../../../services/APIs/BranchAPI"; // Adjust the import path as needed
import AddCompanyMemberForm from "../../Forms/AddCompanyMemberForm/AddCompanyMemberForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import "./AdminManagement.scss";
import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast } from "../../Toast/Toast";


const AdminManagement = () => {
  const [members, setMembers] = useState([]);
  const [branches, setBranches] = useState([]); // Add state for branches
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const fetchCompanyMembers = async () => {
    setIsLoading(true);
    showLoadingToast("Fetching members.....")
    try {
      const response = await getCompanyMembersAPI();
      if (response.status === 200) {
        showSuccessToast(response.message)
        setMembers(response.data);
      } else {
        showErrorToast(response.message)
      }
    } catch (error) {
      console.error("Error fetching company members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompanyBranches = async () => {
    try {
      const response = await getCompanyBranchesAPI();
      console.log("Branches data:", response.data); // Log the branches data
      setBranches(response.data);
    } catch (error) {
      console.error("Error fetching company branches:", error);
    }
  };

  useEffect(() => {
    fetchCompanyMembers();
    fetchCompanyBranches(); // Fetch branches on component mount
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        const response = await deleteCompanyMemberAPI({ userId });
        if (response.status === 200) {
          showSuccessToast(response.message);
          setMembers((prevMembers) => prevMembers.filter((member) => member.id !== userId));
        } else {
          console.error("Error deleting member:", response.message);
          showErrorToast(response.message);
        }
      } catch (error) {
        console.error("Error deleting member:", error);
      }
    }
  };

  const indexOfFirstMember = (currentPage - 1) * rowsPerPage;
  const indexOfLastMember = indexOfFirstMember + rowsPerPage;
  const currentMembers = members.slice(indexOfFirstMember, indexOfLastMember);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(members.length / rowsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="adminManagement">
      <h2>Company Members</h2>
      <p>Manage your company members.</p>
      <button className="addMemberBtn" onClick={openModal}>
        <FontAwesomeIcon icon={faPlusCircle} /> Add Member
      </button>
      {isModalOpen && <AddCompanyMemberForm closeModal={closeModal} fetchCompanyMembers={fetchCompanyMembers} branches={branches} />}

      <table className="memberTable">
        <thead>
          <tr>
            <th>Profile Image</th>
            <th>Username</th>
            <th>Full Name</th>
            <th>Designation</th>
            <th>Email</th>
            <th>Branch</th>
    
            <th>Approval Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="9">
                <div className="skeleton-container" data-testid="skeleton-loader">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="skeleton-row"></div>
                  ))}
                </div>
              </td>
            </tr>
          ) : (
            currentMembers.map((member) => (
              <tr key={member.id}>
                <td>
                  {member.profile_image ? (
                    <img
                      src={member.profile_image}
                      alt="Profile"
                      style={{ width: "50px", height: "auto" }}
                    />
                  ) : (
                    <div className="noImage">No Image</div>
                  )}
                </td>
                <td>{member.username}</td>
                <td>{member.full_name}</td>
                <td>{member.designation}</td>
                <td>{member.email}</td>
                <td>{member.branch_name ? (member.branch_name) :( <>Company wide</>)}</td>
    
                <td>{member.approval_status}</td>
                <td>
                  {member.role !== "company_admin" && (
                    <button className="deleteBtn" onClick={() => handleDelete(member.id)}>
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <ul className="pageNumbers">
        {pageNumbers.map((number) => (
          <li
            key={number}
            id={number}
            onClick={() => setCurrentPage(number)}
            className={currentPage === number ? "current" : ""}
          >
            {number}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminManagement;
