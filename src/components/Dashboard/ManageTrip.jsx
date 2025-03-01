import React, { useState, useRef, useEffect, useContext } from 'react';
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
import axios from 'axios';
import { RecoveryContext } from '../../App';
import moment from 'moment';

function ManageTrip() {
  const location = useLocation();
  const { trip } = location.state || {};
  const [Trip, setTrip] = useState(trip);
  const { BackendUrl, CurrentTripId, User_Id, expenses, setExpenses } = useContext(RecoveryContext);
  const [showInput, setShowInput] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', imgUrl: '' });
  const [showMore, setshowMore] = useState('');
  const [iscompleted, setiscompleted] = useState(false);
  const [Date, setDate] = useState('');
  const formRef = useRef(null);
  const navigate = useNavigate();

  const handleAddMember = () => {
    setShowInput(!showInput);
  };

  const handleSaveMember = async (event) => {
    event.preventDefault();
    try {
      await axios.patch(`${BackendUrl}/patchMembers`, {
        newMember: newMember,
        trip_id: Trip.id,
        User_Id: User_Id,
        manage_id: Trip.manage_id,
      });
      fetchMembers();
      setNewMember({ name: '', imgUrl: '' });
      setShowInput(false);
    } catch (err) {
    }
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

  const handleshowMore = (section) => {
    setshowMore((prev) => (prev === section ? '' : section));
  };

  useEffect(() => {
    getIsCompletedandDate();
  }, [])

  //need to compltet the func here of fetching teh date ,iscomplted
  const getIsCompletedandDate = async () => {
    try {
      const resp = await axios.get(`${BackendUrl}/getDateComplete`, {
        params: {
          User_Id: User_Id,
          CurrentTripId: Trip.id,
          manage_id: Trip.manage_id,
        }
      });
      setiscompleted(resp.data.completed);
      const formattedDate = moment(resp.data.created_at).format("MMMM D, YYYY h:mm A");
      setDate(formattedDate);
      console.log(resp.data.completed)
    } catch (err) {
      console.log(err);
    }
  }

  const handleAddExpense = (name) => {
    navigate('/addexpense', { state: { trip: Trip, name: name } });

  };

  useEffect(() => {
    const fetchData = async () => {
      try {

        await Promise.all([fetchMembers(), fetchExpenses()]);
      } catch (err) {
        console.log("Error fetching data:", err);
      }
    };

    fetchData();
  }, [newMember, expenses]);


  const fetchMembers = async () => {
    try {
      const resp = await axios.get(`${BackendUrl}/getmembers`, {
        params: {
          User_Id: User_Id,
          CurrentTripId: Trip.id,
          manage_id: Trip.manage_id,
        }
      });
      setTrip(prevTrip => ({
        ...prevTrip,
        members: resp.data.success?.members || []
      }));

    } catch (err) {
      console.log("error fetcing the members", err);
    }
  }

  const fetchExpenses = async () => {
    try {
      const resp = await axios.get(`${BackendUrl}/getexpenses`, {
        params: {
          User_Id: User_Id,
          CurrentTripId: Trip.id,
          manage_id: Trip.manage_id,
        }
      });
      setTrip(prevTrip => ({
        ...prevTrip,
        expenses: resp.data.success?.expense || []
      }));
    } catch (err) {
      console.log("error fetching the expenses", err);
    }
  };

  const totalAmount = Trip.expenses ? Trip.expenses?.reduce((prevSum, curr) => prevSum + parseFloat(curr.amount), 0) : 0;

  const pieChartData = Trip.expenses ? Trip.expenses?.reduce((acc, expense) => {
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
      {Trip ? (
        <div className="manage-trip-container">
          <div className="image-sec">
            <img src={Trip.image} alt={Trip.name} />
            <div className="name-date-btn">
              <ArrowBackIcon className="back-icon" onClick={() => navigate('/MyTrips')} />
              <div className="name-date">
                <h2>{Trip.name}</h2>
                <p>{Date}</p>
              </div>
            </div>
          </div>
          <div className="members boxes">
            {!iscompleted && (<><div className="members-add">
              <h3>Members</h3>
              <button onClick={handleAddMember}><PersonAddOutlinedIcon /> Add Member</button>
            </div><form
              className={`add-member-form ${showInput ? 'open' : 'closed'}`}
              ref={formRef}
              onSubmit={handleSaveMember}
            >
                <input
                  type="text"
                  placeholder="Name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  required />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newMember.imgUrl}
                  onChange={(e) => setNewMember({ ...newMember, imgUrl: e.target.value })}
                  required />
                <button type='submit'>Save</button>
              </form></>)}
            <div className="members-list">
              {Trip.members.length > 0 ? Trip.members.map((member, index) => (
                <div key={index} className="member">
                  <div className="member-left">
                    <span className="member-serial">{index + 1}.</span>
                    <CustomAvatar imgUrl={member.imgUrl} name={member.name} height={50} width={50} />
                    <h4>{member.name}</h4>
                  </div>
                  {!iscompleted && <div className="member-right">
                    <span className='addIcon' onClick={() => handleAddExpense(member.name)}><AddIcon className='member-btns' /> <p className='add-expense-prompt'>Add Expense</p> </span>

                    <span className='delIcon'><DeleteIcon className='member-btns' /></span>

                  </div>}
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
            { }
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
                {Trip.expenses && Trip.expenses?.length > 0 ? (Trip.expenses?.map((expense, index) => {
                  return (
                    <div key={index} className='expense-item'>
                      <div className="top-line">
                        <h4>{expense.category}</h4>
                        <p>{parseFloat(expense.amount).toFixed(2)}</p>
                      </div>
                      <p>Date : {expense?.date}</p>
                      <p>Expense by : {expense?.name}</p>
                      <p>Shared By : {expense?.sharedBy ? 'All' : 'HimSelf'}</p>
                      <p>Description : {expense?.desc}</p>
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
                {Trip.expenses && Trip.expenses.length > 0 ? (
                  <div className="pie-chart-container">
                    { }
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
                  <p>{Trip.description}</p>
                </div>
                <div className="places">
                  <h4>Places To Visit</h4>
                  {Trip.nearby_places.map((place, index) => (
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