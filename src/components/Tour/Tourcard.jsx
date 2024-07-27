import React from 'react'
import './Tourcard.css'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useState } from 'react';
import tourData from './TourData';
function Tourcard() {

    const [Expanded, setExpanded] = useState(tourData.map(() => false));
    const handleToggle = (index) => {
        setExpanded(preVal => {
            return preVal.map((exp, idx) => (idx === index ? !exp : exp))
        });
    }

    return (
        <div className='tour-div'>
            {tourData.map((data, index) => (<div className='tour-inner-div1' key={index}>
                <strong>{data.destination}</strong>
                <p><strong>Destination Overview : </strong>{data.overview}</p>
                <div className='arrow-button' onClick={() => handleToggle(index)}>
                    {Expanded[index] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </div>
                {Expanded[index] && (
                    <div className='additional-info'>
                        <p>Estimated Price : $ {data.price}</p>
                        <p>Best time to visit : {data.bestTime}</p>
                    </div>
                )}
            </div>))}
        </div>
    )
}

export default Tourcard