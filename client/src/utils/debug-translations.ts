import { translations } from './translations';
import { Language } from '@/contexts/LanguageContext';

/**
 * Tests direct access to translation keys
 * 
 * This debug utility ensures all critical translation keys are available
 * and validates the translation system operation.
 * 
 * Call this function to get a snapshot of the translation system state
 */
export function testTranslations(language: Language = 'en'): void {
  console.log('=== TRANSLATION DEBUG TOOL ===');
  console.log('Current language:', language);
  
  // Verify translations are loaded
  if (!translations) {
    console.error('ERROR: translations object is not defined!');
    return;
  }
  
  // Verify language keys are available
  const availableLanguages = Object.keys(translations);
  console.log('Available languages:', availableLanguages.join(', '));
  
  if (!availableLanguages.includes(language)) {
    console.error(`ERROR: Language "${language}" is not available in translations!`);
    return;
  }
  
  // Test key access
  const criticalKeys = [
    'home.featured.title',
    'home.featured.description',
    'home.categories.title',
    'home.categories.description',
  ];
  
  console.log('Testing critical translation keys:');
  
  let allPassed = true;
  
  criticalKeys.forEach(key => {
    const hasKey = Object.prototype.hasOwnProperty.call(translations[language], key);
    const value = translations[language][key];
    
    console.log(`Key: "${key}" - ${hasKey ? 'Found ✓' : 'MISSING ✗'} - Value: "${value || 'undefined'}"`);
    
    if (!hasKey || value === undefined) {
      allPassed = false;
    }
  });
  
  if (allPassed) {
    console.log('🎉 All critical translation keys verified!');
  } else {
    console.error('⚠️ Some critical translation keys are missing or have undefined values');
    console.log('Available keys in translations[language]:', Object.keys(translations[language]).length);
  }
  
  console.log('=== END TRANSLATION DEBUG ===');
}

export default testTranslations;