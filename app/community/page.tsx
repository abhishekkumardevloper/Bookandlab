import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header user={null} role={null} />
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-24">
        <h1 className="text-4xl font-bold text-slate-900">Community & Parent Circle</h1>
        <p className="mt-4 text-slate-600 max-w-3xl">We build a trusted ecosystem around every learner through parent circles, peer cohorts, and mentor office hours.</p>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <article className="rounded-2xl border border-slate-200 p-6 bg-slate-50">
            <h2 className="text-xl font-semibold text-slate-900">Student Cohorts</h2>
            <p className="mt-3 text-slate-600">Small group interactions for accountability, collaboration, and healthy competition.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 p-6 bg-slate-50">
            <h2 className="text-xl font-semibold text-slate-900">Parent Community</h2>
            <p className="mt-3 text-slate-600">Monthly parent sessions with progress reports, learning tips, and support channels.</p>
          </article>
        </div>
      </section>
      <Footer />
    </main>
  );
}
