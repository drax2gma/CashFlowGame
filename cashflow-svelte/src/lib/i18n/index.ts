import { addMessages, init, register, locale, getLocaleFromNavigator, _ } from 'svelte-i18n';

// Import languages
import en from './locales/en.json';
import hu from './locales/hu.json';

// Register languages
register('en', () => Promise.resolve(en));
register('hu', () => Promise.resolve(hu));

// Add fallback messages
addMessages('en', en);
addMessages('hu', hu);

// Initialize the i18n library
init({
  fallbackLocale: 'en',
  initialLocale: 'en',
});

// Function to get the user's preferred locale
export function getPreferredLocale(): string {
  // Try to get locale from navigator (browser only)
  if (typeof window !== 'undefined') {
    const localeFromNavigator = getLocaleFromNavigator();
    if (localeFromNavigator) return localeFromNavigator;
  }

  // Default to English
  return 'en';
}

// Export the locale store and translation function for use in components
export { locale, _ };