import React from 'react'
import './PaidPage.css'
import PaidCard from './PaidCard.jsx'
function PaidPage({User_Id,user_name}) {
  console.log("paidpage",User_Id);
  return (
    <div className='paidpage-conatiner'><PaidCard User_Id={User_Id} user_name={user_name}/></div>
  )
}

export default PaidPage