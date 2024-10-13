// src/services/workoutService.jsx
import { db } from '../firebase'; // Import your Firestore instance
import { collection, addDoc } from 'firebase/firestore';

// Function to add a workout entry
export const addWorkout = async (workout) => {
  try {
    const docRef = await addDoc(collection(db, 'workouts'), {
      userId: workout.userId, // Add userId
      date: workout.date,      // Add workout date
      duration: workout.duration, // Add workout duration
      type: workout.type,      // Optional: Add workout type
      description: workout.description, // Optional: Add workout description
      calories: workout.calories // Optional: Add calories burned
    });
    console.log("Workout added with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding workout: ", error);
  }
};
