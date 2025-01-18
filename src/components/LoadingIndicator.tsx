"use client";

const LoadingIndicator = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-gray-500"></div>
    </div>
  );
};

export default LoadingIndicator;
