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
      {type === "product" && (
        <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Price */}
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      )}

      {type === "order" && (
        <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Price */}
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>

          {/* Order Details */}
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-1">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      )}

      {type === "card" && (
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      )}
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
