import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  // Format the time
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const meridiem = hours < 12 ? 'AM' : 'PM';
  hours = hours % 12 || 12; // Convert to 12-hour format
  const formattedTime = `${hours}:${minutes} ${meridiem}`;

  // Format the date
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const formattedDate = date.toLocaleDateString('en-US', options);

  const shortDateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
  };
  const shortDate = date.toLocaleDateString('en-US', shortDateOptions);

  return {
    time: formattedTime,
    date: formattedDate,
    shortDate,
  };
};