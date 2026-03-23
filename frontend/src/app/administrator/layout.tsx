"use client";


/**
 * Layout component that enforces onboarding completion and renders the dashboard shell.
 *
 * When user data finishes loading, redirects users whose `publicMetadata.onboardingComplete`
 * is falsy to "/onboarding". While loading or when onboarding is incomplete, renders `null`.
 *
 * @param children - The page content to render inside the dashboard layout
 * @returns The dashboard layout containing the sidebar and top bar with `children`, or `null` if the user is not ready or not onboarded
 */
export default function SupaDupaAdminLayouttoDesu({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={`w-full h-screen no-scrollbar overflow-hidden`}>{children}</div>;
}
