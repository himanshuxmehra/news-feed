"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Image, X } from "lucide-react";

const replySchema = z.object({
  content: z
    .string()
    .min(1, "Reply cannot be empty")
    .max(280, "Reply cannot exceed 280 characters"),
});

type ReplyFormData = z.infer<typeof replySchema>;

interface ReplyBoxProps {
  postId: string;
  onReplyPosted?: (reply: any) => void;
}

function ReplyBox({ postId, onReplyPosted }: ReplyBoxProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const token = useAuth((state) => state.token);
  const user = useAuth((state) => state.user);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ReplyFormData>({
    resolver: zodResolver(replySchema),
  });

  const content = watch("content", "");

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || imageUrls.length + files.length > 4) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Maximum 4 images allowed",
      });
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await fetch("http://localhost:4000/api/uploads", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload images");
      }

      const data = await response.json();
      setImageUrls((prev) => [...prev, ...data.urls]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload images",
      });
    }
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ReplyFormData) => {
    try {
      setIsLoading(true);

      const response = await fetch("http://localhost:4000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: data.content,
          mediaUrls: imageUrls,
          parentPostId: postId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post reply");
      }

      const newReply = await response.json();

      toast({
        title: "Success",
        description: "Reply posted successfully",
      });

      // Reset form and images
      reset();
      setImageUrls([]);

      // Notify parent component
      if (onReplyPosted) {
        onReplyPosted(newReply);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to post reply",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-b bg-gray-700 border-gray-700 p-4">
      <div className="flex gap-4">
        <Avatar className="h-10 w-10">
          <img
            src={"/globe.svg"}
            alt={user?.name}
            className="h-full w-full rounded-full"
          />
        </Avatar>

        <div className="flex-1 flex flex-col gap-4">
          <textarea
            {...register("content")}
            placeholder="Post your reply"
            className="bg-transparent text-xl resize-none outline-none flex-1 min-h-[100px] placeholder:text-gray-500"
          />

          {/* Image preview */}
          {imageUrls.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {imageUrls.map((url, index) => (
                <div key={url} className="relative rounded-2xl overflow-hidden">
                  <img
                    src={url}
                    alt={`Uploaded image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/75 text-white rounded-full"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e.target.files)}
              />

              <Button
                size="icon"
                variant="ghost"
                className="text-sky-500 h-8 w-8 hover:bg-sky-500/10"
                onClick={handleImageClick}
                disabled={imageUrls.length >= 4}
              >
                <Image className="h-5 w-5" />
              </Button>
            </div>

            <Button
              onClick={handleSubmit(onSubmit)}
              className="rounded-full px-4 bg-sky-500 hover:bg-sky-600 font-semibold"
              disabled={isLoading || !content}
            >
              {isLoading ? "Replying..." : "Reply"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReplyBox;
