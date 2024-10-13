// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { db } from '../firebase'; // Import Firestore database
import { collection, addDoc, onSnapshot, deleteDoc, doc } from "firebase/firestore"; // Import Firestore functions
import WorkoutLog from "../components/WorkoutLog";
import WorkoutHistory from "../components/WorkoutHistory";
import ProgressChart from '../components/ProgressChart'; // Import ProgressChart

const Dashboard = () => {
  const [workouts, setWorkouts] = useState([]);

  // Load workouts from Firestore on component mount
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "workouts"), (snapshot) => {
      const workoutsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWorkouts(workoutsData);
    });
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Function to add a new workout
  const addWorkout = async (newWorkout) => {
    try {
      const docRef = await addDoc(collection(db, "workouts"), newWorkout); // Add workout to Firestore
      setWorkouts([...workouts, { id: docRef.id, ...newWorkout }]); // Update state with the new workout
    } catch (error) {
      console.error("Error adding workout: ", error);
    }
  };

  // Function to delete a workout
  const deleteWorkout = async (id) => {
    try {
      await deleteDoc(doc(db, "workouts", id)); // Delete workout from Firestore
      const updatedWorkouts = workouts.filter(workout => workout.id !== id);
      setWorkouts(updatedWorkouts); // Update state
    } catch (error) {
      console.error("Error deleting workout: ", error);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-slate-200">
      <h1 className="text-4xl font-bold mb-4">Fitness Tracker Dashboard</h1>
      <WorkoutLog addWorkout={addWorkout} /> {/* Pass the addWorkout function */}
      <WorkoutHistory workouts={workouts} onDelete={deleteWorkout} /> {/* Pass workouts and delete function */}
      <ProgressChart /> {/* Add ProgressChart component */}
    </div>
  );
};

export default Dashboard;
