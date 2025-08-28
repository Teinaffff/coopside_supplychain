import React from "react";

interface StatusBadgeProps {
  status: string;
  isActive: boolean;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  isActive,
  className = "",
}) => {
  const statusClass = isActive
    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";

  return (
    <span
      className={`px-4 py-1.5 rounded-full text-xs font-medium border-0 ${statusClass} ${className}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
