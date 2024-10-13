import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth"; // Import sendPasswordResetEmail
import { useNavigate, Link } from "react-router-dom";
import SandlyLanding from "../assets/SandlyLanding.png"; // Import the image directly

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // State for loading
  const [resetEmailSent, setResetEmailSent] = useState(false); // State to track if reset email is sent
  const navigate = useNavigate();

  // Check if the user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard"); // Redirect to the dashboard if logged in
      }
    });
    return unsubscribe; // Cleanup subscription on unmount
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(""); // Clear any previous errors

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // Redirect to the home page
    } catch (error) {
      setError(error.message); // Set the error message in state
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true); // Set the state to indicate the email was sent
    } catch (error) {
      setError(error.message); // Set the error message in state
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-200">
      {/* Container for image and login form */}
      <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-between w-full max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden">
        
        {/* Left side with the workout image */}
        <div className="hidden lg:block w-full lg:w-1/2">
          <img 
            src={SandlyLanding} // Use the imported image here
            alt="Workout"
            className="w-full h-auto object-cover" // Ensure the image covers the area properly
          />
        </div>

        {/* Right side with the login form */}
        <div className="w-full lg:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>

          {/* Display error message if exists */}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {resetEmailSent && <p className="text-green-500 text-center mb-4">Password reset email sent!</p>} {/* Display success message */}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full bg-blue-500 text-white p-3 rounded-lg transition duration-200 ${
                loading ? "bg-gray-400" : "hover:bg-blue-600"
              }`}
              disabled={loading} // Disable button while loading
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <button onClick={handlePasswordReset} className="mt-4 text-blue-500 hover:underline">
            Forgot Password?
          </button>

          <p className="mt-4 text-center text-gray-600">
            Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
