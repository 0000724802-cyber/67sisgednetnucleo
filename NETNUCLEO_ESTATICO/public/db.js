/* =====================================================================
   SISGED / NetNúcleo - camada de dados 100% estática (sem PHP / MySQL)
   ---------------------------------------------------------------------
   Substitui os controllers PHP. Os dados ficam no localStorage do
   navegador, iniciados com os mesmos registros do bancodedados.sql.
   Não há login: o site é totalmente aberto.
   Para voltar aos dados originais: DB.reset() (botão na página inicial).
   ===================================================================== */
(function () {
  'use strict';
  var KEY = 'sisged_db_v2';

  /* ---------- Dados iniciais (espelham bancodedados.sql) ---------- */
  function seed() {
    return {
      instrutor: [
        { id: 1, nome: 'Tubinho',                cpf: '12345678901', email: 'joao.pereira@exemplo.com',  telefone: '31999990001', area: 'Redes',               status: 1 },
        { id: 2, nome: 'Guidu Ratu',             cpf: '23456789012', email: 'maria.souza@exemplo.com',   telefone: '31999990002', area: 'Programação',         status: 1 },
        { id: 3, nome: 'Migles Belo',            cpf: '34567890123', email: 'carlos.lima@exemplo.com',   telefone: '31999990003', area: 'Banco de Dados',      status: 1 },
        { id: 4, nome: 'Edson Paulo Nascimento', cpf: '45678901234', email: 'ana.oliveira@exemplo.com',  telefone: '31999990004', area: 'Desenvolvimento Web', status: 1 }
      ],
      materia: [
        { id: 1, sigla: 'RED',  nome: 'Redes de Computadores',  carga: '02:00:00', ementa: 'Fundamentos de redes e comunicação de dados.' },
        { id: 2, sigla: 'BDD',  nome: 'Banco de Dados',         carga: '02:00:00', ementa: 'Modelagem, SQL, relacionamentos e consultas.' },
        { id: 3, sigla: 'PROG', nome: 'Programação',            carga: '02:00:00', ementa: 'Lógica, algoritmos e desenvolvimento de aplicações.' },
        { id: 4, sigla: 'WEB',  nome: 'Desenvolvimento Web',    carga: '02:00:00', ementa: 'HTML, CSS, JavaScript, PHP e aplicações web.' },
        { id: 5, sigla: 'SO',   nome: 'Sistemas Operacionais',  carga: '02:00:00', ementa: 'Conceitos de sistemas operacionais.' },
        { id: 6, sigla: 'LOG',  nome: 'Lógica de Programação',  carga: '02:00:00', ementa: 'Algoritmos, estruturas condicionais e repetição.' }
      ],
      turma: [
        { id: 1, codigo: 101, turno: 'Manhã', inicio: '2026-02-01', fim: '2026-12-15' },
        { id: 2, codigo: 102, turno: 'Tarde', inicio: '2026-02-01', fim: '2026-12-15' },
        { id: 3, codigo: 103, turno: 'Noite', inicio: '2026-02-01', fim: '2026-12-15' }
      ],
      aluno: [
        { id: 1, nome: 'Buzz',          cpf: '56789012345', email: 'lucas.almeida@exemplo.com',  telefone: '31999990005', turmaId: 1 },
        { id: 2, nome: 'Beatriz Costa', cpf: '67890123456', email: 'beatriz.costa@exemplo.com',  telefone: '31999990006', turmaId: 2 }
      ],
      sala: [
        { id: 1, nome: 'Laboratório 01', capacidade: 30, tipo: 'Laboratório',  bloco: 'Bloco A - 1º andar' },
        { id: 2, nome: 'Laboratório 02', capacidade: 30, tipo: 'Laboratório',  bloco: 'Bloco A - 1º andar' },
        { id: 3, nome: 'Sala 101',       capacidade: 35, tipo: 'Sala de aula', bloco: 'Bloco B - 1º andar' }
      ],
      aula: [
        { id: 1, adminId: 1, alunoId: null, instrutorId: 1, materiaId: 1, turmaId: 1, salaId: 1, data: '2026-09-01', turno: 'Manhã', inicio: '07:00', fim: '08:40', duracao: '01:40:00', tipo: 'Presencial', status: 1 },
        { id: 2, adminId: 1, alunoId: null, instrutorId: 3, materiaId: 2, turmaId: 2, salaId: 2, data: '2026-09-01', turno: 'Tarde', inicio: '13:00', fim: '14:40', duracao: '01:40:00', tipo: 'Presencial', status: 1 },
        { id: 3, adminId: 1, alunoId: null, instrutorId: 4, materiaId: 4, turmaId: 3, salaId: 3, data: '2026-09-01', turno: 'Noite', inicio: '18:30', fim: '20:10', duracao: '01:40:00', tipo: 'Presencial', status: 0 },
        { id: 4, adminId: 1, alunoId: null, instrutorId: 1, materiaId: 1, turmaId: 1, salaId: 1, data: '2026-09-02', turno: 'Manhã', inicio: '07:00', fim: '08:40', duracao: '01:40:00', tipo: 'Presencial', status: 1 },
        { id: 5, adminId: 1, alunoId: null, instrutorId: 3, materiaId: 2, turmaId: 2, salaId: 2, data: '2026-09-02', turno: 'Tarde', inicio: '13:00', fim: '14:40', duracao: '01:40:00', tipo: 'Presencial', status: 1 },
        { id: 6, adminId: 1, alunoId: null, instrutorId: 4, materiaId: 4, turmaId: 3, salaId: 3, data: '2026-09-02', turno: 'Noite', inicio: '18:30', fim: '20:10', duracao: '01:40:00', tipo: 'Presencial', status: 0 },
        { id: 7, adminId: 1, alunoId: null, instrutorId: 2, materiaId: 3, turmaId: 1, salaId: 2, data: '2026-09-03', turno: 'Manhã', inicio: '08:50', fim: '10:30', duracao: '01:40:00', tipo: 'Presencial', status: 1 },
        { id: 8, adminId: 1, alunoId: null, instrutorId: 1, materiaId: 5, turmaId: 2, salaId: 1, data: '2026-09-04', turno: 'Tarde', inicio: '14:50', fim: '16:30', duracao: '01:40:00', tipo: 'Presencial', status: 0 },
        { id: 9, adminId: 1, alunoId: null, instrutorId: 1, materiaId: 6, turmaId: 3, salaId: 3, data: '2026-09-05', turno: 'Noite', inicio: '20:20', fim: '22:00', duracao: '01:40:00', tipo: 'Presencial', status: 0 }
      ],
    };
  }

  var cache = null;
  function load() {
    if (cache) return cache;
    try { var raw = localStorage.getItem(KEY); if (raw) { cache = JSON.parse(raw); return cache; } } catch (e) {}
    cache = seed(); save(); return cache;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(cache)); } catch (e) {} }
  function nextId(arr) { return arr.reduce(function (m, x) { return Math.max(m, x.id); }, 0) + 1; }
  function byId(arr, id) { id = Number(id); for (var i = 0; i < arr.length; i++) if (arr[i].id === id) return arr[i]; return null; }
  function fail(m) { return { success: false, message: m }; }
  function ok(m, extra) { var r = { success: true, message: m }; for (var k in (extra || {})) r[k] = extra[k]; return r; }
  function digits(s) { return String(s == null ? '' : s).replace(/\D+/g, ''); }
  function validEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
  function brDate(iso) { var p = String(iso).split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }
  function todayISO() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function validDate(s) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s); if (!m) return false; var d = new Date(+m[1], +m[2] - 1, +m[3]); return d.getFullYear() === +m[1] && d.getMonth() === +m[2] - 1 && d.getDate() === +m[3]; }
  function validHora(s) { return /^([01]\d|2[0-3]):[0-5]\d$/.test(s); }

  /* ---------- Opções de formulários ---------- */
  function opcoes() {
    var db = load();
    var by = function (f) { return function (a, b) { return String(f(a)).localeCompare(String(f(b)), 'pt-BR'); }; };
    return {
      success: true,
      turmas: db.turma.slice().sort(function (a, b) { return a.codigo - b.codigo; }).map(function (t) { return { id: t.id, codigo: t.codigo, turno: t.turno, inicio: t.inicio, fim: t.fim }; }),
      instrutores: db.instrutor.filter(function (i) { return i.status === 1; }).sort(by(function (i) { return i.nome; })).map(function (i) { return { id: i.id, nome: i.nome }; }),
      materias: db.materia.slice().sort(by(function (m) { return m.nome; })).map(function (m) { return { id: m.id, sigla: m.sigla, nome: m.nome }; }),
      salas: db.sala.slice().sort(by(function (s) { return s.nome; })).map(function (s) { return { id: s.id, nome: s.nome }; })
    };
  }

  /* ---------- Consulta de aulas ---------- */
  function consultar(f) {
    var db = load();
    f = f || {};
    var lista = db.aula.filter(function (a) {
      if (f.dataAula && a.data !== f.dataAula) return false;
      if (f.periodo && a.turno !== f.periodo) return false;
      if (f.turma && a.turmaId !== Number(f.turma)) return false;
      if (f.instrutor && a.instrutorId !== Number(f.instrutor)) return false;
      if (f.materia && a.materiaId !== Number(f.materia)) return false;
      if (f.situacao === 'realizada' && a.status !== 1) return false;
      if (f.situacao === 'nao_realizada' && a.status !== 0) return false;
      if (f.horario && a.inicio !== f.horario) return false;
      return true;
    });
    function cod(a) { var t = byId(db.turma, a.turmaId); return t ? t.codigo : 0; }
    lista.sort(function (a, b) { return a.data.localeCompare(b.data) || a.inicio.localeCompare(b.inicio) || cod(a) - cod(b); });
    var dados = lista.map(function (a) {
      var t = byId(db.turma, a.turmaId), i = byId(db.instrutor, a.instrutorId), m = byId(db.materia, a.materiaId), sl = byId(db.sala, a.salaId);
      return { idAula: a.id, data: brDate(a.data), horarioInicio: a.inicio, horarioFim: a.fim, horario: a.inicio + ' - ' + a.fim,
        turma: t ? String(t.codigo) : '-', instrutor: i ? i.nome : '-', materia: m ? m.nome : '-', sala: sl ? sl.nome : '-',
        situacao: a.status === 1 ? 'Realizada' : 'Não realizada', statusAula: a.status, turnoAula: a.turno };
    });
    return { success: true, data: dados, total: dados.length };
  }

  /* ---------- Cadastro de aula (admin) ---------- */
  function cadastrarAula(i) {
    var db = load();
    var data = (i.dataAula || '').trim(), inicio = (i.horarioinicioAula || '').trim(), fim = (i.horariofimAula || '').trim(), turno = (i.turnoAula || '').trim();
    var instrutor = parseInt(i.idInstrutor, 10) || 0, materia = parseInt(i.idMateria, 10) || 0, turma = parseInt(i.idTurma, 10) || 0, sala = parseInt(i.idSala, 10) || 0;
    var tipo = (i.tipoAula || 'Presencial').trim(), statusRaw = String(i.statusAula == null ? '1' : i.statusAula);
    if (!data || !inicio || !fim || !turno || instrutor <= 0 || materia <= 0 || turma <= 0) return fail('Preencha data, horários, período, instrutor, matéria e turma.');
    if (!validDate(data)) return fail('Data da aula inválida.');
    if (data < todayISO()) return fail('Não é possível cadastrar uma aula com data passada.');
    if (!validHora(inicio) || !validHora(fim)) return fail('Os horários devem estar no formato HH:MM.');
    if (fim <= inicio) return fail('O horário final deve ser posterior ao horário inicial.');
    if (['Manhã', 'Tarde', 'Noite'].indexOf(turno) < 0) return fail('Período de aula inválido.');
    if (['Presencial', 'Online', 'Híbrida'].indexOf(tipo) < 0) return fail('Tipo de aula inválido.');
    if (['0', '1'].indexOf(statusRaw) < 0) return fail('Situação de aula inválida.');
    var ins = byId(db.instrutor, instrutor);
    if (!ins) return fail('O instrutor selecionado não existe.');
    if (ins.status !== 1) return fail('O instrutor selecionado está inativo.');
    if (!byId(db.materia, materia)) return fail('A matéria selecionada não existe.');
    var t = byId(db.turma, turma);
    if (!t) return fail('A turma selecionada não existe.');
    if (t.inicio && data < t.inicio) return fail('A data da aula não pode ser anterior ao início da turma.');
    if (t.fim && data > t.fim) return fail('A data da aula não pode ultrapassar o término da turma.');
    if (sala > 0 && !byId(db.sala, sala)) return fail('A sala selecionada não existe.');
    var conflito = db.aula.some(function (a) {
      return a.data === data && a.inicio < fim && a.fim > inicio && (a.instrutorId === instrutor || a.turmaId === turma || (sala > 0 && a.salaId === sala));
    });
    if (conflito) return fail('Existe conflito de horário com o instrutor, a turma ou a sala selecionada.');
    var seg = (parseInt(fim.slice(0, 2), 10) * 60 + parseInt(fim.slice(3), 10) - parseInt(inicio.slice(0, 2), 10) * 60 - parseInt(inicio.slice(3), 10)) * 60;
    var p2 = function (n) { return ('0' + n).slice(-2); };
    var nova = { id: nextId(db.aula), adminId: null, alunoId: null, instrutorId: instrutor, materiaId: materia, turmaId: turma, salaId: sala > 0 ? sala : null,
      data: data, turno: turno, inicio: inicio, fim: fim, duracao: p2(Math.floor(seg / 3600)) + ':' + p2(Math.floor(seg % 3600 / 60)) + ':00', tipo: tipo, status: parseInt(statusRaw, 10) };
    db.aula.push(nova); save();
    return ok('Aula registrada com sucesso. ID da aula: ' + nova.id);
  }

  /* ---------- Cadastro de instrutor (admin) ---------- */
  function cadastrarInstrutor(i) {
    var db = load();
    var nome = (i.nomeInstrutor || '').trim(), cpf = digits(i.cpfInstrutor), email = (i.emailInstrutor || '').trim(), tel = digits(i.telefoneInstrutor), area = (i.areaInstrutor || '').trim();
    if (!nome) return fail('O nome do instrutor é obrigatório.');
    if (email && !validEmail(email)) return fail('E-mail inválido.');
    if (cpf && !/^\d{11}$/.test(cpf)) return fail('CPF inválido. Informe 11 dígitos.');
    if (tel && !/^\d{10,11}$/.test(tel)) return fail('Telefone inválido. Informe 10 ou 11 dígitos.');
    if (cpf && db.instrutor.some(function (x) { return x.cpf === cpf; })) return fail('Este CPF já está cadastrado para outro instrutor.');
    var novo = { id: nextId(db.instrutor), nome: nome, cpf: cpf || null, email: email || null, telefone: tel || null, area: area || null, status: 1 };
    db.instrutor.push(novo); save();
    return ok('Instrutor cadastrado com sucesso. ID: ' + novo.id);
  }

  function reset() { cache = seed(); save();  }

  window.DB = { opcoes: opcoes, consultar: consultar, cadastrarAula: cadastrarAula, cadastrarInstrutor: cadastrarInstrutor, reset: reset, todayISO: todayISO };

  /* Menu mobile */
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('.menu-button'), nav = document.querySelector('.navigation');
    if (btn && nav) btn.addEventListener('click', function () { var o = nav.classList.toggle('open'); btn.setAttribute('aria-expanded', o ? 'true' : 'false'); });
  });
})();
