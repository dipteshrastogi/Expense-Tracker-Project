// src/components/ProfilePage.jsx
import React, { useState } from 'react';

const ProfilePage = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || 'John Doe',
    email: user?.email || 'johndoe@example.com',
    income: user?.income || 0,
    totalExpenses: user?.totalExpenses || 0,
    description: user?.description || 'No description provided.',
    profilePhoto: user?.profilePhoto || 'https://via.placeholder.com/100',
    joinedDate: user?.joinedDate || '2024-01-01',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // You can add logic to update user profile in DB here
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Profile</h1>
      <div className="flex items-center space-x-6">
        <img src={formData.profilePhoto} alt="Profile" className="w-24 h-24 rounded-full border" />
        <div>
          {isEditing ? (
            <>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="text-xl font-medium text-gray-700 bg-white border rounded px-2 py-1 w-full"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="text-gray-500 bg-white border rounded px-2 py-1 w-full mt-2"
              />
            </>
          ) : (
            <>
              <h2 className="text-xl font-medium text-gray-700">{formData.fullName}</h2>
              <p className="text-gray-500">{formData.email}</p>
            </>
          )}
          <p className="text-sm text-gray-400">Joined on {formData.joinedDate}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="text-sm text-gray-600">Monthly Income</h3>
          {isEditing ? (
            <input
              type="number"
              name="income"
              value={formData.income}
              onChange={handleChange}
              className="text-lg font-semibold text-green-700 bg-white border rounded px-2 py-1 w-full"
            />
          ) : (
            <p className="text-lg font-semibold text-green-700">₹{formData.income}</p>
          )}
        </div>
        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="text-sm text-gray-600">Total Expenses</h3>
          <p className="text-lg font-semibold text-red-700">₹{formData.totalExpenses}</p>
        </div>
        <div className="md:col-span-2">
          <h3 className="text-sm text-gray-600 mb-2">About</h3>
          {isEditing ? (
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="text-gray-700 bg-white border p-3 rounded-md w-full"
            />
          ) : (
            <p className="text-gray-700 bg-gray-50 p-3 rounded-md border">{formData.description}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <h3 className="text-sm text-gray-600 mb-2">Account Status</h3>
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-green-500 inline-block"></span>
            <span className="text-sm text-gray-600">Active</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-3"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
