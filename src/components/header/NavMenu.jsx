import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import HomeTwoToneIcon from "@mui/icons-material/HomeTwoTone";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import ContactPhoneTwoToneIcon from "@mui/icons-material/ContactPhoneTwoTone";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationTwoToneIcon from "@mui/icons-material/AppRegistrationTwoTone";
import './NavMenu.css';

const NavMenu = ({ ULine, handledropDown, isMobile }) => {
  const loc=useLocation();
  const navigate=useNavigate();
  const handlesmoothScroll=(section)=>{
    if(loc.pathname==='/'){
      console.log(loc.pathname);
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
    }else{
      navigate('/');
      setTimeout(() => {
        document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  };

  return (
    <div className="info">
      <NavLink
        to="#home"
        className={`common ${ULine === "home" ? "uline" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          handledropDown("home");
          handlesmoothScroll("Home");
        }}
      >
        {isMobile ? (
          <>
            <HomeTwoToneIcon /> Home
          </>
        ) : (
          "Home"
        )}
      </NavLink>
      <NavLink
        to="#About"
        className={`common ${ULine === "about" ? "uline" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          handledropDown("about");
          handlesmoothScroll("About");
        }}
      >
        {isMobile ? (
          <>
            <InfoTwoToneIcon /> About Us
          </>
        ) : (
          "About Us"
        )}
      </NavLink>
      <NavLink
        to="#Contact"
        className={`common ${ULine === "contact" ? "uline" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          handledropDown("contact");
          handlesmoothScroll("Contact");
        }}
      >
        {isMobile ? (
          <>
            <ContactPhoneTwoToneIcon /> Contact
          </>
        ) : (
          "Contact"
        )}
      </NavLink>
      <NavLink
        to="/Signin"
        className={`common ${ULine === "signin" ? "uline" : ""}`}
        onClick={(e) => handledropDown("signin")}
      >
        {isMobile ? (
          <>
            <LoginIcon /> Sign in
          </>
        ) : (
          "Signin"
        )}
      </NavLink>
      <NavLink
        to="/Signup"
        className={`common ${ULine === "signup" ? "uline" : ""}`}
        onClick={() => handledropDown("signup")}
      >
        {isMobile ? (
          <>
            <AppRegistrationTwoToneIcon /> Register
          </>
        ) : (
          "Register"
        )}
      </NavLink>
    </div>
  );
};

export default NavMenu;
