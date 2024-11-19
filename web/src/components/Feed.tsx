"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Post from "./Post";
import { ScrollArea } from "./ui/scroll-area";

function Feed() {
  return (
    <div className="min-w-screen mx-16 md:mx-0">
      <Tabs defaultValue="latest">
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
          <ScrollArea className="h-[95vh] rounded-md p-4">
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="trending">
          <ScrollArea className="h-[95vh] rounded-md p-4">
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="hot">
          <ScrollArea className="h-[95vh] rounded-md p-4">
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Feed;
