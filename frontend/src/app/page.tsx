"use client";

import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { EmailList } from "@/components/EmailList";
import { EmailViewer } from "@/components/EmailViewer";
import { useMailStore } from "@/store/mailStore";

export default function Home() {
  const selectedEmail = useMailStore((state) => state.selectedEmail);

  return (
    <div className="flex h-screen w-full flex-col bg-background-dark">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex overflow-hidden">
          <EmailList />
          {selectedEmail && <EmailViewer />}
        </main>
      </div>
    </div>
  );
}
