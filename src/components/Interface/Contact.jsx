import React, { useState } from 'react'
import './Contact.css'
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import axios from 'axios';
function Footer() {
  const [Name, setName] = useState("");
  const [UserEmail, setUserEmail] = useState("");

  const [Msg, setMsg] = useState("");
  const handleContact=async(e)=>{
    e.preventDefault();
        try{
          const response=await axios.post("http://localhost:3000/contact",{
            Name:Name,
            UserEmail:UserEmail,
            Msg:Msg,
          });
          if(response.data.error){
            console.log(response.data.error);
          }else{
            console.log(response.data);
          }
          setMsg("");
          setName("");
          setUserEmail("");
        }catch(error){
          console.log(error);
        }
  }
  return (
    <div className='footer-container' id='Contact'>
      <h1>Contact Us</h1>
      <p>To reach out us...</p>
      <div className="footer-div">
        <form className="footer-form">

          <div className="inner-box">
            <div>
              <label htmlFor="Name">Name*</label>
              <input type="text" name="Name" id="" value={Name} placeholder='Enter your name' onChange={(e)=>setName(e.target.value)}/>
            </div>
            <div>
              <label htmlFor="Email">Email*</label>
              <input type="text" name="Email" id="" value={UserEmail} placeholder='Enter your email' onChange={(e)=>setUserEmail(e.target.value)}/>
            </div>
          </div>

          <textarea name="msg" rows={5} id="" value={Msg} placeholder='Message...' onChange={(e)=>setMsg(e.target.value)}></textarea>

          <button onClick={handleContact}>Send Message <NearMeOutlinedIcon /></button>
        </form>
        <div className="contact-info">
          <a href="mailto:nikhilpalem93466@gmail.com">
            <MarkEmailReadOutlinedIcon /> nikhilpalem93466@gmail.com</a>
          <a href="tel:+91 6302247559">
            <SmartphoneOutlinedIcon /> (+91) 6302247559</a>
          <a href=""><RoomOutlinedIcon /> Lb Nagaar ,Hyderabad ,Telangana ,500074</a>
        </div>
      </div>
    </div>
  )
}

export default Footer