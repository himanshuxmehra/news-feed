"use client";

import React, { useEffect, useState } from "react";
import ReplyBox from "@/components/ReplyBox";
import Post from "@/components/Post";
import { useAuth } from "@/lib/auth";
import { API_URL } from "@/lib/constants";

interface Reply {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  likes: number;
  replies: number;
  views: number;
  mediaUrls?: string[];
}

function RepliesSection({ postId }: { postId: string }) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = useAuth((state) => state.token);

  const fetchReplies = async () => {
    try {
      const response = await fetch(`${API_URL}/api/posts/${postId}/replies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch replies");
      }

      const data = await response.json();
      setReplies(data);
    } catch (error) {
      console.error("Error fetching replies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReplies();
  }, [postId, token]);

  const handleNewReply = (newReply: Reply) => {
    setReplies((prev) => [newReply, ...prev]);
  };

  return (
    <div className="space-y-4">
      <ReplyBox postId={postId} onReplyPosted={handleNewReply} />
      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {replies.map((reply) => (
            <Post key={reply.id} post={reply} />
          ))}
        </div>
      )}
    </div>
  );
}

export default RepliesSection;
