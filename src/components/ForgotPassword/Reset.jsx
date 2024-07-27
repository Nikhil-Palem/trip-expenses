import React,{useState,useContext} from 'react'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import './Reset.css'
import { RecoveryContext } from '../../App';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Reset() {
    const [NewPassword, setNewPassword] = useState('');
    const [ConfirmPassword, setConfirmPassword] = useState('');
    const [visibilityPassword, setvisibilityPassword] = useState(false);
    const [visibilityCP, setvisibilityCP] = useState(false)
    const [ErrorMsg, setErrorMsg] = useState('');
    const {Email} = useContext(RecoveryContext);
    const navigate = useNavigate();

    const handleVisibility=(field)=>{
        if(field=="NP")
            setvisibilityPassword(!visibilityPassword);
        if(field=="CP")
            setvisibilityCP(!visibilityCP);
    }

    const handleReset=async()=>{
        if(NewPassword!==ConfirmPassword){
            setErrorMsg("Password Doesn't Match");
            return;
        }
        try{
            const Response=await axios.post("http://localhost:3000/reset",{
                Email,
                NewPassword,
            });
            if(Response.data.error){
                setErrorMsg("Failed to reset the Password")
            }else{
                navigate("/Signin");
            }
        }catch(error){
        console.log(error);
        setErrorMsg('An error occured.Please try again.');
        }
    }

  return (
    <div className='reset-container'>
        <div className="reset-div">
            <strong>New Password</strong>
            <p>Enter a new password below to change your password</p>
            <div className="reset-inputs">
                <div className='input-wrapper'>
                    <input type={visibilityPassword ? "text" : "password"} name='new_password' placeholder='New Password' value={NewPassword} onChange={(e)=>{setNewPassword(e.target.value)}}/>
                    <span onClick={()=>{handleVisibility('NP')}}>{!visibilityPassword ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}</span>
                </div>
                <div className='input-wrapper'>
                    <input type={visibilityCP ? "text" : "password"} name='confirm_password' placeholder='Confirm Password' value={ConfirmPassword} onChange={(e)=>{setConfirmPassword(e.target.value)}}/>
                    <span onClick={()=>{handleVisibility('CP')}}>{!visibilityCP ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}</span>
                </div>
            </div>
            <button onClick={handleReset}>Change</button>
            {ErrorMsg && <p style={{color:"red"}}>{ErrorMsg}</p>}
        </div>
    </div>
  )
}

export default Reset