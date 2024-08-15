import React from 'react'
import Navbar from '../header/Navbar'
import Contact from './Contact'
import Welcome from './Welcome'
import About from './About'
function Home() {
  return (
    <div>
        <Navbar/>
        <Welcome/>
        <About/>
        <Contact/>
    </div>
  )
}

export default Home