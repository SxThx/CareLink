import React, { useState, useEffect } from "react";
import Banner from "../../assets/Img/carelink_logo.png"
import Typewriter from "../../Components/Typewriter/Typewrite"


import "./MainPage.scss";


const MainPage = () => {

    const handleLoginBtn = () => {
        window.location ="/login"
    }

    
    const handleRegister = () => {
        window.location ="/register"
    }

  return (
    <div className="MainPage">
        <div className="Container">
        <div className="actions">
            <h1>
        <Typewriter
            staticPart="C"
            typewriterPart="areLink"
            typingSpeed={100}
            typingPause={500}
            eraseSpeed={50}
            erasePause={500}
          />
            </h1>
            {/* <h2>
                Merchant Portal
            </h2> */}
                <p>Connecting Care, Empowering Continuity.</p>
                <div className="buttons">
                    <button className="loginBtn" onClick={handleLoginBtn}>Login</button>
                    <button className="registerBtn" onClick={handleRegister}>Register</button>
                    {/* <button className="customerBtn">Go to Customer Portal</button> */}
                </div>
            </div>
            <div className="banner">
                <img src={Banner} alt="" srcset="" />
            </div>

        </div>
    </div>
  );
};

export default MainPage;
