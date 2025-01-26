import React from 'react'
import Avatar from '@mui/material/Avatar';

function CustomAvatar({ imgUrl, name, height, width }) {
    function getRandomColor() {
        const colors = ['#FFB6C1', '#ADD8E6', '#90EE90', '#FFD700', '#FFA07A', '#20B2AA', '#87CEFA', '#778899'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    return (
        <div>
            <Avatar
                src={imgUrl}
                alt={name.charAt(0).toUpperCase()}
                sx={{
                    width: width,
                    height: height,
                    bgcolor: !imgUrl ? getRandomColor() : 'var(--icon-bg)',
                    color: 'var(--icon-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    objectFit: 'cover',
                    overflow: 'hidden'
                }}
                // className='mui-icon dark-mui-icon'
            >
                {(!imgUrl && name) ? name.charAt(0).toUpperCase() : ""}
            </Avatar>
        </div>
    )
}

export default CustomAvatar