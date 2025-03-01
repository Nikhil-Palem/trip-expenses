import React from 'react';
import { NavLink } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedin, children }) => {
  return isLoggedin ? children : <NavLink to="/Signin" />;
};


export default ProtectedRoute;
