import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  rows?: number;
  type?: 'text' | 'card' | 'table' | 'chart';
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  className = '', 
  rows = 3, 
  type = 'text' 
}) => {
  if (type === 'card') {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-gray-700 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-600 rounded w-1/3"></div>
              <div className="h-8 bg-gray-600 rounded w-1/2"></div>
            </div>
            <div className="w-12 h-12 bg-gray-600 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 bg-gray-700">
            <div className="h-6 bg-gray-600 rounded w-1/4"></div>
          </div>
          <div className="divide-y divide-gray-600">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex space-x-4">
                <div className="h-4 bg-gray-600 rounded flex-1"></div>
                <div className="h-4 bg-gray-600 rounded w-20"></div>
                <div className="h-4 bg-gray-600 rounded w-32"></div>
                <div className="h-4 bg-gray-600 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="h-6 bg-gray-600 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-600 rounded w-full"></div>
      ))}
    </div>
  );
};

export default SkeletonLoader;