import React, { useState } from 'react';
import './AccountManagement.css';
import KeyboardArrowRightSharpIcon from '@mui/icons-material/KeyboardArrowRightSharp';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import { useNavigate } from 'react-router-dom';
function AccountManagement() {
  const [Show, setShow] = useState('');
  const [subscriptionPlan, setSubscriptionPlan] = useState('Free Plan');
  const navigate=useNavigate();
  // const handleDeactivateAccount = () => {
  //   alert('Your account has been deactivated temporarily.');
  //   // Add logic to handle account deactivation
  // };

  // const handleDeleteAccount = () => {
  //   if (window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
  //     alert('Your account has been deleted.');
  //     // Add logic to handle account deletion
  //   }
  // };

  const handleSubscriptionChange = (event) => {
    setSubscriptionPlan(event.target.value);
    alert(`Subscription changed to ${event.target.value}`);
    // Add logic to update the subscription on the backend
  };

  return (
    <div className="account-settings-container">
      <div className="acc-settings-header">
        <h3>Account Settings</h3>
        <CloseTwoToneIcon className='mui_icon boxH' onClick={() => navigate('/Trips')} />
      </div>
      <div className="account-settings-details">
        <div className="account-settings-item">
          <h4>Account Actions</h4>
          <div className='boxH' onClick={() => setShow('DorD')}>
            <span> Deactivation or Deletion<KeyboardArrowRightSharpIcon /></span>
            <p>Temporarily deactivate or permanently delete your accounts and profiles</p>
          </div>
        </div>
        <div className="account-settings-item">
          <h4>Subscription Details</h4>
          <label htmlFor="subscriptionPlan">Manage Subscription Plan:</label>
          <select
            id="subscriptionPlan"
            value={subscriptionPlan}
            onChange={handleSubscriptionChange}
            className="subscription-select"
          >
            <option value="Free Plan">Free Plan</option>
            <option value="Basic Plan">Basic Plan - $5/month</option>
            <option value="Premium Plan">Premium Plan - $10/month</option>
          </select>
        </div>
      </div>

      {Show == 'DorD' && (
        <div className="overlay">
          <div className="account-actions small-Boxes">
            <CloseTwoToneIcon className='mui_icon boxH' onClick={() => setShow('')} />
            <h3>Deactivating or deleting your Instagram account</h3>
            <p>If you want to take a break from Instagram, you can temporarily deactivate this account. If you want to permanently delete your account, let us know. You can only deactivate your account once a week.</p>
            <div className="deac-del-acc">
              <div className="deac-del-acc-innbox boxH">
                <div>
                  <h4>Deactivate account</h4>
                  <span>Deactivating your account is temporary, and it means your profile will be hidden on Instagram until you reactivate it through Accounts Center or by logging in to your Instagram account.</span>
                </div>
                <input type="radio" name="del-deac" id="" />
              </div>
              <div className="deac-del-acc-innbox boxH">
                <div>
                  <h4>Delete account</h4>
                  <span>Deleting your account is permanent. When you delete your Instagram account, your profile, photos, videos, comments, likes and followers will be permanently removed. If you’d just like to take a break, you can temporarily deactivate your account.</span>
                </div>
                <input type="radio" name="del-deac" id="" />
              </div>
            </div>
            <div className="btns">
              <button className='cancel_btn boxH boxTC' type="submit" onClick={() => setShow('')}>Cancel</button>
              <button className='cont_btn' type="submit">Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountManagement;
