import React, { useContext, useState, useEffect } from 'react';
import './MyTrips.css';
import { RecoveryContext } from '../../App';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { useNavigate } from 'react-router-dom';
function MyTrips() {
  const { currentTrip, setCurrentTrip } = useContext(RecoveryContext);
  const [PastTrips, setPastTrips] = useState([]);//store the past trips to db for particular user currently im using localstorage
  const navigate = useNavigate(); 
  useEffect(() => {
    // Load past trips from local storage when the component mounts
    const storedPastTrips = localStorage.getItem('pastTrips');
    if (storedPastTrips) {
      setPastTrips(JSON.parse(storedPastTrips));
    }
  }, []);

  useEffect(() => {
    // Save past trips to local storage whenever they are updated
    localStorage.setItem('pastTrips', JSON.stringify(PastTrips));
  }, [PastTrips]);

  const handleCompleted = () => {
    setPastTrips((prev) => [...prev, currentTrip]);
    setCurrentTrip(null);
  }

  const handleManageTrip = (trip) => {
    console.log("fun",trip);
    navigate(`/manage-trip/${trip.id}`,{state:{trip:{...trip,members:[],expenses:0}}});
  }

  return (
    <div className='mytrips-div'>
      {currentTrip == null && PastTrips.length == 0 ? (
        <div className="no-trips">
          <h2 className='not-found'>No trips added yet.</h2>
        </div>
      ) : (
        <>
          {currentTrip ? (
            <div className="current-trip" onClick={()=>handleManageTrip(currentTrip)}>
              <h2>Current Trip</h2>
              <div className="curr-trip small-Boxes" key={currentTrip.id}>
                <div className="trip-img">
                  <img src={currentTrip.image} alt={currentTrip.name} />
                </div>
                <div className="trip-info">
                  <h4 className='trip-name'>{currentTrip.name}</h4>
                  <div className="second-line-box">
                    <p className='trip-date'>Date: 12-05-2021</p>
                    <p className='trip-price'>Total Price: $2000</p>
                  </div>
                  <div className="third-line-btns">
                    <button className='completed' onClick={handleCompleted}><TaskAltIcon /></button>
                    <span className="completed-info">Completed</span>
                    <button className='del'><DeleteForeverRoundedIcon /></button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <><h2 className='not-found-h2'>Current Trip</h2>
              <h2 className='not-found'>No current Trips Found</h2>
            </>
          )}

          {PastTrips.length == 0 ? <><h2 className='not-found-h2'>Past Trips</h2> <h2 className='not-found'>No past Trips Found</h2> </> : (<div className="past-trips">
            <h2>Past Trips</h2>
            <div className="past-trips-container">
              {PastTrips.map((p) => (
                <div className="past-trip small-Boxes" key={p?.id} onClick={()=>handleManageTrip(p)}>
                  <div className="past-trip-img">
                    <img src={p?.image} alt={p?.name} />
                  </div>
                  <div className="trip-info">
                    <h4 className='trip-name'>{p?.name}</h4>
                    <div className="second-line-box">
                      <p className='trip-date'>Date: 12-05-2021</p>
                      <p className='trip-price'>Total Price: $2000</p>
                    </div>
                    <button className='del'><DeleteForeverRoundedIcon /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>)}
        </>
      )}
    </div>
  );
}

export default MyTrips;