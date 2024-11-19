"use client";
import { API_URL } from "@/lib/constants";
import { BarChart3, ClockAlert, Heart } from "lucide-react";
import React from "react";

function ActionBar({
  data,
}: {
  data: {
    created_at: string;
    likes_count: number;
    views_count: number;
    post_id: string;
  };
}) {
  const [isLiked, setIsLiked] = React.useState(false);
  const [likesCount, setLikesCount] = React.useState(data.likes_count);
  const handleLike = async () => {
    console.log("like");
    let like;
    const headers = {
      Authentication: `Bearer ${localStorage.getItem("token")}`,
    };
    if (isLiked) {
      like = await fetch(`${API_URL}/api/posts/${data.post_id}/like`, {
        method: "DELETE",
        headers,
      }).then((res) => res.json());
    } else {
      like = await fetch(`${API_URL}/api/posts/${data.post_id}/like`, {
        method: "POST",
        headers,
      }).then((res) => res.json());
    }
    setLikesCount(like.likes_count);
    setIsLiked(!isLiked);
  };
  return (
    <div className="mx-auto flex gap-4 text-[#edf2f4]">
      <div className="flex gap-2">
        <ClockAlert className="h-4 w-4 mr-1" />
        {new Date(data.created_at).toLocaleString()}
      </div>
      <div className="flex gap-2" onClick={handleLike}>
        <Heart className="h-4 w-4 mr-1" />
        {likesCount} likes
      </div>
      <div className="flex gap-2">
        <BarChart3 className="h-4 w-4 mr-1" />
        {data.views_count} views
      </div>
    </div>
  );
}

export default ActionBar;
