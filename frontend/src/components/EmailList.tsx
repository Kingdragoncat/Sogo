"use client";

import { useMailStore } from "@/store/mailStore";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import clsx from "clsx";
import { fetchEmails } from "@/lib/api";
import { EmailAvatar } from "./EmailAvatar";

export function EmailList() {
  const { currentFolder, selectedEmail, setSelectedEmail } = useMailStore();

  const { data: emails, isLoading } = useQuery({
    queryKey: ["emails", currentFolder],
    queryFn: () => fetchEmails(currentFolder),
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background-dark/50">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background-dark/50 overflow-hidden">
      <div className="border-b border-slate-800 px-4">
        <div className="flex items-center gap-8">
          <button className="relative py-4 text-sm font-bold text-mythofy-gold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-mythofy-gold">
            Primary
          </button>
          <button className="py-4 text-sm font-bold text-slate-500 hover:text-slate-200 transition-colors">
            Social
          </button>
          <button className="py-4 text-sm font-bold text-slate-500 hover:text-slate-200 transition-colors">
            Promotions
          </button>
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto divide-y divide-slate-800">
        {emails?.map((email) => (
          <li
            key={email.id}
            onClick={() => setSelectedEmail(email)}
            className={clsx(
              "flex items-start gap-4 p-4 cursor-pointer transition-all hover-glow",
              selectedEmail?.id === email.id
                ? "bg-mythofy-gold/10 border-l-2 border-mythofy-gold"
                : "hover:bg-slate-800/30"
            )}
          >
            <EmailAvatar
              email={email.from}
              name={email.from.split('<')[0].trim()}
              size="md"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <p className={clsx(
                  "font-semibold truncate",
                  email.unread ? "text-white" : "text-slate-300"
                )}>
                  {email.subject}
                </p>
                <p className="text-xs text-slate-500 shrink-0">
                  {formatDistanceToNow(new Date(email.date), { addSuffix: true })}
                </p>
              </div>
              <p className="text-sm text-slate-400 mt-0.5">
                {email.from}
              </p>
              <p className="text-sm text-slate-500 line-clamp-2 mt-1">
                {email.preview}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
