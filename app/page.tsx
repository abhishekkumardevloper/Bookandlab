import { getDbUser } from "@/lib/auth/user";
import { getActiveRole } from "@/lib/rbac/roles";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { WhyBookandLab } from "@/components/landing/WhyBookandLab";
import { Audience } from "@/components/landing/Audience";
import { StudentJourney } from "@/components/landing/StudentJourney";
import { ParentTrust } from "@/components/landing/ParentTrust";
import { Pricing } from "@/components/landing/Pricing";
import { Footer } from "@/components/landing/Footer";

export default async function Home() {
  const user = await getDbUser().catch(() => null);
  const role = user ? await getActiveRole(user).catch(() => null) : null;

  return (
    <main className="min-h-screen bg-[#F8F9FB] selection:bg-indigo-200 selection:text-[#1E2A5A] font-sans">
      <Header user={user} role={role} />
      <Hero />
      <HowItWorks />
      <WhyBookandLab />
      <StudentJourney />
      <Audience />
      <ParentTrust />
      <Pricing />
      <Footer />
    </main>
  );
}
