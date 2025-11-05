import React, { useContext } from "react";
import ReactSwitch from "react-switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { ThemeContext } from "../../App";


const ThemeSwitch = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <ReactSwitch
      onColor="#4d4d4d"
      offColor="#4d4d4d"
      onChange={toggleTheme}
      checked={theme === "light"}
      uncheckedIcon={
        <FontAwesomeIcon
          icon={faSun}
          color="#FFD700"
          style={{
            display: "flex",
            position: "relative",
            margin: "auto",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            height: "70%",
            padding: "4px 0 0 0",
          }}
        />
      }
      checkedIcon={
        <FontAwesomeIcon
          icon={faMoon}
          size="2x"
          color="#FFD700"
          style={{
            display: "flex",
            position: "relative",
            margin: "auto",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            height: "70%",
            padding: "4px 0 0 0",
          }}
        />
      }
    />
  );
};

export default ThemeSwitch;
