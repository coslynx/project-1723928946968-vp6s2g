"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/utils/supabase";
import { useStore } from "@/utils/store";
import GoalForm from "@/components/GoalForm";
import GoalList from "@/components/GoalList";

const GoalsPage = () => {
  const { data: session } = useSession();
  const { goals, addGoal, updateGoal, deleteGoal } = useStore();
  const [selectedGoalId, setSelectedGoalId] = useState(null);

  const handleGoalSelect = (goalId) => {
    setSelectedGoalId(goalId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Your Goals</h1>
      <GoalForm goalId={selectedGoalId} />
      <GoalList handleGoalSelect={handleGoalSelect} />
    </div>
  );
};

export default GoalsPage;