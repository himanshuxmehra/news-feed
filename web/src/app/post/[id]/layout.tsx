import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="md:grid md:grid-cols-8 w-screen">
      <div className="md:col-span-2 md:justify-end">
        <Sidebar />
      </div>
      <div className="w-full md:col-span-4">{children}</div>
      <div className="sm:hidden w-full"></div>
    </div>
  );
}
