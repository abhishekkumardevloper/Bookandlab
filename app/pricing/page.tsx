import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";

const plans = [
  { name: "Starter", price: "₹1,499/mo", tag: "Best for Class 6-7", features: ["3 live classes/week", "Mentor chat support", "Weekly progress report"] },
  { name: "Plus", price: "₹2,499/mo", tag: "Best for Class 8-9", features: ["5 live classes/week", "Doubt-solving labs", "Parent review call"] },
  { name: "Advanced", price: "₹3,499/mo", tag: "Best for Class 10", features: ["Board prep roadmap", "Mock tests + analysis", "Priority mentor support"] },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header user={null} role={null} />
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-12 text-center">
        <h1 className="text-4xl font-bold text-slate-900">Flexible Pricing for Every Family</h1>
        <p className="mt-4 text-slate-600">Choose a plan based on your child&apos;s stage and goals. Upgrade anytime.</p>
      </section>
      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <article key={plan.name} className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-indigo-600">{plan.tag}</p>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">{plan.name}</h2>
            <p className="text-3xl font-extrabold mt-3 text-slate-900">{plan.price}</p>
            <ul className="mt-5 space-y-2 text-slate-600">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
      <Footer />
    </main>
  );
}
