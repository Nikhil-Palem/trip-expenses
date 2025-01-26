import React, { useContext, useEffect, useState } from 'react';
import './Trips.css';
import dataset from '../../Dataset.js';
import AddIcon from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { useNavigate } from 'react-router-dom';
import { RecoveryContext } from '../../App.jsx';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';

function Trips() {
  const [activePlaceBtn, setActivePlaceBtn] = useState('');
  const [viewLeftBtn, setViewLeftBtn] = useState(false);
  const [placesData, setPlacesData] = useState([]);
  const { customPlaces, setCustomPlaces,currentTrip, setCurrentTrip } = useContext(RecoveryContext);
  const [showCompleteMessage, setShowCompleteMessage] = useState(false);
  const navigate = useNavigate();

  const handleActiveBtn = (btnName) => {
    setActivePlaceBtn(btnName);
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

  const handleDeletePlace = (id) => {
    setCustomPlaces((prev) => prev.filter((p) => p.id !== id));
  }

  const handleAddToMyTrips = (place) => {
    if (currentTrip) {
      setShowCompleteMessage(true);
    } else {
      setCurrentTrip(place);
    }
  }


  const filteredPlaces = activePlaceBtn ? placesData.filter((place) => place.country === activePlaceBtn) : placesData;

  useEffect(() => {
    setPlacesData(dataset.places);
  }, [])

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
            {filteredPlaces.map((place) => (
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
            ))}
          </div>
          <span className='arrow-btn' onClick={handleScrollRight}><ChevronRightIcon /></span>
          {viewLeftBtn && <span className='arrow-btnL' onClick={handleScrollLeft}><NavigateBeforeIcon /></span>}
        </div>

        <div className="popularPlaces boxes">
          <h2>Top Destinations to Visit</h2>
          <div className="country-buttons">
            <button className={`Cbtn ${activePlaceBtn === "India" ? "active" : ""}small-Boxes`} onClick={() => handleActiveBtn("India")}>India</button>
            <button className={`Cbtn ${activePlaceBtn === "USA" ? "active" : ""}small-Boxes`} onClick={() => handleActiveBtn("USA")}>USA</button>
            <button className={`Cbtn ${activePlaceBtn === "Australia" ? "active" : ""}small-Boxes`} onClick={() => handleActiveBtn("Australia")}>Australia</button>
            <button className={`Cbtn ${activePlaceBtn === "South_Africa" ? "active" : ""}small-Boxes`} onClick={() => handleActiveBtn("South_Africa")}>South Africa</button>
            <button className={`Cbtn ${activePlaceBtn === "Japan" ? "active" : ""}small-Boxes`} onClick={() => handleActiveBtn("Japan")}>Japan</button>
            <button className={`Cbtn ${activePlaceBtn === "China" ? "active" : ""}small-Boxes`} onClick={() => handleActiveBtn("China")}>China</button>
          </div>
          <div className="places PlacesExplore">
            {filteredPlaces.map((place) => (
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
            ))}
          </div>
          <span className='popular-arrow-btnR' onClick={handleScrollPopularRight}><ChevronRightIcon /></span>
          {viewLeftBtn && <span className='popular-arrow-btnL' onClick={handleScrollPopularLeft}><NavigateBeforeIcon /></span>}
        </div>

        {customPlaces.length>0 && <div className="customPlaces boxes">
          <h2>Custom Places</h2>
          <div className="country-buttons">
            <button className={`Cbtn ${activePlaceBtn === "India" ? "active" : ""}small-Boxes`} onClick={() => handleActiveBtn("India")}>India</button>
            <button className={`Cbtn ${activePlaceBtn === "USA" ? "active" : ""}small-Boxes`} onClick={() => handleActiveBtn("USA")}>USA</button>
            <button className={`Cbtn ${activePlaceBtn === "Australia" ? "active" : ""}small-Boxes`} onClick={() => handleActiveBtn("Australia")}>Australia</button>
            <button className={`Cbtn ${activePlaceBtn === "South_Africa" ? "active" : ""}small-Boxes`} onClick={() => handleActiveBtn("South_Africa")}>South Africa</button>
            <button className={`Cbtn ${activePlaceBtn === "Japan" ? "active" : ""}small-Boxes`} onClick={() => handleActiveBtn("Japan")}>Japan</button>
            <button className={`Cbtn ${activePlaceBtn === "China" ? "active" : ""}small-Boxes`} onClick={() => handleActiveBtn("China")}>China</button>
          </div>
          <div className="places CustomExplore">
            {customPlaces.map((place) => (
              <div className="place small-Boxes" key={place.id}>
                <div className="img-div">
                  <img src={place.imgUrl} alt={`${place.placeName} img`} />
                </div>
                <div className="place_info">
                  <div className="first_line">
                    <span className="places_del_btn" onClick={() => handleDeletePlace(place.id)}><DeleteForeverRoundedIcon /></span>
                    <h4 className='places_h4'>{place.placeName}</h4>
                    <span className='places_btn' onClick={() => handleAddToMyTrips(place)}>
                      <AddIcon />
                      <span className='AddToMytrips'>Add to MyTrips</span>
                    </span>
                  </div>
                  <p className='places_p' onClick={() => handleFullDetails(place.id)}>Click to view more details...</p>
                </div>
              </div>
            ))}
          </div>
        </div>}
      </div>
      <span className='custom-places-btn' onClick={handleCustomPlaces}><AddIcon /></span>
      <span className="addCustom-places">Add Custom Places</span>

      {showCompleteMessage && (
        <div className="complete-message">
          <p>There is already a current trip. Please mark it as completed before adding a new one.</p>
          {/* <button onClick={handleMarkAsCompleted}>Mark as Completed</button> */}
        </div>
      )}
    </div>
  )
}

export default Trips;