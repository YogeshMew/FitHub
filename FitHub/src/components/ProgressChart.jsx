// src/components/ProgressChart.jsx
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { db } from '../firebase'; // Ensure you import your Firestore instance
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const ProgressChart = () => {
  const { currentUser } = useAuth(); // Get the current user
  const [workoutData, setWorkoutData] = useState([]);

  useEffect(() => {
    const fetchWorkoutData = () => {
      const workoutRef = collection(db, 'workouts');
      const q = query(workoutRef, orderBy('date', 'asc')); // Order by date

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((workout) => workout.userId === currentUser.uid); // Filter by user ID

        // Transform the data to the format required for the chart
        const formattedData = data.map(workout => ({
          date: new Date(workout.date).toLocaleDateString(), // Format date
          duration: workout.duration || 0, // Replace with your actual field
        }));

        setWorkoutData(formattedData);
      });

      return () => unsubscribe(); // Cleanup on unmount
    };

    if (currentUser) {
      fetchWorkoutData();
    }
  }, [currentUser]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Workout Progress Over Time</h2>
      <LineChart
        width={600}
        height={300}
        data={workoutData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="duration" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </div>
  );
};

export default ProgressChart;
