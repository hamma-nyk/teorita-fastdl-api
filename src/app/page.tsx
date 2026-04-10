import React from 'react';
import { Activity, Terminal, Globe, Cpu } from 'lucide-react'; // Pastikan install lucide-react

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-300 font-mono selection:bg-cyan-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-400 to-cyan-500">
              FASTDL-API
            </h1>
            <p className="mt-2 text-zinc-500 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              SYSTEM ONLINE
            </p>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg backdrop-blur-md">
              <p className="text-[10px] uppercase text-zinc-500">Uptime</p>
              <p className="text-sm font-bold text-cyan-400">99.9%</p>
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg backdrop-blur-md">
              <p className="text-[10px] uppercase text-zinc-500">Region</p>
              <p className="text-sm font-bold text-cyan-400">ID</p>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard icon={<Terminal size={20}/>} title="Endpoints" value="2 Active" desc="/api/info, /api/posts" />
          {/* <StatCard icon={<Globe size={20}/>} title="Provider" value="Browserless" desc="Cluster: Production-SFO" /> */}
          <StatCard icon={<Cpu size={20}/>} title="Engine" value="Next.js 16" desc="Vercel Edge Runtime" />
        </div>

        {/* Console / API Documentation Area */}
        <section className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500">api_documentation.sh</span>
          </div>
          <div className="p-8 space-y-6">
            <div>
              <h3 className="text-cyan-400 text-sm mb-3"># GET INSTAGRAM USER INFO</h3>
              <div className="bg-zinc-900/50 p-4 rounded-lg border border-white/5 flex items-center justify-between group">
                <code className="text-sm text-zinc-300">GET /api/info?user=<span className="text-yellow-500">username</span></code>
                <button className="text-[10px] text-zinc-500 hover:text-white transition-colors">COPY</button>
              </div>
            </div>

            <div>
              <h3 className="text-cyan-400 text-sm mb-3"># GET INSTAGRAM POSTS LIST</h3>
              <div className="bg-zinc-900/50 p-4 rounded-lg border border-white/5 flex items-center justify-between group">
                <code className="text-sm text-zinc-300">GET /api/posts?user=<span className="text-yellow-500">username</span></code>
                <button className="text-[10px] text-zinc-500 hover:text-white transition-colors">COPY</button>
              </div>
            </div>
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

function StatCard({ icon, title, value, desc }: { icon: React.ReactNode, title: string, value: string, desc: string }) {
  return (
    <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl hover:bg-white/[0.04] transition-all group">
      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-zinc-500 text-xs uppercase mb-1">{title}</h3>
      <p className="text-xl font-bold text-white mb-2">{value}</p>
      <p className="text-[10px] text-zinc-600 leading-relaxed">{desc}</p>
    </div>
  );
}