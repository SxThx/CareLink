import React, { useState, useRef, useEffect } from "react";
import { imageToBase64 } from "../../../utils/Base64Encoder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import ThemeSwitch from "../../ThemeSwitch/ThemeSwitch";
import { updateCompanyAPI } from "../../../services/APIs/CompanyAPI";
import {
  showSuccessToast,
  showErrorToast,
  showLoadingToast,
  dismissToast,
} from "../../Toast/Toast"; 
import "./CompanyUpdateForm.scss";

const CompanyUpdateForm = () => {

  const [loading, setLoading] = useState(false);
  const [haveBranches, setHaveBranches] = useState("no");
  const [numberOfBranches, setNumberOfBranches] = useState(0);
  const [branches, setBranches] = useState([]);
  const [company, setCompany] = useState({
    company_name: "",
    company_address: "",
    company_contact_number: "",
    company_email: "",
    company_description: "",
    company_logo: "",
    business_registration_number: "",
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setCompany({
        company_name: userData.company_name,
        business_registration_number: userData.business_registration_number,
        company_address: userData.company_address || "",
        company_contact_number: userData.company_contact_number || "",
        company_email: userData.company_email || "",
        company_description: userData.company_description || "",
        company_logo: userData.company_logo || "",
      });
    }
  }, []);

  const handleImageConversion = async (file) => {
    try {
      const base64 = await imageToBase64(file);
      setCompany({ ...company, company_logo: base64 });
      dismissToast();
    } catch (error) {
      console.error("Error converting image to Base64:", error);
      showErrorToast(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompany({ ...company, [name]: value });
  };

  const handleHaveBranchesChange = (e) => {
    const value = e.target.value;
    setHaveBranches(value);
    if (value === "no") {
      setNumberOfBranches(0);
      setBranches([]);
    }
  };

  const handleNumberOfBranchesChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setNumberOfBranches(value);
    setBranches(
      Array.from({ length: value }, (_, index) => ({
        branch_name: "",
        branch_address: "",
      }))
    );
  };

  const handleBranchChange = (index, e) => {
    const { name, value } = e.target;
    const newBranches = [...branches];
    newBranches[index][name] = value;
    setBranches(newBranches);
  };

  const updateCompany = async (e) => {
    e.preventDefault();
    setLoading(true);
    showLoadingToast("Loading.....")

    // Check if any field is empty
    if (
      !company.company_name ||
      !company.company_address ||
      !company.company_contact_number ||
      !company.company_email ||
      !company.company_description ||
      !company.business_registration_number
    ) {
      showErrorToast("All fields are required!");
      setLoading(false);
      return;
    }

    if (haveBranches === "yes" && numberOfBranches > 0) {
      for (let i = 0; i < numberOfBranches; i++) {
        if (!branches[i].branch_name || !branches[i].branch_address) {
          showErrorToast(`Branch ${i + 1} name and address are required!`);
          setLoading(false);
          return;
        }
      }
    }

    try {
      const dataToUpdate = {
        ...company,
        have_branches: haveBranches === "yes" ? 1 : 0,
      };
      if (haveBranches === "yes") {
        dataToUpdate.branches = branches;
      }

      console.log("package", dataToUpdate)
      const response = await updateCompanyAPI(dataToUpdate);
      if (response.status === 200) {
        showSuccessToast(response.message);
        setTimeout(() => {
          location.reload();
        }, 1500);
      } else {
        showErrorToast(response.message);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      showErrorToast(
        "An error occurred while updating the company: " + error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    await handleImageConversion(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    await handleImageConversion(file);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <form className="companyUpdateForm" onSubmit={updateCompany}>
      <div className="titleContainer">
        <h1>Enter your Company info</h1>
        <ThemeSwitch />
      </div>

      <div className="grid">
        <div
          className={`DropArea ${company.company_logo ? "with-image" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleClick}
        >
          {company.company_logo ? (
            <img src={company.company_logo} alt="Preview" />
          ) : (
            <p>Click or Drag & Drop to Upload the Company Logo</p>
          )}
        </div>
        <input
          type="file"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        <div className="forms">
          <div className="formGroup">
            <input
              type="text"
              name="company_name"
              id="company_name"
              value={company.company_name}
              readOnly
              placeholder=" "
            />
            <label htmlFor="company_name">Company Name</label>
          </div>

          <div className="formGroup">
            <input
              type="text"
              name="business_registration_number"
              id="business_registration_number"
              value={company.business_registration_number}
              readOnly
              placeholder=" "
            />
            <label htmlFor="business_registration_number">
              Business Registration Number
            </label>
          </div>

          <div className="formGroup">
            <input
              type="text"
              name="company_address"
              id="company_address"
              value={company.company_address}
              onChange={handleInputChange}
              placeholder=" "
              required
            />
            <label htmlFor="company_address">Company Address</label>
          </div>

          <div className="formGroup">
            <input
              type="text"
              name="company_contact_number"
              id="company_contact_number"
              value={company.company_contact_number}
              onChange={handleInputChange}
              placeholder=" "
              required
            />
            <label htmlFor="company_contact_number">
              Company Contact Number
            </label>
          </div>

          <div className="formGroup">
            <input
              type="email"
              name="company_email"
              id="company_email"
              value={company.company_email}
              onChange={handleInputChange}
              placeholder=" "
              required
            />
            <label htmlFor="company_email">Company Email</label>
          </div>

          <div className="formGroup">
            <textarea
              name="company_description"
              id="company_description"
              value={company.company_description}
              onChange={handleInputChange}
              placeholder="Description "
              required
            />
          </div>

          <div className="formGroup haveBranches">
            <label htmlFor="have_branches">Have Branches?</label>
            <select
              name="have_branches"
              id="have_branches"
              value={haveBranches}
              onChange={handleHaveBranchesChange}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
        </div>
      </div>
        <div className="forms2">
          {haveBranches === "yes" && (
            <>
              <div className="formGroup">
                <input
                  type="number"
                  name="number_of_branches"
                  id="number_of_branches"
                  value={numberOfBranches}
                  onChange={handleNumberOfBranchesChange}
                  placeholder=" "
                  min="1"
                  required
                />
                <label htmlFor="number_of_branches">Number of Branches</label>
              </div>
              <div className="branches">
              {branches.map((branch, index) => (
                  <div key={index} className="branchForm">
                    <h3>Branch {index + 1}</h3>
                    <div className="formGroup">
                      <input
                        type="text"
                        name="branch_name"
                        id={`branch_name_${index}`}
                        value={branch.branch_name}
                        onChange={(e) => handleBranchChange(index, e)}
                        placeholder=" "
                        required
                      />
                      <label htmlFor={`branch_name_${index}`}>
                        Branch Name
                      </label>
                    </div>
                    <div className="formGroup">
                      <input
                        type="text"
                        name="branch_address"
                        id={`branch_address_${index}`}
                        value={branch.branch_address}
                        onChange={(e) => handleBranchChange(index, e)}
                        placeholder=" "
                        required
                      />
                      <label htmlFor={`branch_address_${index}`}>
                        Branch Address
                      </label>
                    </div>
                  </div>
              ))}
                </div>
            </>
          )}
        </div>

      <div className="formGroup">
        <button type="submit" disabled={loading}>
          {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default CompanyUpdateForm;
