document.addEventListener("DOMContentLoaded", () => {
  const toggleMenu = document.getElementById("toggleMenu");
  const sidebar = document.getElementById("sidebar");

  // Alterna a visibilidade do menu lateral
  toggleMenu.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });

  // Fecha o menu automaticamente ao clicar em qualquer item (útil em mobile)
  const sidebarLinks = sidebar.querySelectorAll("a");
  sidebarLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove("active");
      }
    });
  });

  // Fecha o menu ao clicar fora dele (opcional, para usabilidade)
  document.addEventListener("click", (e) => {
    const isClickInsideSidebar = sidebar.contains(e.target);
    const isClickOnToggle = toggleMenu.contains(e.target);

    if (!isClickInsideSidebar && !isClickOnToggle && window.innerWidth <= 768) {
      sidebar.classList.remove("active");
    }
  });

  // Fecha menu lateral automaticamente ao redimensionar para desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      sidebar.classList.remove("active");
    }
  });
});