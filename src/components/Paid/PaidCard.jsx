import React, { useState, useEffect } from 'react'
import './PaidCard.css'
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
// import { colors } from '@mui/material';

function PaidCard({ User_Id, user_name }) {
    const [Details, setDetails] = useState({
        id: uuidv4(), Payername: "", Itemname: "", Amountpaid: "", PaidDate: "",
    })
    const [PaidDetails, setPaidDetails] = useState([]);
    const [checkedItems, setcheckedItems] = useState([]);
    useEffect(() => {
        if (User_Id) {
            localStorage.setItem('User_Id', User_Id);
            fetchedDetails(User_Id);
        }
    }, [User_Id]);

    const fetchedDetails = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:3000/PaidPage/${userId}`);
            if (response.data.error) {
                console.log(response.data.error);
            } else {
                const formattedData = response.data.map(item => ({
                    id: item.item_id,
                    Payername: item.payername,
                    Itemname: item.itemname,
                    Amountpaid: item.amountpaid,
                    PaidDate: item.paiddate.split('T')[0],
                }))
                console.log(response.data);
                setPaidDetails(formattedData);
                setcheckedItems(formattedData.map(() => false));
            }
        } catch (err) {
            console.log("Error fetching paid details:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails({ ...Details, [name]: value });
    }
    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/PaidPage", {
                item_id: Details.id,
                user_id: User_Id,
                Payername: Details.Payername,
                Itemname: Details.Itemname,
                Amountpaid: Details.Amountpaid,
                PaidDate: Details.PaidDate,
            });
            if (response.data.error) {
                console.log(response.data.error);
            }
            else {
                console.log(response.data);
                setPaidDetails((prevVal) => [
                    ...prevVal, Details
                ]);
                setcheckedItems((preVal => [...preVal, false]));
                setDetails({ id: uuidv4(), Payername: "", Itemname: "", Amountpaid: "", PaidDate: "" });
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleCheckedItems = (index) => {
        setcheckedItems((preVal => {
            const newcheckedItems = [...preVal];
            newcheckedItems[index] = !newcheckedItems[index];
            return newcheckedItems;
        }));
    }
    const handleEdit = (index) => {
        const Details = PaidDetails[index];
        setDetails(Details);
        handleDelete(index);
    }
    const handleDelete = (index) => {
        setPaidDetails((preVal) => preVal.filter((_, i) => i !== index));
        setcheckedItems((preVal => preVal.filter((_, i) => i !== index)));
    }
    return (
        <div className='paidcard-div'>
            <div className="inputdata">
                <h1>welcome <span style={{ color: "#198754" }}> {user_name}!!</span></h1>
                <form action="" onSubmit={handleClick} className='paidcard-form'>
                    <div>
                        <label htmlFor="Payername">Payername </label>
                        <input type="text" name='Payername' value={Details.Payername} placeholder='Enter the payername' onChange={handleChange} required />
                    </div>
                    <div>
                        <label htmlFor="Item Name">Item Name </label>
                        <input type="text" name='Itemname' value={Details.Itemname} placeholder='Enter the itemname' onChange={handleChange} required />
                    </div>
                    <div>
                        <label htmlFor="Amount Paid">Amount Paid </label>
                        <input type="text" name='Amountpaid' value={Details.Amountpaid} placeholder='Enter the Amountpaid' onChange={handleChange} required />
                    </div>
                    <div>
                        <label htmlFor="Paid Date">Paid Date </label>
                        <input type="text" name='PaidDate' value={Details.PaidDate} placeholder='EX:26-jan-2024' onChange={handleChange} required />
                    </div>
                    <div className='paidform-button'>
                        <button type='submit' >Submit</button>
                    </div>
                </form>
            </div>
            <div className="result-list">
                {PaidDetails.length > 0 ? (
                    <table className="paiddetails-tab">
                        <thead>
                            <tr>
                                <th>Checklist</th>
                                <th>PayerName</th>
                                <th>Item Name</th>
                                <th>Amount Paid</th>
                                <th>Paid Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {PaidDetails.map((paid, index) => (
                                <tr key={index} className='paidlist'>
                                    <td><input type="checkbox" onChange={() => { handleCheckedItems(index) }} style={{ cursor: "pointer" }} /></td>
                                    <td style={{ textDecoration: checkedItems[index] ? "line-through" : '' }} >{paid.Payername}</td>
                                    <td style={{ textDecoration: checkedItems[index] ? "line-through" : '' }} >{paid.Itemname}</td>
                                    <td style={{ textDecoration: checkedItems[index] ? "line-through" : '' }} >{paid.Amountpaid}</td>
                                    <td style={{ textDecoration: checkedItems[index] ? "line-through" : '' }} >{paid.PaidDate}</td>
                                    <td className="buttons">
                                        <button onClick={() => handleEdit(index)}><EditNoteIcon /></button>
                                        <button onClick={() => handleDelete(index)}><DeleteIcon /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No details found</p>

                )}
            </div>
        </div>
    )
}

export default PaidCard