/**
 * 🚀 BOOTCAMP DATA ENGINEERING - Enhanced UI Components
 * JavaScript pour l'indicateur de progression et le bouton retour en haut
 * 
 * INSTALLATION :
 * 1. Ajouter ce script dans ton fichier _quarto.yml :
 *    include-after-body:
 *      - text: |
 *          <div class="reading-progress"></div>
 *          <button class="back-to-top" aria-label="Retour en haut de page"></button>
 *          <script src="bootcamp-ui.js"></script>
 * 
 * OU ajouter directement dans ton template HTML avant </body>
 */

(function() {
  'use strict';

  // ==================================================
  // 📊 READING PROGRESS INDICATOR
  // ==================================================
  
  const progressBar = document.querySelector('.reading-progress');
  
  if (progressBar) {
    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = Math.min(progress, 100) + '%';
    }
    
    // Throttle pour performance
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
    
    // Initial call
    updateProgress();
  }

  // ==================================================
  // ⬆️ BACK TO TOP BUTTON
  // ==================================================
  
  const backToTop = document.querySelector('.back-to-top');
  
  if (backToTop) {
    const SCROLL_THRESHOLD = 300; // Pixels avant d'afficher le bouton
    
    function toggleBackToTop() {
      if (window.scrollY > SCROLL_THRESHOLD) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
    
    // Throttle pour performance
    let btTicking = false;
    window.addEventListener('scroll', function() {
      if (!btTicking) {
        window.requestAnimationFrame(function() {
          toggleBackToTop();
          btTicking = false;
        });
        btTicking = true;
      }
    }, { passive: true });
    
    // Click handler
    backToTop.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
    // Keyboard support
    backToTop.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
    
    // Initial check
    toggleBackToTop();
  }

  // ==================================================
  // ♿ SKIP LINK (Accessibilité)
  // ==================================================
  
  // Créer le skip link s'il n'existe pas
  if (!document.querySelector('.skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.href = '#quarto-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Aller au contenu principal';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // ==================================================
  // 🎯 SMOOTH SCROLL FOR ANCHOR LINKS
  // ==================================================
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

  // ==================================================
  // 🌙 DARK MODE DETECTION (Optional logging)
  // ==================================================
  
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  
  function handleDarkModeChange(e) {
    console.log('[Bootcamp UI] Mode sombre:', e.matches ? 'activé' : 'désactivé');
    // Tu peux ajouter des actions supplémentaires ici si nécessaire
  }
  
  prefersDark.addEventListener('change', handleDarkModeChange);
  
  // Log initial state
  console.log('[Bootcamp UI] Initialisé - Mode sombre:', prefersDark.matches ? 'activé' : 'désactivé');

})();
