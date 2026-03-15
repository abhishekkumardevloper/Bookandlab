import { StackServerApp } from "@stackframe/stack";

const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID;

// Single source of truth for auth availability across the app.
export const isStackAuthEnabled = Boolean(projectId);

export const stackServerApp: StackServerApp | null = isStackAuthEnabled
  ? new StackServerApp({
      tokenStore: "nextjs-cookie",
      urls: {
        afterSignIn: "/auth-callback",
        afterSignUp: "/auth-callback",
      },
    })
  : null;