/**
 * Bootcamp Data Engineering - UI Enhancements
 * Version: 3.1 (sans back-to-top - géré par Quarto)
 * 
 * Features:
 * - Reading progress indicator
 * - Smooth scroll for anchor links
 * - Skip link for accessibility
 */

(function() {
  'use strict';

  // ==========================================================================
  // READING PROGRESS INDICATOR
  // ==========================================================================
  
  const progressBar = document.querySelector('.reading-progress');
  
  if (progressBar) {
    let ticking = false;
    
    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      progressBar.style.width = Math.min(progress, 100) + '%';
      ticking = false;
    }
    
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
    updateProgress(); // Initial call
  }

  // ==========================================================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================================================
  
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
        
        // Update URL without jumping
        history.pushState(null, null, targetId);
      }
    });
  });

  // ==========================================================================
  // SKIP LINK FOR ACCESSIBILITY
  // ==========================================================================
  
  function createSkipLink() {
    if (document.querySelector('.skip-link')) return;
    
    const skipLink = document.createElement('a');
    skipLink.href = '#quarto-document-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Aller au contenu principal';
    
    // Style inline pour garantir le fonctionnement
    skipLink.style.cssText = `
      position: fixed;
      top: -100px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--bs-primary, #0d6efd);
      color: white;
      padding: 12px 24px;
      border-radius: 0 0 8px 8px;
      z-index: 10000;
      transition: top 0.3s ease;
      text-decoration: none;
      font-weight: 600;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '0';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-100px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
  
  createSkipLink();

  // ==========================================================================
  // DARK MODE DETECTION LOG (for debugging)
  // ==========================================================================
  
  if (window.matchMedia) {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    console.log('🌓 Dark mode:', darkModeQuery.matches ? 'enabled' : 'disabled');
  }

})();
