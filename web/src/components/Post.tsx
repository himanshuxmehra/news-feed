import React from "react";
import { Avatar } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  BarChart3,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import Link from "next/link";

function Post() {
  return (
    <Link href={"/posts/${dasdsa}"}>
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
              <span className="font-bold text-[#edf2f4]">face</span>

              <span className="text-[#edf2f4]/60">@facedev · 1d</span>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto text-[#edf2f4] hover:bg-[#EF233C]/20"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 text-[#edf2f4] space-y-1">
              <p>
                Lyntr is now sitting at 400+ users. Lyntr is now sitting at
                3000+ lynts. Lyntr is now sitting at 197,000+ views. I might
                have to upgrade my database 😅 Lyntr is now sitting at 400+
                users. Lyntr is now sitting at 3000+ lynts. Lyntr is now sitting
                at 197,000+ views. I might have to upgrade my database 😅
              </p>
            </div>
            <div className="mt-3 flex items-center space-x-8">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#edf2f4] hover:text-[#edf2f4]/80 text-sm hover:bg-[#EF233C]/10"
              >
                <MessageCircle className="h-4 w-4 mr-1" />5
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-[#edf2f4] hover:text-[#edf2f4]/80 text-sm hover:bg-[#EF233C]/10"
              >
                <Heart className="h-4 w-4 mr-1" />
                17
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#edf2f4] hover:text-[#edf2f4]/80 text-sm hover:bg-[#EF233C]/10"
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                91
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
