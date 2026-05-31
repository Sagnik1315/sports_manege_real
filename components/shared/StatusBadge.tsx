import { cn } from "@/lib/utils";
import type { RegistrationStatus } from "@/types";

const statusConfig: Record<RegistrationStatus, { label: string; className: string }> = {
  Draft: { label: "Draft", className: "bg-gray-100 text-gray-700 border-gray-200" },
  Submitted: { label: "Submitted", className: "bg-blue-50 text-blue-700 border-blue-200" },
  "Under Review": { label: "Under Review", className: "bg-amber-50 text-amber-700 border-amber-200" },
  Approved: { label: "Approved", className: "bg-green-50 text-green-700 border-green-200" },
  Rejected: { label: "Rejected", className: "bg-red-50 text-red-700 border-red-200" },
};

interface StatusBadgeProps {
  status: RegistrationStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.Draft;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full mr-1.5",
          status === "Draft" && "bg-gray-400",
          status === "Submitted" && "bg-blue-500",
          status === "Under Review" && "bg-amber-500",
          status === "Approved" && "bg-green-500",
          status === "Rejected" && "bg-red-500"
        )}
      />
      {config.label}
    </span>
  );
}
