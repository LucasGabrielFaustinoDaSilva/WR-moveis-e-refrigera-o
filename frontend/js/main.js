document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling para links internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = targetPosition + window.pageYOffset - navbarHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Fechar menu mobile se estiver aberto
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
          const bsCollapse = new bootstrap.Collapse(navbarCollapse);
          bsCollapse.hide();
        }
      }
    });
  });
  
  // Adicionar classe active ao navbar conforme scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  function updateActiveNav() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      
      if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav(); // Chamar inicialmente
  
  // Formulário de orçamento
  const formOrcamento = document.getElementById('formOrcamento');
  if (formOrcamento) {
    formOrcamento.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simular envio do formulário
      const btn = this.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
      
      setTimeout(() => {
        btn.innerHTML = 'Enviado com sucesso!';
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-success');
        
        // Resetar formulário após 2 segundos
        setTimeout(() => {
          formOrcamento.reset();
          btn.disabled = false;
          btn.innerHTML = 'Enviar Solicitação';
          btn.classList.remove('btn-success');
          btn.classList.add('btn-primary');
          
          // Exibir mensagem de sucesso
          mostrarToast('Solicitação enviada com sucesso! Entraremos em contato em breve.');
        }, 2000);
      }, 1500);
    });
  }
  
  // Efeito de hover nos cards de portfólio
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  portfolioItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.querySelector('.portfolio-overlay').style.transform = 'translateY(0)';
      this.querySelector('img').style.transform = 'scale(1.1)';
    });
    
    item.addEventListener('mouseleave', function() {
      this.querySelector('.portfolio-overlay').style.transform = 'translateY(100%)';
      this.querySelector('img').style.transform = 'scale(1)';
    });
  });
  
  // Mostrar toast de notificação
  function mostrarToast(mensagem) {
    const toastHTML = `
      <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header bg-primary text-white">
            <strong class="me-auto">Sucesso</strong>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body">
            ${mensagem}
          </div>
        </div>
      </div>
    `;
    
    const toastContainer = document.createElement('div');
    toastContainer.innerHTML = toastHTML;
    document.body.appendChild(toastContainer);
    
    // Remover toast após 3 segundos
    setTimeout(() => {
      toastContainer.remove();
    }, 3000);
  }
  
  // Inicializar carrossel
  const myCarousel = new bootstrap.Carousel(document.getElementById('mainCarousel'), {
    interval: 5000,
    wrap: true
  });
});