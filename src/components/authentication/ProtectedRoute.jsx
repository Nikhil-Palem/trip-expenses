import React from 'react';
import { NavLink } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedin, children }) => {
  return isLoggedin ? children : <NavLink to="/Signin" />;
};
//here the children prop is implicitly handled by the react the children
//  prop what ever is inbw the open and close tag in app.jsx
export default ProtectedRoute;
