import React, { useContext, useEffect, useState } from 'react';
import './Trips.css';
import dataset from '../../Dataset.js';
import AddIcon from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { useNavigate } from 'react-router-dom';
import { RecoveryContext } from '../../App.jsx';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import noDataImage from '../../images/nodata.png';
import axios from 'axios';
import Lottie from "lottie-react";
import customPlacesAnimation from '../../images/customPlaces-loading.json';

function Trips() {
  const [activePlaceBtn, setActivePlaceBtn] = useState('');
  const [activePopularPlaceBtn, setActivePopularPlaceBtn] = useState('');
  const [activeCustomPlaceBtn, setactiveCustomPlaceBtn] = useState('');
  const [viewLeftBtn, setViewLeftBtn] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [placesData, setPlacesData] = useState([]);
  const [popularPlacesData, setPopularPlacesData] = useState([]);
  const { customPlaces, setcustomPlaces, User_Id, BackendUrl, CurrentTripId, setCurrentTripId } = useContext(RecoveryContext);
  const [showCompleteMessage, setShowCompleteMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();

  const handleActiveBtn = (btnName) => {
    setActivePlaceBtn(btnName);
  }

  const handleActivePopularBtn = (btnName) => {
    setActivePopularPlaceBtn(btnName);
  }

  const hanldeActiveCustBtn = (btnName) => {
    setactiveCustomPlaceBtn(btnName);
  }

  const handleScrollRight = () => {
    setViewLeftBtn(true);
    const placesContainer = document.querySelector('.places');
    placesContainer.scrollBy({ left: 270, behavior: 'smooth' });
  }

  const handleScrollLeft = () => {
    const placesContainer = document.querySelector('.places');
    placesContainer.scrollBy({ left: -270, behavior: 'smooth' });
  }

  const handleScrollPopularRight = () => {
    setViewLeftBtn(true);
    const placesContainer = document.querySelector('.places.PlacesExplore');
    placesContainer.scrollBy({ left: 270, behavior: 'smooth' });
  }

  const handleScrollPopularLeft = () => {
    const placesContainer = document.querySelector('.places.PlacesExplore');
    placesContainer.scrollBy({ left: -270, behavior: 'smooth' });
  }

  const handleFullDetails = (id) => {
    navigate(`/detail/${id}`)
  }

  const handleCustomPlaces = () => {
    navigate("/customPlace");
  }

  const handleDeletePlace = async (id) => {
    try {
      const resp = await axios.delete(`${BackendUrl}/customPlaces?id=${id}`);
      if (resp.data.success) {
        setcustomPlaces((prev) => prev.filter((p) => p.id !== resp.data.success.id));
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleAddToMyTrips = async (place) => {
    const trip_id = place.id;
    try {
      if (!CurrentTripId) {
        const response = await axios.post(`${BackendUrl}/currentTrip`, {
          trip_id: trip_id,
          User_Id: User_Id
        });
        localStorage.setItem("currentTripID", response.data.success.trip_id);
        setCurrentTripId(response.data.success.trip_id);
        setShowSuccessMessage(true);
      } else {
        setShowCompleteMessage(true);
      }
    } catch (error) {
      console.log("frontend catch error", error);
    }
  }


  useEffect(() => {
    handleFetchCustomPlaces();
  }, []);

  const handleFetchCustomPlaces = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BackendUrl}/customPlaces?User_Id=${User_Id}`);
      if (response.data.error) {
        console.log("customplaces error", response.data.error);
      } else {
        const mappedData = response.data.success.map(place => ({
          ...place,
          name: place.place_name,
          image: place.image_url
        }));
        setcustomPlaces(mappedData);
      }
    }
    catch (err) {
      console.log("this is catch error", err);
    } finally {
      setLoading(false);
    }
  }


  const filteredPlaces = activePlaceBtn ? placesData.filter((place) => place.country === activePlaceBtn) : placesData;

  const filteredPopularPlaces = activePopularPlaceBtn ? popularPlacesData.filter((place) => place.country === activePopularPlaceBtn) : popularPlacesData;

  const filteredCustomPlaces = activeCustomPlaceBtn ? customPlaces.filter((p) => p.country === activeCustomPlaceBtn) : customPlaces;

  useEffect(() => {
    setPlacesData(dataset.places);
    setPopularPlacesData(dataset.places.filter((place) => place.isPopular));
  }, []);

  useEffect(() => {
    if (showCompleteMessage) {
      const timer = setTimeout(() => {
        setShowCompleteMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showCompleteMessage]);

  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);


  return (
    <div className='trip-div'>
      <h1 className='tripH'>Plan Your Trip</h1>
      <div className="places-div">
        <div className="exploreMore boxes">
          <h2>Explore More Places</h2>
          <div className="country-buttons">
            <button className={`Cbtn ${activePlaceBtn === "India" ? "active" : ""} small-Boxes`} onClick={() => handleActiveBtn("India")}>India</button>
            <button className={`Cbtn ${activePlaceBtn === "USA" ? "active" : ""}  small-Boxes`} onClick={() => handleActiveBtn("USA")}>USA</button>
            <button className={`Cbtn ${activePlaceBtn === "Australia" ? "active" : ""} small-Boxes`} onClick={() => handleActiveBtn("Australia")}>Australia</button>
            <button className={`Cbtn ${activePlaceBtn === "South_Africa" ? "active" : ""} small-Boxes`} onClick={() => handleActiveBtn("South_Africa")}>South Africa</button>
            <button className={`Cbtn ${activePlaceBtn === "Japan" ? "active" : ""} small-Boxes`} onClick={() => handleActiveBtn("Japan")}>Japan</button>
            <button className={`Cbtn ${activePlaceBtn === "China" ? "active" : ""} small-Boxes`} onClick={() => handleActiveBtn("China")}>China</button>
          </div>
          <div className="places">
            {filteredPlaces.length > 0 ? (filteredPlaces.map((place) => (
              <div className="place small-Boxes" key={place.id}>
                <div className="img-div">
                  <img src={place.image} alt={`${place.name} img`} />
                </div>
                <div className="place_info">
                  <div className="first_line">
                    <h4 className='places_h4'>{place.name}</h4>
                    <span className='places_btn' onClick={() => handleAddToMyTrips(place)}>
                      <AddIcon />
                      <span className='AddToMytrips'>Add to MyTrips</span>
                    </span>
                  </div>
                  <p className='places_p' onClick={() => handleFullDetails(place.id)}>Click to view more details...</p>
                </div>
              </div>))) : (<div className='no-places'>
                <img src={noDataImage} alt="No data available" />
                <p>Their is no {activePlaceBtn} places data Available...</p>
              </div>)
            }
          </div>
          <span className='arrow-btn' onClick={handleScrollRight}><ChevronRightIcon /></span>
          {viewLeftBtn && <span className='arrow-btnL' onClick={handleScrollLeft}><NavigateBeforeIcon /></span>}
        </div>

        <div className="popularPlaces boxes">
          <h2>Top Destinations to Visit</h2>
          <div className="country-buttons">
            <button className={`Cbtn ${activePopularPlaceBtn === "India" ? "active" : ""} small-Boxes`} onClick={() => handleActivePopularBtn("India")}>India</button>
            <button className={`Cbtn ${activePopularPlaceBtn === "USA" ? "active" : ""} small-Boxes`} onClick={() => handleActivePopularBtn("USA")}>USA</button>
            <button className={`Cbtn ${activePopularPlaceBtn === "Australia" ? "active" : ""} small-Boxes`} onClick={() => handleActivePopularBtn("Australia")}>Australia</button>
            <button className={`Cbtn ${activePopularPlaceBtn === "South_Africa" ? "active" : ""} small-Boxes`} onClick={() => handleActivePopularBtn("South_Africa")}>South Africa</button>
            <button className={`Cbtn ${activePopularPlaceBtn === "Japan" ? "active" : ""} small-Boxes`} onClick={() => handleActivePopularBtn("Japan")}>Japan</button>
            <button className={`Cbtn ${activePopularPlaceBtn === "China" ? "active" : ""} small-Boxes`} onClick={() => handleActivePopularBtn("China")}>China</button>
          </div>
          <div className="places PlacesExplore">
            {filteredPopularPlaces.length > 0 ? (filteredPopularPlaces.map((place) => (
              <div className="place small-Boxes" key={place.id}>
                <div className="img-div">
                  <img src={place.image} alt={`${place.name} img`} />
                </div>
                <div className="place_info">
                  <div className="first_line">
                    <h4 className='places_h4'>{place.name}</h4>
                    <span className='places_btn' onClick={() => handleAddToMyTrips(place)}>
                      <AddIcon />
                      <span className='AddToMytrips'>Add to MyTrips</span>
                    </span>
                  </div>
                  <p className='places_p' onClick={() => handleFullDetails(place.id)}>Click to view more details...</p>
                </div>
              </div>
            ))) : (<div className='no-places'>
              <img src={noDataImage} alt="No data available" />
              <p>Their is no Popular {activePopularPlaceBtn} places data Available...</p>
            </div>)
            }
          </div>
          <span className='popular-arrow-btnR' onClick={handleScrollPopularRight}><ChevronRightIcon /></span>
          {viewLeftBtn && <span className='popular-arrow-btnL' onClick={handleScrollPopularLeft}><NavigateBeforeIcon /></span>}
        </div>

        {!Loading ? (customPlaces.length > 0 && <div className="customPlaces boxes">
          <h2>Custom Places</h2>
          <div className="country-buttons">
            <button className={`Cbtn ${activeCustomPlaceBtn === "india" ? "active" : ""}  small-Boxes`} onClick={() => hanldeActiveCustBtn("india")}>India</button>
            <button className={`Cbtn ${activeCustomPlaceBtn === "usa" ? "active" : ""} small-Boxes`} onClick={() => hanldeActiveCustBtn("usa")}>USA</button>
            <button className={`Cbtn ${activeCustomPlaceBtn === "australia" ? "active" : ""} small-Boxes`} onClick={() => hanldeActiveCustBtn("australia")}>Australia</button>
            <button className={`Cbtn ${activeCustomPlaceBtn === "southafrica" ? "active" : ""} small-Boxes`} onClick={() => hanldeActiveCustBtn("southafrica")}>South Africa</button>
            <button className={`Cbtn ${activeCustomPlaceBtn === "japan" ? "active" : ""} small-Boxes`} onClick={() => hanldeActiveCustBtn("japan")}>Japan</button>
            <button className={`Cbtn ${activeCustomPlaceBtn === "china" ? "active" : ""} small-Boxes`} onClick={() => hanldeActiveCustBtn("china")}>China</button>
          </div>
          <div className="places CustomExplore">
            {filteredCustomPlaces.length > 0 ? (filteredCustomPlaces.map((place) => (
              <div className="place small-Boxes" key={place.id}>
                <div className="img-div">
                  <img src={place.image} alt={`${place.name} img`} />
                </div>
                <div className="place_info">
                  <div className="first_line">
                    <span className="places_del_btn" onClick={() => handleDeletePlace(place.id)}><DeleteForeverRoundedIcon /></span>
                    <h4 className='places_h4'>{place.name}</h4>
                    <span className='places_btn' onClick={() => handleAddToMyTrips(place)}>
                      <AddIcon />
                      <span className='AddToMytrips'>Add to MyTrips</span>
                    </span>
                  </div>
                  <p className='places_p' onClick={() => handleFullDetails(place.id)}>Click to view more details...</p>
                </div>
              </div>
            ))) : (<div className='no-places'>
              <img src={noDataImage} alt="No data available" />
              <p>No custom places data available for {activeCustomPlaceBtn}. Please add custom places to view them here.</p>
            </div>)
            }
          </div>
        </div>) : <div className="loader">
          <Lottie animationData={customPlacesAnimation} loop={true} style={{ height: "100px" }} />
        </div>}
      </div>

      <span className='custom-places-btn' onClick={handleCustomPlaces}><AddIcon /></span>
      <span className="addCustom-places">Add Custom Places</span>

      {showCompleteMessage && (
        <div className="complete-message">
          <p><WarningAmberRoundedIcon className='warning-icon' /> There is already a current trip. Please mark it as completed before adding a new one.</p>
          <div className="countdown-timer"></div>
        </div>
      )}

      {showSuccessMessage && (
        <div className="complete-message-success">
          <p><TaskAltIcon className='sucess_icon'/> Successfully Added.</p>
          <div className="countdown-timer"></div>
        </div>
      )}
    </div>
  )
}

export default Trips;