"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/utils/supabase";
import { useStore } from "@/utils/store";
import { formatDate } from "@/utils/date";

const UserProfile = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [goals, setGoals] = useState([]);
  const [totalProgress, setTotalProgress] = useState(0);
  const { goals: allGoals } = useStore();

  useEffect(() => {
    if (session?.user) {
      fetchUserData();
      fetchUserGoals();
    }
  }, [session]);

  const fetchUserData = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", session?.user.id);
    if (error) {
      console.error("Error fetching user data:", error);
      return;
    }
    setUser(data[0]);
  };

  const fetchUserGoals = async () => {
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", session?.user.id);
    if (error) {
      console.error("Error fetching user goals:", error);
      return;
    }
    setGoals(data);
  };

  useEffect(() => {
    const calculateTotalProgress = () => {
      if (goals.length === 0) {
        setTotalProgress(0);
        return;
      }

      let progressSum = 0;
      goals.forEach((goal) => {
        const completedPercentage = goal.progress / 100;
        progressSum += completedPercentage;
      });
      setTotalProgress(Math.round((progressSum / goals.length) * 100));
    };

    calculateTotalProgress();
  }, [goals]);

  const getGoalStatus = (goalStatus) => {
    switch (goalStatus) {
      case "Active":
        return "Active";
      case "Completed":
        return "Completed";
      default:
        return "In Progress";
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error loading user data.</div>;
  }

  if (!session?.user) {
    return <div>Please login to view your profile.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
        <div className="bg-gray-200 rounded-full overflow-hidden w-32 h-32">
          <img
            src={user?.avatar_url || "/profile-placeholder.jpg"}
            alt={user?.name || "User Profile"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">
            {user?.name || "Welcome, User"}
          </h2>
          <p className="text-gray-600">{user?.email || "Email not found"}</p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Overall Progress</h2>
        <div className="bg-blue-200 rounded-md p-4 flex items-center justify-between">
          <span className="text-lg font-bold text-blue-800">
            {totalProgress}%
          </span>
          <span className="text-gray-600">
            {`Overall progress across ${goals.length} goals`}
          </span>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Goals</h2>
        <ul className="flex flex-col gap-4">
          {goals.map((goal) => (
            <li key={goal.id} className="bg-white rounded-md p-4 shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold mb-2">{goal.title}</h3>
                  <p className="text-gray-600">{goal.description}</p>
                </div>
                <div>
                  <span className="font-bold text-gray-600">
                    {getGoalStatus(goal.status)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                  <span className="font-bold text-gray-600">Target Date:</span>
                  <span className="text-gray-600">
                    {formatDate(goal.target_date)}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-gray-600">Progress:</span>
                  <span className="text-gray-600">{goal.progress}%</span>
                </div>
              </div>
            </li>
          ))}
          {goals.length === 0 && (
            <li className="bg-white rounded-md p-4 shadow-md">
              <p className="text-gray-600 text-center">
                No goals yet. Start setting some goals on the goals page!
              </p>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default UserProfile;