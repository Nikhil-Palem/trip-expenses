import React, { use, useContext, useEffect, useState } from 'react'
import dataset from '../../Dataset.js'
import './PlaceDetails.css'
import { useNavigate, useParams } from 'react-router-dom';
import { RecoveryContext } from '../../App';
import axios from 'axios';
import Lottie from "lottie-react";
import animationData from '../../images/loading-animation.json';

function PlaceDetails() {
  const { id } = useParams();
  const { User_Id ,BackendUrl} = useContext(RecoveryContext);
  const [place, setPlace] = useState(null);
  const navigate = useNavigate();

  console.log("id from details", id, User_Id);

  useEffect(() => {
    const placeFromDataset = dataset.places.find((p) => p.id === Number(id));
    if (placeFromDataset) {
      console.log("place", placeFromDataset);
      setPlace(placeFromDataset);
    } else {
      getPlaceFromBackend();
    }
  }, [id, User_Id]);

  const getPlaceFromBackend = async () => {
    try {
      const response = await axios.get(`${BackendUrl}/places?id=${id}&User_Id=${User_Id}`);
      if (response.data.error) {
        console.log("customplaces error", response.data.error);
      } else {
        const backendData = response.data.success;
        const mappedData = {
          id: backendData.id,
          name: backendData.place_name,
          country: backendData.country,
          image: backendData.image_url,
          description: backendData.description,
          price: backendData.price,
          nearby_places: backendData.nearby_places,
        };
        setPlace(mappedData);
              }
    } catch (err) {
      console.log("this is catch error", err);
    }
  };

  return (
    <div className="details-div boxes">
      {place ? (<div className="detail_place small-Boxes" key={place.id}>
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
      </div>) : <div className="loader">
        <Lottie animationData={animationData} loop={true} />
      </div>}
    </div>
  )
}

export default PlaceDetails