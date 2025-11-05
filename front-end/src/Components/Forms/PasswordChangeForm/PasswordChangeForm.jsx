import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faCheck, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast } from "../../Toast/Toast";
import "./PasswordChangeForm.scss"; 
import { ChangePasswordAPI } from "../../../services/APIs/UserAPI";


const PasswordChangeForm = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleCurrentPasswordVisibility = () => {
        setShowCurrentPassword(!showCurrentPassword);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        showLoadingToast("Resetting Password....");

        if (formData.newPassword === formData.confirmPassword) {
            const isConfirmed = window.confirm("Are you sure you want to change your password?");

            if (isConfirmed) {
                const PasswordChangePackage = {
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                    confirmPassword: formData.confirmPassword
                };
                try {
                    const response = await ChangePasswordAPI(PasswordChangePackage);
                    if (response.status === 200) {
                        showSuccessToast(response.message);
                        setTimeout(() => {
                            setFormData({
                                currentPassword: "",
                                newPassword: "",
                                confirmPassword: ""
                            });
                        }, 1500);
                    } else {
                        showErrorToast(response.message);
                        setTimeout(() => {
                            setFormData({
                                currentPassword: "",
                                newPassword: "",
                                confirmPassword: ""
                            });
                        }, 1500);
                    }
                } catch (error) {
                    console.error("Error occurred:", error);
                    showErrorToast("An error occurred while updating the password: " + error.message);
                } finally {
                    setLoading(false);
                  }
            } else {
                setLoading(false);
                setFormData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
            }
        } else {
            setLoading(false);
            showErrorToast("New password and confirm password do not match!"); // Inform user of mismatch
        } 
    };

    return (
        <form className="passwordChangeForm" onSubmit={handleSubmit}>
            {/* Current Password Input */}
            <div className="formGroup passwordGroup">
                <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    id="currentPassword"
                    required
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder=" "
                />
                <label htmlFor="currentPassword">Current Password</label>
                <button
                    type="button"
                    onClick={toggleCurrentPasswordVisibility}
                    className="togglePassword"
                >
                    <FontAwesomeIcon icon={showCurrentPassword ? faEyeSlash : faEye} />
                </button>
            </div>

            {/* New Password Input */}
            <div className="formGroup passwordGroup">
                <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    id="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    placeholder=" "
                />
                <label htmlFor="newPassword">New Password</label>
                <button
                    type="button"
                    onClick={toggleNewPasswordVisibility}
                    className="togglePassword"
                >
                    <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                </button>
            </div>

            {/* Confirm Password Input */}
            <div className="formGroup passwordGroup">
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder=" "
                />
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="togglePassword"
                >
                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>
            </div>
              <button type="submit" disabled={loading}>
        {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Change Password"}
      </button>
        </form>
    );
};

export default PasswordChangeForm;
