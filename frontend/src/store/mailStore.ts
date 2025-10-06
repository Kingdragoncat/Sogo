import { create } from "zustand";

export interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  body?: string;
  htmlBody?: string;
  date: string;
  unread: boolean;
  starred: boolean;
  folder: string;
}

interface MailStore {
  currentFolder: string;
  selectedEmail: Email | null;
  setCurrentFolder: (folder: string) => void;
  setSelectedEmail: (email: Email | null) => void;
}

export const useMailStore = create<MailStore>((set) => ({
  currentFolder: "inbox",
  selectedEmail: null,
  setCurrentFolder: (folder) => set({ currentFolder: folder, selectedEmail: null }),
  setSelectedEmail: (email) => set({ selectedEmail: email }),
}));
