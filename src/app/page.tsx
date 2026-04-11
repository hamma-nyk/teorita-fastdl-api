"use client";

import React from "react";
import { Activity, Terminal, Globe, Cpu } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-300 font-mono selection:bg-orange-500/30">
      {/* Background Decor - Changed to Amber/Orange */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header Container */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 border-b border-white/5 pb-12">
          <div className="flex items-center gap-5 group">
            {/* Logo Box dengan Glow Yellow/Orange */}
            <div className="w-16 h-16 bg-zinc-900 border-2 border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.2)] rounded-2xl overflow-hidden p-1.5 transition-all duration-500 group-hover:scale-105 group-hover:border-amber-400">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-full h-full object-cover rounded-xl shadow-inner transition-all"
              />
            </div>

            <div>
              {/* Judul Utama: Chika (Yellow to Orange Gradient) */}
              <h1 className="text-4xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-300 to-orange-500">
                Teoritta
              </h1>
              {/* Subtitle: Lexicon_Intelligence (Amber accent) */}
              <p className="text-[10px] text-amber-500/70 tracking-[0.3em] uppercase font-bold">
                FASTDL-API
              </p>
            </div>
          </div>

          {/* System Badges - Amber Styled */}
          <div className="flex gap-3">
            <div className="px-4 py-2 bg-amber-500/5 border border-amber-500/10 rounded-xl backdrop-blur-md">
              <p className="text-[9px] uppercase tracking-widest text-zinc-500">
                Node_Status
              </p>
              <p className="text-xs font-bold text-amber-400 uppercase">
                Active_Secure
              </p>
            </div>
            <div className="px-4 py-2 bg-orange-500/5 border border-orange-500/10 rounded-xl backdrop-blur-md">
              <p className="text-[9px] uppercase tracking-widest text-zinc-500">
                VERSION
              </p>
              <p className="text-xs font-bold text-orange-400">2.0.0</p>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={<Terminal size={20} />}
            title="Endpoints"
            value="2 Active"
            desc="/api/info, /api/posts"
          />
          <StatCard
            icon={<Cpu size={20} />}
            title="Engine"
            value="Next.js 16"
            desc="Vercel Edge Runtime"
          />
        </div>

        {/* Console / API Documentation Area */}
        <section className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-amber-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500">
              api_documentation.sh
            </span>
          </div>
          <div className="p-8 space-y-6">
            {/* API Info Endpoint */}
            <ApiEndpoint
              title="# INSTAGRAM USER INFO"
              endpoint="/api/info?user=username"
            />

            {/* API Posts Endpoint */}
            <ApiEndpoint
              title="# INSTAGRAM POSTS LIST"
              endpoint="/api/posts?user=username"
            />
          </div>
        </section>

        <footer className="mt-12 text-center">
          <p className="text-[10px] text-zinc-600 tracking-widest uppercase">
            &copy; 2026 HAMMA-NYK
          </p>
        </footer>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  desc: string;
}) {
  return (
    <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl hover:bg-amber-500/[0.02] hover:border-amber-500/30 transition-all group">
      <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-zinc-500 text-xs uppercase mb-1">{title}</h3>
      <p className="text-xl font-bold text-white mb-2">{value}</p>
      <p className="text-[10px] text-zinc-600 leading-relaxed italic">{desc}</p>
    </div>
  );
}

function ApiEndpoint({ title, endpoint }: { title: string; endpoint: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      // Mengambil domain utama secara otomatis
      const baseUrl = window.location.origin;
      await navigator.clipboard.writeText(`${baseUrl}${endpoint}`);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset status setelah 2 detik
    } catch (err) {
      console.error("Gagal menyalin: ", err);
    }
  };

  return (
    <div>
      <h3 className="text-amber-400 text-sm mb-3 uppercase tracking-tight">
        {title}
      </h3>
      <div className="bg-zinc-900/50 p-4 rounded-lg border border-white/5 flex items-center justify-between group transition-all hover:border-amber-500/30">
        <code className="text-sm text-zinc-300 break-all">
          GET {endpoint.split("username")[0]}
          <span className="text-orange-400">username</span>
        </code>
        <button
          onClick={handleCopy}
          className={`text-[10px] font-bold px-3 py-1 rounded border transition-all ${
            copied
              ? "bg-green-500/20 border-green-500 text-green-500"
              : "border-white/10 text-zinc-500 hover:text-white hover:border-white/30"
          }`}
        >
          {copied ? "COPIED!" : "COPY"}
        </button>
      </div>
    </div>
  );
}
