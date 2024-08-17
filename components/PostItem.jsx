"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/utils/supabase";
import { useStore } from "@/utils/store";
import { formatDate } from "@/utils/date";

const PostItem = ({ post }) => {
  const { data: session } = useSession();
  const { goals } = useStore();
  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(
    post.likes?.some((like) => like.user_id === session?.user.id) || false
  );

  const handleLike = async () => {
    if (liked) {
      const { error } = await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", session?.user.id);
      if (error) {
        console.error("Error unliking post:", error);
      } else {
        setLikes((prevLikes) => prevLikes - 1);
        setLiked(false);
      }
    } else {
      const { error } = await supabase
        .from("post_likes")
        .insert({
          post_id: post.id,
          user_id: session?.user.id,
        });
      if (error) {
        console.error("Error liking post:", error);
      } else {
        setLikes((prevLikes) => prevLikes + 1);
        setLiked(true);
      }
    }
  };

  const goal = goals.find((goal) => goal.id === post.goal_id);

  return (
    <div className="bg-white rounded-md p-4 shadow-md">
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2 items-center">
          <img
            src={post.user.avatar_url || "/profile-placeholder.jpg"}
            alt={post.user.name}
            className="w-8 h-8 rounded-full"
          />
          <span className="font-bold">{post.user.name}</span>
        </div>
        <span className="text-gray-600">{formatDate(post.created_at)}</span>
      </div>
      <p className="text-gray-700">{post.content}</p>
      {goal && (
        <p className="text-gray-600 mt-2">
          Goal: <span className="font-bold">{goal.title}</span>
        </p>
      )}
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2">
          <button
            onClick={handleLike}
            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${
              liked ? "bg-blue-600" : ""
            }`}
          >
            {liked ? "Liked" : "Like"}
          </button>
          <span className="text-gray-600">{likes} Likes</span>
        </div>
        <div className="flex gap-2">
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
            Comment
          </button>
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostItem;