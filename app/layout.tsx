import type { ComponentProps } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/lib/auth/stack";

export const metadata: Metadata = {
  title: {
    template: "%s | BookandLab",
    default: "BookandLab - The Digital School System",
  },
  description:
    "A structured digital school for Classes 6–10 where students think, apply, and grow — not just watch videos.",
};

const stackProviderApp = stackServerApp as unknown as ComponentProps<typeof StackProvider>["app"];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {stackServerApp ? (
          <StackProvider app={stackProviderApp}>
            <StackTheme>{children}</StackTheme>
          </StackProvider>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
