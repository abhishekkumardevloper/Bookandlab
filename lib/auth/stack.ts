import { StackServerApp } from "@stackframe/stack";

const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID;

export const isStackAuthEnabled = Boolean(projectId);

export const stackServerApp = isStackAuthEnabled
  ? new StackServerApp({
      tokenStore: "nextjs-cookie",
      urls: {
        afterSignIn: "/auth-callback",
        afterSignUp: "/auth-callback",
      },
    })
  : ({
      async getUser() {
        return null;
      },
    } as unknown as StackServerApp);
