import { useState, useEffect } from 'react';
import { useUI } from '@/contexts/UIContext';

// Extreme simple version - just a fixed button
export default function MiniCartDebug() {
  const { miniCartOpen, setMiniCartOpen } = useUI();
  
  useEffect(() => {
    console.log("[MiniCartDebug] Component mounted");
  }, []);

  return (
    <div 
      className="fixed bottom-4 left-4 z-[1000] p-4 rounded shadow-lg flex flex-col gap-2"
      style={{
        backgroundColor: 'red',
        color: 'white',
        fontWeight: 'bold',
        border: '2px solid white'
      }}
    >
      <div>Debug Controls</div>
      <div>Cart is: {miniCartOpen ? 'OPEN' : 'CLOSED'}</div>
      <div className="flex gap-2">
        <button 
          onClick={() => setMiniCartOpen(true)}
          style={{
            backgroundColor: 'white',
            color: 'red',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          OPEN
        </button>
        <button 
          onClick={() => setMiniCartOpen(false)}
          style={{
            backgroundColor: 'black',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          CLOSE
        </button>
      </div>
    </div>
  );
} 
