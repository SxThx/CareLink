import React, { useState, useEffect } from 'react';
import ConsoleBar from '../../Components/ConsoleBar/ConsoleBar';
import CompanyUpdatePage from '../CompanyUpdatePage/CompanyUpdatePage';
import { getUserDataAPI } from '../../services/APIs/UserAPI';
import ThemeSwitch from '../../Components/ThemeSwitch/ThemeSwitch';
import "./AdminPage.scss";

const AdminPage = () => {
  const [loading, setLoading] = useState(true);
  const [hasNullFields, setHasNullFields] = useState(false);
  const [dataFetched, setDataFetched] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');

  const checkNullFields = (data) => {
    const fieldsToCheck = [
      'company_address',
      'company_contact_number',
      'company_description',
      'company_email',
    ];

    const nullOrEmptyFields = fieldsToCheck.filter((field) => !data[field] || data[field].trim() === '');
    const anyFieldIsNullOrEmpty = nullOrEmptyFields.length > 0;

    if (anyFieldIsNullOrEmpty) {
      console.log("Null or empty fields:", nullOrEmptyFields);
    }

    setHasNullFields(anyFieldIsNullOrEmpty);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const tokenExpiry = localStorage.getItem('tokenExpiry');
        const currentTime = new Date().getTime();

        // Redirect to login if token is invalid or expired
        if (!token || !tokenExpiry || currentTime > tokenExpiry) {
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiry');
          localStorage.removeItem('userData');
          localStorage.removeItem('mockLogin');
          window.location.href = '/';
          return; // Return here so no further logic runs
        }

        const isMockLoginActive = localStorage.getItem('mockLogin') === 'true';
        if (isMockLoginActive) {
          const storedUserData = localStorage.getItem('userData');
          if (storedUserData) {
            const data = JSON.parse(storedUserData);
            setUserRole(data.role);
            if (data.role !== 'super_admin') {
              checkNullFields(data);
            }
            setDataFetched(data);
            setApprovalStatus(data.approval_status);
            setUserEmail(data.email);
            return;
          } else {
            localStorage.removeItem('mockLogin');
          }
        }

        const response = await getUserDataAPI();
        console.log("userData", response);
        const data = response.data;

        setUserRole(data.role);

        // Check for null fields if the user is not a super_admin
        if (data.role !== 'super_admin') {
          checkNullFields(data); 
        }

        localStorage.setItem('userData', JSON.stringify(data));
        setDataFetched(data);
        setApprovalStatus(data.approval_status);
        setUserEmail(data.email);
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('mockLogin');
        window.location.href = '/login'; // Redirect to login on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const checkTokenExpiry = () => {
      const tokenExpiry = localStorage.getItem('tokenExpiry');
      const currentTime = new Date().getTime();

      if (!tokenExpiry || currentTime > tokenExpiry) {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        localStorage.removeItem('userData');
        localStorage.removeItem('mockLogin');
        window.location.href = '/login'; // Redirect if token expired
      }
    };

    const intervalId = setInterval(checkTokenExpiry, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // If user has null fields and is not super_admin, show the company update page
  if (hasNullFields && userRole !== 'super_admin') {
    return <CompanyUpdatePage />;
  }

  if (userRole !== 'super_admin') {
    if (approvalStatus === 'pending') {
      return (
        <div className='pending'>
          <div className="wrapper">
            <div className="container">
              <div className="titleContainer">
                <h1>Your Account is currently under review.</h1>
                <ThemeSwitch />
              </div>
              <p>Your account is currently under review and is pending. You will be notified via email at <strong>{userEmail}</strong> once your account is approved.</p>
            </div>
          </div>
        </div>
      );
    }

    if (approvalStatus === 'rejected') {
      return (
        <div className='rejected'>
          <div className="wrapper">
            <div className="container">
              <div className="titleContainer">
                <h1>Your Account is Rejected.</h1>
                <ThemeSwitch />
              </div>
              <p>Your account has been rejected. Please contact support for further assistance. You will be notified via email at {userEmail}.</p>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="empty-page">
      <ConsoleBar />
    </div>
  );
};

export default AdminPage;
