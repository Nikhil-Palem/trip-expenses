import React, { useEffect, useState } from 'react'
import dataset from '../../Dataset'
import './PlaceDetails.css'
import { useNavigate, useParams } from 'react-router-dom';

function PlaceDetails() {
  const [PlacesData, setPlacesData] = useState(dataset.places);
  const { id } = useParams();
  const place = PlacesData.find((place) => place.id === Number(id));
  const navigate = useNavigate();


  if (!place) {
    <p>No Place Details Found</p>
  }
  return (
      <div className="details-div boxes">
        <div className="detail_place small-Boxes" key={place.id}>
          <div className="detail_img-div">
            <img src={place.image} alt={`${place.name} img`} />
          </div>
          <div className="detail_place_info">
            <h4 className='detail_place_h4 places_p'>{place.name}</h4>
            <p className='detail_place_p'><span>Country :</span> {place.country}</p>
            <p className='detail_place_p'><span>Best Time To Visit : </span>{place.best_time_to_visit}</p>
            <p className='detail_place_p'><span>Estimated Price : </span>{place.price}</p>
            <p className='detail_place_p'><span>Description : </span>{place.description}</p>
            <p className='detail_place_p'><span>Near By Places To Visit : </span>{place.nearby_places}</p>
            <div className="btn_class"><span className='detail_goback_btn' onClick={() => navigate(-1)}>Go Back</span></div>
          </div>
        </div>
      </div>
  )
}

export default PlaceDetails