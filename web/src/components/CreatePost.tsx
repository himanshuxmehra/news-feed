"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image, Gift, MapPin, Smile, ChevronDown, X } from "lucide-react";
import NextImage from "next/image";
import { API_URL } from "@/lib/constants";

const PostSchema = z.object({
  content: z
    .string()
    .min(1, "Post cannot be empty")
    .max(280, "Post cannot exceed 280 characters"),
});

type PostFormData = z.infer<typeof PostSchema>;

export function PostBox() {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const token = useAuth((state) => state.token);
  const user = useAuth((state) => state.user);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(PostSchema),
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
      const response = await fetch(`${API_URL}/api/uploads`, {
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

  const onSubmit = async (data: PostFormData) => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: data.content,
          mediaUrls: imageUrls,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post Post");
      }

      toast({
        title: "Success",
        description: "Post posted successfully",
      });

      // Reset form and images
      reset();
      setImageUrls([]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to post Post",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-b border-gray-700">
      <div className="flex flex-col p-4">
        {/* Header */}
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            className="text-sky-500 font-semibold flex items-center gap-2 hover:bg-sky-500/10"
          >
            Everyone
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        {/* Main input area */}
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-4">
            <textarea
              {...register("content")}
              placeholder="What is happening?!"
              className="bg-transparent text-xl resize-none outline-none flex-1 min-h-[120px] placeholder:text-gray-500"
            />

            {/* Image preview */}
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {imageUrls.map((url, index) => (
                  <div
                    key={url}
                    className="relative rounded-2xl overflow-hidden"
                  >
                    <NextImage
                      src={url}
                      alt={`Uploaded image ${index + 1}`}
                      width={280}
                      height={280}
                      className="object-cover"
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

            {/* Reply settings */}
            <div className="flex items-center text-sky-500 text-sm font-semibold pb-4">
              <Smile className="h-4 w-4 mr-2" />
              Everyone can reply
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700" />

            {/* Actions */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex gap-2">
                {/* Hidden file input */}
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
                {isLoading ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
