/**
 * Sidebar Toggle for Quarto Bootcamp
 * Permet de masquer/afficher la sidebar pour agrandir le contenu
 */

document.addEventListener('DOMContentLoaded', function() {
  // Ne pas exécuter sur mobile
  if (window.innerWidth <= 991) {
    return;
  }

  // Créer le bouton toggle
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'sidebar-toggle-btn';
  toggleBtn.setAttribute('aria-label', 'Masquer/Afficher le menu');
  toggleBtn.setAttribute('title', 'Masquer/Afficher le menu (raccourci: [)');
  
  // Créer l'icône hamburger
  toggleBtn.innerHTML = `
    <span class="toggle-icon">
      <span></span>
      <span></span>
      <span></span>
    </span>
  `;
  
  // Ajouter au body
  document.body.appendChild(toggleBtn);
  
  // Récupérer l'état depuis localStorage
  const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
  if (isCollapsed) {
    document.body.classList.add('sidebar-collapsed');
  }
  
  // Toggle au clic
  toggleBtn.addEventListener('click', function() {
    document.body.classList.toggle('sidebar-collapsed');
    
    // Sauvegarder l'état
    const collapsed = document.body.classList.contains('sidebar-collapsed');
    localStorage.setItem('sidebar-collapsed', collapsed);
    
    // Annoncer le changement pour l'accessibilité
    const status = collapsed ? 'Menu masqué' : 'Menu affiché';
    toggleBtn.setAttribute('aria-label', status);
  });
  
  // Raccourci clavier: touche [ pour toggle
  document.addEventListener('keydown', function(e) {
    // Ignorer si on est dans un input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }
    
    // Touche [ (BracketLeft)
    if (e.key === '[' || e.code === 'BracketLeft') {
      toggleBtn.click();
    }
  });
  
  // Masquer le bouton si pas de sidebar
  const sidebar = document.querySelector('#quarto-sidebar, .sidebar');
  if (!sidebar) {
    toggleBtn.style.display = 'none';
  }
  
  // Gérer le resize de la fenêtre
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      if (window.innerWidth <= 991) {
        toggleBtn.style.display = 'none';
        document.body.classList.remove('sidebar-collapsed');
      } else {
        toggleBtn.style.display = 'flex';
        // Restaurer l'état sauvegardé
        const saved = localStorage.getItem('sidebar-collapsed') === 'true';
        if (saved) {
          document.body.classList.add('sidebar-collapsed');
        }
      }
    }, 150);
  });
});
