import { BarChart3, Heart } from "lucide-react";
import React from "react";

function Reply() {
  const post = {
    id: "1",
    author: {
      name: "John Doe",
      username: "johndoe",

      avatar:
        "https://images.unsplash.com/photo-1731848358278-61c25d75a855?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    content: "yes that's true",
    timestamp: "1h ago",
    likes: 10,
    views: 5,
  };
  return (
    <div key={post.id} className="flex gap-3 p-4">
      <img src={post.author.avatar} className="w-10 h-10 rounded-full" />
      <div>
        <div className="flex gap-2">
          <span className="font-bold">{post.author.name}</span>
          <span className="text-gray-500">@{post.author.username}</span>
          <span className="text-gray-500">{post.timestamp}</span>
        </div>
        <p className="mt-1">{post.content}</p>
        <div className="flex mt-2 text-sm text-gray-500">
          <Heart className="h-4 w-4 mr-1" />
          <button className="hover:text-blue-500 mr-2">
            {post.likes} Likes
          </button>
          <BarChart3 className="h-4 w-4 mr-1" />
          <button className="hover:text-blue-500">{post.views} views</button>
        </div>
      </div>
    </div>
  );
}

export default Reply;
