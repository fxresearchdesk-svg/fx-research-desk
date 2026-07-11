"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { ImageUpload } from "@/components/image-upload";
import type { Signal, Stats, Testimonial, SignalDirection, SignalResult } from "@/lib/types";

type SignalFormState = {
  pair: string;
  direction: SignalDirection;
  entry_price: string;
  stop_loss: string;
  take_profit: string;
  result: SignalResult;
  pips: string;
};

const emptySignal: SignalFormState = {
  pair: "EUR/USD",
  direction: "BUY",
  entry_price: "",
  stop_loss: "",
  take_profit: "",
  result: "PENDING",
  pips: "",
};

const emptyTestimonial = {
  name: "",
  location: "",
  quote: "",
  rating: 5,
  member_type: "",
  image_url: "",
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState("");

  const [stats, setStats] = useState<Stats | null>(null);
  const [statsForm, setStatsForm] = useState({
    win_rate: "87",
    pips_month: "2450",
    monthly_return: "14.2",
    active_traders: "500",
  });

  const [signals, setSignals] = useState<Signal[]>([]);
  const [signalForm, setSignalForm] = useState(emptySignal);
  const [editingSignalId, setEditingSignalId] = useState<string | null>(null);

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonial);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);

  const headers = useCallback(
    () => ({
      "Content-Type": "application/json",
      "x-admin-password": password,
    }),
    [password]
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const [statsRes, signalsRes, testimonialsRes] = await Promise.all([
        fetch("/api/stats", { headers: { "x-admin-password": password } }),
        fetch("/api/signals", { headers: { "x-admin-password": password } }),
        fetch("/api/testimonials", { headers: { "x-admin-password": password } }),
      ]);

      if (statsRes.status === 401 || signalsRes.status === 401) {
        setAuthenticated(false);
        sessionStorage.removeItem("fx-admin-authenticated");
        setMessage("Session expired. Please log in again.");
        return;
      }

      const statsData = await statsRes.json();
      const signalsData = await signalsRes.json();
      const testimonialsData = await testimonialsRes.json();

      if (statsData.stats) {
        setStats(statsData.stats);
        setStatsForm({
          win_rate: String(statsData.stats.win_rate),
          pips_month: String(statsData.stats.pips_month),
          monthly_return: String(statsData.stats.monthly_return),
          active_traders: String(statsData.stats.active_traders),
        });
      }

      setSignals(signalsData.signals ?? []);
      setTestimonials(testimonialsData.testimonials ?? []);
      setAuthenticated(true);
    } catch {
      setMessage("Failed to load data. Check Supabase configuration.");
    } finally {
      setLoading(false);
    }
  }, [password]);

  useEffect(() => {
    const saved = sessionStorage.getItem("fx-admin-password");
    if (saved) {
      setPassword(saved);
    }
  }, []);

  useEffect(() => {
    if (password && sessionStorage.getItem("fx-admin-authenticated") === "true") {
      loadData();
    }
  }, [password, loadData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const verifyRes = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "x-admin-password": password },
      });

      if (!verifyRes.ok) {
        setAuthenticated(false);
        sessionStorage.removeItem("fx-admin-authenticated");
        setMessage("Invalid password");
        return;
      }

      sessionStorage.setItem("fx-admin-password", password);
      sessionStorage.setItem("fx-admin-authenticated", "true");
      setAuthenticated(true);
      await loadData();
    } catch {
      setMessage("Failed to verify password");
    } finally {
      setLoading(false);
    }
  };

  const handlePublishStats = async () => {
    setPublishing(true);
    setMessage("");
    try {
      const res = await fetch("/api/stats", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          id: stats?.id,
          win_rate: Number(statsForm.win_rate),
          pips_month: Number(statsForm.pips_month),
          monthly_return: Number(statsForm.monthly_return),
          active_traders: Number(statsForm.active_traders),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStats(data.stats);
      setMessage("Stats published to site successfully.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to publish stats");
    } finally {
      setPublishing(false);
    }
  };

  const handleSaveSignal = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const payload = {
        pair: signalForm.pair,
        direction: signalForm.direction,
        entry_price: Number(signalForm.entry_price),
        stop_loss: Number(signalForm.stop_loss),
        take_profit: Number(signalForm.take_profit),
        result: signalForm.result,
        pips: signalForm.pips ? Number(signalForm.pips) : null,
      };

      const res = await fetch("/api/signals", {
        method: editingSignalId ? "PATCH" : "POST",
        headers: headers(),
        body: JSON.stringify(
          editingSignalId ? { id: editingSignalId, ...payload } : payload
        ),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSignalForm(emptySignal);
      setEditingSignalId(null);
      await loadData();
      setMessage("Signal saved.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to save signal");
    }
  };

  const handleDeleteSignal = async (id: string) => {
    const res = await fetch(`/api/signals?id=${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    if (res.ok) {
      await loadData();
      setMessage("Signal deleted.");
    }
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const payload = {
        name: testimonialForm.name,
        location: testimonialForm.location || null,
        quote: testimonialForm.quote,
        rating: Number(testimonialForm.rating),
        member_type: testimonialForm.member_type || null,
        image_url: testimonialForm.image_url || null,
      };

      const res = await fetch("/api/testimonials", {
        method: editingTestimonialId ? "PATCH" : "POST",
        headers: headers(),
        body: JSON.stringify(
          editingTestimonialId ? { id: editingTestimonialId, ...payload } : payload
        ),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setTestimonialForm(emptyTestimonial);
      setEditingTestimonialId(null);
      await loadData();
      setMessage("Testimonial saved.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to save testimonial");
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    const res = await fetch(`/api/testimonials?id=${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    if (res.ok) {
      await loadData();
      setMessage("Testimonial deleted.");
    }
  };

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-[#E8E6E3] flex items-center justify-center px-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-[#0C0C0C] border border-[#1F1F1F]  p-8"
        >
          <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-[#6B6B6B] text-sm mb-6">Enter admin password to continue</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full bg-[#030303] border border-[#1F1F1F]  px-4 py-3 mb-4 text-[#E8E6E3]"
          />
          {message && <p className="text-red-400 text-sm mb-4">{message}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full border border-[#1F1F1F] bg-transparent text-[#B8956A] hover:bg-[#B8956A] hover:text-[#030303] text-black font-bold py-3  disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Login"}
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 text-sm mt-6 hover:text-[#B8956A]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to site
          </Link>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#E8E6E3]">
      <header className="border-b border-[#1F1F1F] bg-[#0a0a0a]/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">FX Research Desk Admin</h1>
            <p className="text-slate-500 text-sm">Manage signals, stats & testimonials</p>
          </div>
          <Link href="/" className="text-sm text-[#B8956A] hover:underline">
            View Site →
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {message && (
          <div className="bg-[#B8956A] text-[#030303]/10 border border-emerald-500/30 text-[#B8956A] px-4 py-3  text-sm">
            {message}
          </div>
        )}

        {/* Stats */}
        <section className="bg-[#0C0C0C] border border-[#1F1F1F]  p-6">
          <h2 className="text-lg font-bold mb-4">Site Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { key: "win_rate", label: "Win Rate %" },
              { key: "pips_month", label: "Pips/Month" },
              { key: "monthly_return", label: "Monthly Return %" },
              { key: "active_traders", label: "Active Traders" },
            ].map((field) => (
              <div key={field.key}>
                <label className="text-xs text-slate-500 block mb-1">{field.label}</label>
                <input
                  value={statsForm[field.key as keyof typeof statsForm]}
                  onChange={(e) =>
                    setStatsForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  className="w-full bg-[#030303] border border-[#1F1F1F]  px-3 py-2 text-[#E8E6E3]"
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handlePublishStats}
            disabled={publishing}
            className="inline-flex items-center gap-2 border border-[#1F1F1F] bg-transparent text-[#B8956A] hover:bg-[#B8956A] hover:text-[#030303] text-black font-bold px-6 py-2.5  disabled:opacity-50"
          >
            {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Publish to Site
          </button>
        </section>

        {/* Signals */}
        <section className="bg-[#0C0C0C] border border-[#1F1F1F]  p-6">
          <h2 className="text-lg font-bold mb-4">Signals</h2>
          <form onSubmit={handleSaveSignal} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <input
              value={signalForm.pair}
              onChange={(e) => setSignalForm((p) => ({ ...p, pair: e.target.value }))}
              placeholder="Pair"
              className="bg-[#030303] border border-[#1F1F1F]  px-3 py-2"
            />
            <select
              value={signalForm.direction}
              onChange={(e) =>
                setSignalForm((p) => ({
                  ...p,
                  direction: e.target.value as SignalDirection,
                }))
              }
              className="bg-[#030303] border border-[#1F1F1F]  px-3 py-2"
            >
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
            <input
              value={signalForm.entry_price}
              onChange={(e) => setSignalForm((p) => ({ ...p, entry_price: e.target.value }))}
              placeholder="Entry"
              className="bg-[#030303] border border-[#1F1F1F]  px-3 py-2"
            />
            <input
              value={signalForm.stop_loss}
              onChange={(e) => setSignalForm((p) => ({ ...p, stop_loss: e.target.value }))}
              placeholder="Stop Loss"
              className="bg-[#030303] border border-[#1F1F1F]  px-3 py-2"
            />
            <input
              value={signalForm.take_profit}
              onChange={(e) => setSignalForm((p) => ({ ...p, take_profit: e.target.value }))}
              placeholder="Take Profit"
              className="bg-[#030303] border border-[#1F1F1F]  px-3 py-2"
            />
            <select
              value={signalForm.result}
              onChange={(e) =>
                setSignalForm((p) => ({
                  ...p,
                  result: e.target.value as SignalResult,
                }))
              }
              className="bg-[#030303] border border-[#1F1F1F]  px-3 py-2"
            >
              <option value="PENDING">PENDING</option>
              <option value="WIN">WIN</option>
              <option value="LOSS">LOSS</option>
            </select>
            <input
              value={signalForm.pips}
              onChange={(e) => setSignalForm((p) => ({ ...p, pips: e.target.value }))}
              placeholder="Pips"
              className="bg-[#030303] border border-[#1F1F1F]  px-3 py-2"
            />
            <button
              type="submit"
              className="bg-[#B8956A] text-[#030303] text-black font-bold  px-4 py-2"
            >
              {editingSignalId ? "Update Signal" : "Add Signal"}
            </button>
          </form>

          <div className="space-y-2">
            {signals.map((signal) => (
              <div
                key={signal.id}
                className="flex flex-wrap items-center justify-between gap-3 bg-[#030303]/50 border border-[#1F1F1F]  px-4 py-3"
              >
                <div className="text-sm">
                  <span className="font-semibold text-[#E8E6E3]">{signal.pair}</span>{" "}
                  <span className="text-[#B8956A]">{signal.direction}</span> · Entry{" "}
                  {signal.entry_price} · {signal.result ?? "PENDING"}
                  {signal.pips != null && ` (${signal.pips} pips)`}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSignalId(signal.id);
                      setSignalForm({
                        pair: signal.pair,
                        direction: signal.direction,
                        entry_price: String(signal.entry_price),
                        stop_loss: String(signal.stop_loss),
                        take_profit: String(signal.take_profit),
                        result: signal.result ?? "PENDING",
                        pips: signal.pips != null ? String(signal.pips) : "",
                      });
                    }}
                    className="text-xs text-[#B8956A] hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSignal(signal.id)}
                    className="text-xs text-red-400 hover:underline inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-[#0C0C0C] border border-[#1F1F1F]  p-6">
          <h2 className="text-lg font-bold mb-4">Testimonials</h2>
          <form onSubmit={handleSaveTestimonial} className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                value={testimonialForm.name}
                onChange={(e) => setTestimonialForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Name"
                className="bg-[#030303] border border-[#1F1F1F]  px-3 py-2"
              />
              <input
                value={testimonialForm.location}
                onChange={(e) => setTestimonialForm((p) => ({ ...p, location: e.target.value }))}
                placeholder="Location"
                className="bg-[#030303] border border-[#1F1F1F]  px-3 py-2"
              />
            </div>
            <textarea
              value={testimonialForm.quote}
              onChange={(e) => setTestimonialForm((p) => ({ ...p, quote: e.target.value }))}
              placeholder="Quote"
              rows={3}
              className="w-full bg-[#030303] border border-[#1F1F1F]  px-3 py-2"
            />
            <input
              value={testimonialForm.member_type}
              onChange={(e) =>
                setTestimonialForm((p) => ({ ...p, member_type: e.target.value }))
              }
              placeholder="Member type (e.g. Premium Member • 6 months)"
              className="w-full bg-[#030303] border border-[#1F1F1F]  px-3 py-2"
            />
            <ImageUpload
              value={testimonialForm.image_url}
              onChange={(url) => setTestimonialForm((p) => ({ ...p, image_url: url }))}
            />
            <button
              type="submit"
              className="bg-[#B8956A] text-[#030303] text-black font-bold  px-6 py-2"
            >
              {editingTestimonialId ? "Update Testimonial" : "Add Testimonial"}
            </button>
          </form>

          <div className="space-y-2">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="flex flex-wrap items-start justify-between gap-3 bg-[#030303]/50 border border-[#1F1F1F]  px-4 py-3"
              >
                <div className="text-sm max-w-xl">
                  <p className="text-[#6B6B6B] italic mb-1">&ldquo;{t.quote}&rdquo;</p>
                  <p className="text-[#E8E6E3] font-semibold">
                    {t.name}
                    {t.location && <span className="text-slate-500 font-normal"> · {t.location}</span>}
                  </p>
                  {t.member_type && <p className="text-slate-500 text-xs">{t.member_type}</p>}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTestimonialId(t.id);
                      setTestimonialForm({
                        name: t.name,
                        location: t.location ?? "",
                        quote: t.quote,
                        rating: t.rating,
                        member_type: t.member_type ?? "",
                        image_url: t.image_url ?? "",
                      });
                    }}
                    className="text-xs text-[#B8956A] hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTestimonial(t.id)}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
