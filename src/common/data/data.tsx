import { Notification } from "../../constants/interface/notification";

export const notifications: Notification[] = [
  {
    createdAt: "2025-01-01T08:00:00Z",
    message: "Your frequest has been confirmed.",
    route: "/bookings/12345",
    seen: false,
    updatedAt: "2025-01-01T08:00:00Z",
    _id: "notif1",
  },
  {
    createdAt: "2025-01-01T09:15:30Z",
    message: "A new update is available for the app.",
    route: "/updates",
    seen: true,
    updatedAt: "2025-01-01T09:20:00Z",
    _id: "notif2",
  },
  {
    createdAt: "2025-01-01T10:45:00Z",
    message: "Your password has been successfully changed.",
    route: "/settings/security",
    seen: false,
    updatedAt: "2025-01-01T10:45:00Z",
    _id: "notif3",
  },
  {
    createdAt: "2025-01-01T11:30:00Z",
    message: "Your profile has been updated.",
    route: "/profile",
    seen: true,
    updatedAt: "2025-01-01T11:35:00Z",
    _id: "notif4",
  },
  {
    createdAt: "2025-01-01T12:00:00Z",
    message: "You have a new message from customer support.",
    route: "/messages/support",
    seen: false,
    updatedAt: "2025-01-01T12:05:00Z",
    _id: "notif5",
  },
];
