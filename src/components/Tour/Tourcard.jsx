import React from 'react'
import './Tourcard.css'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useState } from 'react';
function Tourcard() {
    const [showMore, setshowMore] = useState(false);
    const handleToggle=()=>{
        setshowMore(!showMore);
    }

  return (
    <div className='tour-div'>
        <div className='tour-inner-div1'>
            <strong>Goa</strong>
            <p><strong>Destination Overview : </strong>Goa,known for its beautiful beaches,vibrant nightlife,and rich Portuguese heritage.</p>
            <div className='arrow-button' onClick={handleToggle}>
                    {showMore ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
            {showMore &&(
                <div className='additional-info'>
                    <p>Estimated Price:10000</p>
                    <p>Best time to visit:Nov-Feb</p>
                </div>
            )}
        </div>
    </div>
  )
}

export default Tourcard