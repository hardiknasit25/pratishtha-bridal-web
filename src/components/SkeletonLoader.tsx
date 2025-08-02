import { Loader2 } from "lucide-react";

interface SkeletonLoaderProps {
  count?: number;
  type?: "product" | "order" | "card";
}

export const SkeletonLoader = ({
  count = 3,
  type = "product",
}: SkeletonLoaderProps) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div key={index} className="animate-pulse">
      <div className="w-full bg-white shadow-sm border border-gray-100 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {/* Title skeleton */}
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
            {/* Subtitle skeleton */}
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="flex items-center gap-3">
            {/* Price skeleton */}
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            {/* Chevron icon skeleton */}
            <div className="h-5 w-5 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  ));

  return <div className="space-y-4">{skeletons}</div>;
};

// Loading spinner component
export const LoadingSpinner = ({
  size = "default",
  text = "Loading...",
}: {
  size?: "sm" | "default" | "lg";
  text?: string;
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2
        className={`${sizeClasses[size]} animate-spin text-pink-500 mb-4`}
      />
      <p className="text-gray-600">{text}</p>
    </div>
  );
};

// Button loading state
export const ButtonLoader = ({
  size = "default",
}: {
  size?: "sm" | "default" | "lg";
}) => {
  const sizeClasses = {
    sm: "h-3 w-3",
    default: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return <Loader2 className={`${sizeClasses[size]} animate-spin`} />;
};
