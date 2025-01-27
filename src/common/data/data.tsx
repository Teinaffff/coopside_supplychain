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

export const members = [
  {
    memberId: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    age: 35,
    nationality: "American",
    city: "New York",
    subcity: "Manhattan",
    woreda: "1",
    startDate: "2023-01-15",
    photo: "https://example.com/photos/john.jpg",
    registrationFee: 150,
    share: 2000,
    collateral: "House in Manhattan",
    inheritor: "Jane Doe",
  },
  {
    memberId: 2,
    name: "Amina Yusuf",
    email: "amina.yusuf@example.com",
    age: 28,
    nationality: "Ethiopian",
    city: "Addis Ababa",
    subcity: "Bole",
    woreda: "2",
    startDate: "2022-09-10",
    photo: "https://example.com/photos/amina.jpg",
    registrationFee: 120,
    share: 1500,
    collateral: "Land in Addis Ababa",
    inheritor: "Ali Yusuf",
  },
  {
    memberId: 3,
    name: "Carlos Garcia",
    email: "carlos.garcia@example.com",
    age: 42,
    nationality: "Spanish",
    city: "Madrid",
    subcity: "Centro",
    woreda: "3",
    startDate: "2021-05-20",
    photo: "https://example.com/photos/carlos.jpg",
    registrationFee: 200,
    share: 2500,
    collateral: "Apartment in Madrid",
    inheritor: "Maria Garcia",
  },
  {
    memberId: 4,
    name: "Wei Zhang",
    email: "wei.zhang@example.com",
    age: 30,
    nationality: "Chinese",
    city: "Shanghai",
    subcity: "Pudong",
    woreda: "4",
    startDate: "2020-11-05",
    photo: "https://example.com/photos/wei.jpg",
    registrationFee: 170,
    share: 1800,
    collateral: "Car in Shanghai",
    inheritor: "Li Zhang",
  },
  {
    memberId: 5,
    name: "Fatima Khan",
    email: "fatima.khan@example.com",
    age: 25,
    nationality: "Pakistani",
    city: "Karachi",
    subcity: "Clifton",
    woreda: "5",
    startDate: "2023-06-18",
    photo: "https://example.com/photos/fatima.jpg",
    registrationFee: 130,
    share: 2200,
    collateral: "Gold jewelry",
    inheritor: "Ahmed Khan",
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
    name: "Sophia Zhang",
    role: "Chairperson",
    board: "General Board",
    email: "sarah.johnson@example.com",
    date: "1/15/2023",
  },
  {
    _id: 2,
    userId: 1,
    name: "Alice Johnson",
    role: "Secretary",
    board: "Cooperatives Board",
    email: "michael.chen@example.com",
    date: "2/20/2023",
  },
];

export const boards = [
  "General Board",
  "Cooperatives Board",
  "Activities Leadership Board",
  "Activities Responsibility Board",
  "Inspection Board",
  "Loan Board",
  "Social Life Board",
];

export const profitData = [
  {
    id: 1,
    year: 2024,
    sold: 1500,
    bought: 1800,
    revenue: 50000,
    cost: 30000,
    expenses: 10000,
    gross: 20000,
    net: 10000,
    margin: 20,
    top: "Rice",
  },
  {
    id: 2,
    year: 2025,
    sold: 2000,
    bought: 2300,
    revenue: 75000,
    cost: 45000,
    expenses: 15000,
    gross: 30000,
    net: 15000,
    margin: 25,
    top: "Maize",
  },
  {
    id: 3,
    year: 2026,
    sold: 1800,
    bought: 2100,
    revenue: 60000,
    cost: 35000,
    expenses: 12000,
    gross: 25000,
    net: 13000,
    margin: 21.7,
    top: "Wheat",
  },
  {
    id: 4,
    year: 2027,
    sold: 2200,
    bought: 2500,
    revenue: 80000,
    cost: 50000,
    expenses: 18000,
    gross: 30000,
    net: 12000,
    margin: 15,
    top: "Barley",
  },
  {
    id: 5,
    year: 2028,
    sold: 2400,
    bought: 2700,
    revenue: 90000,
    cost: 55000,
    expenses: 20000,
    gross: 35000,
    net: 15000,
    margin: 16.7,
    top: "Oats",
  },
];
