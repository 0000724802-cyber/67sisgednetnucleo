document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('usuario-form');
    const body = document.getElementById('usuarios-body');
    const papel = document.getElementById('papel');
    const msg = document.getElementById('mensagem');
    const senha = document.getElementById('senha');
    const toggle = document.getElementById('toggle-senha-gerenciar');
    let contas = [];

    const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

    function updateFields() {
        const isAdmin = papel.value === 'admin';
        document.getElementById('dados-pessoa').style.display = isAdmin ? 'none' : 'block';
        document.getElementById('grupo-instrutor').style.display = papel.value === 'instrutor' ? 'block' : 'none';
        document.getElementById('grupo-aluno').style.display = papel.value === 'aluno' ? 'block' : 'none';
    }

    function limpar() {
        form.reset();
        document.getElementById('id').value = '';
        document.getElementById('acao').value = 'criar';
        document.getElementById('form-title').textContent = 'Criar novo login';
        msg.style.display = 'none';
        updateFields();
    }

    papel.addEventListener('change', updateFields);
    document.getElementById('cancelar').addEventListener('click', limpar);

    toggle?.addEventListener('click', () => {
        const show = senha.type === 'password';
        senha.type = show ? 'text' : 'password';
        toggle.textContent = show ? '🙈' : '👁';
        toggle.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
        toggle.setAttribute('aria-pressed', show ? 'true' : 'false');
    });

    function carregarTurmas() {
        const d = DB.opcoes();
        const select = document.getElementById('turma_id');
        d.turmas.forEach(x => {
            const option = document.createElement('option');
            option.value = x.id;
            option.textContent = `Turma ${x.codigo} - ${x.turno}`;
            select.appendChild(option);
        });
    }

    function carregar() {
        const d = DB.listarUsuarios();
        if (!d.success) { location.href = 'index.html'; return; }
        contas = d.usuarios;
        body.innerHTML = contas.map((x, i) => {
            const nome = x.papelAdministrador === 'instrutor' ? x.nomeInstrutor : x.papelAdministrador === 'aluno' ? x.nomeAluno : x.usuarioAdministrador;
            return `<tr>
                <td>${esc(x.usuarioAdministrador)}</td>
                <td>${esc(x.papelAdministrador)}</td>
                <td>${esc(nome || '-')}</td>
                <td>${esc(x.emailAdministrador || x.emailInstrutor || x.emailAluno || '-')}</td>
                <td>
                    <button type="button" class="button button-secondary" data-edit="${i}">Editar</button>
                    <button type="button" class="button button-danger" data-delete="${x.idAdministrador}">Excluir</button>
                </td>
            </tr>`;
        }).join('');

        body.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => editar(contas[Number(b.dataset.edit)])));
        body.querySelectorAll('[data-delete]').forEach(b => b.addEventListener('click', () => excluir(Number(b.dataset.delete))));
    }

    function editar(x) {
        form.id.value = x.idAdministrador;
        form.acao.value = 'editar';
        form.usuario.value = x.usuarioAdministrador || '';
        form.email.value = x.emailAdministrador || '';
        form.unidade.value = x.unidadeAdministrador || 'Horto';
        papel.value = x.papelAdministrador || 'aluno';
        form.senha.value = '';
        form.nome.value = x.papelAdministrador === 'instrutor' ? x.nomeInstrutor : x.nomeAluno;
        form.cpf.value = x.papelAdministrador === 'instrutor' ? x.cpfInstrutor : x.cpfAluno;
        form.telefone.value = x.papelAdministrador === 'instrutor' ? x.telefoneInstrutor : x.telefoneAluno;
        form.area.value = x.areaInstrutor || '';
        form.turma_id.value = x.Turma_idTurma || '';
        document.getElementById('form-title').textContent = 'Alterar login e informações';
        updateFields();
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    function excluir(id) {
        if (!confirm('Tem certeza que deseja excluir este login?')) return;
        const d = DB.excluirUsuario(id);
        msg.textContent = d.message || 'Operação concluída.';
        msg.className = 'form-message ' + (d.success ? 'success' : 'error');
        msg.style.display = 'block';
        if (d.success) carregar();
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        msg.style.display = 'none';
        const dados = Object.fromEntries(new FormData(form).entries());
        const d = DB.salvarUsuario(dados);
        msg.textContent = d.message || 'Operação concluída.';
        msg.className = 'form-message ' + (d.success ? 'success' : 'error');
        msg.style.display = 'block';
        if (d.success) {
            const texto = d.message;
            limpar(); carregar();
            msg.textContent = texto; msg.className = 'form-message success'; msg.style.display = 'block';
        }
    });

    carregarTurmas();
    updateFields();
    carregar();
});
