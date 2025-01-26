import React from 'react'
import travelimg from '../../images/travel1.jpg'
import travelimg1 from '../../images/travel2.jpg'
import './About.css'
function About() {
  return (
    <div className='about-div' id='About'>
      <div className="first-about-div">
        <div className="about-img">
          <img src={travelimg} alt="img" className='invert-img'/>
        </div>
        <div className="about-info">
          <p>Welcome to Travel Book !

            Travel Book is your ultimate travel companion, designed to make group travel fun, stress-free, and financially transparent. Whether you're exploring new destinations with friends or organizing a family trip, Travel Book helps you manage expenses with ease, ensuring that everyone knows exactly who owes what.
          </p>
        </div>
      </div>
      <div className="second-about-div">
        <div className="about-info2">
          <p>
            <h1>Why Travel Book?</h1>
            Group travel is about creating memories, not worrying about money. Travel Book eliminates the hassle of managing shared expenses, allowing you to focus on enjoying the journey. Whether you're on a weekend getaway or a month-long adventure, Travel Book ensures that everyone has a clear understanding of costs, making your trip more enjoyable and stress-free.</p>
        </div>
        <div className="about-img2">
          <img src={travelimg1} alt="img" className='invert-img'/>
        </div>
      </div>
    </div>
  )
}

export default About