"use client";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Post from "./Post";
import { ScrollArea } from "./ui/scroll-area";
import { API_URL } from "@/lib/constants";
import Loader from "./ui/loader";

function Feed() {
  const [latestPosts, setLatestPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [hotPosts, setHotPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("latest");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchPosts = async (sort: string, order: string) => {
      setIsLoading(true);

      const response = await fetch(
        `${API_URL}/api/posts?sort=${sort}&order=${order}`
      );
      const data = await response.json();
      setIsLoading(false);

      return data;
    };

    const fetchTrendingPosts = async () => {
      const response = await fetch(
        `${API_URL}/api/posts?sort=likes&order=desc`
      );
      const data = await response.json();
      return data;
    };

    const fetchHotPosts = async () => {
      const response = await fetch(
        `${API_URL}/api/posts?sort=replies&order=desc`
      );
      const data = await response.json();
      return data;
    };

    if (activeTab === "latest") {
      fetchPosts("date", "desc").then(setLatestPosts);
    } else if (activeTab === "trending") {
      fetchTrendingPosts().then(setTrendingPosts);
    } else if (activeTab === "hot") {
      fetchHotPosts().then(setHotPosts);
    }
  }, [activeTab]);

  return (
    <div className="min-w-screen mx-16 md:mx-0">
      <Tabs defaultValue="latest" onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3 bg-[#2B2D42]">
          <TabsTrigger value="latest">
            <h1 className="text-xl font-poppins text-[#EDF2F4]">Latest</h1>
          </TabsTrigger>
          <TabsTrigger value="trending">
            <h1 className="text-xl font-poppins text-[#EDF2F4]">Trending</h1>
          </TabsTrigger>
          <TabsTrigger value="hot">
            <h1 className="text-xl font-poppins text-[#EDF2F4]">Hot</h1>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="latest">
          {isLoading ? (
            <Loader />
          ) : (
            <ScrollArea className="h-[95vh] rounded-md p-4">
              {latestPosts.map((post) => (
                <Post key={post.id} post={post} />
              ))}
            </ScrollArea>
          )}
        </TabsContent>
        <TabsContent value="trending">
          {isLoading ? (
            <Loader />
          ) : (
            <ScrollArea className="h-[95vh] rounded-md p-4">
              {trendingPosts.map((post) => (
                <Post key={post.id} post={post} />
              ))}
            </ScrollArea>
          )}
        </TabsContent>
        <TabsContent value="hot">
          {isLoading ? (
            <Loader />
          ) : (
            <ScrollArea className="h-[95vh] rounded-md p-4">
              {hotPosts.map((post) => (
                <Post key={post.id} post={post} />
              ))}
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Feed;
