import React, { useState } from "react";
import "./TripPreferences.css"; // Import the unique CSS file for TripPreferences
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone";
import { useNavigate } from "react-router-dom";
function TripPreferences() {
  const [splitMethod, setSplitMethod] = useState("equal");
  const [categories, setCategories] = useState(['food', 'travel','accomodation']);
  const [currency, setCurrency] = useState("");
  const [notifications, setNotifications] = useState("enable");
  const [visibility, setVisibility] = useState("private");
  const navigate=useNavigate();
  // Add a new category
  const addCategory = (newCategory) => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
    }
  };

  // Remove a category
  const removeCategory = (category) => {
    setCategories(categories.filter((cat) => cat !== category));
  };

  return (
    <div className="trip-preferences-container">
      <div className="trip-pref-header">
        <h3>Trip Preferences</h3>
        <CloseTwoToneIcon className='mui_icon boxH' onClick={() => navigate('/Trips')} />
      </div>
      <div className="trip-pref-div">
        <div className="trip-preferences-details">
          {/* Expense Splitting */}
          <div className="trip-preferences-item">
            <label>Expense Splitting</label>
            <select
              value={splitMethod}
              onChange={(e) => setSplitMethod(e.target.value)}
            >
              <option value="equal">Equal</option>
              <option value="custom">Custom</option>
              <option value="percentage">Percentage</option>
            </select>
          </div>

          {/* Default Categories */}
          <div className="trip-preferences-item">
            <label>Default Categories</label>
            <ul>
              {categories.map((category, index) => (
                <li key={index}>
                  {category}
                  <button
                    onClick={() => removeCategory(category)}
                    style={{
                      marginLeft: "10px",
                      background: "#ff4d4f",
                      color: "#fff",
                      border: "none",
                      padding: "3px 6px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <input
              type="text"
              placeholder="Add a category"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addCategory(e.target.value);
                  e.target.value = "";
                }
              }}
            />
          </div>

          {/* Default Currency */}
          <div className="trip-preferences-item">
            <label>Default Currency</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="INR">INR - Indian Rupee</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              {/* Add more currencies as needed */}
            </select>
          </div>

          {/* Notifications */}
          <div className="trip-preferences-item">
            <label>Notifications</label>
            <select
              value={notifications}
              onChange={(e) => setNotifications(e.target.value)}
            >
              <option value="enable">Enable</option>
              <option value="disable">Disable</option>
            </select>
          </div>

          {/* Trip Visibility */}
          <div className="trip-preferences-item">
            <label>Trip Visibility</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          {/* Save Button */}
          <button className="trip-preferences-btn" type="button">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default TripPreferences;
