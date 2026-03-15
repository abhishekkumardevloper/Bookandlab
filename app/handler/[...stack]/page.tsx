import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/lib/auth/stack";
import { Suspense } from "react";
import { redirect } from "next/navigation";

export default function Handler(props: any) {
  if (!stackServerApp) {
    redirect("/");
  }

  return (
    <Suspense fallback={null}>
      <StackHandler app={stackServerApp} {...props} />
    </Suspense>
  );
}
