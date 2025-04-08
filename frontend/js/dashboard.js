document.addEventListener('DOMContentLoaded', () => {
  const clienteForm = document.getElementById('clienteForm');
  const clientesBody = document.getElementById('clientesBody');
  const pesquisaClientes = document.getElementById('pesquisaClientes');
  const toastContainer = document.querySelector('.toast-container');

  // Utilitários
  const gerarId = () => '_' + Math.random().toString(36).substr(2, 9);

  const exibirToast = (mensagem, tipo = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-${tipo} show toast-${tipo}`;
    toast.innerHTML = `
      <div class="toast-header">
        <strong class="me-auto">${tipo === 'success' ? 'Sucesso' : 'Erro'}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body">${mensagem}</div>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  };

  const salvarClientes = (clientes) => {
    localStorage.setItem('clientes', JSON.stringify(clientes));
    atualizarDashboard();
  };

  const carregarClientes = () => JSON.parse(localStorage.getItem('clientes')) || [];

  const atualizarDashboard = () => {
    const clientes = carregarClientes();
    document.getElementById('totalClientes').textContent = clientes.length;
  };

  const renderizarClientes = (filtro = '') => {
    const clientes = carregarClientes();
    clientesBody.innerHTML = '';

    const filtrados = clientes.filter(c =>
      c.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      c.email.toLowerCase().includes(filtro.toLowerCase()) ||
      c.telefone.includes(filtro)
    );

    if (filtrados.length === 0) {
      clientesBody.innerHTML = `<tr><td colspan="4">Nenhum cliente encontrado.</td></tr>`;
      return;
    }

    filtrados.forEach(cliente => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${cliente.nome}</td>
        <td>${cliente.telefone}</td>
        <td>${cliente.email}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-2" onclick="editarCliente('${cliente.id}')"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger" onclick="excluirCliente('${cliente.id}')"><i class="bi bi-trash"></i></button>
        </td>
      `;
      clientesBody.appendChild(tr);
    });
  };

  window.editarCliente = (id) => {
    const cliente = carregarClientes().find(c => c.id === id);
    if (!cliente) return;

    document.getElementById('clienteId').value = cliente.id;
    document.getElementById('clienteNome').value = cliente.nome;
    document.getElementById('clienteEmail').value = cliente.email;
    document.getElementById('clienteTelefone').value = cliente.telefone;
    document.getElementById('clienteDocumento').value = cliente.documento;
    document.getElementById('clienteCEP').value = cliente.cep;
    document.getElementById('clienteStatus').value = cliente.status;

    const modal = new bootstrap.Modal(document.getElementById('clienteModal'));
    modal.show();
  };

  window.excluirCliente = (id) => {
    const clientes = carregarClientes().filter(c => c.id !== id);
    salvarClientes(clientes);
    renderizarClientes();
    exibirToast('Cliente removido com sucesso.');
  };

  clienteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('clienteId').value;
    const novoCliente = {
      id: id || gerarId(),
      nome: document.getElementById('clienteNome').value,
      email: document.getElementById('clienteEmail').value,
      telefone: document.getElementById('clienteTelefone').value,
      documento: document.getElementById('clienteDocumento').value,
      cep: document.getElementById('clienteCEP').value,
      status: document.getElementById('clienteStatus').value,
    };

    let clientes = carregarClientes();
    if (id) {
      clientes = clientes.map(c => (c.id === id ? novoCliente : c));
      exibirToast('Cliente atualizado com sucesso.');
    } else {
      clientes.push(novoCliente);
      exibirToast('Cliente cadastrado com sucesso.');
    }

    salvarClientes(clientes);
    renderizarClientes();
    clienteForm.reset();
    bootstrap.Modal.getInstance(document.getElementById('clienteModal')).hide();
  });

  pesquisaClientes.addEventListener('input', () => renderizarClientes(pesquisaClientes.value));

  atualizarDashboard();
  renderizarClientes();
});