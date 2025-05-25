import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import axios from '../../utils/axios'
import { Pencil } from 'lucide-react'
import { toast } from 'react-toastify'


const UserProfilePage = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const [fadeIn, setFadeIn] = useState(false)
  const [editField, setEditField] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [otpStep, setOtpStep] = useState(false)

  useEffect(() => {
    if (user && user.isLoggedIn) {
      setName(user.name || '')
      setEmail(user.email || '')
    }

    const timer = setTimeout(() => setFadeIn(true), 100)
    return () => clearTimeout(timer)
  }, [user])

  // for update image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      const res = await axios.post('/update/updateProfileImage', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
  
      // Update the image in your state or global context
      setUser((prev) => ({ ...prev, image: res.data.imageUrl }));
    } catch (err) {
      console.error('Error uploading image:', err);
    }
  };
  

  const handleSave = async () => {
    if (editField === 'name') {
      try {
        const response = await axios.post('/update/updateName', { newName: name }, { withCredentials: true })
        dispatch({ type: 'UPDATE_NAME', payload: name })
      } catch (error) {
        console.error('Error updating name:', error.response?.data || error.message)
      }
      setEditField(null)
    }

    if (editField === 'email') {
      try {
        // Send OTP to the new email
        await axios.post('/update/requestEmailOTP', { email: newEmail }, { withCredentials: true })
        setOtpStep(true) // move to OTP modal
      } catch (error) {
        console.log(error)
        console.error('Error sending OTP:', error.response?.data || error.message)
      }
    }
  }

  const handleVerifyOTP = async () => {
    try {
      const res = await axios.post('/update/verifyEmailOTP', { email: newEmail, otp }, { withCredentials: true })
      // Update Redux state with new email
      dispatch({ type: 'UPDATE_EMAIL', payload: newEmail })
      setEmail(newEmail)
      setEditField(null)
      setOtpStep(false)
      setOtp('')
    } catch (error) {
      console.error('OTP verification failed:', error.response?.data || error.message)
      toast.error('Enter correct otp')
    }
  }

  if (!user.isLoggedIn) {
    return <div className="p-4">Please log in to view your profile.</div>
  }

  return (
    <motion.div
      className="padding-fix"
      initial={{ opacity: 0 }}
      animate={{ opacity: fadeIn ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 shadow-md w-full h-1/4">
        <div className="flex justify-center max-w-screen-lg mx-auto py-4 text-white text-3xl">
          <h1>User Profile</h1>
        </div>
      </div>

      {/* Main content area */}
      <div className="mt-4 max-w-screen-lg mx-auto p-6">
        <div className="flex justify-between">
          {/* Left section */}
          <div className="w-1/4 bg-white p-4 rounded shadow mr-4">
            <img
              src={user.image || 'default-profile-image.jpg'}
              alt="Profile"
              className="w-full h-48 object-cover rounded-full mb-4"
            />
            <div className="text-center">
              <h3 className="font-bold text-xl">{user.name.toUpperCase()}</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <img src="/profile-icon.png" alt="icon" className="w-6 h-6" />
                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer text-black-600 hover:underline m-0"
                >
                  Update Profile Image
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
            </div>
          </div>

          {/* Right section */}
          <div className="w-3/4 bg-white p-6 rounded shadow">
            <div className="my-4 p-4">
              <h3 className="text-lg font-semibold">Change Profile</h3>
            </div>

            {/* Name */}
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <strong className='pl-2'>Name:</strong>
                <button
                  className="text-blue-500 hover:underline pr-4"
                  onClick={() => setEditField('name')}
                >
                  Edit
                </button>
              </div>
              <input
                className="border p-2 w-full mt-1"
                value={name}
                readOnly
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <strong className='pl-2'>Email:</strong>
                <button
                  className="text-blue-500 hover:underline pr-4"
                  onClick={() => setEditField('email')}
                >
                  Edit
                </button>
              </div>
              <input
                className="border p-2 w-full mt-1"
                value={email}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal for editing name or email */}
      {editField && !otpStep && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded shadow-lg w-full max-w-md"
          >
            <h2 className="text-xl font-semibold mb-4">Edit {editField}</h2>
            <input
              type="text"
              className="border p-2 w-full mb-4"
              value={editField === 'name' ? name : newEmail}
              onChange={(e) =>
                editField === 'name' ? setName(e.target.value) : setNewEmail(e.target.value)
              }
            />
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setEditField(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal for OTP verification */}
      {otpStep && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded shadow-lg w-full max-w-md"
          >
            <h2 className="text-xl font-semibold mb-4">Enter OTP sent to {newEmail}</h2>
            <input
              type="text"
              className="border p-2 w-full mb-4"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setOtpStep(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleVerifyOTP}
              >
                Verify OTP
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default UserProfilePage
