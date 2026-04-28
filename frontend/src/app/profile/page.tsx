"use client";

import { BACKEND_URL } from "@/app/config";
import { Appbar } from "@/components/Appbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BackArrow from "@/components/BackArrow";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, Mail, Lock, Trash2, Pencil, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

type UserProfile = {
  name: string;
  email: string;
};

type Toast = {
  type: "success" | "error";
  message: string;
};

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // which section is being edited
  const [editingInfo, setEditingInfo] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/user`, { headers: authHeaders() })
      .then((res) => {
        const u = res.data.user ?? res.data;
        setProfile(u);
        setName(u.name);
        setEmail(u.email);
      })
      .catch(() => showToast("error", "Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSaveInfo() {
    if (!name.trim() || !email.trim()) {
      showToast("error", "Name and email cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      await axios.put(
        `${BACKEND_URL}/api/v1/user`,
        { name, email },
        { headers: authHeaders() }
      );
      setProfile((p) => (p ? { ...p, name, email } : p));
      setEditingInfo(false);
      showToast("success", "Profile updated successfully.");
    } catch {
      showToast("error", "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSavePassword() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("error", "All password fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("error", "New passwords don't match.");
      return;
    }
    if (newPassword.length < 6) {
      showToast("error", "Password must be at least 6 characters.");
      return;
    }
    setSaving(true);
    try {
      await axios.put(
        `${BACKEND_URL}/api/v1/user/password`,
        { currentPassword, newPassword },
        { headers: authHeaders() }
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setEditingPassword(false);
      showToast("success", "Password changed successfully.");
    } catch {
      showToast("error", "Failed to change password. Check your current password.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/user`, {
        headers: authHeaders(),
      });
      localStorage.removeItem("token");
      router.push("/signin");
    } catch {
      showToast("error", "Failed to delete account.");
      setDeleting(false);
      setDeleteOpen(false);
    }
  }

  function getInitials(n: string) {
    return n
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Appbar />
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Appbar />
      <BackArrow></BackArrow>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm shadow-lg transition-all ${
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
        {/* Header */}
        <div className="mb-8">
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-orange-500">
            account
          </p>
          <h1 className="text-2xl font-medium tracking-tight text-slate-900">
            Your profile
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage your personal details and account security.
          </p>
        </div>

        {/* Avatar + name card */}
        <div className="mb-5 flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 font-mono text-lg font-medium text-orange-600">
            {profile ? getInitials(profile.name) : "?"}
          </div>
          <div>
            <p className="text-base font-medium text-slate-800">{profile?.name}</p>
            <p className="text-sm text-slate-400">{profile?.email}</p>
          </div>
        </div>

        {/* Personal info */}
        <section className="mb-4 rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <User className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-slate-800">Personal info</span>
            </div>
            {!editingInfo && (
              <button
                onClick={() => setEditingInfo(true)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
              >
                <Pencil className="h-3 w-3" />
                Edit
              </button>
            )}
          </div>

          <div className="px-5 py-5">
            {!editingInfo ? (
              <div className="space-y-4">
                <div>
                  <p className="mb-0.5 text-xs text-slate-400">Full name</p>
                  <p className="text-sm font-medium text-slate-800">{profile?.name}</p>
                </div>
                <div>
                  <p className="mb-0.5 text-xs text-slate-400">Email address</p>
                  <p className="text-sm font-medium text-slate-800">{profile?.email}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs text-slate-500">
                    Full name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs text-slate-500">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    onClick={handleSaveInfo}
                    disabled={saving}
                    className="h-8 rounded-full bg-orange-500 px-5 text-xs hover:bg-orange-600"
                  >
                    {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save changes"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditingInfo(false);
                      setName(profile?.name ?? "");
                      setEmail(profile?.email ?? "");
                    }}
                    className="h-8 rounded-full px-5 text-xs text-slate-500"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Password */}
        <section className="mb-4 rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <Lock className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-slate-800">Password</span>
            </div>
            {!editingPassword && (
              <button
                onClick={() => setEditingPassword(true)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
              >
                <Pencil className="h-3 w-3" />
                Change
              </button>
            )}
          </div>

          <div className="px-5 py-5">
            {!editingPassword ? (
              <div>
                <p className="mb-0.5 text-xs text-slate-400">Current password</p>
                <p className="text-sm font-medium tracking-widest text-slate-800">••••••••</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="current-pw" className="text-xs text-slate-500">
                    Current password
                  </Label>
                  <Input
                    id="current-pw"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="new-pw" className="text-xs text-slate-500">
                    New password
                  </Label>
                  <Input
                    id="new-pw"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirm-pw" className="text-xs text-slate-500">
                    Confirm new password
                  </Label>
                  <Input
                    id="confirm-pw"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-9 text-sm"
                  />
                  {newPassword && confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-500">Passwords don't match.</p>
                  )}
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    onClick={handleSavePassword}
                    disabled={saving}
                    className="h-8 rounded-full bg-orange-500 px-5 text-xs hover:bg-orange-600"
                  >
                    {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Update password"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditingPassword(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    className="h-8 rounded-full px-5 text-xs text-slate-500"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Danger zone */}
        <section className="rounded-xl border border-red-100 bg-white">
          <div className="flex items-center gap-2.5 border-b border-red-100 px-5 py-4">
            <Trash2 className="h-4 w-4 text-red-400" />
            <span className="text-sm font-medium text-slate-800">Danger zone</span>
          </div>
          <div className="flex items-center justify-between px-5 py-5">
            <div>
              <p className="text-sm font-medium text-slate-700">Delete account</p>
              <p className="text-xs text-slate-400">
                Permanently delete your account and all your zaps. This cannot be undone.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(true)}
              className="ml-4 h-8 shrink-0 rounded-full border-red-200 px-4 text-xs text-red-500 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              Delete account
            </Button>
          </div>
        </section>
      </main>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 border border-red-100">
              <Trash2 className="h-4 w-4 text-red-500" />
            </div>
            <DialogTitle className="text-base">Delete account?</DialogTitle>
            <DialogDescription className="text-sm text-slate-400">
              This will permanently delete your account and all associated zaps.
              There's no way to recover this data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="ghost"
              onClick={() => setDeleteOpen(false)}
              className="h-8 rounded-full px-5 text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
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