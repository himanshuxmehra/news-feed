"use client";

import React, { useEffect, useState } from "react";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  BarChart3,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/lib/constants";

function Post({
  post: initialPost,
}: {
  post: {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    name: string;
    likes_count: number;
    replies: number;
    views_count: number;
  };
}) {
  const [post, setPost] = useState(initialPost);
  const [hasLiked, setHasLiked] = useState(false);
  const token = useAuth((state) => state.token);
  const { toast } = useToast();

  // Check if user has liked the post
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/api/posts/${post.id}/like`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setHasLiked(data.hasLiked);
        }
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    if (token) {
      checkLikeStatus();
    }
  }, [post.id, token]);

  // Increment view count when post is viewed
  useEffect(() => {
    const incrementViews = async () => {
      try {
        const response = await fetch(`${API_URL}/api/posts/${post.id}/view`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPost((prev) => ({ ...prev, views: data.views }));
        }
      } catch (error) {
        console.error("Error incrementing views:", error);
      }
    };

    incrementViews();
  }, [post.id, token]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking like button
    try {
      const method = hasLiked ? "DELETE" : "POST";
      const response = await fetch(`${API_URL}/api/posts/${post.id}/like`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setHasLiked(!hasLiked);
        setPost((prev) => ({
          ...prev,
          likes: hasLiked ? prev.likes - 1 : prev.likes + 1,
        }));
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to like post",
      });
    }
  };

  return (
    <Link href={`/post/${post.id}`} key={post.id}>
      <div className="border-b border-[#edf2f4]/20 py-4 px-4">
        <div className="flex items-start space-x-3">
          <Avatar className="w-10 h-10 border-2 border-[#edf2f4]">
            <img
              src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBvcnRyYWl0fGVufDB8fDB8fHww"
              alt="@facedev"
              className="w-full h-full"
            />
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-1">
              <span className="font-bold text-[#edf2f4]">{post.name}</span>

              <span className="text-[#edf2f4]/60">
                {post.authorId} · {post.createdAt}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto text-[#edf2f4] hover:bg-[#EF233C]/20"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 text-[#edf2f4] space-y-1">
              <p>{post.content}</p>
            </div>
            <div className="mt-3 flex items-center space-x-8">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#edf2f4] hover:text-[#edf2f4]/80 text-sm hover:bg-[#EF233C]/10"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                {post.replies}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={`text-[#edf2f4] hover:text-[#edf2f4]/80 text-sm hover:bg-[#EF233C]/10 ${
                  hasLiked ? "text-red-500" : ""
                }`}
                onClick={handleLike}
              >
                <Heart
                  className={`h-4 w-4 mr-1 ${hasLiked ? "fill-current" : ""}`}
                />
                {post.likes_count}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#edf2f4] hover:text-[#edf2f4]/80 text-sm hover:bg-[#EF233C]/10"
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                {post.views_count}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#edf2f4] hover:text-[#edf2f4]/80 text-sm hover:bg-[#EF233C]/10"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Post;
