import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";

const model = [
  "Concept Clarity through instructor-led sessions",
  "Practice Labs with scenario-based worksheets",
  "Weekly reflection and growth journals",
  "Parent progress reviews with measurable milestones",
];

export default function LearningModelPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header user={null} role={null} />
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-12">
        <h1 className="text-4xl font-bold text-slate-900">The BookandLab Learning Model</h1>
        <p className="mt-4 text-slate-600 max-w-3xl">A clear, repeatable learning cycle that helps students think deeply, build confidence, and perform consistently.</p>
      </section>
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          {model.map((point) => (
            <div key={point} className="flex gap-3 items-start">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-600" />
              <p className="text-slate-700">{point}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
