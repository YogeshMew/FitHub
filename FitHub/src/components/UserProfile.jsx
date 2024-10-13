// src/components/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase'; // Import Firestore
import { doc, getDoc, setDoc } from 'firebase/firestore';

const UserProfile = () => {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    profilePicture: '',
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        setProfileData(userDoc.data());
      }
    };
    
    if (currentUser) {
      fetchProfileData();
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, 'users', currentUser.uid), profileData); // Save to Firestore
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" value={profileData.username} onChange={handleChange} placeholder="Username" />
      <input type="email" name="email" value={profileData.email} onChange={handleChange} placeholder="Email" />
      {/* Add an image upload input for profile picture */}
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default UserProfile;
