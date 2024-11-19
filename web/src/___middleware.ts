// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("token");

//   // List of protected paths
//   const protectedPaths = ["/dashboard", "/profile"];

//   // Check if the path is protected
//   const isProtectedPath = protectedPaths.some((path) =>
//     request.nextUrl.pathname.startsWith(path)
//   );

//   if (isProtectedPath && !token) {
//     return NextResponse.redirect(new URL("/auth", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/profile/:path*"],
// };
