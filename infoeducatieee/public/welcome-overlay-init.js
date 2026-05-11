// welcome-overlay-init.js
// Initializes the 3D welcome overlay after DOM is ready
import { initWelcomeOverlay } from './welcome-overlay.js';

function init() {
  initWelcomeOverlay();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
