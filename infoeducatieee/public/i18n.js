/**
 * 🌍 TerraQuest — Internationalization Module
 * Includes robust English fallbacks to prevent "raw key" display bugs.
 */

export const translations = {
  en: {
    nav: { 
      home: "Home", lessons: "Lessons", games: "Games", tests: "Tests", 
      shop: "Geo Market", profile: "Profile", ai: "AI Agent", 
      worldmap: "World Map", settings: "Settings", coaching: "Coaching" 
    },
    home: {
      title_line1: "Master the", title_line2: "Geopolitical", title_line3: "Landscape",
      desc: "Dive into an immersive journey through state systems, territorial disputes, and geopolitical forces.",
      btn_learn: "Begin Learning", btn_play: "Play Games",
      stat_lessons: "Lessons", stat_countries: "Countries", stat_questions: "Questions", stat_badges: "Badges",
      features_title: "Platform", features_title_gradient: "Features",
      feat1_title: "Interactive Maps", feat2_title: "Gamified Learning", 
      feat3_title: "Practice Tests", feat4_title: "Geopolitics Simulator",
      news_title: "App", news_title_gradient: "Updates", news_subtitle: "Track the latest improvements."
    },
    lessons: { 
      btn_open: "Open Module", btn_start: "Start Lesson", 
      count_label: "Lessons", title: "Lesson", title_gradient: "Modules",
      no_content: "No content available yet.", mark_completed: "Mark as Completed"
    },
    games: { 
      title: "Interactive", title_gradient: "Games", btn_play: "Play Now",
      score: "Score", regime: "Monarchy or Republic?", city_guesser: "City Guesser",
      shape_guesser: "Shape Guesser", map_quiz: "Map Quiz", timeline_chal: "Timeline Challenge",
      badge_visual: "Visual", badge_reflex: "Reflexes", badge_geo: "Geography",
      btn_back: "Back to Games", exit: "Exit Game"
    },
    worldmap: { 
      title: "World", title_gradient: "Political Map", subtitle: "Interactive political boundaries",
      legend_title: "Map Legend", current_map: "Current Map", historic_map: "Historical Map",
      types: {
        const_monarchy: "Constitutional Monarchy", abs_monarchy: "Absolute Monarchy",
        pres_republic: "Presidential Republic", parl_republic: "Parliamentary Republic",
        semi_pres: "Semi-Presidential Republic", one_party: "One-Party State",
        territory: "Territory / Disputed", federal: "Federal Republic", other: "Other"
      }
    },
    common: { 
      close: "Close", continue: "Continue", level: "Level", lv: "Lv.",
      owned: "Owned", questions: "Questions" 
    },
    settings: {
      title: "System", title_gradient: "Settings", tab_login: "🔐 Sign In",
      tab_register: "📝 Register", tab_reset: "🔑 Reset Password"
    }
  },
  ro: null // Will be populated from ro.json
};

export let currentLang = localStorage.getItem('appLang') || 'en';

/**
 * Loads JSON translation files with error handling.
 */
export async function initI18n() {
  console.log("[i18n] Initializing...");
  try {
    // 1. Try to load English JSON for full depth
    const enResponse = await fetch('./lang/en.json');
    if (enResponse.ok) {
        const enData = await enResponse.json();
        translations.en = mergeDeep(translations.en, enData);
        console.log("[i18n] English JSON loaded.");
    }
    
    // 2. Try to load Romanian JSON
    const roResponse = await fetch('./lang/ro.json');
    if (roResponse.ok) {
        translations.ro = await roResponse.json();
        console.log("[i18n] Romanian JSON loaded.");
    } else {
        console.warn("[i18n] Romanian JSON missing, using English fallback.");
    }
    
    updateDOMTranslations();
  } catch (error) {
    console.error('[i18n] Failed to load JSON files:', error);
    // Even if fetch fails, we have internal English defaults
    updateDOMTranslations();
  }
}

function mergeDeep(target, source) {
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object') {
            if (!target[key]) target[key] = {};
            mergeDeep(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

export function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('appLang', lang);
  updateDOMTranslations();
  document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

/**
 * Translates a key, with automatic English fallback.
 */
export function t(key) {
  if (!key) return '';
  const keys = key.split('.');
  
  // 1. Try selected language
  let value = translations[currentLang];
  let found = true;
  if (value) {
      for (const k of keys) {
        if (value && value[k]) {
          value = value[k];
        } else {
          found = false;
          break;
        }
      }
  } else {
      found = false;
  }
  
  if (found && typeof value === 'string') return value;

  // 2. Fallback to English
  let fallback = translations['en'];
  for (const k of keys) {
    if (fallback && fallback[k]) {
      fallback = fallback[k];
    } else {
      return key; // Final fallback: return the key itself
    }
  }
  
  return (typeof fallback === 'string') ? fallback : key;
}

/**
 * Scans the DOM for [data-i18n] attributes and updates them.
 */
export function updateDOMTranslations() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = t(key);
    
    if (el.tagName === 'INPUT' && (el.type === 'text' || el.type === 'password' || el.type === 'email')) {
      el.placeholder = translation;
    } else {
      // Find and preserve existing elements (icons, spans, etc)
      const children = Array.from(el.children);
      
      // Clear all content
      el.innerHTML = '';
      
      // Re-add children (icons)
      children.forEach(child => el.appendChild(child));
      
      // Add the new translation text
      const textNode = document.createTextNode(' ' + translation);
      el.appendChild(textNode);
    }
  });
}
