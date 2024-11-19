import { Suspense } from "react";

// Search results with filtering
async function SearchResults({
  query,
  filter,
}: {
  query: string;
  filter: "top" | "latest" | "people";
}) {
  //   const results = await fetch(`/api/search?q=${query}&filter=${filter}`);
  //   const data = await results.json();
  const data = [
    {
      id: "1",
      author: {
        name: "John Doe",
        username: "johndoe",

        avatar:
          "https://images.unsplash.com/photo-1731484636246-ba9365148d60?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.vLorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      timestamp: "1h ago",
      likes: 10,
      reposts: 5,
    },
    {
      id: "2",
      author: {
        name: "Hiehiea Coded",
        username: "rewqsadasdml",

        avatar:
          "https://images.unsplash.com/photo-1731641904795-2873e1da5ac1?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.vLorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      timestamp: "1h ago",
      likes: 10,
      reposts: 5,
    },
  ];

  return (
    <div className="divide-y">
      {data.map((post) => (
        <div key={post.id} className="p-4 hover:border-2">
          <div className="flex gap-3">
            <img src={post.author.avatar} className="w-12 h-12 rounded-full" />
            <div>
              <div className="flex gap-2">
                <span className="font-bold">{post.author.name}</span>
                <span className="text-gray-500">@{post.author.username}</span>
              </div>
              <p className="mt-2">{post.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Main search page
export default function SearchPage({
  searchParams,
}: {
  searchParams: { q: string; filter: "top" | "latest" | "people" };
}) {
  const { q = "", filter = "top" } = searchParams;

  return (
    <main className="max-w-2xl mx-auto">
      <div className="sticky top-0  border-b p-4">
        <input
          type="search"
          placeholder="Search Xseed"
          className="w-full p-3 rounded-full bg-inherit border-2"
          defaultValue={q}
        />
        <div className="flex gap-4 mt-4">
          <a
            href={`/search?q=${q}&filter=top`}
            className={`px-4 py-2 ${
              filter === "top" ? "font-bold border-b-2 border-blue-500" : ""
            }`}
          >
            Top
          </a>
          <a
            href={`/search?q=${q}&filter=latest`}
            className={`px-4 py-2 ${
              filter === "latest" ? "font-bold border-b-2 border-blue-500" : ""
            }`}
          >
            Latest
          </a>
          <a
            href={`/search?q=${q}&filter=people`}
            className={`px-4 py-2 ${
              filter === "people" ? "font-bold border-b-2 border-blue-500" : ""
            }`}
          >
            People
          </a>
        </div>
      </div>

      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <SearchResults query={q} filter={filter} />
      </Suspense>
    </main>
  );
}
