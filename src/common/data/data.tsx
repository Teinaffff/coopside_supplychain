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
    age: 31,
    nationality: "Egyptian",
  },
  {
    userId: 3,
    _id: 103,
    name: "Sophia Zhang",
    email: "sophia.zhang@example.com",
    age: 27,
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
    age: 28,
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
    age: 30,
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

export const ages = [
  {
    label: "27",
    value: 27,
  },
  {
    label: "28",
    value: 28,
  },
  { label: "29", value: 29 },
  { label: "30", value: 30 },
  { label: "31", value: 31 },
];

export const topMembers = [
  { id: 1, name: "Beharudin Mohammed", share: 1000, profit: 400 },
  { id: 2, name: "Iyyasu Amana", share: 800, profit: 300 },
  { id: 3, name: "Chala Abdi", share: 1200, profit: 350 },
  { id: 4, name: "Caltu Jamal", share: 600, profit: 200 },
  { id: 5, name: "Abdi Ali", share: 1500, profit: 500 },
];

export const recentTransactions = [
  {
    id: 1,
    productName: "Oil",
    quantity: 50,
    totalSales: 4000,
    buyer: "ABC Traders",
    remark: "Delivered on time",
    date: "2025-01-15",
    transactionId: "TXN001234",
  },
  {
    id: 2,
    productName: "Grains",
    quantity: 100,
    totalSales: 5000,
    buyer: "XYZ Suppliers",
    remark: "Payment pending",
    date: "2025-01-16",
    transactionId: "TXN001235",
  },
  {
    id: 3,
    productName: "Sugar",
    quantity: 75,
    totalSales: 3000,
    buyer: "LMN Wholesalers",
    remark: "Partial delivery",
    date: "2025-01-17",
    transactionId: "TXN001236",
  },
  {
    id: 4,
    productName: "Spices",
    quantity: 40,
    totalSales: 2500,
    buyer: "PQR Stores",
    remark: "Discount applied",
    date: "2025-01-18",
    transactionId: "TXN001237",
  },
  {
    id: 5,
    productName: "Soap",
    quantity: 60,
    totalSales: 1800,
    buyer: "DEF Retailers",
    remark: "Repeat order",
    date: "2025-01-19",
    transactionId: "TXN001238",
  },
];

export const requestHistoryData = [
  {
    id: "1",
    type: "License Renewal",
    submittedDate: "2025-01-03",
    approvedDate: "2025-01-10",
    status: "Approved",
    expiryDate: "2026-01-03",
  },
  {
    id: "2",
    type: "Membership Update",
    submittedDate: "2024-12-15",
    approvedDate: "2025-01-02",
    status: "Pending",
    expiryDate: "2026-01-15",
  },
];

export const requirements = [
  {
    completed: true,
    title: "Minimum Members",
    subtitle: "At least 5 registered members",
  },
  {
    completed: true,
    title: "Leadership Structure",
    subtitle: "Must have 7 board members",
  },
  {
    completed: false,
    title: "Bank Account Set",
    subtitle: "Bank account should be set",
  },
  {
    completed: true,
    title: "Cooperative Details",
    subtitle: "At least 5 registered members",
  },
  { completed: false, title: "Logo", subtitle: "Corporate logo is mandatory" },
];

export const locationMockData = [
  "0912 New Street, Oromia",
  "0120 New Street, Addis Ababa",
  "0920 New Street, Oromia",
  "0901 New Street, Addis Ababa",
  "0910 New Street, Oromia",
  "0921 New Street, Oromia",
];

export const profileMockData = {
  fullName: "Bahar Mm",
  phone: "0912078640",
  email: "",
  gender: "",
  address: { region: "", zone: "", woreda: "", kebele: "" },
  pcAddress: { region: "", zone: "", woreda: "", kebele: "" },
  pcName: "",
  pcPhone: "",
  pcEmail: "",
  licenseNo: "",
  tinNo: "",
  purpose: "",
  accNo: "",
};

export const cities = [
  {
    id: 1,
    createdAt: "2025-01-23T10:00:00Z",
    cityName: "city-1",
    isEnabled: true,
    subcities: [
      {
        id: 1,
        createdAt: "2025-01-23T10:00:00Z",
        subcityName: "subcity-1",
        cityName: "city-1",
        isEnabled: true,
        woredas: [
          {
            id: 1,
            createdAt: "2025-01-23T10:00:00Z",
            woredaName: "woreda-1",
            subcityName: "subcity-1",
          },
          {
            id: 2,
            createdAt: "2025-01-23T10:00:00Z",
            woredaName: "woreda-2",
            subcityName: "subcity-1",
          },
        ],
      },
      {
        id: 2,
        createdAt: "2025-01-23T10:00:00Z",
        subcityName: "subcity-2",
        cityName: "city-1",
        isEnabled: false,
        woredas: [
          {
            id: 3,
            createdAt: "2025-01-23T10:00:00Z",
            woredaName: "woreda-3",
            subcityName: "subcity-2",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    createdAt: "2025-01-23T10:00:00Z",
    cityName: "city-2",
    isEnabled: false,
    subcities: [
      {
        id: 3,
        createdAt: "2025-01-23T10:00:00Z",
        subcityName: "subcity-3",
        cityName: "city-2",
        isEnabled: true,
        woredas: [
          {
            id: 4,
            createdAt: "2025-01-23T10:00:00Z",
            woredaName: "woreda-4",
            subcityName: "subcity-3",
          },
        ],
      },
    ],
  },
];

export const subcities = [
  {
    id: 1,
    createdAt: "2025-01-23T10:00:00Z",
    subcityName: "subcity-1",
    cityName: "city-1",
    isEnabled: true,
    woredas: [
      {
        id: 1,
        createdAt: "2025-01-23T10:00:00Z",
        woredaName: "woreda-1",
        subcityName: "subcity-1",
      },
      {
        id: 2,
        createdAt: "2025-01-23T10:00:00Z",
        woredaName: "woreda-2",
        subcityName: "subcity-1",
      },
    ],
  },
  {
    id: 2,
    createdAt: "2025-01-23T10:00:00Z",
    subcityName: "subcity-2",
    cityName: "city-1",
    isEnabled: false,
    woredas: [
      {
        id: 3,
        createdAt: "2025-01-23T10:00:00Z",
        woredaName: "woreda-3",
        subcityName: "subcity-2",
      },
    ],
  },
];

export const woredas = [
  {
    id: 1,
    createdAt: "2025-01-23T10:00:00Z",
    woredaName: "woreda-1",
    subcityName: "subcity-1",
  },
  {
    id: 2,
    createdAt: "2025-01-23T10:00:00Z",
    woredaName: "woreda-2",
    subcityName: "subcity-1",
  },
  {
    id: 3,
    createdAt: "2025-01-23T10:00:00Z",
    woredaName: "woreda-3",
    subcityName: "subcity-2",
  },
  {
    id: 4,
    createdAt: "2025-01-23T10:00:00Z",
    woredaName: "woreda-4",
    subcityName: "subcity-3",
  },
];

export const leaders = [
  {
    _id: 1,
    userId: 3,
    name: "Sarah Johnson",
    role: "Chairperson",
    board: "General Board",
    email: "sarah.johnson@example.com",
    date: "1/15/2023",
  },
  {
    _id: 2,
    userId: 2,
    name: "Michael Chen",
    role: "Secretary",
    board: "Cooperatives Board",
    email: "michael.chen@example.com",
    date: "2/20/2023",
  },
];

export const boards=[
  "General Board",
  "Cooperative Board",
  "Activities Leadership Board",
  "Activities Responsibility Board",
  "Inspection Board",
  "Loan Board",
  "Social Life Board",
]
