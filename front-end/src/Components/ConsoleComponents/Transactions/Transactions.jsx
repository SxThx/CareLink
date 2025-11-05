import React, { useState, useEffect } from "react";
import { getTransactionsAPI } from "../../../services/APIs/TransactionAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import "./Transactions.scss";
import { getUserDataAPI } from "../../../services/APIs/UserAPI";
import { showLoadingToast, showSuccessToast, showErrorToast, showErrorToastWithoutDismiss, showLoadingToastWithoutDismiss, showSuccessToastWithoutDismiss, dismissToast, dismissToastById } from "../../Toast/Toast";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isPointsLoading, setIsPointsLoading] = useState(true);
  const [isRecordssLoading, setIsRecordsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({}); 
  

  const rowsPerPage = 5;

  const fetchTransactions = async (page) => {
    setIsRecordsLoading(true);
    const tRecordsLoadingToast = showLoadingToastWithoutDismiss("Fetching transaction records....")
    try {
      const response = await getTransactionsAPI(page, rowsPerPage);
      if (response.status === 200) {
        dismissToastById(tRecordsLoadingToast)
        showSuccessToastWithoutDismiss(response.message)
        setTransactions(response.data.transactions);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
      } else {
        showErrorToastWithoutDismiss("Failed to fetch transactions:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsRecordsLoading(false);
    }
  };

  const fetchPoints = async () => {
    setIsPointsLoading(true);
    const pointsLoadingToast = showLoadingToastWithoutDismiss("Fetching points....")
    try {
      const response = await getUserDataAPI();
      if (response.status === 200) {
        dismissToastById(pointsLoadingToast)
        showSuccessToastWithoutDismiss("Points retrieved successfully!")
        setUserInfo(response.data)
      } else {
        showErrorToastWithoutDismiss("Something went wrong!")
      }
    } catch (error) {
      console.error(response.message)
    }finally{
      setIsPointsLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchPoints();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const formatDate = (date) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  };

  const formatTime = (date) => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    const time = new Intl.DateTimeFormat('en-GB', options).format(date);
    return time.replace('am', 'AM').replace('pm', 'PM');
  };

  function formatPoints(number) {
    return number.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  
  

  return (
    <div className="Transactions">
      <div className="Container">
      <div className="GridItem PointsItem">
          <h2>Points</h2>
          <p className="GridItemDescription">
            Points your company currently has.
          </p>
          <div className="GridContentContainer">
            <h1 className="points">
            {userInfo.points ? formatPoints(userInfo.points) : "0.00"} Points
            </h1>
          </div>
        </div>
        <div className="GridItem TransactionHistory">
          <h2>Points Transactions</h2>
          <p className="GridItemDescription">
            A summary of points Transactions.
          </p>
          <div className="GridContentContainer">
            {isRecordssLoading ? (
              <div className="LoadingContainer">
                <FontAwesomeIcon icon={faSpinner} spin />
              </div>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.id} className="TransactionCard">
                  <div className="dateAndTime">
                  <p>
                    {formatDate(transaction.date)}
                  </p>
                  <p>
                    {formatTime(transaction.date)}
                  </p>

                  </div>
                  <p>
                    {transaction.reference}
                  </p>
                  <p className="purpose">
                    {transaction.purpose}
                  </p>
                  <h1>
                    {transaction.transaction_type === "addition" ? (
                      <div className="plus">+{transaction.points}</div>
                    ) : (
                      <div className="minus">-{transaction.points}</div>
                    )}
                  </h1>
                </div>
              ))
            )}
          </div>
          <ul className="pageNumbers">
            {pageNumbers.map((number) => (
              <li
                key={number}
                id={number}
                onClick={() => handlePageChange(number)}
                className={currentPage === number ? "current" : ""}
              >
                {number}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
