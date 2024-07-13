import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css';
function Navbar() {
  const [AcitvePage, setAcitvePage] = useState(false)
    const handleClick=()=>{
        setAcitvePage(!AcitvePage);
    }
  return (
    
    <div className='navbar'>
        <nav>
            <NavLink to="/PaidPage" className={!AcitvePage?"PaidPage":"common"} onClick={handleClick}>PaidPage</NavLink>
            <NavLink to="/TourPage" className={AcitvePage?"TourPage":"common"} onClick={handleClick}>TourPage</NavLink>
        </nav>
    </div>
  )
}

export default Navbar