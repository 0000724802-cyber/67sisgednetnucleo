document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const senha = document.getElementById('senha');
    const toggleSenha = document.getElementById('toggle-senha');

    if (toggleSenha && senha) {
        toggleSenha.addEventListener('click', () => {
            const mostrar = senha.type === 'password';
            senha.type = mostrar ? 'text' : 'password';
            toggleSenha.textContent = mostrar ? '🙈' : '👁';
            toggleSenha.setAttribute('aria-label', mostrar ? 'Ocultar senha' : 'Mostrar senha');
            toggleSenha.setAttribute('aria-pressed', mostrar ? 'true' : 'false');
        });
    }

    if (loginForm) {
        // Quem já está logado vai direto para a própria área.
        const atual = DB.sessao();
        if (atual) { location.replace(DB.destino(atual.papel)); return; }

        const errorText = document.getElementById('error-text');
        function mostrarErroLogin(mensagem) {
            if (loginError) loginError.style.display = 'block';
            if (errorText) errorText.textContent = mensagem;
        }

        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const usuario = document.getElementById('usuario')?.value.trim() || '';
            const senhaValor = document.getElementById('senha')?.value || '';
            const unidade = document.getElementById('unidade')?.value.trim() || '';

            if (!usuario || !senhaValor || !unidade) { mostrarErroLogin('Preencha todos os campos.'); return; }
            if (loginError) loginError.style.display = 'none';

            const resultado = DB.login(unidade, usuario, senhaValor);
            if (resultado.success) {
                window.location.href = resultado.redirect || 'index.html';
            } else {
                mostrarErroLogin(resultado.message || 'Login inválido.');
            }
        });
    }
});
