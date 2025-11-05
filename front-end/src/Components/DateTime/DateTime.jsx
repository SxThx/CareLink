import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faClock } from '@fortawesome/free-solid-svg-icons';
import "./DateTime.scss";

const DateTimeDisplay = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update the time every second

    return () => clearInterval(timer); // Clean up the interval on component unmount
  }, []);

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className='dateTime'>
      <p className='date'><FontAwesomeIcon icon={faCalendarDay} /> Current Date: {formatDate(currentDateTime)}</p>
      <p className='time'><FontAwesomeIcon icon={faClock} /> Current Time: {currentDateTime.toLocaleTimeString()}</p>
    </div>
  );
};

export default DateTimeDisplay;
