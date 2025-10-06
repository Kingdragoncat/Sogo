import axios from "axios";
import type { Email } from "@/store/mailStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function fetchEmails(folder: string): Promise<Email[]> {
  try {
    const { data } = await api.get(`/api/emails/${folder}`);
    return data;
  } catch (error) {
    console.error("Failed to fetch emails:", error);
    // Return mock data for development
    return generateMockEmails(folder);
  }
}

export async function sendEmail(to: string, subject: string, body: string) {
  const { data } = await api.post("/api/emails/send", { to, subject, body });
  return data;
}

export async function deleteEmail(id: string) {
  const { data } = await api.delete(`/api/emails/${id}`);
  return data;
}

export async function markAsRead(id: string, read: boolean) {
  const { data } = await api.patch(`/api/emails/${id}/read`, { read });
  return data;
}

export async function starEmail(id: string, starred: boolean) {
  const { data } = await api.patch(`/api/emails/${id}/star`, { starred });
  return data;
}

export async function login(email: string, password: string) {
  const { data } = await api.post("/api/auth/login", { email, password });
  if (data.token) {
    localStorage.setItem("authToken", data.token);
  }
  return data;
}

// Mock data for development
function generateMockEmails(folder: string): Email[] {
  const mockEmails: Email[] = [
    {
      id: "1",
      from: "Sarah Johnson",
      subject: "Marketing Campaign Review",
      preview: "Hi, I hope this email finds you well. I'm writing to follow up on our meeting last week regarding the new marketing campaign. I've attached the proposal document for your review.",
      body: "Hi,\n\nI hope this email finds you well. I'm writing to follow up on our meeting last week regarding the new marketing campaign.\n\nI've attached the proposal document for your review. Please let me know if you have any questions or need any clarifications.\n\nBest regards,\nSarah",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      unread: true,
      starred: false,
      folder: "inbox",
    },
    {
      id: "2",
      from: "Project Team",
      subject: "Project Kickoff Agenda",
      preview: "Dear Team, Please find attached the agenda for our upcoming project kickoff meeting scheduled for next Tuesday at 10 AM. Your active participation is highly valued.",
      body: "Dear Team,\n\nPlease find attached the agenda for our upcoming project kickoff meeting scheduled for next Tuesday at 10 AM.\n\nYour active participation is highly valued.\n\nThank you,\nProject Management",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      unread: true,
      starred: true,
      folder: "inbox",
    },
    {
      id: "3",
      from: "Tech Conference",
      subject: "Annual Tech Conference Invitation",
      preview: "Dear Tech Enthusiast, We are excited to invite you to our Annual Tech Conference. Register now to secure your spot and take advantage of early bird discounts.",
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      unread: false,
      starred: false,
      folder: "inbox",
    },
    {
      id: "4",
      from: "Product Team",
      subject: "New Product: Innovate X Launch",
      preview: "Hi Team, I'm pleased to announce that we have successfully launched our new product, the 'Innovate X'. The initial feedback has been overwhelmingly positive.",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      unread: false,
      starred: false,
      folder: "inbox",
    },
    {
      id: "5",
      from: "Marketing",
      subject: "Exclusive Discount for Premium Services",
      preview: "Dear Valued Customer, We are excited to offer you an exclusive 20% discount on our premium services. Use the code PREMIUM20 at checkout.",
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      unread: false,
      starred: false,
      folder: "inbox",
    },
  ];

  return mockEmails.filter((email) => {
    if (folder === "all") return true;
    if (folder === "starred") return email.starred;
    return email.folder === folder;
  });
}
