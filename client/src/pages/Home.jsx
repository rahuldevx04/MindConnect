import {
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";

import {
  Brain,
  Users,
  ShieldCheck,
} from "lucide-react";

function Home() {

  return (

    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-100 overflow-x-hidden">

      {/* ================= NAVBAR ================= */}

      <nav className="flex justify-between items-center px-6 md:px-12 py-4 bg-white shadow-sm border-b">

        {/* LOGO */}

        <div>

          <h1 className="text-2xl md:text-3xl font-bold text-cyan-600">

            MindConnect

          </h1>

          <p className="text-xs md:text-sm text-slate-500 mt-1">

            AI Mental Wellness Support Platform

          </p>

        </div>

        {/* BUTTONS */}

        <div className="flex gap-3">

          {/* LOGIN */}

          <SignInButton
            mode="modal"
            forceRedirectUrl="/role-redirect"
          >

            <button className="px-5 py-2 rounded-xl bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-700 transition">

              Login

            </button>

          </SignInButton>

          {/* REGISTER */}

          <SignUpButton
            mode="modal"
            forceRedirectUrl="/role-redirect"
          >

            <button className="px-5 py-2 rounded-xl border-2 border-cyan-600 text-cyan-600 text-sm font-medium hover:bg-cyan-50 transition">

              Register

            </button>

          </SignUpButton>

        </div>

      </nav>

      {/* ================= HERO SECTION ================= */}

      <section className="px-6 py-20 md:py-24 text-center">

        <div className="max-w-5xl mx-auto">

          {/* BADGE */}

          <div className="inline-block bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-xs md:text-sm font-semibold mb-8">

            AI Powered Student Wellness Platform

          </div>

          {/* TITLE */}

          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">

            Empowering Students Through

            <span className="block text-cyan-600 mt-3">

              AI Wellness & Mentorship

            </span>

          </h1>

          {/* DESCRIPTION */}

          <p className="mt-8 text-base md:text-lg text-slate-600 leading-8 max-w-3xl mx-auto">

            MindConnect helps students anonymously share thoughts,
            receive mentor support,
            track emotional wellness using NLP,
            and improve mental health through AI-driven insights.

          </p>

          {/* CTA BUTTON */}

          <div className="mt-10">

            <SignInButton
              mode="modal"
              forceRedirectUrl="/role-redirect"
            >

              <button className="px-8 py-3 bg-cyan-600 text-white rounded-2xl text-base font-semibold hover:bg-cyan-700 transition shadow-lg">

                Get Started

              </button>

            </SignInButton>

          </div>

        </div>

      </section>

      {/* ================= FEATURES ================= */}

      <section className="px-6 md:px-12 py-14">

        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">

          Platform Features

        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {/* FEATURE 1 */}

          <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition">

            <Brain className="w-12 h-12 text-cyan-500 mb-5" />

            <h3 className="text-xl font-bold text-cyan-600 mb-4">

              AI Emotion Analysis

            </h3>

            <p className="text-slate-600 text-sm md:text-base leading-7">

              Detect stress, emotional imbalance,
              anxiety, positivity,
              and mood trends using NLP analytics.

            </p>

          </div>

          {/* FEATURE 2 */}

          <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition">

            <Users className="w-12 h-12 text-blue-500 mb-5" />

            <h3 className="text-xl font-bold text-blue-600 mb-4">

              Mentor Support

            </h3>

            <p className="text-slate-600 text-sm md:text-base leading-7">

              Connect students with mentors
              for emotional guidance,
              support,
              and wellbeing assistance.

            </p>

          </div>

          {/* FEATURE 3 */}

          <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition">

            <ShieldCheck className="w-12 h-12 text-emerald-500 mb-5" />

            <h3 className="text-xl font-bold text-emerald-600 mb-4">

              Anonymous Thoughts

            </h3>

            <p className="text-slate-600 text-sm md:text-base leading-7">

              Safely express emotions anonymously
              while maintaining privacy
              and emotional safety.

            </p>

          </div>

        </div>

      </section>

      {/* ================= STATS ================= */}

      <section className="bg-white py-14 px-6 border-y">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">

          <div>

            <h1 className="text-4xl font-bold text-cyan-600">

              1000+

            </h1>

            <p className="mt-2 text-sm md:text-base text-slate-600">

              Student Thoughts

            </p>

          </div>

          <div>

            <h1 className="text-4xl font-bold text-blue-600">

              250+

            </h1>

            <p className="mt-2 text-sm md:text-base text-slate-600">

              Mentors Available

            </p>

          </div>

          <div>

            <h1 className="text-4xl font-bold text-emerald-500">

              95%

            </h1>

            <p className="mt-2 text-sm md:text-base text-slate-600">

              Wellness Accuracy

            </p>

          </div>

          <div>

            <h1 className="text-4xl font-bold text-orange-500">

              24/7

            </h1>

            <p className="mt-2 text-sm md:text-base text-slate-600">

              Emotional Support

            </p>

          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="bg-slate-950 py-12 text-center">

        <h1 className="text-2xl font-bold text-cyan-400 mb-3">

          MindConnect

        </h1>

        <p className="text-slate-300 text-sm md:text-base">

          Empowering Student Mental Wellness Through AI

        </p>

        <p className="text-slate-500 text-xs mt-5">

          Built using React, Clerk, Supabase & NLP Analytics

        </p>

      </footer>

    </div>

  );

}

export default Home;