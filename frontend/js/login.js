document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');

  // Removemos o redirecionamento automático
  // O login sempre será exigido ao acessar a página

  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const usuario = document.getElementById('usuario').value.trim();
      const senha = document.getElementById('senha').value.trim();
      const btn = this.querySelector('button[type="submit"]');

      if (!usuario || !senha) {
        mostrarToast('Por favor, preencha todos os campos.', 'danger');
        return;
      }

      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Verificando...';

      // Simula requisição ao servidor
      setTimeout(() => {
        const credenciaisValidas = (usuario === 'admin' && senha === 'admin123');

        if (credenciaisValidas) {
          // Salva de forma estruturada no localStorage
          const dadosUsuario = {
            nome: usuario,
            autenticado: true
          };
          localStorage.setItem('usuarioLogado', JSON.stringify(dadosUsuario));
          window.location.href = 'dashboard.html';
        } else {
          mostrarToast('Credenciais inválidas. Tente admin/admin123', 'danger');
          btn.disabled = false;
          btn.innerHTML = 'Acessar';
        }
      }, 1500);
    });
  }

  function mostrarToast(mensagem, tipo = 'success') {
    const toastHTML = `
      <div class="position-fixed top-0 start-50 translate-middle-x p-3" style="z-index: 1055">
        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header bg-${tipo} text-white">
            <strong class="me-auto">${tipo === 'success' ? 'Sucesso' : 'Erro'}</strong>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Fechar"></button>
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

    setTimeout(() => {
      toastContainer.remove();
    }, 3000);
  }
});