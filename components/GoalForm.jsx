"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/utils/supabase";
import { useStore } from "@/utils/store";
import { useRouter } from "next/navigation";

const GoalForm = ({ goalId }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { goals, addGoal, updateGoal, deleteGoal } = useStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Active");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (goalId) {
      const goal = goals.find((g) => g.id === goalId);
      if (goal) {
        setTitle(goal.title);
        setDescription(goal.description);
        setTargetDate(goal.target_date);
        setProgress(goal.progress);
        setStatus(goal.status);
        setIsEditing(true);
      }
    }
  }, [goalId, goals]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !targetDate) {
      setError("Please fill in all required fields.");
      return;
    }

    const data = {
      title,
      description,
      target_date: targetDate,
      progress: progress,
      status,
      user_id: session.user.id,
    };

    try {
      if (isEditing) {
        await supabase
          .from("goals")
          .update(data)
          .eq("id", goalId);
        updateGoal(goalId, data);
      } else {
        const { data: newGoal } = await supabase.from("goals").insert(data);
        addGoal(newGoal);
      }

      setError(null);
      router.push("/goals");
    } catch (error) {
      console.error("Error saving goal:", error);
      setError("Error saving goal. Please try again later.");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this goal?")) {
      try {
        await supabase.from("goals").delete().eq("id", goalId);
        deleteGoal(goalId);
        router.push("/goals");
      } catch (error) {
        console.error("Error deleting goal:", error);
        setError("Error deleting goal. Please try again later.");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        {isEditing ? "Edit Goal" : "Create New Goal"}
      </h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-bold mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="targetDate"
            className="block text-gray-700 font-bold mb-2"
          >
            Target Date
          </label>
          <input
            type="date"
            id="targetDate"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="progress"
            className="block text-gray-700 font-bold mb-2"
          >
            Progress (%)
          </label>
          <input
            type="number"
            id="progress"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(parseInt(e.target.value, 10))}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="status"
            className="block text-gray-700 font-bold mb-2"
          >
            Status
          </label>
          <select
            id="status"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus-shadow-outline"
        >
          {isEditing ? "Save Goal" : "Create Goal"}
        </button>
        {isEditing && (
          <button
            onClick={handleDelete}
            className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus-shadow-outline"
          >
            Delete Goal
          </button>
        )}
      </form>
    </div>
  );
};

export default GoalForm;