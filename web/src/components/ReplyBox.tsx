"use client";
import { useState } from "react";

export default function ReplyBox({ postId }: { postId: string }) {
  const [content, setContent] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({ postId, content }),
    });
    setContent("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 p-4 border-b">
      <img
        src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBvcnRyYWl0fGVufDB8fDB8fHww"
        alt="avatar"
        className="w-10 h-10 rounded-full"
      />
      <div className="flex-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Post your reply"
          className="w-full text-[#2B2D42] p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        <button
          className="mt-2 px-4 py-2 bg-[#d80032] text-white rounded-full hover:bg-[#d80032a7]"
          disabled={!content.trim()}
        >
          Reply
        </button>
      </div>
    </form>
  );
}
