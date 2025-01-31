import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const phoneRegex = /^(0|\+251)(9|7)\d{8}$/;

export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  // Format the time
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const meridiem = hours < 12 ? "AM" : "PM";
  hours = hours % 12 || 12; // Convert to 12-hour format
  const formattedTime = `${hours}:${minutes} ${meridiem}`;

  // Format the date
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = date.toLocaleDateString("en-US", options);

  const shortDateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "2-digit",
  };
  const shortDate = date.toLocaleDateString("en-US", shortDateOptions);

  return {
    time: formattedTime,
    date: formattedDate,
    shortDate,
  };
};

export const isActivePath = (pathname: string, base: string, target: string) =>
  target === base
    ? pathname === target
    : pathname.startsWith(base) && pathname.startsWith(target);

export function getInitials(fullName: string): string {
  const words = fullName?.trim().split(/\s+/); // Split on whitespace (one or more spaces)

  if (words?.length === 1) {
    return words[0].charAt(0).toUpperCase(); // Take first letter for single word, uppercase
  } else {
    return words
      ?.slice(0, 2) // Take first two words
      .map((word) => word.charAt(0).toUpperCase()) // Take first letter of each word, uppercase
      .join(""); // Combine initials
  }
}
