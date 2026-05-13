import { initWelcomeOverlay } from './welcome-overlay.js';

function init() {
  initWelcomeOverlay();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
