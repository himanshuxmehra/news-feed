import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import ReplyBox from "@/components/ReplyBox";
import Reply from "@/components/Reply";
import { API_URL } from "@/lib/constants";
import ActionBar from "@/components/ActionBar";
import { toast } from "@/hooks/use-toast";

interface PostData {
    id: string;
    name: string;
    username: string;
    avatar: string;
    content: string;
    created_at: string;
    likes_count: number;
    views_count: number;
}
export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    console.log(id);
    let data;
    try {
        const res = await fetch(`${API_URL}/api/posts/${id}`);
        if (!res.ok) {
            throw new Error("Failed to fetch post");
        }
        data = await res.json();
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description:
                error instanceof Error ? error.message : "Loading Failed",
        });
    }
    return (
        <div className="w-full">
            <Card className="bg-inherit">
                <CardHeader className="border-b-2 mb-4">
                    <CardTitle className="text-xl text-[#edf2f4]">
                        Post
                    </CardTitle>
                </CardHeader>
                <CardContent className="m-0">
                    <article className="max-w-2xl mx-auto px-4">
                        <div className="flex items-start gap-3 border-b pb-4">
                            <img
                                src={data.avatar}
                                className="w-12 h-12 rounded-full"
                                alt={data.name}
                            />

                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h2 className="font-bold text-[#edf2f4]">
                                        {data.name}
                                    </h2>
                                    <span className="text-gray-500">
                                        @{data.username}
                                    </span>
                                </div>

                                <p className="mt-2 text-xl text-[#edf2f4]">
                                    {data.content}
                                </p>
                            </div>
                        </div>
                    </article>
                </CardContent>
                <CardFooter>
                    <ActionBar
                        data={{
                            created_at: data.created_at,
                            likes_count: data.likes_count,
                            views_count: data.views_count,
                            post_id: data.id,
                        }}
                    />
                </CardFooter>
            </Card>
            <h1 className="text-2xl my-2 border-b-2 pb-2">Replies</h1>
            <ReplyBox postId={data.id} />
            <Reply />
            <Reply />
            <Reply />
            <Reply />
            <Reply />
        </div>
    );
}
