import { useState, useEffect } from 'react';
import { translations } from './translations';
import { useLanguage, Language, AccessibilityMode } from '@/contexts/LanguageContext';
import { testTranslations } from './debug-translations';

/**
 * Component to test and debug translation system
 * This provides a comprehensive UI for testing the translation system
 */
export default function TestTranslations() {
  const { 
    t, 
    tA11y, 
    language, 
    setLanguage, 
    accessibilityMode, 
    setAccessibilityMode, 
    isScreenReaderEnabled 
  } = useLanguage();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [customKey, setCustomKey] = useState('home.featured.title');
  const [customResult, setCustomResult] = useState('');
  const [showConsoleOutput, setShowConsoleOutput] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [showA11yComparison, setShowA11yComparison] = useState(false);
  
  // Critical keys that are essential for app functionality
  const criticalKeys = [
    'home.featured.title',
    'home.featured.description',
    'home.categories.title',
    'home.categories.description',
    'home.hero.title',
    'home.newsletter.title',
    'nav.home',
    'nav.products'
  ];
  
  // This component performs extensive testing of the translation system
  useEffect(() => {
    // Deep verification of translation system
    const output: string[] = [];
    
    // Capture console output for display in the UI
    const log = (message: string) => {
      output.push(message);
    };
    
    log('=== DETAILED TRANSLATION SYSTEM VERIFICATION ===');
    
    // Step 1: Verify the translations global object
    log('1. Global translations object:');
    log(`   Type: ${typeof translations}`);
    log(`   Available languages: ${Object.keys(translations).join(', ')}`);
    
    // Step 2: Verify individual language objects
    log(`2. Current language: ${language}`);
    log(`   English translations count: ${Object.keys(translations.en || {}).length}`);
    
    if (language === 'he') {
      log(`   Hebrew translations count: ${Object.keys(translations.he || {}).length}`);
    }
    
    // Step 3: Test specifically the keys that are showing up as raw
    log('3. Testing problematic translation keys:');
    criticalKeys.forEach(key => {
      // Test t() function
      const translated = t(key);
      
      // Test direct access
      const directTranslation = translations[language]?.[key];
      
      log(`   Key: "${key}"`);
      log(`   - t() function returns: "${translated}"`);
      log(`   - Direct access returns: "${directTranslation}"`);
      log(`   - Result match: ${translated === directTranslation ? 'YES ✓' : 'NO ✗'}`);
    });
    
    log('=== END TRANSLATION VERIFICATION ===');
    
    // Identify if import might be a problem
    try {
      // This reference should match expected value
      if (translations.en['home.featured.title'] !== 'Featured Products') {
        log('ERROR: Corrupt translation data - values don\'t match expected defaults');
      } else {
        log('Translation data integrity check: PASSED');
      }
    } catch (e) {
      log(`ERROR during translation integrity check: ${e}`);
    }
    
    setConsoleOutput(output);
    
    // Also run the dedicated test function
    testTranslations(language);
  }, [language, t, criticalKeys]);
  
  // Search for translation keys containing the query
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    const results: string[] = [];
    const searchLower = searchQuery.toLowerCase();
    
    // Search in all languages
    Object.values(translations).forEach(translationSet => {
      Object.entries(translationSet).forEach(([key, value]) => {
        if (
          key.toLowerCase().includes(searchLower) ||
          String(value).toLowerCase().includes(searchLower)
        ) {
          if (!results.includes(key)) {
            results.push(key);
          }
        }
      });
    });
    
    setSearchResults(results);
  };
  
  // Test a custom translation key
  const testCustomKey = () => {
    if (!customKey.trim()) return;
    
    const translated = t(customKey);
    const directValue = translations[language]?.[customKey] || 'Not found in current language';
    const englishValue = language !== 'en' ? translations.en?.[customKey] || 'Not found in English' : 'Same as current';
    
    setCustomResult(`
      Translation: "${translated}"
      Direct value: "${directValue}"
      English fallback: "${englishValue}"
      Status: ${translated && translated !== customKey ? '✅ Success' : '❌ Failed'}
    `);
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-sky-700 border-b pb-2">Translation System Diagnostics</h1>
      
      {/* Language selection */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Language Settings</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Current Language:</label>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="p-2 border rounded-md bg-white shadow-sm focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="en">English</option>
              <option value="he">Hebrew (עברית)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Direction:</label>
            <div className="p-2 bg-slate-100 rounded-md min-w-[120px] text-center">
              {language === 'he' ? 'RTL (Right to Left)' : 'LTR (Left to Right)'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Translation search */}
      <div className="mb-6 p-4 bg-slate-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Search Translations</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for keys or values..."
            className="flex-1 p-2 border rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
          />
          <button
            onClick={handleSearch}
            className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Search
          </button>
        </div>
        
        {searchResults.length > 0 && (
          <div className="mt-4 border rounded-md p-3 bg-white max-h-60 overflow-y-auto">
            <h3 className="font-medium mb-2">Results ({searchResults.length})</h3>
            <ul className="space-y-1">
              {searchResults.map((key) => (
                <li key={key} className="text-sm flex flex-wrap items-baseline">
                  <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-sky-700">{key}</span>
                  <span className="mx-2 text-slate-400">→</span>
                  <span className="text-slate-700">{t(key)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Custom key testing */}
      <div className="mb-6 p-4 bg-slate-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Test Custom Translation Key</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={customKey}
            onChange={(e) => setCustomKey(e.target.value)}
            placeholder="Enter translation key to test..."
            className="flex-1 p-2 border rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
          />
          <button
            onClick={testCustomKey}
            className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Test
          </button>
        </div>
        
        {customResult && (
          <pre className="mt-4 border rounded-md p-3 bg-white text-sm font-mono whitespace-pre-wrap">
            {customResult}
          </pre>
        )}
      </div>
      
      {/* Critical keys status */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Critical Keys Status</h2>
          <button
            className="text-sm text-sky-600 hover:text-sky-800"
            onClick={() => setShowConsoleOutput(!showConsoleOutput)}
          >
            {showConsoleOutput ? 'Hide Detailed Log' : 'Show Detailed Log'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {criticalKeys.map(key => {
            const translated = t(key);
            const isWorking = translated && translated !== key;
            
            return (
              <div key={key} className="p-3 border rounded-md bg-white flex justify-between items-center">
                <div>
                  <span className="font-mono text-sm text-slate-600">{key}</span>
                  <p className="text-slate-800 truncate max-w-[240px]">{translated}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${isWorking ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {isWorking ? 'Working' : 'Failed'}
                </span>
              </div>
            );
          })}
        </div>
        
        {showConsoleOutput && (
          <div className="mt-4 border rounded-md bg-slate-900 text-white p-3 font-mono text-sm max-h-80 overflow-y-auto">
            {consoleOutput.map((line, index) => (
              <div key={index} className="whitespace-pre-wrap">
                {line}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Accessibility Settings */}
      <div className="mb-6 p-4 bg-slate-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Accessibility Settings</h2>
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Current Mode:</label>
            <select 
              value={accessibilityMode} 
              onChange={(e) => setAccessibilityMode(e.target.value as AccessibilityMode)}
              className="p-2 border rounded-md bg-white shadow-sm focus:ring-sky-500 focus:border-sky-500 min-w-[200px]"
            >
              <option value="standard">Standard Mode</option>
              <option value="screenReader">Screen Reader Mode</option>
              <option value="highContrast">High Contrast Mode</option>
              <option value="reducedMotion">Reduced Motion Mode</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-md ${isScreenReaderEnabled ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
              Screen Reader Optimizations: {isScreenReaderEnabled ? 'Enabled' : 'Disabled'}
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <button
            onClick={() => setShowA11yComparison(!showA11yComparison)}
            className="text-sm text-sky-600 hover:text-sky-800 flex items-center gap-1"
          >
            <span>{showA11yComparison ? 'Hide' : 'Show'} Screen Reader Translation Comparison</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 transition-transform ${showA11yComparison ? 'rotate-180' : 'rotate-0'}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {showA11yComparison && (
          <div className="border rounded-md bg-white p-3">
            <h3 className="font-medium text-slate-700 mb-2">Regular vs. Screen Reader Optimized Translations</h3>
            <div className="space-y-4">
              {['nav.home', 'nav.shop', 'product.addToCart', 'home.featured.title', 'button.submit'].map(key => (
                <div key={key} className="p-3 border rounded-md">
                  <div className="font-mono text-sm bg-slate-50 p-1 rounded mb-2 text-slate-700">{key}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-2 bg-blue-50 rounded">
                      <div className="text-xs text-blue-500 font-medium mb-1">Standard Translation:</div>
                      <div className="text-slate-900">{t(key)}</div>
                    </div>
                    <div className="p-2 bg-green-50 rounded">
                      <div className="text-xs text-green-500 font-medium mb-1">Screen Reader Optimized:</div>
                      <div className="text-slate-900">{tA11y(key)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
              <p className="font-medium text-yellow-700">How Screen Reader Optimizations Work:</p>
              <ul className="list-disc list-inside text-yellow-600 mt-2 space-y-1">
                <li>Adds contextual information to navigation elements</li>
                <li>Expands abbreviations and acronyms</li>
                <li>Enhances form control descriptions</li>
                <li>Adds element type hints (button, link, etc.)</li>
                <li>Provides supplementary descriptions for images</li>
              </ul>
            </div>
          </div>
        )}
      </div>
      
      {/* Accessibility CSS Demo */}
      <div className="mb-6 p-4 bg-slate-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Accessibility CSS Demo</h2>
        <p className="text-sm text-slate-600 mb-4">
          This section demonstrates how CSS styling adapts to different accessibility modes. 
          Change the accessibility mode above to see the differences.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 bg-white">
            <h3 className="text-lg font-medium mb-2">Product Card</h3>
            <div className="product-card">
              <div className="relative overflow-hidden rounded-lg h-40 bg-slate-100">
                <div className="product-image bg-gradient-to-r from-sky-400 to-blue-500 w-full h-full flex items-center justify-center text-white">
                  Product Image Placeholder
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-medium">Example Product</h4>
                <p className="text-sm text-slate-500">High-quality tactical gear</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="font-bold">$99.99</span>
                  <button className="bg-sky-600 text-white px-3 py-1 rounded-md text-sm">Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 bg-white">
            <h3 className="text-lg font-medium mb-2">Form Controls</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Input Field</label>
                <input type="text" className="w-full p-2 border rounded-md" placeholder="Enter text here" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Menu</label>
                <select className="w-full p-2 border rounded-md">
                  <option>Option 1</option>
                  <option>Option 2</option>
                  <option>Option 3</option>
                </select>
              </div>
              <div className="pt-2">
                <button className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded-md mr-2">
                  Primary Button
                </button>
                <button className="bg-white border border-slate-300 text-slate-700 font-medium py-2 px-4 rounded-md">
                  Secondary Button
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 border rounded-lg p-4 bg-white">
          <h3 className="text-lg font-medium mb-2">Text and Links</h3>
          <p className="mb-2">
            This is a paragraph with a <a href="#" className="text-sky-600 hover:underline">link</a> inside it. 
            Links should be distinguishable from regular text and provide clear focus indicators.
          </p>
          <div className="space-y-2">
            <p className="text-sm font-medium">Different heading levels:</p>
            <h1 className="text-2xl font-bold">Heading Level 1</h1>
            <h2 className="text-xl font-semibold">Heading Level 2</h2>
            <h3 className="text-lg font-medium">Heading Level 3</h3>
            <p className="text-sm text-slate-500">Small text with lower contrast (affected by high contrast mode)</p>
          </div>
        </div>
      </div>
    </div>
  );
}