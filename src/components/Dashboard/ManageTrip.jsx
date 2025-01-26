import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ManageTrip.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import Avatar from '@mui/material/Avatar';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FunctionsIcon from '@mui/icons-material/Functions';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import AssignmentIcon from '@mui/icons-material/Assignment';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PieChartComponent from '../SubTasks/PieChartComponent';
import CustomAvatar from '../SubTasks/CustomAvatar';

function ManageTrip() {
  const location = useLocation();
  const { trip } = location.state || {};
  const [showInput, setShowInput] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', imgUrl: '' });
  const [showMore, setshowMore] = useState('');
  const formRef = useRef(null);
  const navigate = useNavigate();

  const handleAddMember = () => {
    setShowInput(!showInput);
  };

  const handleSaveMember = (event) => {
    event.preventDefault();
    trip.members = [...trip.members, newMember];
    setNewMember({ name: '', imgUrl: '' });
    setShowInput(false);
  };

  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target) && event.target.tagName !== 'BUTTON') {
      setShowInput(false);
    }
  };

  useEffect(() => {
    if (showInput) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInput]);

  const getRandomColor = () => {
    const colors = ['#FFB6C1', '#ADD8E6', '#90EE90', '#FFD700', '#FFA07A', '#20B2AA', '#87CEFA', '#778899'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleshowMore = (section) => {
    setshowMore((prev) => (prev === section ? '' : section));
  };

  const handleAddExpense = (name) => {
    console.log(name);
    navigate('/addexpense', { state: { trip: trip, name: name } });
  };

  const totalAmount = trip.expenses ? trip.expenses.reduce((prevSum, curr) => prevSum + parseFloat(curr.amount), 0) : 0;


  const pieChartData = trip.expenses ? trip.expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += parseFloat(expense.amount);
    return acc;
  }, {}) : {};

  const pieData = Object.keys(pieChartData).map(category => ({
    name: category,
    value: parseFloat(((pieChartData[category] / totalAmount) * 100).toFixed(2)),
    amount: parseFloat(pieChartData[category].toFixed(2)),
  }));

  return (
    <div className='manage-trip-div'>
      {trip ? (
        <div className="manage-trip-container">
          <div className="image-sec">
            <img src={trip.image} alt={trip.name} />
            <div className="name-date-btn">
              <ArrowBackIcon className="back-icon" onClick={() => navigate('/MyTrips')} />
              <div className="name-date">
                <h2>{trip.name}</h2>
                <p>12-05-2021</p>
              </div>
            </div>
          </div>
          <div className="members boxes">
            <div className="members-add">
              <h3>Members</h3>
              <button onClick={handleAddMember}><PersonAddOutlinedIcon /> Add Member</button>
            </div>
            <form
              className={`add-member-form ${showInput ? 'open' : 'closed'}`}
              ref={formRef}
              onSubmit={handleSaveMember}
            >
              <input
                type="text"
                placeholder="Name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Image URL"
                value={newMember.imgUrl}
                onChange={(e) => setNewMember({ ...newMember, imgUrl: e.target.value })}
                required
              />
              <button type='submit'>Save</button>
            </form>
            <div className="members-list">
              {trip.members.length > 0 ? trip.members.map((member, index) => (
                <div key={index} className="member">
                  <div className="member-left">
                    <span className="member-serial">{index + 1}.</span>
                    <CustomAvatar imgUrl={member.imgUrl} name={member.name} height={50} width={50} />
                    <h4>{member.name}</h4>
                  </div>
                  <div className="member-right">
                    <span className='addIcon' onClick={() => handleAddExpense(member.name)}><AddIcon className='member-btns' /> <p className='add-expense-prompt'>Add Expense</p> </span>

                    <span className='delIcon'><DeleteIcon className='member-btns' /></span>
                    {/* when user click on delete icon then delete the member from the list after confirming are you sure  prompting*/}
                  </div>
                </div>
              )) : <p>No members added yet.</p>}
            </div>
          </div>
          <div className="members-trip-details boxes">
            <div className="total">
              <div className="sym-heading" onClick={() => handleshowMore('total')}>
                <div className='total-show'>
                  <FunctionsIcon className='sum-icon' />
                  <div className="total-rep">
                    <h4>Total</h4>
                    <span>&#8377; {totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                <span className={showMore === 'total' ? 'rotate' : ''}>
                  {showMore === 'total' ? <KeyboardArrowUpIcon /> : <KeyboardArrowRightIcon />}
                </span>
              </div>
              <div className={`total-details ${showMore === 'total' ? 'open' : ''}`}>
                <h6>Today</h6>
                <p>500</p>
                <h6>Yesterday</h6>
                <p>1000</p>
              </div>
            </div>
            {/* in total we need to groupby as the same date and calc the sum of the day and show here from db */}
            <hr />
            <div className="expenseSummary">
              <div className="sym-heading" onClick={() => handleshowMore('expenseSummary')}>
                <h4><BusinessCenterIcon />Expense Summary</h4>
                <span className={showMore === 'expenseSummary' ? 'rotate' : ''}>
                  {showMore === 'expenseSummary' ? <KeyboardArrowUpIcon /> : <KeyboardArrowRightIcon />}
                </span>
              </div>
              <div className={`expense-details ${showMore === 'expenseSummary' ? 'open' : ''}`}>
                <div className="total-div">
                  <h4>Total</h4>
                  <p>&#8377; {totalAmount.toFixed(2)}</p>
                </div>
                {trip.expenses && trip.expenses.length > 0 ? (trip.expenses.map((expense, index) => {
                  return (
                    <div key={index} className='expense-item'>
                      <div className="top-line">
                        <h4>{expense.category}</h4>
                        <p>{parseFloat(expense.amount).toFixed(2)}</p>
                      </div>
                      <p>Date : {expense.date}</p>
                      <p>Expense by : {expense.name}</p>
                      <p>Shared By : {expense.sharedBy ? 'All' : 'HimSelf'}</p>
                      <p>Description : {expense.desc}</p>
                    </div>
                  )
                })) : <p>No expenses added yet.</p>}
              </div>
            </div>
            <hr />
            <div className="stats">
              <div className="sym-heading" onClick={() => handleshowMore('stats')}>
                <h4><QueryStatsIcon />Stats</h4>
                <span className={showMore === 'stats' ? 'rotate' : ''}>
                  {showMore === 'stats' ? <KeyboardArrowUpIcon /> : <KeyboardArrowRightIcon />}
                </span>
              </div>
              <div className={`pie-chart ${showMore === 'stats' ? 'open' : ''}`}>
                <h4>Expense Distribution</h4>
                {trip.expenses && trip.expenses.length > 0 ? (
                  <div className="pie-chart-container">
                    {/* <Pie className='pie-graph' data={pieChartData} /> */}
                    <PieChartComponent data={pieData} />
                  </div>
                ) : (
                  <p>No expenses added yet.</p>
                )}
              </div>
            </div>
            <hr />
            <div className="details">
              <div className="sym-heading" onClick={() => handleshowMore('details')}>
                <h4><AssignmentIcon />View Details</h4>
                <span className={showMore === 'details' ? 'rotate' : ''}>
                  {showMore === 'details' ? <KeyboardArrowUpIcon /> : <KeyboardArrowRightIcon />}
                </span>
              </div>
              <div className={`details_hidden_box ${showMore === 'details' ? 'open' : ''}`}>
                <div className="desc">
                  <h4>Description</h4>
                  <p>{trip.description}</p>
                </div>
                <div className="places">
                  <h4>Places To Visit</h4>
                  {trip.nearby_places.map((place, index) => (
                    <span key={index}>{place}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>No trip data available.</p>
      )}
    </div>
  );
}

export default ManageTrip;