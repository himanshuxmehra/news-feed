import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, ClockAlert, Heart } from "lucide-react";
import ReplyBox from "@/components/ReplyBox";
import Reply from "@/components/Reply";
import { API_URL } from "@/lib/constants";
import ActionBar from "@/components/ActionBar";

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  console.log(id);
  // const post = {
  //   id: "1",
  //   author: {
  //     name: "John Doe",
  //     username: "johndoe",

  //     avatar:
  //       "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBvcnRyYWl0fGVufDB8fDB8fHww",
  //   },
  //   content:
  //     "Lorem ipsum dolor sit amet, consectetur adipiscing elit.vLorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //   timestamp: "1h ago",
  //   likes: 10,
  //   reposts: 5,
  // };

  const data = await fetch(`${API_URL}/api/posts/${id}`).then((res) =>
    res.json()
  );

  return (
    <div className="w-full">
      <Card className="bg-inherit">
        <CardHeader className="border-b-2 mb-4">
          <CardTitle className="text-xl text-[#edf2f4]">Post</CardTitle>
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
                  <h2 className="font-bold text-[#edf2f4]">{data.name}</h2>
                  <span className="text-gray-500">@{data.username}</span>
                </div>

                <p className="mt-2 text-xl text-[#edf2f4]">{data.content}</p>
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
};

export default page;
