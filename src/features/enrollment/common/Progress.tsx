import React from "react";

interface ProgressBarProps {
  progress: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  color?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size = "md",
  showLabel = true,
  color = "#106c54",
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Tiến độ</span>
          <span className="text-sm font-medium text-gray-900">{clampedProgress}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div
          className={`${sizeClasses[size]} rounded-full transition-all duration-300 ease-out`}
          style={{
            width: `${clampedProgress}%`,
            backgroundColor: color,
          }}
        ></div>
      </div>
    </div>
  );
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = "" }) => {
  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return {
          label: "Hoàn thành",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          dotColor: "bg-green-400",
        };
      case "in_progress":
        return {
          label: "Đang học",
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          dotColor: "bg-blue-400",
        };
      case "not_started":
        return {
          label: "Chưa bắt đầu",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          dotColor: "bg-gray-400",
        };
      case "expired":
        return {
          label: "Hết hạn",
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          dotColor: "bg-red-400",
        };
      default:
        return {
          label: status || "Không xác định",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          dotColor: "bg-gray-400",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} ${className}`}
    >
      <span className={`w-2 h-2 rounded-full mr-1.5 ${config.dotColor}`}></span>
      {config.label}
    </span>
  );
};

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = "#106c54",
  trend,
  className = "",
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md border overflow-hidden ${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            {trend && (
              <div className="flex items-center mt-2">
                <span
                  className={`text-sm font-medium ${
                    trend.isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-gray-500 ml-2">từ tháng trước</span>
              </div>
            )}
          </div>
          {icon && (
            <div className="flex-shrink-0 ml-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: color }}
              >
                {icon}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};