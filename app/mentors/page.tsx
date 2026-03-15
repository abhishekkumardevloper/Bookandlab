import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";

const mentors = [
  { name: "Riya Sharma", subject: "Mathematics", exp: "8 years mentoring middle school learners" },
  { name: "Arjun Nair", subject: "Science", exp: "Project-based mentor focused on practical reasoning" },
  { name: "Fatima Khan", subject: "English", exp: "Communication coach with writing lab specialization" },
];

export default function MentorsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header user={null} role={null} />
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-12">
        <h1 className="text-4xl font-bold text-slate-900">Meet Our Mentors</h1>
        <p className="mt-4 text-slate-600 max-w-3xl">Mentors at BookandLab are selected for empathy, subject depth, and coaching ability—not just teaching experience.</p>
      </section>
      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-6">
        {mentors.map((mentor) => (
          <article key={mentor.name} className="rounded-2xl border border-slate-200 p-6 bg-slate-50">
            <h2 className="text-xl font-semibold text-slate-900">{mentor.name}</h2>
            <p className="text-indigo-600 mt-2 font-medium">{mentor.subject}</p>
            <p className="text-slate-600 mt-3">{mentor.exp}</p>
          </article>
        ))}
      </section>
      <Footer />
    </main>
  );
}
