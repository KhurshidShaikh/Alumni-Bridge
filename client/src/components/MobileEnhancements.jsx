import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

const MobileEnhancements = ({ children, onRefresh }) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let touchStartY = 0;
    let touchCurrentY = 0;
    let pullThreshold = 80;

    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        touchStartY = e.touches[0].clientY;
        setStartY(touchStartY);
      }
    };

    const handleTouchMove = (e) => {
      if (window.scrollY === 0 && touchStartY > 0) {
        touchCurrentY = e.touches[0].clientY;
        const pullDistance = Math.max(0, (touchCurrentY - touchStartY) * 0.5);
        
        if (pullDistance > 10) {
          e.preventDefault();
          setIsPulling(true);
          setPullDistance(pullDistance);
        }
      }
    };

    const handleTouchEnd = async () => {
      if (isPulling && pullDistance > pullThreshold) {
        setIsRefreshing(true);
        if (onRefresh) {
          await onRefresh();
        }
        setTimeout(() => {
          setIsRefreshing(false);
        }, 1000);
      }
      
      setIsPulling(false);
      setPullDistance(0);
      setStartY(0);
    };

    // Only add touch listeners on mobile devices
    if (window.innerWidth <= 768) {
      document.addEventListener('touchstart', handleTouchStart, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, pullDistance, onRefresh]);

  return (
    <div className="relative">
      {/* Pull to Refresh Indicator */}
      {(isPulling || isRefreshing) && (
        <div 
          className="pull-to-refresh visible md:hidden"
          style={{ 
            top: Math.min(pullDistance - 20, 60),
            opacity: Math.min(pullDistance / 80, 1)
          }}
        >
          <div className="flex items-center space-x-2 text-blue-600">
            <RefreshCw 
              className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} 
            />
            <span className="text-sm font-medium">
              {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div 
        style={{ 
          transform: isPulling ? `translateY(${Math.min(pullDistance, 100)}px)` : 'translateY(0)',
          transition: isPulling ? 'none' : 'transform 0.3s ease'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default MobileEnhancements;
