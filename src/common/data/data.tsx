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

export const users = [
  {
    userId: 1,
    _id: 101,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    age: 28,
    nationality: "American",
  },
  {
    userId: 2,
    _id: 102,
    name: "Mohammed Ali",
    email: "mohammed.ali@example.com",
    age: 32,
    nationality: "Egyptian",
  },
  {
    userId: 3,
    _id: 103,
    name: "Sophia Zhang",
    email: "sophia.zhang@example.com",
    age: 24,
    nationality: "Chinese",
  },
  {
    userId: 4,
    _id: 104,
    name: "Carlos Rivera",
    email: "carlos.rivera@example.com",
    age: 35,
    nationality: "Mexican",
  },
  {
    userId: 5,
    _id: 105,
    name: "Emilia Rossi",
    email: "emilia.rossi@example.com",
    age: 29,
    nationality: "Italian",
  },
  {
    userId: 6,
    _id: 106,
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    age: 27,
    nationality: "Indian",
  },
  {
    userId: 7,
    _id: 107,
    name: "Yuki Tanaka",
    email: "yuki.tanaka@example.com",
    age: 22,
    nationality: "Japanese",
  },
  {
    userId: 8,
    _id: 108,
    name: "Liam O'Connor",
    email: "liam.oconnor@example.com",
    age: 31,
    nationality: "Irish",
  },
  {
    userId: 9,
    _id: 109,
    name: "Fatima Hassan",
    email: "fatima.hassan@example.com",
    age: 30,
    nationality: "Pakistani",
  },
  {
    userId: 10,
    _id: 110,
    name: "Ethan Brown",
    email: "ethan.brown@example.com",
    age: 26,
    nationality: "Canadian",
  },
];

export const cooperativeQuotes = [
  {
    quote:
      "The key to overcoming poverty lies in the power of cooperation and cooperatives",
    name: "Haile Gebre",
  },
  {
    quote: "Alone we can do so little; together we can do so much.",
    name: "Helen Keller",
  },
  {
    quote:
      "The success of a cooperative lies in its ability to foster trust and collaboration.",
    name: "Miyamoto Musashi",
  },
  {
    quote:
      "In the heart of cooperation, we find the strength of community and the promise of a brighter future.",
    name: "Nelson Mandela",
  },
  {
    quote:
      "A cooperative is not just a business, it’s a movement that embodies shared responsibility and mutual benefit.",
    name: "Amina J. Mohammed",
  },
];
