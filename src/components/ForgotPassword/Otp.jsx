import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RecoveryContext } from '../../App';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import './Otp.css';

function Otp() {
    const navigate = useNavigate();
    const { Email, OTP, BackendUrl } = useContext(RecoveryContext);
    const [UserOTP, setUserOTP] = useState(['', '', '', '']);
    const [ErrorMsg, setErrorMsg] = useState('');
    const [canResend, setcanResend] = useState(true);
    const [countDown, setcountDown] = useState(60);
    const inputRefs = useRef([]);

    const handleOtpChange = (index, value) => {
        if (/^\d$/.test(value) || value === '') {
            const newOtp = [...UserOTP];
            newOtp[index] = value;
            setUserOTP(newOtp);

            
            if (value !== '' && index < inputRefs.current.length - 1) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleOtp = () => {
        const enteredOtp = UserOTP.join('');
        if (enteredOtp === OTP.toString()) {
                        navigate("/Reset");
        } else {
                        setErrorMsg("Invalid OTP");
        }
    };

    const handleResend = async () => {
        if (canResend) {
            try {
                const newOtp = Math.floor(Math.random() * 9000 + 1000);
                await axios.post(`${BackendUrl}/send_recovery_email`, {
                    OTP: newOtp,
                    Email,
                });
                setcanResend(false);
                setcountDown(60);
            } catch (err) {
                setErrorMsg('Failed to resend OTP');
            }
        }
    };

    useEffect(() => {
        let timer;
        if (!canResend) {
            timer = setInterval(() => {
                setcountDown(preVal => {
                    if (preVal === 1) {
                        setcanResend(true);
                        clearInterval(timer);
                        return 60;
                    }
                    return preVal - 1;
                });
            }, 1000);
        }
        return () => { clearInterval(timer); };
    }, [canResend]);

    return (
        <div className='Otp-container'>
            <div className='Otp-div'>
                <span className='icon-msg'><MarkEmailReadIcon /></span>
                <strong>Please check your mail</strong>
                <p>We've sent a code to your mail {Email}</p>

                <div className='otp-inputs'>
                    {UserOTP.map((value, index) => (
                        <div key={index} className='otp-letter-input'>
                            <input
                                type="text"
                                maxLength={1}
                                value={value}
                                onChange={(e) => { handleOtpChange(index, e.target.value); }}
                                ref={(el) => (inputRefs.current[index] = el)}
                            />
                        </div>
                    ))}
                </div>
                <p style={{ paddingBottom: "15px" }}>Didn't receive code?{' '}
                    <span style={{ color: "#198754", cursor: "pointer", textDecoration: "underline" }}
                        onClick={handleResend}>{canResend ? "Click to resend" : `Resend in ${countDown}`}</span>
                </p>

                <div className='buttons-otp'>
                    <div>
                        <button onClick={() => { navigate("/ForgotPage") }}>Cancel</button>
                    </div>
                    <div>
                        <button className='second-button' onClick={handleOtp}>Verify</button>
                    </div>
                </div>
                {ErrorMsg && <p style={{ color: "red" }}>{ErrorMsg}</p>}
            </div>
        </div>
    );
}

export default Otp;