import { AccountSettings } from "@stackframe/stack";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { stackServerApp } from "@/lib/auth/stack";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function AccountPage() {
  const user = await stackServerApp.getUser();
  if (!user) {
    redirect("/handler/sign-in");
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium">
          <ArrowLeft className="w-5 h-5" />
          Back to BookandLab
        </Link>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <Suspense fallback={<div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>}>
            <AccountSettings />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
