document.addEventListener('DOMContentLoaded', function() {
  // Verificar autenticação
  if (!localStorage.getItem('usuarioLogado')) {
    window.location.href = 'login.html';
  }

  // Dados de exemplo (substituir por dados reais)
  let clientes = JSON.parse(localStorage.getItem('clientes')) || [
    {
      id: 1,
      nome: "João Silva",
      email: "joao@exemplo.com",
      telefone: "(11) 98765-4321",
      documento: "123.456.789-00",
      endereco: "Rua Exemplo, 123 - Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01000-000",
      status: "ativo",
      dataCadastro: "2023-01-15"
    },
    // Adicione mais clientes de exemplo conforme necessário
  ];

  // Elementos do DOM
  const clientesBody = document.getElementById('clientesBody');
  const totalClientes = document.getElementById('totalClientes');
  const totalOrcamentos = document.getElementById('totalOrcamentos');
  const totalPedidos = document.getElementById('totalPedidos');
  const totalPendentes = document.getElementById('totalPendentes');
  
  // Inicialização
  atualizarEstatisticas();
  renderizarClientes();

  // Atualizar estatísticas
  function atualizarEstatisticas() {
    totalClientes.textContent = clientes.length;
    totalOrcamentos.textContent = "24"; // Exemplo
    totalPedidos.textContent = "18"; // Exemplo
    totalPendentes.textContent = "5"; // Exemplo
    
    // Salvar no localStorage
    localStorage.setItem('clientes', JSON.stringify(clientes));
  }

  // Renderizar lista de clientes
  function renderizarClientes(clientesFiltrados = clientes) {
    clientesBody.innerHTML = '';
    
    if (clientesFiltrados.length === 0) {
      clientesBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center py-5">
            <i class="fas fa-users-slash fa-3x mb-3 text-muted"></i>
            <h5 class="text-muted">Nenhum cliente encontrado</h5>
            <button class="btn btn-primary mt-3" data-bs-toggle="modal" data-bs-target="#clienteModal">
              <i class="fas fa-plus me-2"></i>Adicionar Cliente
            </button>
          </td>
        </tr>
      `;
      return;
    }
    
    clientesFiltrados.forEach(cliente => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="d-flex align-items-center">
            <div class="avatar me-3">
              <span class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 36px; height: 36px;">
                ${cliente.nome.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h6 class="mb-0">${cliente.nome}</h6>
              <small class="text-muted">${cliente.email}</small>
            </div>
          </div>
        </td>
        <td>${cliente.telefone}</td>
        <td>${cliente.documento}</td>
        <td>
          <span class="badge ${cliente.status === 'ativo' ? 'bg-success' : 'bg-secondary'}">
            ${cliente.status === 'ativo' ? 'Ativo' : 'Inativo'}
          </span>
        </td>
        <td>
          <div class="d-flex">
            <button class="btn btn-sm btn-outline-primary edit-btn me-2" data-id="${cliente.id}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${cliente.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      `;
      clientesBody.appendChild(tr);
    });
    
    // Adicionar eventos aos botões
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => editarCliente(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => prepararExclusao(btn.dataset.id));
    });
  }

  // Pesquisar clientes
  document.getElementById('pesquisaClientes').addEventListener('input', function() {
    const termo = this.value.toLowerCase();
    const clientesFiltrados = clientes.filter(cliente => 
      cliente.nome.toLowerCase().includes(termo) || 
      cliente.email.toLowerCase().includes(termo) ||
      cliente.telefone.includes(termo) ||
      cliente.documento.includes(termo)
    );
    renderizarClientes(clientesFiltrados);
  });

  // Configurar máscaras
  function configurarMascaras() {
    // Máscara para telefone
    const telefoneInput = document.getElementById('clienteTelefone');
    telefoneInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      
      if (value.length > 11) {
        value = value.substring(0, 11);
      }
      
      if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
      
      e.target.value = value;
    });
    
    // Máscara para CPF/CNPJ
    const documentoInput = document.getElementById('clienteDocumento');
    documentoInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      
      if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      } else {
        value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
      }
      
      e.target.value = value.substring(0, 18);
    });
    
    // Máscara para CEP
    const cepInput = document.getElementById('clienteCEP');
    cepInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      value = value.replace(/^(\d{5})(\d)/, '$1-$2');
      e.target.value = value.substring(0, 9);
    });
  }

  // Mostrar toast de notificação
  function mostrarToast(mensagem, tipo = 'success') {
    const toastHTML = `
      <div class="toast show align-items-center text-white bg-${tipo} border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            <i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2"></i>
            ${mensagem}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;
    
    const toastContainer = document.querySelector('.toast-container');
    const toastElement = document.createElement('div');
    toastElement.innerHTML = toastHTML;
    toastContainer.appendChild(toastElement);
    
    // Remover toast após 5 segundos
    setTimeout(() => {
      toastElement.remove();
    }, 5000);
  }

  // Logout
  document.getElementById('logout').addEventListener('click', function() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'login.html';
  });

  // Toggle sidebar em dispositivos móveis
  document.getElementById('sidebarToggle').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.toggle('active');
    document.querySelector('.content').classList.toggle('active');
  });

  // Inicializar máscaras
  configurarMascaras();

  // Mostrar mensagem de boas-vindas
  mostrarToast('Bem-vindo ao Painel Administrativo!');
});