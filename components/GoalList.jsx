"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/utils/supabase";
import { useStore } from "@/utils/store";
import GoalCard from "./GoalCard";

const GoalList = () => {
  const { data: session } = useSession();
  const [goals, setGoals] = useState([]);
  const { goals: allGoals, addGoal } = useStore();

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
      <h1 className="text-3xl font-bold mb-4">Your Goals</h1>
      <ul className="flex flex-col gap-4">
        {goals.map((goal) => (
          <li key={goal.id}>
            <GoalCard goal={goal} />
          </li>
        ))}
        {goals.length === 0 && (
          <li className="bg-white rounded-md p-4 shadow-md">
            <p className="text-gray-600 text-center">
              No goals yet. Start setting some goals!
            </p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default GoalList;