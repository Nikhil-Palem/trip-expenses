import React, { useContext, useState, useEffect } from 'react';
import './MyTrips.css';
import { RecoveryContext } from '../../App';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dataset from '../../Dataset.js'
import Lottie from "lottie-react";
import TripsAnimation from '../../images/trips-skeleton-animation.json';
import TripsLoading from '../../images/trips-loading-animation.json';

function MyTrips() {
  const { currentTrip, setCurrentTrip, User_Id, BackendUrl, CurrentTripId, setCurrentTripId } = useContext(RecoveryContext);
  const [PastTrips, setPastTrips] = useState([]);
  // const CurrentTripId = localStorage.getItem('currentTripID');
  const [Loading, setLoading] = useState(false);
  // const [trigger, settrigger] = useState(false);
  const navigate = useNavigate();
  console.log(currentTrip);
  console.log(PastTrips);

  useEffect(() => {
    fetchPastTrips();
  }, []);

  const fetchPastTrips = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(`${BackendUrl}/getPastTrips`, {
        params: {
          User_Id: User_Id
        }
      });
      const mappedPastTrips = resp.data.success.map(mapBackendData);
      setPastTrips(mappedPastTrips || []);
    } catch (err) {
      console.log("error fetching past trips", err);
    } finally {
      setLoading(false);
    }
  };

  const mapBackendData = (backendData) => {
    return {
      id: backendData?.id,
      manage_id: backendData?.mid,
      name: backendData?.place_name,
      country: backendData?.country,
      image: backendData?.image_url,
      description: backendData?.description,
      price: backendData?.price,
      nearby_places: backendData?.nearby_places,
    };
  };

  const handleCompleted = async () => {
    try {
      const resp = await axios.patch(`${BackendUrl}/updateStatus`, {
        User_Id: User_Id,
        trip_id: CurrentTripId,
        manage_id: currentTrip.manage_id,
      });
      setPastTrips((prev) => [...prev, currentTrip]);
      setCurrentTrip(null);
      localStorage.removeItem('currentTripID');
      fetchPastTrips();
      setCurrentTripId('');
    } catch (err) {
      console.log("error during complete status", err);
    }
  }

  const handleManageTrip = (trip) => {
    navigate(`/manage-trip/${trip.id}`, { state: { trip: { ...trip, members: [], expenses: [] } } });
  }

  useEffect(() => {
    if (CurrentTripId) {
      const placeFromDataset = dataset.places.find((p) => p.id === Number(CurrentTripId));

      if (placeFromDataset) {
        getMangeId(placeFromDataset);
      } else {
        getPlaceFromBackend();
      }
    }
  }, [CurrentTripId]);

  const getMangeId = async (placeFromDataset) => {
    try {
      const resp = await axios.get(`${BackendUrl}/getManageId`, {
        params: {
          trip_id: placeFromDataset.id,
          User_Id: User_Id
        }
      })
      const mid = resp.data.success?.id;
      setCurrentTrip({
        ...placeFromDataset,
        manage_id: mid
      })
    } catch (err) {
      console.log("catch error in get manage id", err);
    }
  }

  const getPlaceFromBackend = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BackendUrl}/getCurrentPlaces?id=${CurrentTripId}&User_Id=${User_Id}`);
      if (response.data.error) {
      } else {
        const backendData = response.data.success;
        const mappedData = {
          id: backendData?.id,
          manage_id: backendData?.mid,
          name: backendData?.place_name,
          country: backendData?.country,
          image: backendData?.image_url,
          description: backendData?.description,
          price: backendData?.price,
          nearby_places: backendData?.nearby_places,
        };
        setCurrentTrip(mappedData);
      }
    } catch (err) {
      console.log("this is catch error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (delTrip) => {
    try {
      const resp = await axios.delete(`${BackendUrl}/delMyTrips`, {
        params: {
          id: delTrip.manage_id,
          trip_id: delTrip.id,
          User_Id: User_Id
        }
      });
      if (delTrip.id == CurrentTripId) {
        setCurrentTrip(null);
        setCurrentTripId('');
        localStorage.removeItem('currentTripID');
      } else {
        fetchPastTrips();
      }
      //need to fix if trip was current trip then remove it from local storage as well 
      console.log(resp.data.success);
    } catch (err) {
      console.log("catch error", err);
    }
  }

  return (
    <div className='mytrips-div'>
      {!Loading ? ((!currentTrip || !currentTrip?.id) && (!Array.isArray(PastTrips) || PastTrips.length === 0) ? (
        <div className="no-trips">
          <h2 className='not-found'>No trips added yet.</h2>
        </div>
      ) : (
        <>
          {(currentTrip || currentTrip?.id) ? (
            <div className="current-trip">
              <h2>Current Trip</h2>
              {!Loading ? (<div className="curr-trip small-Boxes" key={currentTrip.id}>
                <div className="trip-img" onClick={() => handleManageTrip(currentTrip)}>
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
                    <button onClick={() => handleDeleteTrip(currentTrip)} className='del'><DeleteForeverRoundedIcon /></button>
                  </div>
                </div>
              </div>) : <div className="loader">
                <Lottie animationData={TripsAnimation} loop={true} style={{ height: "500px" }} />
              </div>}
            </div>
          ) : (
            <><h2 className='not-found-h2'>Current Trip</h2>
              <h2 className='not-found'>No current Trips Found</h2>
            </>
          )}

          {!Array.isArray(PastTrips) || PastTrips.length === 0 ? <><h2 className='not-found-h2'>Past Trips</h2> <h2 className='not-found'>No past Trips Found</h2> </> : (<div className="past-trips">
            <h2>Past Trips</h2>
            {!Loading ? (<div className="past-trips-container">
              {PastTrips.map((p) => (
                <div className="past-trip small-Boxes" key={p?.id} >
                  <div className="past-trip-img" onClick={() => handleManageTrip(p)}>
                    <img src={p?.image} alt={p?.name} />
                  </div>
                  <div className="trip-info">
                    <h4 className='trip-name'>{p?.name}</h4>
                    <div className="second-line-box">
                      <p className='trip-date'>Date: 12-05-2021</p>
                      <p className='trip-price'>Total Price: $2000</p>
                    </div>
                    <button onClick={() => handleDeleteTrip(p)} className='del'><DeleteForeverRoundedIcon /></button>
                  </div>
                </div>
              ))}
            </div>) : <div className="loader">
              <Lottie animationData={TripsAnimation} loop={true} style={{ height: "500px" }} />
            </div>}
          </div>)}
        </>
      )) : <div className="main-loader">
        <Lottie animationData={TripsLoading} loop={true} style={{ height: "100px" }} />
      </div>}
    </div>
  );
}

export default MyTrips;