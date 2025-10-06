"use client";

import { useState } from "react";
import { Search, Settings } from "lucide-react";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 px-6 bg-background-dark/80 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 gold-gradient rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">M</span>
        </div>
        <h1 className="text-lg font-bold text-white">Mythofy Mail</h1>
      </div>

      <div className="flex flex-1 items-center justify-end gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            className="w-full rounded-lg border-transparent bg-slate-800/50 py-2 pl-10 pr-4 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-mythofy-gold focus:ring-offset-2 focus:ring-offset-background-dark transition-all"
            placeholder="Search mail..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-800 transition-colors">
          <Settings className="h-5 w-5 text-slate-300" />
        </button>

        <div className="h-10 w-10 rounded-full gold-gradient flex items-center justify-center">
          <span className="text-white font-semibold text-sm">U</span>
        </div>
      </div>
    </header>
  );
}
