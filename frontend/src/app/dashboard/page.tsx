"use client"
import { Appbar } from "@/components/Appbar";
import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL, HOOKS_URL } from "../config";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Copy, Plus, Zap } from "lucide-react";
import { toast } from "sonner";

interface Zap {
    id: string
    triggerId: string
    userId: number
    created_at: Date
    actions: {
        id: string
        zapId: string
        actionId: string
        sortingOrder: number
        type: { id: string; name: string; image: string }
    }[]
    trigger: {
        id: string
        zapId: string
        triggerId: string
        type: { id: string; name: string; image: string }
    }
}

function useZaps() {
    const [loading, setLoading] = useState(true);
    const [zaps, setZaps] = useState<Zap[]>([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/zap`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }).then(res => {
            setZaps(res.data.zaps);
            setLoading(false);
        });
    }, []);

    return { loading, zaps };
}

export default function() {
    const { loading, zaps } = useZaps();
    const router = useRouter();

    return (
        <div className="min-h-screen bg-slate-50">
            <Appbar />
            <div className="mx-auto max-w-screen-lg px-6 py-10">

                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-medium uppercase tracking-widest text-slate-400 mb-1">Automation</p>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Zaps</h1>
                    </div>
                    <Button
                        onClick={() => router.push("/zap/create")}
                        className="rounded-full bg-orange-500 hover:bg-orange-600 text-white px-5 gap-2 transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <Plus className="h-4 w-4" />
                        Create
                    </Button>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                        <div className="grid grid-cols-[2fr_2fr_1.5fr_3fr_auto] gap-4 border-b border-slate-100 px-6 py-3">
                            {["Name", "ID", "Created at", "Webhook URL", ""].map((h, i) => (
                                <Skeleton key={i} className="h-3 w-16 rounded" />
                            ))}
                        </div>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="grid grid-cols-[2fr_2fr_1.5fr_3fr_auto] gap-4 border-b border-slate-100 px-6 py-4 last:border-0">
                                <Skeleton className="h-8 w-20 rounded-lg" />
                                <Skeleton className="h-4 w-32 rounded" />
                                <Skeleton className="h-4 w-28 rounded" />
                                <Skeleton className="h-4 w-48 rounded" />
                                <Skeleton className="h-8 w-12 rounded-lg" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Table */}
                {!loading && zaps.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center shadow-sm">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
                            <Zap className="h-5 w-5 text-orange-500" />
                        </div>
                        <p className="text-sm font-medium text-slate-800">No Zaps yet</p>
                        <p className="mt-1 text-sm text-slate-400">Create your first automation to get started.</p>
                        <Button
                            onClick={() => router.push("/zap/create")}
                            className="mt-5 rounded-full bg-orange-500 hover:bg-orange-600 text-white px-5"
                        >
                            Create a Zap
                        </Button>
                    </div>
                )}

                {!loading && zaps.length > 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                        {/* Table header */}
                        <div className="grid grid-cols-[2fr_2fr_1.5fr_3fr_80px] gap-4 border-b border-slate-100 bg-slate-50/60 px-6 py-3">
                            {["Name", "ID", "Created at", "Webhook URL", ""].map((h, i) => (
                                <div key={i} className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                                    {h}
                                </div>
                            ))}
                        </div>

                        {/* Rows */}
                        {zaps.map((z, idx) => (
                            <ZapRow key={z.id} zap={z} isLast={idx === zaps.length - 1} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function ZapRow({ zap, isLast }: { zap: Zap; isLast: boolean }) {
    const router = useRouter();
    const webhookUrl = `${HOOKS_URL}/hooks/catch/${zap.userId}/${zap.id}`;

    const copyUrl = () => {
        navigator.clipboard.writeText(webhookUrl);
        toast?.("Copied to clipboard");
    };

    return (
        <div className={`group grid grid-cols-[2fr_2fr_1.5fr_3fr_80px] gap-4 items-center px-6 py-4 transition-colors hover:bg-slate-50/80 ${!isLast ? "border-b border-slate-100" : ""}`}>

            {/* Name — trigger + action icons */}
            <div className="flex items-center gap-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm">
                    <img src={zap.trigger.type.image} className="h-5 w-5 object-contain" alt={zap.trigger.type.name} />
                </div>
                {zap.actions.map((action, i) => (
                    <div key={action.id}>
                        <ArrowRight className="h-3 w-3 text-slate-300 mx-0.5" />
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm">
                            <img src={action.type.image} className="h-5 w-5 object-contain" alt={action.type.name} />
                        </div>
                    </div>
                ))}
            </div>

            {/* ID */}
            <div className="font-mono text-xs text-slate-500 truncate" title={zap.id}>
                {zap.id}
            </div>

            {/* Created at */}
            <div className="text-sm text-slate-500">
                {new Date(zap.created_at).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric"
                })}
            </div>

            {/* Webhook URL */}
            <div className="flex items-center gap-2 min-w-0">
                <code className="truncate text-xs text-slate-400 bg-slate-100 rounded px-2 py-1 flex-1 min-w-0">
                    {webhookUrl}
                </code>
                <button
                    onClick={copyUrl}
                    className="flex-shrink-0 text-slate-400 hover:text-slate-700 transition-colors"
                    title="Copy URL"
                >
                    <Copy className="h-3.5 w-3.5" />
                </button>
            </div>

            {/* Go */}
            <div>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push("/zap/" + zap.id)}
                    className="rounded-full px-3 text-xs font-medium transition-all hover:-translate-y-0.5 hover:shadow-sm gap-1"
                >
                    Open
                    <ArrowRight className="h-3 w-3" />
                </Button>
            </div>
        </div>
    )
}