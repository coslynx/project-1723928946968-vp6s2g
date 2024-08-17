"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/utils/supabase";
import { useStore } from "@/utils/store";
import { formatDate } from "@/utils/date";
import ProgressChart from "./ProgressChart";

const GoalCard = ({ goal }) => {
  const { data: session } = useSession();
  const { updateGoal, deleteGoal } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(goal.title);
  const [description, setDescription] = useState(goal.description);
  const [targetDate, setTargetDate] = useState(goal.target_date);
  const [progress, setProgress] = useState(goal.progress);
  const [status, setStatus] = useState(goal.status);
  const [error, setError] = useState(null);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const data = {
      title,
      description,
      target_date: targetDate,
      progress,
      status,
    };

    try {
      await supabase.from("goals").update(data).eq("id", goal.id);
      updateGoal(goal.id, data);
      setIsEditing(false);
      setError(null);
    } catch (error) {
      console.error("Error saving goal:", error);
      setError("Error saving goal. Please try again later.");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this goal?")) {
      try {
        await supabase.from("goals").delete().eq("id", goal.id);
        deleteGoal(goal.id);
      } catch (error) {
        console.error("Error deleting goal:", error);
        setError("Error deleting goal. Please try again later.");
      }
    }
  };

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

  return (
    <div className="bg-white rounded-md p-4 shadow-md">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold mb-2">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            />
          ) : (
            title
          )}
        </h3>
        <div className="flex gap-2">
          {!isEditing && (
            <>
              <button
                onClick={handleEdit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus-shadow-outline"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus-shadow-outline"
              >
                Delete
              </button>
            </>
          )}
          {isEditing && (
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus-shadow-outline"
            >
              Save
            </button>
          )}
        </div>
      </div>
      <p className="text-gray-600">
        {isEditing ? (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
          />
        ) : (
          description
        )}
      </p>
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2">
          <span className="font-bold text-gray-600">Target Date:</span>
          <span className="text-gray-600">
            {isEditing ? (
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              />
            ) : (
              formatDate(targetDate)
            )}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="font-bold text-gray-600">Progress:</span>
          <span className="text-gray-600">
            {isEditing ? (
              <input
                type="number"
                value={progress}
                onChange={(e) => setProgress(parseInt(e.target.value, 10))}
                className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              />
            ) : (
              `${progress}%`
            )}
          </span>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <span className="font-bold text-gray-600">Status:</span>
        <span className="text-gray-600">
          {isEditing ? (
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            >
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
            </select>
          ) : (
            getGoalStatus(status)
          )}
        </span>
      </div>
      <ProgressChart goalId={goal.id} />
    </div>
  );
};

export default GoalCard;