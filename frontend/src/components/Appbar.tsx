"use client";
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"

export const Appbar = () => {
    const router = useRouter();

    return (
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
            {/* Logo */}
            <div
                className="text-xl font-extrabold tracking-tight text-slate-900 cursor-pointer"
                onClick={() => router.push("/")}
            >
                Zapier
            </div>

            {/* Right side */}
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500 hover:text-slate-900"
                    onClick={() => router.push("/settings/connections")}
                >
                    <Settings className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    className="text-sm font-medium text-slate-600 hover:text-slate-900"
                    onClick={() => {}}
                >
                    Contact Sales
                </Button>

                <Button
                    variant="ghost"
                    className="text-sm font-medium text-slate-600 hover:text-slate-900"
                    onClick={() => router.push("/login")}
                >
                    Login
                </Button>

                <Button
                    className="rounded-full bg-orange-500 px-5 text-sm font-semibold text-white hover:bg-orange-600 transition-all hover:-translate-y-0.5 hover:shadow-md"
                    onClick={() => router.push("/signup")}
                >
                    Signup
                </Button>
            </div>
        </div>
    )
}