import { Protected } from "@/components/auth/Protected";
import Feed from "@/components/Feed";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";

export default function Home() {
  // auth check
  return (
    <Protected>
      <div className="md:grid md:grid-cols-8 w-screen">
        <div className="md:col-span-2 md:justify-end">
          <Sidebar />
        </div>
        <div className="w-full md:col-span-4">
          <Feed />
        </div>
        <div className="sm:hidden w-full"></div>
      </div>
    </Protected>
  );
}
