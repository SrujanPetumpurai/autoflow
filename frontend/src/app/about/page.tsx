"use client"

import { useRouter } from "next/navigation"
import BackArrow from "@/components/BackArrow"
const stats = [
  { num: "2M+", label: "Automations created" },
  { num: "500+", label: "App integrations" },
  { num: "98%", label: "Uptime reliability" },
  { num: "40k", label: "Happy users worldwide" },
]

const values = [
  {
    num: "01",
    title: "Simplicity first",
    desc: "If it takes more than a minute to set up, we've failed. Every feature must pass the simplicity test before it ships.",
  },
  {
    num: "02",
    title: "Reliability above all",
    desc: "Your automations run in the background 24/7. They need to work every single time — no excuses, no exceptions.",
  },
  {
    num: "03",
    title: "Built for humans",
    desc: "No jargon, no complex configs. We design for the person who just wants things to work, not the one who enjoys debugging.",
  },
]

const team = [
  { initials: "AK", name: "Alex Kim", role: "Co-founder & CEO" },
  { initials: "SR", name: "Sara Reyes", role: "Co-founder & CTO" },
  { initials: "MJ", name: "Marcus J.", role: "Head of Design" },
  { initials: "LP", name: "Lena Park", role: "Lead Engineer" },
]

const avatarColors = [
  "bg-orange-100 text-orange-500",
  "bg-gray-100 text-gray-800",
  "bg-orange-50 text-orange-400",
  "bg-gray-100 text-gray-700",
]

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#fafaf8] text-[#1a1a1a] font-sans overflow-x-hidden">
        <BackArrow></BackArrow>
      {/* HERO */}
      <section className="max-w-5xl mx-auto px-12 pt-24 pb-20 relative">
        <div className="absolute right-12 top-20 w-80 h-80 rounded-full bg-orange-500/5 pointer-events-none" />
        <span className="inline-block text-[11px] font-medium tracking-widest uppercase text-orange-500 border border-orange-200 rounded-full px-4 py-1 mb-7">
          About Zapflow
        </span>
        <h1 className="font-extrabold text-[clamp(42px,6vw,80px)] leading-[1.05] tracking-tight text-[#111] max-w-3xl">
          We connect the tools<br />you{" "}
          <em className="not-italic text-orange-500 font-semibold">already</em> love.
        </h1>
        <p className="mt-7 text-lg font-light text-[#555] leading-relaxed max-w-lg">
          Zapflow was built on one idea — your apps should talk to each other, so you don't have to.
          No code, no hassle, just flow.
        </p>
      </section>

      {/* STATS */}
      <div className="border-t border-b border-[#e8e6e0] max-w-5xl mx-auto px-12 py-12 grid grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`px-8 ${i !== 0 ? "border-l border-[#e8e6e0]" : "pl-0"} ${i === stats.length - 1 ? "" : ""}`}
          >
            <div className="text-[44px] font-extrabold tracking-tight leading-none text-[#111]">
              {s.num.replace(/[+%k]$/, "")}
              <span className="text-orange-500">{s.num.match(/[+%k]$/)?.[0]}</span>
            </div>
            <div className="mt-1.5 text-[13px] text-[#888]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* MISSION */}
      <section className="max-w-5xl mx-auto px-12 py-24 grid grid-cols-2 gap-20 items-center">
        <div>
          <div className="text-[11px] font-medium tracking-widest uppercase text-[#aaa] mb-5">
            Our mission
          </div>
          <h2 className="text-[36px] font-bold leading-[1.2] tracking-tight text-[#111]">
            Automation should be for everyone, not just developers.
          </h2>
        </div>
        <div className="text-base font-light text-[#555] leading-relaxed space-y-4">
          <p>
            We started Zapflow because we were tired of copying data between apps manually.
            There had to be a better way — and there was.
          </p>
          <p>
            Today, Zapflow lets anyone build powerful automations in minutes. Whether you're a
            solo founder or a growing team, we give you back the hours that repetitive tasks steal.
          </p>
        </div>
      </section>

      {/* FLOW VISUAL */}
      <div className="max-w-5xl mx-auto px-12 pb-20">
        <div className="bg-[#111] rounded-2xl p-10 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-orange-500/10 pointer-events-none" />
          <div className="text-[11px] text-[#666] uppercase tracking-widest mb-4">
            Example automation
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {["📧 Gmail", "📋 Notion", "💬 Slack"].map((app, i) => (
              <>
                {i > 0 && (
                  <span key={`arrow-${i}`} className="text-orange-500 text-lg">→</span>
                )}
                {i === 1 ? (
                  <div key={app} className="bg-orange-500 text-white rounded-xl px-4 py-2.5 text-[13px] font-semibold">
                    ⚡ Zapflow
                  </div>
                ) : null}
                <div key={app} className="bg-[#1e1e1e] border border-[#333] text-white rounded-xl px-4 py-2.5 text-[13px] font-medium">
                  {app}
                </div>
              </>
            ))}
          </div>
          <p className="mt-4 text-[13px] text-[#555]">
            New email → Save to Notion → Notify team on Slack
          </p>
        </div>
      </div>

      {/* VALUES */}
      <section className="bg-[#111] py-24 px-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-end mb-14">
            <h2 className="text-[40px] font-extrabold tracking-tight text-white leading-[1.1]">
              What we<br />stand for
            </h2>
            <p className="text-[14px] text-[#666] max-w-[260px] text-right leading-relaxed">
              Three principles that guide every decision we make at Zapflow.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-0.5">
            {values.map((v) => (
              <div
                key={v.num}
                className="bg-[#161616] hover:bg-[#1a1a1a] transition-colors p-9 rounded-sm"
              >
                <div className="text-[11px] font-semibold text-orange-500 tracking-widest mb-5">
                  {v.num}
                </div>
                <div className="text-[20px] font-bold text-white mb-3">{v.title}</div>
                <div className="text-[14px] text-[#666] leading-relaxed font-light">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="max-w-5xl mx-auto px-12 py-24">
        <div className="text-[11px] font-medium tracking-widest uppercase text-[#aaa] mb-4">
          The team
        </div>
        <h2 className="text-[40px] font-extrabold tracking-tight text-[#111] mb-14 leading-[1.1]">
          Small team,<br />big ambitions.
        </h2>
        <div className="grid grid-cols-4 gap-6">
          {team.map((member, i) => (
            <div key={member.name} className="flex flex-col gap-3">
              <div
                className={`w-full aspect-square rounded-2xl flex items-center justify-center text-[28px] font-extrabold tracking-tight ${avatarColors[i]}`}
              >
                {member.initials}
              </div>
              <div className="text-[16px] font-bold text-[#111]">{member.name}</div>
              <div className="text-[13px] text-[#888] font-light -mt-2">{member.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-12 pb-20">
        <div className="bg-orange-500 rounded-3xl px-16 py-16 flex justify-between items-center gap-10">
          <h2 className="text-[36px] font-extrabold text-white tracking-tight leading-[1.15] max-w-md">
            Ready to automate your workflow?
          </h2>
          <button
            onClick={() => router.push("/signup")}
            className="flex-shrink-0 bg-white text-orange-500 font-bold text-[15px] rounded-full px-9 py-4 hover:-translate-y-0.5 hover:shadow-lg transition-all"
          >
            Get started free
          </button>
        </div>
      </section>

    </div>
  )
}