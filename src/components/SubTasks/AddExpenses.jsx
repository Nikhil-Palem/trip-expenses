import React, { useContext, useState } from 'react';
import './AddExpenses.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { RecoveryContext } from '../../App';
import axios from 'axios';
function AddExpenses() {
    const navigate = useNavigate();
    const location = useLocation();
    const { BackendUrl, User_Id, CurrentTripId,expenses, setExpenses } = useContext(RecoveryContext);
    const { trip, name } = location.state;
    
    const [newExpense, setNewExpense] = useState({
        desc: '',
        category: '',
        sharedBy: false,
        date: '',
        amount: '',
        name: name
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewExpense(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`${BackendUrl}/patchExpenses`, {
                newExpense: newExpense,
                trip_id: CurrentTripId,
                User_Id: User_Id,
                manage_id:trip.manage_id,
            });
            const updatedExpenses = [...expenses, newExpense];
            setExpenses(updatedExpenses);
            navigate(`/manage-trip/${trip.id}`, { state: { trip: { ...trip, expenses: updatedExpenses } } });
        } catch (err) {
            console.log("addexpenes catch err", err);
        }
    };

    return (
        <div className='add-expense-div'>
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <textarea
                        name="desc"
                        maxLength={300}
                        rows={5}
                        value={newExpense.desc}
                        onChange={handleChange}
                        placeholder='Write something about Expense (optional)'
                    ></textarea>
                    <label className='label'>Description</label>
                </div>
                <div className="input-container">
                    <select name="category" value={newExpense.category} onChange={handleChange} required>
                        <option value="" disabled>Select the Category</option>
                        <option value="Food">Food</option>
                        <option value="Accommodation">Accommodation</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Transport">Transport</option>
                        <option value="Others">Others</option>
                    </select>
                    <label>Category</label>
                </div>
                <div className="input-container-check">
                    <p>Expense Shared By All</p>
                    <input type="checkbox" name="sharedBy" checked={newExpense.sharedBy} onChange={handleChange} />
                </div>
                <div className="input-container">
                    <input type="date" name="date" value={newExpense.date} onChange={handleChange} required />
                    <label>Date</label>
                </div>
                <hr />
                <div className='input-container-exp'>
                    <p>Expense By : </p>
                    <span>{name}</span>
                </div>
                <div className="input-container">
                    <input type="number" name="amount" value={newExpense.amount} onChange={handleChange} placeholder='Enter Amount' required />
                    <label>Amount</label>
                </div>
                <div className="expense-btns">
                    <button type='submit' className='btn-DM'>Submit</button>
                    <button type='button' className='btn-DM' onClick={(e) => { e.preventDefault(); navigate(-1); }}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default AddExpenses;