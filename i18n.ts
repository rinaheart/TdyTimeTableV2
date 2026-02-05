import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { APP_VERSION } from './constants';

// Default language detection
let defaultLanguage = 'vi';
try {
    defaultLanguage = localStorage.getItem('language') || 'vi';
} catch (e) {
    console.warn('LocalStorage not accessible, falling back to "vi"');
}

// Async locale loader
const loadLocaleAsync = async (lng: string) => {
    try {
        const locale = await import(`./locales/${lng}.json`);
        return locale.default;
    } catch {
        // Fallback to Vietnamese if locale not found
        const fallback = await import('./locales/vi.json');
        return fallback.default;
    }
};

// Initialize with empty resources, load async
i18n
    .use(initReactI18next)
    .init({
        resources: {},
        lng: defaultLanguage,
        fallbackLng: 'vi',
        interpolation: {
            escapeValue: false,
            defaultVariables: {
                version: APP_VERSION
            }
        },
        react: {
            useSuspense: false
        }
    });

// Load initial locale
loadLocaleAsync(defaultLanguage).then((translations) => {
    i18n.addResourceBundle(defaultLanguage, 'translation', translations, true, true);

    // If not Vietnamese, also preload Vietnamese as fallback
    if (defaultLanguage !== 'vi') {
        loadLocaleAsync('vi').then((viTranslations) => {
            i18n.addResourceBundle('vi', 'translation', viTranslations, true, true);
        });
    }
});

// Handle language change - load new locale dynamically
i18n.on('languageChanged', async (lng) => {
    document.documentElement.lang = lng;

    // Check if bundle exists, if not load it
    if (!i18n.hasResourceBundle(lng, 'translation')) {
        const translations = await loadLocaleAsync(lng);
        i18n.addResourceBundle(lng, 'translation', translations, true, true);
    }
});

// Initial set
document.documentElement.lang = i18n.language || defaultLanguage;

export default i18n;
