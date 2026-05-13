import { currentLang as langFromModule, translations as translationsFromModule } from './i18n.js';

// We overwrite the module's internal state if needed, but better to just use the tools provided.
// Since I can't easily overwrite the exported variables of a module from another file without a proxy,
// I will just modify the i18n.js file itself.
