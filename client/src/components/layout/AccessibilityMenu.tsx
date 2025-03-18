import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, AccessibilityMode } from '@/contexts/LanguageContext';
import { 
  Accessibility, 
  Monitor, 
  Eye, 
  EyeOff, 
  MousePointerClick, 
  Volume2, 
  X
} from 'lucide-react';

export default function AccessibilityMenu() {
  const { t, language, accessibilityMode, setAccessibilityMode, isScreenReaderEnabled, tA11y } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  // Use the appropriate translation function based on screen reader mode
  const translate = isScreenReaderEnabled ? tA11y : t;
  
  // Helper to check if a specific mode is active
  const isActive = (mode: AccessibilityMode): boolean => {
    return accessibilityMode === mode;
  };
  
  // Change accessibility mode
  const handleModeChange = (mode: AccessibilityMode) => {
    setAccessibilityMode(mode);
    
    // Announce change to screen readers
    if (mode === 'screenReader') {
      setTimeout(() => {
        announceToScreenReader('Screen reader optimizations enabled');
      }, 500);
    }
  };
  
  // Announce messages to screen readers via aria-live region
  const announceToScreenReader = (message: string) => {
    const announcer = document.getElementById('accessibility-announcer');
    if (announcer) {
      announcer.textContent = message;
      // Clear after a few seconds
      setTimeout(() => {
        announcer.textContent = '';
      }, 3000);
    }
  };
  
  return (
    <>
      {/* Screen reader announcement area - hidden visually but read by screen readers */}
      <div 
        id="accessibility-announcer" 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
      ></div>
      
      {/* Accessibility menu toggle button */}
      <button
        aria-label={translate('accessibility.menu.toggle')}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-lg ${
          isOpen ? 'bg-sky-600 text-white' : 'bg-white text-sky-700 border border-sky-200'
        }`}
      >
        <Accessibility className="w-6 h-6" />
      </button>
      
      {/* Accessibility menu panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 z-50 bg-white rounded-lg shadow-xl p-4 w-80 border border-slate-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg text-slate-800">
                {translate('accessibility.menu.title')}
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                aria-label={translate('accessibility.menu.close')}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-slate-600 mb-4">
              {translate('accessibility.menu.description')}
            </p>
            
            <div className="space-y-3">
              {/* Standard Mode */}
              <button
                onClick={() => handleModeChange('standard')}
                className={`flex items-center p-3 w-full rounded-lg transition-colors ${
                  isActive('standard') 
                    ? 'bg-sky-100 text-sky-700 border-2 border-sky-500' 
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
                aria-pressed={isActive('standard')}
              >
                <Monitor className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{translate('accessibility.mode.standard')}</div>
                  <div className="text-xs opacity-75">{translate('accessibility.mode.standard.description')}</div>
                </div>
              </button>
              
              {/* Screen Reader Mode */}
              <button
                onClick={() => handleModeChange('screenReader')}
                className={`flex items-center p-3 w-full rounded-lg transition-colors ${
                  isActive('screenReader') 
                    ? 'bg-sky-100 text-sky-700 border-2 border-sky-500' 
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
                aria-pressed={isActive('screenReader')}
              >
                <Volume2 className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{translate('accessibility.mode.screenReader')}</div>
                  <div className="text-xs opacity-75">{translate('accessibility.mode.screenReader.description')}</div>
                </div>
              </button>
              
              {/* High Contrast Mode */}
              <button
                onClick={() => handleModeChange('highContrast')}
                className={`flex items-center p-3 w-full rounded-lg transition-colors ${
                  isActive('highContrast') 
                    ? 'bg-sky-100 text-sky-700 border-2 border-sky-500' 
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
                aria-pressed={isActive('highContrast')}
              >
                <Eye className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{translate('accessibility.mode.highContrast')}</div>
                  <div className="text-xs opacity-75">{translate('accessibility.mode.highContrast.description')}</div>
                </div>
              </button>
              
              {/* Reduced Motion Mode */}
              <button
                onClick={() => handleModeChange('reducedMotion')}
                className={`flex items-center p-3 w-full rounded-lg transition-colors ${
                  isActive('reducedMotion') 
                    ? 'bg-sky-100 text-sky-700 border-2 border-sky-500' 
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
                aria-pressed={isActive('reducedMotion')}
              >
                <MousePointerClick className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{translate('accessibility.mode.reducedMotion')}</div>
                  <div className="text-xs opacity-75">{translate('accessibility.mode.reducedMotion.description')}</div>
                </div>
              </button>
            </div>
            
            <div className="pt-4 mt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500">
                {translate('accessibility.menu.footer')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}