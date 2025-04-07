document.addEventListener('DOMContentLoaded', () => {
  const clientes = JSON.parse(localStorage.getItem('clientes')) || [];

  const form = document.getElementById('clienteForm');
  const clientesBody = document.getElementById('clientesBody');
  const pesquisaInput = document.getElementById('pesquisaClientes');
  const modal = new bootstrap.Modal(document.getElementById('clienteModal'));
  const btnSalvar = document.getElementById('salvarCliente');

  // Campos do formulário
  const campos = {
    id: document.getElementById('clienteId'),
    nome: document.getElementById('clienteNome'),
    email: document.getElementById('clienteEmail'),
    telefone: document.getElementById('clienteTelefone'),
    documento: document.getElementById('clienteDocumento'),
    cep: document.getElementById('clienteCEP'),
    status: document.getElementById('clienteStatus')
  };

  atualizarEstatisticas();
  renderizarClientes(clientes);
  configurarMascaras();
  configurarEventosGlobais();

  form.addEventListener('submit', salvarCliente);
  pesquisaInput.addEventListener('input', filtrarClientes);

  function salvarCliente(e) {
    e.preventDefault();

    const id = campos.id.value;
    const novoCliente = {
      id: id || Date.now().toString(),
      nome: campos.nome.value.trim(),
      email: campos.email.value.trim(),
      telefone: campos.telefone.value.trim(),
      documento: campos.documento.value.trim(),
      cep: campos.cep.value.trim(),
      status: campos.status.value
    };

    if (id) {
      const index = clientes.findIndex(c => c.id === id);
      if (index !== -1) {
        clientes[index] = novoCliente;
        mostrarToast('Cliente atualizado com sucesso!');
      }
    } else {
      clientes.push(novoCliente);
      mostrarToast('Cliente cadastrado com sucesso!');
    }

    salvarClientes();
    renderizarClientes(clientes);
    modal.hide();
    form.reset();
    campos.id.value = '';
  }

  function editarCliente(id) {
    const cliente = clientes.find(c => c.id === id);
    if (cliente) {
      campos.id.value = cliente.id;
      campos.nome.value = cliente.nome;
      campos.email.value = cliente.email;
      campos.telefone.value = cliente.telefone;
      campos.documento.value = cliente.documento;
      campos.cep.value = cliente.cep;
      campos.status.value = cliente.status;

      modal.show();
    }
  }

  function excluirCliente(id) {
    const index = clientes.findIndex(c => c.id === id);
    if (index !== -1) {
      if (confirm('Tem certeza que deseja excluir este cliente?')) {
        clientes.splice(index, 1);
        mostrarToast('Cliente excluído com sucesso!', 'warning');
        salvarClientes();
        renderizarClientes(clientes);
      }
    }
  }

  function salvarClientes() {
    localStorage.setItem('clientes', JSON.stringify(clientes));
    atualizarEstatisticas();
  }

  function renderizarClientes(lista) {
    clientesBody.innerHTML = '';

    if (lista.length === 0) {
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

    lista.forEach(cliente => {
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
            ${cliente.status}
          </span>
        </td>
        <td>
          <div class="d-flex">
            <button class="btn btn-sm btn-outline-primary me-2" onclick="editarCliente('${cliente.id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="excluirCliente('${cliente.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      `;
      clientesBody.appendChild(tr);
    });
  }

  function filtrarClientes() {
    const termo = pesquisaInput.value.toLowerCase();
    const filtrados = clientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(termo) ||
      cliente.email.toLowerCase().includes(termo) ||
      cliente.telefone.includes(termo) ||
      cliente.documento.includes(termo)
    );
    renderizarClientes(filtrados);
  }

  function atualizarEstatisticas() {
    document.getElementById('totalClientes').textContent = clientes.length;
    document.getElementById('totalOrcamentos').textContent = '24';
    document.getElementById('totalPedidos').textContent = '18';
    document.getElementById('totalPendentes').textContent = '5';
  }

  function mostrarToast(msg, tipo = 'success') {
    const toastHTML = `
      <div class="toast show align-items-center text-white bg-${tipo} border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            <i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2"></i>
            ${msg}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;
    const container = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.innerHTML = toastHTML;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 5000);
  }

  function configurarMascaras() {
    const mascara = (campo, tipo) => {
      campo.addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '');
        if (tipo === 'telefone') {
          v = v.length <= 10
            ? v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
            : v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        } else if (tipo === 'cpfcnpj') {
          v = v.length <= 11
            ? v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4')
            : v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5');
        } else if (tipo === 'cep') {
          v = v.replace(/(\d{5})(\d{0,3})/, '$1-$2');
        }
        e.target.value = v;
      });
    };

    mascara(campos.telefone, 'telefone');
    mascara(campos.documento, 'cpfcnpj');
    mascara(campos.cep, 'cep');
  }

  function configurarEventosGlobais() {
    document.getElementById('logout').addEventListener('click', () => {
      localStorage.removeItem('usuarioLogado');
      window.location.href = 'login.html';
    });

    document.getElementById('sidebarToggle').addEventListener('click', () => {
      document.querySelector('.sidebar').classList.toggle('active');
      document.querySelector('.content').classList.toggle('active');
    });
  }

  // Disponibiliza funções para os botões inline
  window.editarCliente = editarCliente;
  window.excluirCliente = excluirCliente;
  window.abrirModal = () => {
  campos.id.value = '';
  form.reset();
  modal.show();
};
});