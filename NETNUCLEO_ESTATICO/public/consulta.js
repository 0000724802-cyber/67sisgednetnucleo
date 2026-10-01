document.addEventListener('DOMContentLoaded', () => {
    const role = 'admin';
    const form = document.getElementById('filter-form');
    const body = document.getElementById('results-body');
    const count = document.getElementById('result-count');
    if (!form || !body) return;

    // Algumas telas (aluno/instrutor) não têm a coluna "Sala".
    const colunas = document.querySelectorAll('thead th').length || 7;
    const comSala = colunas >= 7;

    function message(text) {
        body.innerHTML = '';
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = colunas;
        td.style.cssText = 'text-align:center;padding:20px;';
        td.textContent = text;
        tr.appendChild(td);
        body.appendChild(tr);
        if (count) count.textContent = '0 resultados';
    }

    function fill(id, items, mapper) {
        const select = document.getElementById(id);
        if (!select) return;
        items.forEach(item => {
            const [value, text] = mapper(item);
            const option = document.createElement('option');
            option.value = value;
            option.textContent = text;
            select.appendChild(option);
        });
    }

    function loadOptions() {
        const d = DB.opcoes();
        if (role === 'admin') {
            fill('turma', d.turmas, x => [`${x.id}`, `Turma ${x.codigo} - ${x.turno}`]);
            fill('instrutor', d.instrutores, x => [`${x.id}`, x.nome]);
            fill('materia', d.materias, x => [`${x.id}`, `${x.sigla} - ${x.nome}`]);
        }
        if (role === 'aluno') {
            fill('turma', d.turmas, x => [`${x.id}`, `Turma ${x.codigo} - ${x.turno}`]);
        }
    }

    function search() {
        const filtros = {};
        new FormData(form).forEach((v, k) => { if (String(v).trim()) filtros[k] = String(v).trim(); });
        const d = DB.consultar(filtros);
        

        body.innerHTML = '';
        if (count) count.textContent = `${d.data.length} ${d.data.length === 1 ? 'resultado' : 'resultados'}`;
        if (!d.data.length) { message('Nenhum horário encontrado para os filtros selecionados.'); return; }
        if (count) count.textContent = `${d.data.length} ${d.data.length === 1 ? 'resultado' : 'resultados'}`;

        d.data.forEach(aula => {
            const tr = document.createElement('tr');
            const campos = [aula.data, aula.horario, aula.turma, aula.instrutor, aula.materia];
            if (comSala) campos.push(aula.sala);
            campos.forEach(value => {
                const td = document.createElement('td');
                td.textContent = value || '-';
                tr.appendChild(td);
            });
            const td = document.createElement('td');
            const badge = document.createElement('span');
            badge.className = 'badge ' + (Number(aula.statusAula) === 1 ? 'badge-success' : 'badge-danger');
            badge.textContent = aula.situacao || '-';
            td.appendChild(badge);
            tr.appendChild(td);
            body.appendChild(tr);
        });
    }

    document.getElementById('limpar-filtros')?.addEventListener('click', () => {
        form.reset();
        message('Preencha os filtros e clique em "Filtrar" para consultar.');
    });
    form.addEventListener('submit', event => { event.preventDefault(); search(); });

    loadOptions();
    message('Preencha os filtros e clique em "Filtrar" para consultar.');
});
