export type NotificationType =
  | "borrow_request"
  | "request_accepted"
  | "book_nearby"
  | "handoff_ready";

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  accent?: string;
};

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    type: "request_accepted",
    title: "Request accepted",
    message: "Meeday accepted your borrow request for Atomic Habits.",
    time: "2m ago",
    read: false,
    accent: "#3C06A7",
  },
  {
    id: "n2",
    type: "handoff_ready",
    title: "Meeting node set",
    message: "Your handoff with Tunde is ready. Scan the QR when you meet.",
    time: "1h ago",
    read: false,
    accent: "#3C06A7",
  },
  {
    id: "n3",
    type: "book_nearby",
    title: "New book nearby",
    message: "Clean Code just appeared on a shelf 0.8km from you.",
    time: "3h ago",
    read: true,
    accent: "#6BB3F2",
  },
  {
    id: "n4",
    type: "borrow_request",
    title: "Borrow request",
    message: "Sam wants to borrow The Pragmatic Programmer from your shelf.",
    time: "Yesterday",
    read: true,
    accent: "#E8843C",
  },
  {
    id: "n5",
    type: "book_nearby",
    title: "Shelf updated",
    message: "Ada added Thinking, Fast and Slow to their shelf.",
    time: "2 days ago",
    read: true,
    accent: "#A0D858",
  },
];

export function getUnreadCount(notifications: AppNotification[]) {
  return notifications.filter((notification) => !notification.read).length;
}
