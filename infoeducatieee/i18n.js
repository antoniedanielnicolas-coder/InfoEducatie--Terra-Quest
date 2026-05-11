export const translations = {
  en: null,
  ro: null
};

export let currentLang = localStorage.getItem('appLang') || 'en';

export async function initI18n() {
  try {
    const enResponse = await fetch('/lang/en.json');
    translations.en = await enResponse.json();
    
    const roResponse = await fetch('/lang/ro.json');
    translations.ro = await roResponse.json();
    
    updateDOMTranslations();
  } catch (error) {
    console.error('Failed to load translations:', error);
  }
}

export function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem('appLang', lang);
    updateDOMTranslations();
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }
}

export function t(key) {
  const keys = key.split('.');
  let value = translations[currentLang];
  
  for (const k of keys) {
    if (value && value[k]) {
      value = value[k];
    } else {
      return key; // fallback to key
    }
  }
  
  return value;
}

function updateDOMTranslations() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = t(key);
    
    if (el.tagName === 'INPUT' && el.type === 'text') {
      el.placeholder = translation;
    } else {
      // Don't overwrite inner HTML if there are icons inside, just text node
      // For simple cases, we can check if it has a span.nav-icon
      const icon = el.querySelector('.nav-icon');
      if (icon) {
        el.innerHTML = '';
        el.appendChild(icon);
        el.append(translation);
      } else {
        el.textContent = translation;
      }
    }
  });
}
