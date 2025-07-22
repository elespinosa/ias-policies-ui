import React from 'react';

interface TabsSkeletonProps {
  tabCount?: number;
  contentHeight?: string;
}

const TabsSkeleton: React.FC<TabsSkeletonProps> = ({
  tabCount = 4,
  contentHeight = 'h-64',
}) => {
  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="flex space-x-4 border-b border-gray-200">
        {[...Array(tabCount)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse"
          >
            <div className="h-10 w-24 bg-gray-200 rounded-t-lg"></div>
          </div>
        ))}
      </div>

      {/* Tab Content */}
      <div className={`${contentHeight} w-full mt-4`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );
};

export default TabsSkeleton; 