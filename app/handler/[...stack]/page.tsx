import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/lib/auth/stack";
import { Suspense } from "react";

export default function Handler(props: any) {
  return (
    <Suspense fallback={null}>
      <StackHandler app={stackServerApp} {...props} />
    </Suspense>
  );
}
