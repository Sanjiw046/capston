import React from 'react'
import { useNavigate } from 'react-router-dom'

const ProfileImage = ({ imageUrl }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/profile')
  }

  return (
    <img
      src={imageUrl}
      className='profile-image w-10 h-10 rounded-full cursor-pointer'
      onClick={handleClick}
      alt='Profile'
    />
  )
}

export default ProfileImage
