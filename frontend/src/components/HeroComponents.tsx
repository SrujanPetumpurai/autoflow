"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Zap, CheckCircle2, Sparkles, Globe } from "lucide-react"

const features = [
    { icon: CheckCircle2, title: "Free Forever", subtitle: "for core features" },
    { icon: Globe, title: "More apps", subtitle: "than any other platform" },
    { icon: Sparkles, title: "Cutting Edge", subtitle: "AI Features" },
]

export const Hero = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center px-4 pt-5 pb-12 text-center">
            {/* Badge */}
            <div className="mb-6 flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5">
                <Zap className="h-3.5 w-3.5 text-green-700" />
                <span className="text-xs font-semibold text-green-700 tracking-wide">
                    Powered by AI
                </span>
            </div>

            {/* Headline */}
            <h1 className="max-w-2xl text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
                Automate as fast as{" "}
                <span className="text-green-700">you can type</span>
            </h1>

            {/* Subheadline */}
            <p className="max-w-xl text-lg text-slate-500 leading-relaxed mb-10">
                AI gives you automation superpowers, and Autoflow puts them to work. Turn ideas into workflows and bots that work for you — no coding required.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
                <Button
                    onClick={() => router.push("/signup")}
                    className="rounded-full bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-5 text-base transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                    Get started free
                </Button>
                <Button
                    variant="outline"
                    onClick={() => {}}
                    className="rounded-full border-slate-300 text-slate-700 font-semibold px-8 py-5 text-base hover:border-slate-400 transition-all hover:-translate-y-0.5"
                >
                    Contact Sales
                </Button>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-4">
                {features.map(({ icon: Icon, title, subtitle }) => (
                    <div
                        key={title}
                        className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                    >
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-50">
                            <Icon className="h-3.5 w-3.5 text-green-700" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-semibold text-slate-800 leading-none">{title}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}