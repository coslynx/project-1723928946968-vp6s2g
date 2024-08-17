"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/utils/supabase";
import { useStore } from "@/utils/store";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProgressChart = ({ goalId }) => {
  const { data: session } = useSession();
  const { goals } = useStore();
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const goal = goals.find((g) => g.id === goalId);
    if (goal) {
      fetchChartData(goal);
    }
  }, [goals, goalId]);

  const fetchChartData = async (goal) => {
    try {
      const { data, error } = await supabase
        .from("goal_progress")
        .select(`progress, created_at`)
        .eq("goal_id", goal.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching chart data:", error);
        return;
      }

      const formattedData = data.map((entry) => ({
        date: new Date(entry.created_at).toLocaleDateString(),
        progress: entry.progress,
      }));
      setChartData(formattedData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  if (!chartData) {
    return <div className="text-gray-600">Loading progress data...</div>;
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Goal Progress",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  const chartDataPoints = {
    labels: chartData.map((entry) => entry.date),
    datasets: [
      {
        label: "Progress",
        data: chartData.map((entry) => entry.progress),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="mt-4">
      <Bar options={chartOptions} data={chartDataPoints} />
    </div>
  );
};

export default ProgressChart;