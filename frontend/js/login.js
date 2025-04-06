document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  
  // Verificar se já está logado
  if (localStorage.getItem('usuarioLogado')) {
    window.location.href = 'dashboard.html';
  }
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const usuario = document.getElementById('usuario').value;
      const senha = document.getElementById('senha').value;
      const btn = this.querySelector('button[type="submit"]');
      
      // Validação simples
      if (!usuario || !senha) {
        mostrarToast('Por favor, preencha todos os campos', 'danger');
        return;
      }
      
      // Simular validação de login
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Verificando...';
      
      // Simular requisição AJAX
      setTimeout(() => {
        // Credenciais válidas para demonstração
        if (usuario === 'admin' && senha === 'admin123') {
          localStorage.setItem('usuarioLogado', 'true');
          window.location.href = 'dashboard.html';
        } else {
          mostrarToast('Credenciais inválidas. Tente admin/admin123', 'danger');
          btn.disabled = false;
          btn.innerHTML = 'Acessar';
        }
      }, 1500);
    });
  }
  
  // Função para mostrar feedback
  function mostrarToast(mensagem, tipo = 'success') {
    const toastHTML = `
      <div class="position-fixed top-0 start-50 translate-middle-x p-3" style="z-index: 11">
        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header bg-${tipo} text-white">
            <strong class="me-auto">${tipo === 'success' ? 'Sucesso' : 'Erro'}</strong>
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
});