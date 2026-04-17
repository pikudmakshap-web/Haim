import React, { useRef, useState, useEffect } from 'react';

const ScrollableTableContainer = ({ children, className, style, maxHeight }) => {
  const scrollRef = useRef(null);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollHeight, clientHeight, scrollTop } = scrollRef.current;
        // Check if content causes a scrollbar AND we haven't scrolled to the bottom
        setCanScroll(scrollHeight > clientHeight && Math.ceil(scrollTop + clientHeight) < scrollHeight - 2);
      }
    };

    checkScroll();

    const current = scrollRef.current;
    if (current) {
      current.addEventListener('scroll', checkScroll);
    }
    window.addEventListener('resize', checkScroll);

    // Use ResizeObserver to detect content height changes
    let resizeObserver;
    if (window.ResizeObserver && current) {
      resizeObserver = new ResizeObserver(() => checkScroll());
      resizeObserver.observe(current);
      if (current.firstElementChild) {
        resizeObserver.observe(current.firstElementChild);
      }
    }

    return () => {
      if (current) current.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [children]);

  return (
    <div style={{ position: 'relative', overflow: 'hidden', ...style }} className={className}>
      <div 
        ref={scrollRef} 
        style={{ 
          maxHeight: maxHeight || '100%', 
          overflowY: 'auto',
          overflowX: 'auto',
          height: '100%'
        }}
      >
        {children}
      </div>
      
      {/* Scroll Indicator */}
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          textAlign: 'center',
          padding: '8px',
          background: 'linear-gradient(transparent, var(--bg-surface) 90%)',
          pointerEvents: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          height: '60px',
          opacity: canScroll ? 1 : 0,
          transition: 'opacity 0.3s ease',
          zIndex: 10
        }}
      >
        <span style={{ 
          background: 'var(--bg-secondary)', 
          color: 'var(--text-secondary)',
          padding: '6px 16px', 
          borderRadius: '20px', 
          boxShadow: 'var(--shadow)',
          marginBottom: '4px',
          border: '1px solid var(--border)',
          fontWeight: '600',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          גלול לפריטים נוספים ↓
        </span>
      </div>
    </div>
  );
};

export default ScrollableTableContainer;
