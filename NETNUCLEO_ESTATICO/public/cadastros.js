document.addEventListener('DOMContentLoaded', () => {
    const ok = document.getElementById('msg-ok');
    const erro = document.getElementById('msg-erro');

    function mostrar(res) {
        ok.style.display = erro.style.display = 'none';
        const alvo = res.success ? ok : erro;
        alvo.textContent = res.message;
        alvo.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function fill(id, items, texto) {
        const s = document.getElementById(id);
        if (!s) return;
        items.forEach(x => { const o = document.createElement('option'); o.value = x.id; o.textContent = texto(x); s.appendChild(o); });
    }

    const aulaForm = document.getElementById('aula-form');
    if (aulaForm) {
        const d = DB.opcoes();
        fill('idInstrutor', d.instrutores, x => x.nome);
        fill('idMateria', d.materias, x => `${x.sigla} - ${x.nome}`);
        fill('idTurma', d.turmas, x => `Turma ${x.codigo} - ${x.turno}`);
        fill('idSala', d.salas, x => x.nome);
        document.getElementById('dataAula').min = DB.todayISO();
        aulaForm.addEventListener('submit', e => {
            e.preventDefault();
            const res = DB.cadastrarAula(Object.fromEntries(new FormData(aulaForm).entries()));
            mostrar(res);
            if (res.success) aulaForm.reset();
        });
    }

    const instrForm = document.getElementById('instrutor-form');
    if (instrForm) {
        instrForm.addEventListener('submit', e => {
            e.preventDefault();
            const res = DB.cadastrarInstrutor(Object.fromEntries(new FormData(instrForm).entries()));
            mostrar(res);
            if (res.success) instrForm.reset();
        });
    }
});
