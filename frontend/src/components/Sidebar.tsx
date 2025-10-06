"use client";

import { useMailStore } from "@/store/mailStore";
import {
  Inbox,
  Star,
  Clock,
  Send,
  FileText,
  Mail,
  AlertCircle,
  Trash2
} from "lucide-react";
import clsx from "clsx";

const folders = [
  { id: "inbox", icon: Inbox, label: "Inbox", count: 2 },
  { id: "starred", icon: Star, label: "Starred", count: 1 },
  { id: "snoozed", icon: Clock, label: "Snoozed", count: 0 },
  { id: "sent", icon: Send, label: "Sent", count: 10 },
  { id: "drafts", icon: FileText, label: "Drafts", count: 3 },
  { id: "all", icon: Mail, label: "All Mail", count: 100 },
  { id: "spam", icon: AlertCircle, label: "Spam", count: 0 },
  { id: "trash", icon: Trash2, label: "Trash", count: 5 },
];

export function Sidebar() {
  const { currentFolder, setCurrentFolder } = useMailStore();

  return (
    <aside className="flex w-64 flex-col border-r border-slate-800 p-4 glass-effect">
      <button className="mb-6 flex h-10 w-full items-center justify-center rounded-lg gold-gradient text-sm font-bold text-white shadow-lg hover-glow">
        Compose
      </button>

      <nav className="flex flex-col gap-1">
        {folders.map((folder) => {
          const Icon = folder.icon;
          const isActive = currentFolder === folder.id;

          return (
            <button
              key={folder.id}
              onClick={() => setCurrentFolder(folder.id)}
              className={clsx(
                "group flex items-center justify-between rounded-lg px-3 py-2 transition-all",
                isActive
                  ? "bg-mythofy-gold/20 text-mythofy-gold"
                  : "text-slate-300 hover:bg-slate-800/50"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={clsx(
                  "h-5 w-5",
                  isActive ? "text-mythofy-gold" : "text-slate-400 group-hover:text-slate-200"
                )} />
                <span className="font-medium text-sm">{folder.label}</span>
              </div>
              {folder.count > 0 && (
                <span className={clsx(
                  "text-xs font-bold",
                  isActive ? "text-mythofy-gold" : "text-slate-500"
                )}>
                  {folder.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800">
        <p className="text-xs text-slate-500 text-center">
          <a href="https://mythofy.net/about" className="hover:text-mythofy-gold transition-colors">
            About
          </a>
          {" · "}
          <a href="https://mythofy.net/legal" className="hover:text-mythofy-gold transition-colors">
            Legal
          </a>
        </p>
        <p className="text-xs text-slate-600 text-center mt-2">
          Clean. Secure. Mythical.
        </p>
      </div>
    </aside>
  );
}
