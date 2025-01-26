import React, { useState, useContext } from 'react';
import './CustomPlaces.css'
import { useNavigate } from 'react-router-dom';
import { RecoveryContext } from '../../App';

function CustomPlace() {
  const { customPlace, setcustomPlaces } = useContext(RecoveryContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    imgUrl: '',
    placeName: '',
    country: '',
    price: '',
    description: '',
    nearByPlaces: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitPlace = (e) => {
    e.preventDefault();
    const newPlace = { id: Date.now(), ...formData };
    setcustomPlaces((prev) => [...prev, newPlace]);
    console.log("form data", formData);
    console.log("customdat", customPlace);
    navigate(-1);
  };

  return (
    <div className="custom-container">
      <div className="customPlaces-div boxes">
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
            <button  className='back-btn' type="button" onClick={() => navigate(-1)}>Go Back</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomPlace;
