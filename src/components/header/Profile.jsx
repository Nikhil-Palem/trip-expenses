import React, { useState, useContext } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Avatar } from '@mui/material';
import './Profile.css';
import { RecoveryContext } from '../../App';
import axios from 'axios';

function Profile() {
    const { user_name, User_Id, imageUrl, setImageUrl } = useContext(RecoveryContext);
    const [urlTrue, setUrlTrue] = useState(false);
    
    const [imageChange, setImageChange] = useState('');
    
    const handleProfile = () => {
        setUrlTrue(!urlTrue);
    };

    const handleUrlChange = (event) => {
        setImageChange(event.target.value);
    };

    const handleUrlClick = async () => {
        try {
            const response = await axios.post("http://localhost:3000/profile_url", {
                url: imageChange,
                User_Id: User_Id
            });
            if (response.data.error) {
                console.log(response.data.error);
            } else {
                console.log(response.data);
                setImageUrl(imageChange);
                setUrlTrue(!urlTrue);
            }
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <div className='Profile-container'>
            <div className="img">
                <Avatar
                    src={imageUrl || ''}
                    alt={user_name}
                    sx={{ width: 100, height: 100 }}
                    onClick={handleProfile}
                    className='Avatar'
                >
                    {!imageUrl && <AccountCircleIcon className='profile-icon' />}
                </Avatar>
                {urlTrue && (
                    <div className="profilechange">
                        <input
                            type="text"
                            name="url"
                            value={imageChange}
                            onChange={handleUrlChange}
                            placeholder='Provide image URL'
                            className='profile-input'
                        />
                        <button onClick={handleUrlClick}>set</button>
                    </div>
                )}
            </div>
            <p>User Name: {user_name}</p>
            <p>User Id: {User_Id}</p>
        </div>
    );
}

export default Profile;
