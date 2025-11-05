import React, { createContext, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage/ResetPasswordPage";
import OTPInputPage from "./pages/OTPInputPage/OTPInputPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import MainPage from "./pages/MainPage/MainPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import ImageToBase64 from "./pages/ImageConverter/ImageConverter";

export const ThemeContext = createContext(null);

const App = () => {
  const storedTheme = localStorage.getItem("theme") || "dark";
  const [theme, setTheme] = useState(storedTheme);
  const navigate = useNavigate();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      navigate("/admin");
    }

    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(
          userAgent
        );
      if (isMobile) {
        alert("This website is only accessible on a desktop. Please use a desktop computer.");
        navigate("/");
      }
    };

    checkDevice();
  }, [navigate]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="Theme" id={theme}>
        <Routes>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/imageconverter" element={<ImageToBase64 />} />
          <Route path="/OTPVerify" element={<OTPInputPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
          <Route path="/resetPassword" element={<ResetPasswordPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        <ToastContainer />
      </div>
    </ThemeContext.Provider>
  );
};

const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWrapper;
