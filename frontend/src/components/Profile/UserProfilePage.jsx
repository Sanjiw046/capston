import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'

const UserProfilePage = () => {
  const user = useSelector((state) => state.user)

  const [fadeIn, setFadeIn] = useState(false)
  const [editField, setEditField] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (user && user.isLoggedIn) {
      setName(user.name || '')
      setEmail(user.email || '')
    }

    const timer = setTimeout(() => setFadeIn(true), 100)
    return () => clearTimeout(timer)
  }, [user])

  const handleSave = () => {
    // You can call an API here to update name or email
    console.log('Updated', editField === 'name' ? name : email)
    setEditField(null)
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
              <h3 className="font-bold text-xl">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
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
                <strong>Name:</strong>
                <button
                  className="text-blue-500 hover:underline"
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
                <strong>Email:</strong>
                <button
                  className="text-blue-500 hover:underline"
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
      {editField && (
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
              value={editField === 'name' ? name : email}
              onChange={(e) =>
                editField === 'name' ? setName(e.target.value) : setEmail(e.target.value)
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
    </motion.div>
  )
}

export default UserProfilePage
