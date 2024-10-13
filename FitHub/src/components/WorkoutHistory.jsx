// src/components/WorkoutHistory.jsx

const WorkoutHistory = ({ workouts, onDelete }) => {
  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">Workout History</h2>

      {workouts.length > 0 ? (
        <ul className="space-y-4">
          {workouts.map((workout, index) => (
            <li key={index} className="p-4 bg-gray-100 rounded-md shadow-md flex justify-between items-center">
              <div>
                <p><strong>Exercise:</strong> {workout.exercise}</p>
                <p><strong>Duration:</strong> {workout.duration} minutes</p>
                <p><strong>Intensity:</strong> {workout.intensity}</p>
                <p><strong>Date:</strong> {workout.date}</p>
              </div>
              <button 
                onClick={() => onDelete(index)} 
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 duration-200"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No workouts logged yet.</p>
      )}
    </div>
  );
};

export default WorkoutHistory;
