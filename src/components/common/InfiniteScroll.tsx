import React, { useEffect, useRef } from 'react';

interface InfiniteScrollProps {
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  debounceMs?: number;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  onLoadMore,
  isLoading,
  hasMore,
  children,
  className = "",
  threshold = 100,
  debounceMs = 300,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isLoadingMore = useRef(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = (e: Event) => {
      const element = e.target as HTMLDivElement;
      
      // Clear any pending timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set new timeout to debounce the scroll event
      timeoutId = setTimeout(() => {
        if (
          element.scrollHeight - element.scrollTop - element.clientHeight < threshold &&
          !isLoading &&
          hasMore &&
          !isLoadingMore.current
        ) {
          isLoadingMore.current = true;
          onLoadMore();
        }
      }, debounceMs);
    };

    const currentRef = scrollContainerRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading, hasMore, threshold, debounceMs, onLoadMore]);

  // Reset loading flag when loading completes
  useEffect(() => {
    if (!isLoading) {
      isLoadingMore.current = false;
    }
  }, [isLoading]);

  return (
    <div 
      ref={scrollContainerRef}
      className={`overflow-hidden overflow-y-auto ${className}`}
    >
      {children}
    </div>
  );
};

export default InfiniteScroll; 