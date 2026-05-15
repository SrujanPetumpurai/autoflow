"use client";
import { Appbar } from "@/components/Appbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../config";
import { useRouter } from "next/navigation";
import { CheckCircle2, Zap, Loader2 } from "lucide-react";

const features = [
    "Easy setup, no coding required",
    "Free forever for core features",
    "14-day trial of premium features & apps",
];

export default function() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50">
            <Appbar />

            <div className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4 pb-6">
                <div className="flex w-full max-w-4xl gap-16 items-center">

                    {/* Left — marketing copy */}
                    <div className="flex-1 hidden md:block">
                        <div className="mb-4 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
                                <Zap className="h-4 w-4 text-green-700" />
                            </div>
                            <span className="text-sm font-semibold text-green-700">Autoflow</span>
                        </div>

                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 leading-tight mb-6">
                            Join millions worldwide who automate their work using Autoflow.
                        </h1>

                        <div className="flex flex-col gap-4">
                            {features.map((f) => (
                                <div key={f} className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-500" />
                                    <span className="text-slate-600">{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — form */}
                    <div className="flex-1 w-full">
                        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                            <h2 className="text-xl font-semibold text-slate-900 mb-1">Welcome back</h2>
                            <p className="text-sm text-slate-500 mb-6">Log in to your Autoflow account.</p>

                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <Label className="text-sm font-medium text-slate-700">Email</Label>
                                    <Input
                                        type="text"
                                        placeholder="you@example.com"
                                        onChange={e => setEmail(e.target.value)}
                                        className="rounded-lg border-slate-200 focus-visible:ring-green-600"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <Label className="text-sm font-medium text-slate-700">Password</Label>
                                    <Input
                                        type="password"
                                        placeholder="Your password"
                                        onChange={e => setPassword(e.target.value)}
                                        className="rounded-lg border-slate-200 focus-visible:ring-green-600"
                                    />
                                </div>

                                <Button
                                    disabled={loading}
                                    onClick={async () => {
                                        setLoading(true);
                                        try {
                                            const res = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
                                                username: email,
                                                password,
                                            });
                                            localStorage.setItem("token", res.data.token);
                                            router.push("/dashboard");
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    className="w-full rounded-full bg-green-700 hover:bg-green-800 text-white font-semibold py-5 transition-all hover:-translate-y-0.5 hover:shadow-md mt-2"
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Login"}
                                </Button>

                                <p className="text-center text-xs text-slate-400">
                                    Don't have an account?{" "}
                                    <span
                                        className="text-green-700 font-medium cursor-pointer hover:underline"
                                        onClick={() => router.push("/signup")}
                                    >
                                        Sign up free
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}