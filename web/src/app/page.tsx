"use client";
import { PostBox } from "@/components/CreatePost";
import Feed from "@/components/Feed";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    // auth check
    const token = useAuth((state) => state.token);
    const router = useRouter();
    useEffect(() => {
        if (!token) {
            router.push("/auth");
        }
    }, [token, router]);
    return (
        <div className="md:grid md:grid-cols-8 w-screen">
            <div className="md:col-span-2 md:justify-end">
                <Sidebar />
            </div>
            <div className="w-full md:col-span-4">
                <Feed />
            </div>
            <div className="w-full col-span-2">
                <PostBox />
            </div>
        </div>
    );
}
