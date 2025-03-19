import React, { useEffect } from 'react';
import { useUI } from '../../contexts/UIContext';

const SimpleMiniCart = () => {
  const { miniCartOpen, setMiniCartOpen: setCartOpen } = useUI();
  
  useEffect(() => {
    console.log('[SimpleMiniCart] Component mounted');
    
    return () => {
      console.log('[SimpleMiniCart] Component unmounted');
    };
  }, []);
  
  useEffect(() => {
    console.log('[SimpleMiniCart] miniCartOpen changed to:', miniCartOpen);
  }, [miniCartOpen]);
  
  if (!miniCartOpen) {
    return null;
  }
  
  // Simple fixed overlay cart implementation
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => {
          console.log('[SimpleMiniCart] Closing cart via backdrop click');
          setCartOpen(false);
        }}
      />
      
      {/* Cart panel */}
      <div className="relative h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Your Cart</h2>
          <button
            onClick={() => {
              console.log('[SimpleMiniCart] Closing cart via header X button');
              setCartOpen(false);
            }}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-grow overflow-auto p-4">
          <p>This is a simplified cart for debugging.</p>
          <p className="mt-4">Current miniCartOpen state: {String(miniCartOpen)}</p>
          <div className="mt-8 p-4 bg-gray-100 rounded">
            <p>Debugging Information:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Component: SimpleMiniCart</li>
              <li>miniCartOpen: {String(miniCartOpen)}</li>
              <li>Time: {new Date().toLocaleTimeString()}</li>
            </ul>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t">
          <button
            onClick={() => {
              console.log('[SimpleMiniCart] Closing cart via footer button');
              setCartOpen(false);
            }}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleMiniCart; 
