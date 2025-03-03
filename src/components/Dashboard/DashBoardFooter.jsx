import React, { useContext, useState } from 'react'
import { RecoveryContext } from '../../App'
import './DashBoardFooter.css'
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import BarChartIcon from '@mui/icons-material/BarChart';
import CommuteIcon from '@mui/icons-material/Commute';
import { useNavigate } from 'react-router-dom';
function DashBoardFooter() {
    const { isMobile } = useContext(RecoveryContext)
    const [Effects, setEffects] = useState('Trips');
    const navigate = useNavigate();
    const handleClick = (effects) => {
        setEffects(effects);
        navigate(`/${effects}`);
    }
    return (<>
        <div className="dashboard-container">
            {isMobile && <div className='dashboard-footer'>
                <TravelExploreIcon className={`${Effects==='Trips'?'active':''}`} onClick={()=>handleClick('Trips')}/>

                <CommuteIcon className={`${Effects==='MyTrips'?'active':''}`} onClick={()=>handleClick('MyTrips')}/>

                <BarChartIcon className={`${Effects==='report'?'active':''}`} onClick={()=>handleClick('report')}/>
            </div>}
        </div>
    </>
    )
}

export default DashBoardFooter