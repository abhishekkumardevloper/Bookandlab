import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";

const programs = [
  { title: "Foundation Program", desc: "Build core mastery in Math, Science, and English with guided concept labs.", level: "Class 6-7" },
  { title: "Growth Program", desc: "Project-based learning with structured mentorship and weekly feedback loops.", level: "Class 8-9" },
  { title: "Future-Ready Program", desc: "Board preparation + problem-solving + portfolio projects for confident transitions.", level: "Class 10" },
];

export default function ProgramsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header user={null} role={null} />
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-12">
        <h1 className="text-4xl font-bold text-slate-900">Our Learning Programs</h1>
        <p className="mt-4 text-slate-600 max-w-3xl">Every program is designed for outcomes, not content consumption. Students learn concepts, apply them, and reflect through mentor guidance.</p>
      </section>
      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-6">
        {programs.map((program) => (
          <article key={program.title} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">{program.level}</p>
            <h2 className="mt-3 text-xl font-semibold text-slate-900">{program.title}</h2>
            <p className="mt-3 text-slate-600">{program.desc}</p>
          </article>
        ))}
      </section>
      <Footer />
    </main>
  );
}
