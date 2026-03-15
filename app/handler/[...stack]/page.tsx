import { StackHandler } from "@stackframe/stack";
import { isStackAuthEnabled, stackServerApp } from "@/lib/auth/stack";
import { Suspense } from "react";
import { redirect } from "next/navigation";

export default function Handler(props: any) {
  // Resolved conflict: Redirect if auth is disabled OR the app instance is missing
  if (!isStackAuthEnabled || !stackServerApp) {
    redirect("/");
  }

  return (
    <Suspense fallback={null}>
      <StackHandler app={stackServerApp} {...props} />
    </Suspense>
  );
}