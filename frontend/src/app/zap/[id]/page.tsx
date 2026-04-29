"use client";

import { BACKEND_URL } from "@/app/config";
import { Appbar } from "@/components/Appbar";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Zap,
  Trash2,
  Clock,
  ToggleLeft,
  ToggleRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  CalendarDays,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type AvailableTrigger = { id: string; name: string; image: string };
type AvailableAction = { id: string; name: string; image: string };
type Action = { id: string; sortingOrder: number; type: AvailableAction };
type Trigger = { id: string; type: AvailableTrigger };
type ZapRun = { id: string; metadata: any };

type ZapDetail = {
  id: string;
  created_at: string;
  isActive?: boolean;
  trigger: Trigger | null;
  actions: Action[];
  zapRuns: ZapRun[];
};

type Toast = { type: "success" | "error"; message: string };

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ZapDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [zap, setZap] = useState<ZapDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }

  useEffect(() => {
  axios
    .get(`${BACKEND_URL}/api/v1/zap/${id}`, { headers: authHeaders() })
    .then((res) => setZap(res.data.zap))
    .catch(() => showToast("error", "Failed to load zap."))
    .finally(() => setLoading(false));
}, [id]);

  async function handleToggle() {
    if (!zap) return;
    setToggling(true);
    try {
      await axios.patch(
        `${BACKEND_URL}/api/v1/zap/${id}/toggle`,
        {},
        { headers: authHeaders() }
      );
      setZap((z) => z ? { ...z, isActive: !z.isActive } : z);
      showToast("success", zap.isActive ? "Zap paused." : "Zap activated.");
    } catch {
      showToast("error", "Failed to toggle zap.");
    } finally {
      setToggling(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/zap/${id}`, {
        headers: authHeaders(),
      });
      router.push("/dashboard");
    } catch {
      showToast("error", "Failed to delete zap.");
      setDeleting(false);
      setDeleteOpen(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Appbar />
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  if (!zap) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Appbar />
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
          <p className="text-sm text-slate-400">Zap not found.</p>
        </div>
      </div>
    );
  }

  const sortedActions = [...zap.actions].sort(
    (a, b) => a.sortingOrder - b.sortingOrder
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Appbar />

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm shadow-lg ${
            toast.type === "success"
              ? "border-green-200 bg-white text-green-700"
              : "border-red-200 bg-white text-red-600"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          {toast.message}
        </div>
      )}

      <main className="mx-auto max-w-2xl px-6 pb-20 pt-10">
        {/* Header row */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-orange-500">
              zap
            </p>
            <h1 className="text-xl font-medium tracking-tight text-slate-900 font-mono">
              {zap.id.slice(0, 8)}…
            </h1>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
              <CalendarDays className="h-3.5 w-3.5" />
              Created {fmt(zap.created_at)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle */}
            <button
              onClick={handleToggle}
              disabled={toggling}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all hover:-translate-y-0.5 ${
                zap.isActive
                  ? "border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100"
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              {toggling ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : zap.isActive ? (
                <ToggleRight className="h-3.5 w-3.5" />
              ) : (
                <ToggleLeft className="h-3.5 w-3.5" />
              )}
              {zap.isActive ? "Active" : "Paused"}
            </button>

            {/* Delete */}
            <button
              onClick={() => setDeleteOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-400 transition-all hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </div>

        {/* Flow */}
        <section className="mb-5 rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
            <Zap className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-slate-800">Flow</span>
          </div>

          <div className="flex flex-col items-center px-5 py-6">
            {/* Trigger */}
            {zap.trigger ? (
              <div className="flex w-full items-center gap-3 rounded-lg border border-orange-100 bg-orange-50 px-4 py-3">
                <img
                  src={zap.trigger.type.image}
                  alt={zap.trigger.type.name}
                  className="h-7 w-7 rounded-md object-contain"
                />
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-orange-400">
                    Trigger
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {zap.trigger.type.name}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="h-7 w-7 rounded-md bg-slate-200" />
                <p className="text-sm text-slate-400">No trigger configured</p>
              </div>
            )}

            {/* Actions */}
            {sortedActions.map((action, i) => (
              <div key={action.id} className="flex w-full flex-col items-center">
                {/* connector */}
                <div className="flex flex-col items-center gap-0.5 py-2">
                  <div className="h-4 w-px bg-slate-200" />
                  <ArrowRight className="h-3 w-3 rotate-90 text-slate-300" />
                </div>
                <div className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
                  <img
                    src={action.type.image}
                    alt={action.type.name}
                    className="h-7 w-7 rounded-md object-contain"
                  />
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                      Action {i + 1}
                    </p>
                    <p className="text-sm font-medium text-slate-800">
                      {action.type.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {sortedActions.length === 0 && (
              <div className="mt-3 flex w-full items-center gap-3 rounded-lg border border-dashed border-slate-200 px-4 py-3">
                <p className="text-sm text-slate-400">No actions configured</p>
              </div>
            )}
          </div>
        </section>

        {/* Zap runs */}
        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-slate-800">
                Zap runs
              </span>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-xs text-slate-600">
              {zap.zapRuns.length}
            </span>
          </div>

          {zap.zapRuns.length === 0 ? (
            <div className="flex flex-col items-center gap-1.5 px-5 py-10 text-center">
              <Clock className="h-8 w-8 text-slate-200" />
              <p className="text-sm text-slate-400">No runs yet</p>
              <p className="text-xs text-slate-300">
                Runs will appear here once this zap fires.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {zap.zapRuns.map((run) => (
                <div
                  key={run.id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    <span className="font-mono text-xs text-slate-500">
                      {run.id.slice(0, 12)}…
                    </span>
                  </div>
                  <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                    completed
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Delete dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-red-50">
              <Trash2 className="h-4 w-4 text-red-500" />
            </div>
            <DialogTitle className="text-base">Delete this zap?</DialogTitle>
            <DialogDescription className="text-sm text-slate-400">
              This will permanently delete the zap and all its run history.
              This can't be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setDeleteOpen(false)}
              className="h-8 rounded-full px-5 text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="h-8 rounded-full bg-red-500 px-5 text-xs text-white hover:bg-red-600"
            >
              {deleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                "Yes, delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}