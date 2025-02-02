import React, { useState, useContext } from 'react';
import './CustomPlaces.css'
import { useNavigate } from 'react-router-dom';
import { RecoveryContext } from '../../App';
import axios from 'axios';
import Lottie from "lottie-react"; 
import animationData from '../../images/loading-animation.json';
function CustomPlace() {
  const { setcustomPlaces, User_Id } = useContext(RecoveryContext);
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    imgUrl: '',
    placeName: '',
    country: '',
    price: '',
    description: '',
    nearByPlaces: '',
  });

  console.log(User_Id, formData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitPlace = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/customPlaces', {
        id: Date.now(),
        User_Id: User_Id,
        formData: {
          ...formData,
          country: formData.country.toLowerCase().trim(),
          nearByPlaces: formData.nearByPlaces.split(',').map(place => place.trim())
        }
      });
      if (response.data.error) {
        console.log("customplaces", err);
      } else {
        setcustomPlaces((prev) => [...prev, { ...response.data.success }]);
        navigate(-1);
      }
    } catch (err) {
      console.log("this is catch error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="custom-container">
      {!Loading ? (<div className="customPlaces-div boxes">
        <form onSubmit={onSubmitPlace}>
          {Object.keys(formData).map((field) => (
            <div className='form-data' key={field}>
              <label htmlFor={field}>{field} : </label>
              <input
                name={field}
                type="text"
                placeholder={`Enter ${field}`}
                value={formData[field]}
                onChange={handleInputChange}
                required
              />
            </div>
          ))}
          <div className="cutom-form-btns">
            <button className='submit-btn' type="submit">Submit</button>
            <button className='back-btn' type="button" onClick={() => navigate(-1)}>Go Back</button>
          </div>
        </form>
      </div>) : <div className="loader">
        <Lottie animationData={animationData} loop={true} />
      </div>}
    </div>
  );
}

export default CustomPlace;
