"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/utils/supabase";
import { useStore } from "@/utils/store";
import { formatDate } from "@/utils/date";
import PostItem from "./PostItem";

const SocialFeed = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const { goals } = useStore();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          user:users(
            id,
            name,
            avatar_url
          ),
          goal:goals(
            id,
            title
          ),
          post_likes(
            user_id
          )
        `
        )
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching posts:", error);
        return;
      }
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Social Feed</h1>
      <ul className="flex flex-col gap-4">
        {posts.map((post) => (
          <li key={post.id}>
            <PostItem post={post} />
          </li>
        ))}
        {posts.length === 0 && (
          <li className="bg-white rounded-md p-4 shadow-md">
            <p className="text-gray-600 text-center">
              No posts yet. Start sharing your progress!
            </p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default SocialFeed;