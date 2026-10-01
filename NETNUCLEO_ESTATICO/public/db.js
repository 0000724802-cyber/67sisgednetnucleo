/* =====================================================================
   SISGED / NetNúcleo - camada de dados 100% estática (sem PHP / MySQL)
   ---------------------------------------------------------------------
   Substitui os controllers PHP. Os dados ficam no localStorage do
   navegador, iniciados com os mesmos registros do bancodedados.sql.
   Para voltar aos dados originais: DB.reset()  (ou botão na tela de login).
   ATENÇÃO: autenticação no navegador serve para demonstração; não é
   segurança real, pois qualquer pessoa pode editar o localStorage.
   ===================================================================== */
(function () {
  'use strict';
  var KEY = 'sisged_db_v1', SKEY = 'sisged_sessao_v1';

  /* ---------- SHA-256 (JS puro, funciona também em file://) ---------- */
  function sha256(str) {
    var s = unescape(encodeURIComponent(str));
    var K = [], H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    var p = [2], n = 3, i, j;
    function frac(x) { return ((x - Math.floor(x)) * 4294967296) | 0; }
    while (p.length < 64) { for (i = 0; i < p.length && n % p[i]; i++); if (i === p.length) p.push(n); n++; }
    for (i = 0; i < 64; i++) K[i] = frac(Math.cbrt ? Math.cbrt(p[i]) : Math.pow(p[i], 1 / 3));
    var bytes = [];
    for (i = 0; i < s.length; i++) bytes.push(s.charCodeAt(i));
    var bitLen = bytes.length * 8;
    bytes.push(0x80);
    while (bytes.length % 64 !== 56) bytes.push(0);
    for (i = 7; i >= 0; i--) bytes.push(i >= 4 ? 0 : (bitLen >>> (i * 8)) & 255);
    function rr(x, c) { return (x >>> c) | (x << (32 - c)); }
    for (var o = 0; o < bytes.length; o += 64) {
      var w = [];
      for (i = 0; i < 16; i++) w[i] = (bytes[o+i*4]<<24)|(bytes[o+i*4+1]<<16)|(bytes[o+i*4+2]<<8)|bytes[o+i*4+3];
      for (i = 16; i < 64; i++) {
        var s0 = rr(w[i-15],7)^rr(w[i-15],18)^(w[i-15]>>>3), s1 = rr(w[i-2],17)^rr(w[i-2],19)^(w[i-2]>>>10);
        w[i] = (w[i-16] + s0 + w[i-7] + s1) | 0;
      }
      var a=H[0],b=H[1],c=H[2],d=H[3],e=H[4],f=H[5],g=H[6],h=H[7];
      for (i = 0; i < 64; i++) {
        var S1 = rr(e,6)^rr(e,11)^rr(e,25), ch = (e&f)^(~e&g), t1 = (h+S1+ch+K[i]+w[i])|0;
        var S0 = rr(a,2)^rr(a,13)^rr(a,22), mj = (a&b)^(a&c)^(b&c), t2 = (S0+mj)|0;
        h=g; g=f; f=e; e=(d+t1)|0; d=c; c=b; b=a; a=(t1+t2)|0;
      }
      H[0]=(H[0]+a)|0;H[1]=(H[1]+b)|0;H[2]=(H[2]+c)|0;H[3]=(H[3]+d)|0;H[4]=(H[4]+e)|0;H[5]=(H[5]+f)|0;H[6]=(H[6]+g)|0;H[7]=(H[7]+h)|0;
    }
    return H.map(function (x) { return ('00000000' + (x >>> 0).toString(16)).slice(-8); }).join('');
  }
  function hashSenha(s) { return sha256('sisged:' + s); }

  /* ---------- Dados iniciais (espelham bancodedados.sql) ---------- */
  function seed() {
    return {
      administrador: [
        { id: 1, usuario: 'Sander',  email: 'sander@netnucleo.local',  senha: '4e26bfebbe16edac510ec0ab63bfa3d8119efad908de909bef3ee8fcdda915d2', unidade: 'Horto', papel: 'admin',     instrutorId: null, alunoId: null },
        { id: 2, usuario: 'Tubinho', email: 'tubinho@netnucleo.local', senha: 'b8cb23fbf0e2e76730761a128cbbfabf2bfdd3ea4894d54b0a5d7f77bccf8641', unidade: 'Horto', papel: 'instrutor', instrutorId: 1,    alunoId: null },
        { id: 3, usuario: 'Buzz',    email: 'buzz@netnucleo.local',    senha: '975de597079aa532dbc71b41b219a3901813d0ade598b5b3ef19496ada28e34e', unidade: 'Horto', papel: 'aluno',     instrutorId: null, alunoId: 1 }
      ],
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
      login_log: []
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
  function destino(papel) { return papel === 'instrutor' ? 'instrutor.html' : papel === 'aluno' ? 'aluno.html' : 'index.html'; }

  /* ---------- Sessão ---------- */
  function sessao() { try { return JSON.parse(sessionStorage.getItem(SKEY)); } catch (e) { return null; } }

  function login(unidade, usuario, senha) {
    var db = load(); usuario = (usuario || '').trim(); unidade = (unidade || '').trim();
    if (!unidade || !usuario || !senha) return fail('Preencha todos os campos.');
    var conta = null;
    db.administrador.forEach(function (a) { if (a.usuario === usuario) conta = a; });
    var sucesso = !!conta && conta.senha === hashSenha(senha) && conta.unidade.toLowerCase() === unidade.toLowerCase();
    var agora = new Date();
    db.login_log.push({ id: nextId(db.login_log), adminId: conta ? conta.id : null, usuario: usuario, unidade: unidade, data: todayISO(), hora: agora.toTimeString().slice(0, 8), sucesso: sucesso ? 1 : 0 });
    save();
    if (!sucesso) return fail('Usuário, senha ou unidade inválidos.');
    sessionStorage.setItem(SKEY, JSON.stringify({ usuario_id: conta.id, usuario: conta.usuario, unidade: conta.unidade, papel: conta.papel, instrutor_id: conta.instrutorId, aluno_id: conta.alunoId }));
    return ok('Login realizado com sucesso.', { papel: conta.papel, redirect: destino(conta.papel) });
  }
  function logout() { sessionStorage.removeItem(SKEY); }

  /* Guarda de página: <body data-role="admin|instrutor|aluno"> */
  function guard(roleEsperado) {
    var s = sessao();
    if (!s) { location.replace('login.html'); return false; }
    if (roleEsperado && s.papel !== roleEsperado) { location.replace(destino(s.papel)); return false; }
    return true;
  }

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
    var db = load(), s = sessao();
    if (!s) return fail('Sessão expirada ou usuário não autenticado.');
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
      if (s.papel === 'instrutor') return !!s.instrutor_id && a.instrutorId === s.instrutor_id;
      if (s.papel === 'aluno') {
        var al = s.aluno_id ? byId(db.aluno, s.aluno_id) : null;
        return !!al && a.turmaId === al.turmaId;
      }
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
    var db = load(), s = sessao();
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
    var nova = { id: nextId(db.aula), adminId: s ? s.usuario_id : null, alunoId: null, instrutorId: instrutor, materiaId: materia, turmaId: turma, salaId: sala > 0 ? sala : null,
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

  /* ---------- Gerenciamento de logins (admin) ---------- */
  function listarUsuarios() {
    var db = load();
    var lista = db.administrador.map(function (a) {
      var i = a.instrutorId ? byId(db.instrutor, a.instrutorId) : null, al = a.alunoId ? byId(db.aluno, a.alunoId) : null, t = al ? byId(db.turma, al.turmaId) : null;
      return { idAdministrador: a.id, usuarioAdministrador: a.usuario, emailAdministrador: a.email || '', unidadeAdministrador: a.unidade, papelAdministrador: a.papel,
        Instrutor_idInstrutor: a.instrutorId, Aluno_idAluno: a.alunoId,
        nomeInstrutor: i ? i.nome : '', cpfInstrutor: i ? i.cpf || '' : '', emailInstrutor: i ? i.email || '' : '', telefoneInstrutor: i ? i.telefone || '' : '', areaInstrutor: i ? i.area || '' : '',
        nomeAluno: al ? al.nome || '' : '', cpfAluno: al ? al.cpf || '' : '', emailAluno: al ? al.email || '' : '', telefoneAluno: al ? al.telefone || '' : '',
        Turma_idTurma: al ? al.turmaId : null, codigoTurma: t ? t.codigo : null };
    });
    lista.sort(function (a, b) { return a.usuarioAdministrador.localeCompare(b.usuarioAdministrador, 'pt-BR'); });
    return { success: true, usuarios: lista };
  }

  function excluirUsuario(id) {
    var db = load(), s = sessao(); id = Number(id);
    if (!id) return fail('Login não informado.');
    if (s && id === s.usuario_id) return fail('O administrador logado não pode excluir o próprio login.');
    var conta = byId(db.administrador, id);
    if (!conta) return fail('Login não encontrado.');
    db.administrador = db.administrador.filter(function (a) { return a.id !== id; });
    if (conta.papel === 'instrutor' && conta.instrutorId) {
      var iid = conta.instrutorId;
      var logins = db.administrador.filter(function (a) { return a.instrutorId === iid; }).length;
      var aulas = db.aula.filter(function (a) { return a.instrutorId === iid; }).length;
      if (!logins && !aulas) db.instrutor = db.instrutor.filter(function (x) { return x.id !== iid; });
    }
    if (conta.papel === 'aluno' && conta.alunoId) {
      var aid = conta.alunoId;
      var l2 = db.administrador.filter(function (a) { return a.alunoId === aid; }).length;
      var a2 = db.aula.filter(function (a) { return a.alunoId === aid; }).length;
      if (!l2 && !a2) db.aluno = db.aluno.filter(function (x) { return x.id !== aid; });
    }
    save();
    return ok('Login excluído com sucesso.');
  }

  function salvarUsuario(inp) {
    var db = load(), acao = inp.acao || 'criar', id = parseInt(inp.id, 10) || 0;
    if (['criar', 'editar'].indexOf(acao) < 0) return fail('Ação inválida.');
    var old = null;
    if (acao === 'editar') { if (id <= 0) return fail('Login não informado.'); old = byId(db.administrador, id); if (!old) return fail('Login não encontrado.'); }
    var usuario = (inp.usuario || '').trim(), email = (inp.email || '').trim(), unidade = (inp.unidade || '').trim() || 'Horto', papel = inp.papel || 'aluno', senha = inp.senha || '';
    if (!/^[a-zA-Z0-9._-]{3,50}$/.test(usuario)) return fail('Usuário inválido. Use de 3 a 50 caracteres.');
    if (email && !validEmail(email)) return fail('E-mail inválido.');
    if (['admin', 'instrutor', 'aluno'].indexOf(papel) < 0) return fail('Perfil inválido.');
    if (acao === 'criar' && !senha) return fail('Informe uma senha para o novo login.');
    if (senha && senha.length < 6) return fail('A senha deve possuir pelo menos 6 caracteres.');
    if (db.administrador.some(function (a) { return a.usuario === usuario && a.id !== id; })) return fail('Este usuário já está cadastrado.');
    var nome = (inp.nome || '').trim(), cpf = digits(inp.cpf), tel = digits(inp.telefone), area = (inp.area || '').trim(), turmaId = parseInt(inp.turma_id, 10) || 0;
    if (papel !== 'admin' && !nome) return fail('Informe o nome do aluno ou instrutor.');
    if (cpf && !/^\d{11}$/.test(cpf)) return fail('CPF inválido. Informe 11 dígitos.');
    if (tel && !/^\d{10,11}$/.test(tel)) return fail('Telefone inválido. Informe 10 ou 11 dígitos.');
    if (papel === 'aluno' && turmaId <= 0) return fail('Selecione a turma do aluno.');

    var instrutorId = null, alunoId = null;
    var oldI = old ? old.instrutorId : null, oldA = old ? old.alunoId : null;

    if (papel === 'instrutor') {
      if (cpf && db.instrutor.some(function (x) { return x.cpf === cpf && x.id !== oldI; })) return fail('Este CPF já está cadastrado para outro instrutor.');
      var ins = oldI ? byId(db.instrutor, oldI) : null;
      if (ins) { ins.nome = nome; ins.cpf = cpf || null; ins.email = email || null; ins.telefone = tel || null; ins.area = area || null; instrutorId = ins.id; }
      else { ins = { id: nextId(db.instrutor), nome: nome, cpf: cpf || null, email: email || null, telefone: tel || null, area: area || null, status: 1 }; db.instrutor.push(ins); instrutorId = ins.id; }
    }
    if (papel === 'aluno') {
      if (!byId(db.turma, turmaId)) return fail('A turma selecionada não existe.');
      if (cpf && db.aluno.some(function (x) { return x.cpf === cpf && x.id !== oldA; })) return fail('Este CPF já está cadastrado para outro aluno.');
      var al = oldA ? byId(db.aluno, oldA) : null;
      if (al) { al.nome = nome; al.cpf = cpf || null; al.email = email || null; al.telefone = tel || null; al.turmaId = turmaId; alunoId = al.id; }
      else { al = { id: nextId(db.aluno), nome: nome, cpf: cpf || null, email: email || null, telefone: tel || null, turmaId: turmaId }; db.aluno.push(al); alunoId = al.id; }
    }
    if (acao === 'criar') {
      db.administrador.push({ id: nextId(db.administrador), usuario: usuario, email: email || null, senha: hashSenha(senha), unidade: unidade, papel: papel, instrutorId: instrutorId, alunoId: alunoId });
      save(); return ok('Login criado com sucesso.');
    }
    old.usuario = usuario; old.email = email || null; old.unidade = unidade; old.papel = papel; old.instrutorId = instrutorId; old.alunoId = alunoId;
    if (senha) old.senha = hashSenha(senha);
    save(); return ok('Informações e login alterados com sucesso.');
  }

  function reset() { cache = seed(); save(); sessionStorage.removeItem(SKEY); }

  window.DB = { login: login, logout: logout, sessao: sessao, guard: guard, opcoes: opcoes, consultar: consultar,
    cadastrarAula: cadastrarAula, cadastrarInstrutor: cadastrarInstrutor, listarUsuarios: listarUsuarios, salvarUsuario: salvarUsuario, excluirUsuario: excluirUsuario,
    reset: reset, destino: destino, todayISO: todayISO };

  /* Guarda automática + logout + menu mobile */
  document.addEventListener('DOMContentLoaded', function () {
    var role = document.body && document.body.dataset.role;
    if (role) DB.guard(role);
    Array.prototype.forEach.call(document.querySelectorAll('[data-logout]'), function (a) { a.addEventListener('click', function () { DB.logout(); }); });
    var btn = document.querySelector('.menu-button'), nav = document.querySelector('.navigation');
    if (btn && nav) btn.addEventListener('click', function () { var o = nav.classList.toggle('open'); btn.setAttribute('aria-expanded', o ? 'true' : 'false'); });
  });
})();
