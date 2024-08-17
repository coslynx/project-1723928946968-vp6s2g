import { supabase } from "./supabase";

export const getGoals = async (userId) => {
  try {
    const { data: goals, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      throw error;
    }

    return goals;
  } catch (error) {
    console.error("Error fetching goals:", error);
    throw error;
  }
};

export const createGoal = async (goal) => {
  try {
    const { data: newGoal, error } = await supabase.from("goals").insert(goal);

    if (error) {
      throw error;
    }

    return newGoal;
  } catch (error) {
    console.error("Error creating goal:", error);
    throw error;
  }
};

export const updateGoal = async (goalId, goal) => {
  try {
    const { error } = await supabase
      .from("goals")
      .update(goal)
      .eq("id", goalId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error updating goal:", error);
    throw error;
  }
};

export const deleteGoal = async (goalId) => {
  try {
    const { error } = await supabase
      .from("goals")
      .delete()
      .eq("id", goalId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error deleting goal:", error);
    throw error;
  }
};

export const getPosts = async () => {
  try {
    const { data: posts, error } = await supabase
      .from("posts")
      .select(
        `
          *,\n
          user:users(
            id,\n
            name,\n
            avatar_url
          ),\n
          goal:goals(
            id,\n
            title
          ),\n
          post_likes(
            user_id
          )
        `
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const createPost = async (post) => {
  try {
    const { data: newPost, error } = await supabase.from("posts").insert(post);

    if (error) {
      throw error;
    }

    return newPost;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const likePost = async (postId, userId) => {
  try {
    const { error } = await supabase
      .from("post_likes")
      .insert({ post_id: postId, user_id: userId });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
};

export const unlikePost = async (postId, userId) => {
  try {
    const { error } = await supabase
      .from("post_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error unliking post:", error);
    throw error;
  }
};

export const getUserData = async (userId) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId);

    if (error) {
      throw error;
    }

    return user[0];
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const getUserGoals = async (userId) => {
  try {
    const { data: goals, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      throw error;
    }

    return goals;
  } catch (error) {
    console.error("Error fetching user goals:", error);
    throw error;
  }
};

export const updateProgress = async (goalId, progress) => {
  try {
    const { error } = await supabase
      .from("goals")
      .update({ progress })
      .eq("id", goalId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error updating progress:", error);
    throw error;
  }
};

export const getGoalProgressData = async (goalId) => {
  try {
    const { data: progressData, error } = await supabase
      .from("goal_progress")
      .select(`progress, created_at`)
      .eq("goal_id", goalId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return progressData;
  } catch (error) {
    console.error("Error fetching goal progress data:", error);
    throw error;
  }
};

export const logProgress = async (goalId, progress) => {
  try {
    const { error } = await supabase
      .from("goal_progress")
      .insert({ goal_id: goalId, progress });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error logging progress:", error);
    throw error;
  }
};