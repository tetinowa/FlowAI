import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
const isPublicRoute = createRouteMatcher(["/"]);
//ene deedliin route path-iig oorsdoo zasaad oorclorei
export default clerkMiddleware(async (auth, req, next) => {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    alert("sign in/up to access content");
  }
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
  const { userId, orgId } = await auth();
  const requestHeaders = new Headers(req.headers);
  if (userId) {
    requestHeaders.set("clerkId", userId);
  }
  if (orgId) {
    requestHeaders.set("orgId", orgId);
  }
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});
//what I need to do here is:
//once new patron is registered, it has to attach userId and orgnanizationId to every sigle request it sends to database.
export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
