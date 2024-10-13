import { useState, useEffect } from "react";
import { addWorkout } from '../services/workoutService'; // Import the Firestore function
import { db } from '../firebase'; // Import your Firestore instance
import { collection, getDocs } from "firebase/firestore"; // Import Firestore methods

const WorkoutLog = () => {
  const [exercise, setExercise] = useState("");
  const [duration, setDuration] = useState("");
  const [intensity, setIntensity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiWorkouts, setApiWorkouts] = useState([]); // State to hold API workouts
  const [loggedWorkouts, setLoggedWorkouts] = useState([]); // State to hold logged workouts
  const [totalDuration, setTotalDuration] = useState(0); // State for total duration
  const [workoutCount, setWorkoutCount] = useState(0); // State for workout count

  useEffect(() => {
    // Function to fetch workouts from the API
    const fetchApiWorkouts = async () => {
      try {
        const response = await fetch("YOUR_API_URL_HERE"); // Replace with your API URL
        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }
        const data = await response.json();
        setApiWorkouts(data); // Assuming data is an array of workouts
      } catch (err) {
        setError(err.message);
      }
    };

    // Function to fetch logged workouts from Firestore
    const fetchLoggedWorkouts = async () => {
      try {
        const workoutsSnapshot = await getDocs(collection(db, "workouts")); // Fetch workouts
        const workoutsData = workoutsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLoggedWorkouts(workoutsData); // Set state with fetched workouts

        // Calculate total duration and workout count
        const totalDuration = workoutsData.reduce((sum, workout) => sum + (workout.duration || 0), 0);
        setTotalDuration(totalDuration);
        setWorkoutCount(workoutsData.length);
      } catch (error) {
        setError("Failed to load logged workouts");
      }
    };

    // Fetch workouts from the API and Firestore
    fetchApiWorkouts();
    fetchLoggedWorkouts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const workout = {
      exercise,
      duration: parseInt(duration),
      intensity,
      date: new Date().toLocaleDateString(),
    };

    // Add the new workout to Firestore
    await addWorkout(workout);

    // Clear form fields
    setExercise("");
    setDuration("");
    setIntensity("");
    alert("Workout Logged Successfully!");

    // Update logged workouts and recalculate analytics
    const updatedWorkouts = [...loggedWorkouts, workout];
    setLoggedWorkouts(updatedWorkouts);
    
    // Recalculate total duration and workout count
    setTotalDuration(prevDuration => prevDuration + workout.duration);
    setWorkoutCount(prevCount => prevCount + 1);

    setLoading(false);
  };

  return (
    <div className="my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Log Your Workout</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Exercise dropdown */}
        <div>
          <label htmlFor="exercise" className="block font-medium text-gray-700">Exercise:</label>
          <select
            id="exercise"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring focus:ring-blue-300"
            required
          >
            <option value="">Select an exercise</option>
            <option value="Push-ups">Push-ups</option>
            <option value="Sit-ups">Sit-ups</option>
            <option value="Running">Running</option>
            <option value="Cycling">Cycling</option>
            <option value="Jumping Jacks">Jumping Jacks</option>
            <option value="Plank">Plank</option>
          </select>
        </div>

        {/* Duration input */}
        <div>
          <label htmlFor="duration" className="block font-medium text-gray-700">Duration (minutes):</label>
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Intensity dropdown */}
        <div>
          <label htmlFor="intensity" className="block font-medium text-gray-700">Intensity:</label>
          <select
            id="intensity"
            value={intensity}
            onChange={(e) => setIntensity(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring focus:ring-blue-300"
            required
          >
            <option value="">Select Intensity</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
          disabled={loading}
        >
          {loading ? "Logging Workout..." : "Log Workout"}
        </button>
      </form>

      {/* Display total workout duration and count */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-gray-800">Workout Analytics</h3>
        <p>Total Workouts Logged: {workoutCount}</p>
        <p>Total Duration: {totalDuration} minutes</p>
      </div>

      {/* Display API workouts */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-gray-800">API Workouts</h3>
        <ul>
          {apiWorkouts.map((workout, index) => (
            <li key={index} className="p-2 border-b">{workout.exercise} - {workout.duration} mins</li>
          ))}
        </ul>
      </div>

      {/* Display logged workouts */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-gray-800">Logged Workouts</h3>
        <ul>
          {loggedWorkouts.map((workout, index) => (
            <li key={index} className="p-2 border-b">{workout.exercise} - {workout.duration} mins</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WorkoutLog;
