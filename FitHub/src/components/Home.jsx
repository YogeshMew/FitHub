// src/components/Home.jsx
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// The user wont have access of the Home page if not logged in
const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [navigate]);

  return (
    <div>
      {user ? (
        <div className="min-h-screen flex flex-col items-center justify-center text-center max-w-[800px] w-full mx-auto p-4">
          <div className="flex flex-col gap-4">
            <h1 className="gap-4 uppercase gap-3  font-semibold text-xs sm:text-xs md:text-xs lg:text-xs py-8">
              You have logged in as, <span className="text-blue-400">{user.email}! </span>
            </h1>

            <h1 className="gap-4 uppercase gap-3 font-semibold text-4xl sm:text-5xl md:text-6xl lg:text-7xl py-8">
              FIT<span className="text-blue-400">HUB</span>
            </h1>
            
          </div>

          <div>
            <p className="text-sm md:text-base font-light py-6">
              Looking to feel your best? Our friendly and supportive gym{" "}
              <span className="text-blue-400 font-medium">community</span> is here to help you reach your fitness{" "}
              <span className="text-blue-400 font-medium">goals</span>. With personalized training, join and track your workouts, the joy of a healthy, active lifestyle.
            </p>
          </div>

          <h2 className="text-lg font-medium py-4">Track your workouts and view your progress</h2>

          <button className="px-8 my-8 py-4 rounded-md border-[2px] bg-slate-200 border-blue-400 border-solid blueShadow duration-200"
          onClick={() => navigate("/Main")} >
            <p>Accept and Begin</p>
          </button>
          
         
        </div>
      ) : (
        <p className="text-center">Loading...</p>
      )}
    </div>
  );
};

export default Home;
