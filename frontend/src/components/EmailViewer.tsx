"use client";

import { useMailStore } from "@/store/mailStore";
import { ArrowLeft, Star, Trash2, Archive, Reply, Forward } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { EmailAvatar } from "./EmailAvatar";
import { HtmlEmail } from "./HtmlEmail";

export function EmailViewer() {
  const { selectedEmail, setSelectedEmail } = useMailStore();

  if (!selectedEmail) return null;

  return (
    <div className="w-2/5 border-l border-slate-800 flex flex-col bg-background-dark/30 overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center gap-2">
        <button
          onClick={() => setSelectedEmail(null)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-slate-400" />
        </button>

        <div className="flex-1" />

        <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
          <Star className="h-5 w-5 text-slate-400 hover:text-mythofy-gold" />
        </button>
        <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
          <Archive className="h-5 w-5 text-slate-400" />
        </button>
        <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
          <Trash2 className="h-5 w-5 text-slate-400 hover:text-red-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <h1 className="text-2xl font-bold text-white mb-4">
          {selectedEmail.subject}
        </h1>

        <div className="flex items-start gap-3 mb-6">
          <EmailAvatar
            email={selectedEmail.from}
            name={selectedEmail.from.split('<')[0].trim()}
            size="md"
          />

          <div className="flex-1">
            <p className="font-semibold text-white">{selectedEmail.from}</p>
            <p className="text-sm text-slate-400">
              to me
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {formatDistanceToNow(new Date(selectedEmail.date), { addSuffix: true })}
            </p>
          </div>
        </div>

        {selectedEmail.htmlBody ? (
          <HtmlEmail
            html={selectedEmail.htmlBody}
            className="prose prose-invert max-w-none"
          />
        ) : (
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 whitespace-pre-wrap">
              {selectedEmail.body || selectedEmail.preview}
            </p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-800 flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-mythofy-gold/20 text-mythofy-gold hover:bg-mythofy-gold/30 transition-colors">
          <Reply className="h-4 w-4" />
          Reply
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors">
          <Forward className="h-4 w-4" />
          Forward
        </button>
      </div>
    </div>
  );
}
