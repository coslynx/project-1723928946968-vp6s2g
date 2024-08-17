"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/utils/supabase";
import { useStore } from "@/utils/store";
import SocialFeed from "@/components/SocialFeed";

const HomePage = () => {
  const { data: session } = useSession();
  const [goals, setGoals] = useState([]);
  const { goals: allGoals } = useStore();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", session?.user.id);
      if (error) {
        console.error("Error fetching goals:", error);
        return;
      }
      setGoals(data);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  useEffect(() => {
    setGoals(allGoals);
  }, [allGoals]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Fitness Goal Tracker</h1>
      <h2 className="text-2xl font-bold mb-4">Welcome, {session?.user.name}!</h2>
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
                    {goal.status}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                  <span className="font-bold text-gray-600">
                    Target Date:
                  </span>
                  <span className="text-gray-600">
                    {new Date(goal.target_date).toLocaleDateString()}
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
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Social Feed</h2>
        <SocialFeed />
      </div>
    </div>
  );
};

export default HomePage;