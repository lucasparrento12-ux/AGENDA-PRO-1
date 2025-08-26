// src/MVPAgendaAutonomos.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { FiUser, FiCalendar, FiDollarSign, FiXCircle } from 'react-icons/fi';
import { Outlet, NavLink } from 'react-router-dom';

export default function LayoutPrincipal() {
  const [clientes, setClientes] = useState(() => JSON.parse(localStorage.getItem('clientes')) || []);
  const [agenda, setAgenda] = useState(() => JSON.parse(localStorage.getItem('agenda')) || []);
  const [clienteNome, setClienteNome] = useState('');
  const [clienteWhatsapp, setClienteWhatsapp] = useState('');
  const [editarClienteId, setEditarClienteId] = useState(null);
  const [formAgenda, setFormAgenda] = useState({ data: '', horario: '', servico: '', preco: '', clienteId: '' });
  const [editarAgendaId, setEditarAgendaId] = useState(null);
  const [filtroCliente, setFiltroCliente] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => { localStorage.setItem('clientes', JSON.stringify(clientes)); }, [clientes]);
  useEffect(() => { localStorage.setItem('agenda', JSON.stringify(agenda)); }, [agenda]);

  // 🔔 Notificações
  useEffect(() => {
    if (Notification.permission !== 'granted') Notification.requestPermission();
    const timers = JSON.parse(localStorage.getItem('notificationTimers')) || [];
    timers.forEach(timerId => clearTimeout(timerId));
    localStorage.setItem('notificationTimers', JSON.stringify([]));

    const novosTimers = [];
    const hoje = new Date().toISOString().slice(0, 10);
    const agendamentosDeHoje = agenda.filter(a => a.data === hoje && a.horario);

    agendamentosDeHoje.forEach(agendamento => {
      const [hora, minuto] = agendamento.horario.split(':');
      const dataAlerta = new Date();
      dataAlerta.setHours(hora, minuto, 0, 0);
      const agora = new Date();
      const tempoAteAlerta = dataAlerta.getTime() - agora.getTime();

      if (tempoAteAlerta > 0) {
        const timerId = setTimeout(() => {
          const cliente = clientes.find(c => c.id === agendamento.clienteId);
          const nomeCliente = cliente ? cliente.nome : 'um cliente';
          const audio = new Audio('/sounds/alerta.mp3');
          audio.play().catch(e => console.error("Erro ao tocar áudio:", e));
          if (Notification.permission === 'granted') {
            new Notification('Lembrete de Agendamento!', {
              body: `Você tem um agendamento com ${nomeCliente} (${agendamento.servico}) agora.`,
              icon: '/vite.svg'
            });
          }
        }, tempoAteAlerta);
        novosTimers.push(timerId);
      }
    });
    localStorage.setItem('notificationTimers', JSON.stringify(novosTimers));
  }, [agenda, clientes]);

  // 🔎 Mensagens rápidas
  const showMsg = (msg, tempo = 3000) => {
    setMensagem(msg);
    setTimeout(() => setMensagem(''), tempo);
  };

  // ➕ Cliente
  const adicionarOuEditarCliente = () => {
    const nomeTrim = clienteNome.trim();
    const whatsappTrim = clienteWhatsapp.trim();
    if (!nomeTrim) return showMsg('Preencha o nome do cliente');
    if (clientes.some(c => c.nome.toLowerCase() === nomeTrim.toLowerCase() && c.id !== editarClienteId)) {
      return showMsg('Já existe um cliente com esse nome');
    }
    if (editarClienteId) {
      setClientes(clientes.map(c => c.id === editarClienteId ? { ...c, nome: nomeTrim, whatsapp: whatsappTrim } : c));
      setEditarClienteId(null);
      showMsg('Cliente editado com sucesso!');
    } else {
      setClientes([...clientes, { id: Date.now(), nome: nomeTrim, whatsapp: whatsappTrim }]);
      showMsg('Cliente adicionado!');
    }
    setClienteNome('');
    setClienteWhatsapp('');
  };
  
  const cancelarEdicaoCliente = () => {
    setClienteNome('');
    setClienteWhatsapp('');
    setEditarClienteId(null);
  };

  const removerCliente = (id) => {
    if (window.confirm('Deseja realmente remover este cliente? Todos os agendamentos dele também serão removidos.')) {
      setClientes(clientes.filter(c => c.id !== id));
      setAgenda(agenda.filter(a => a.clienteId !== id));
      showMsg('Cliente removido!');
    }
  };
  
  const editarCliente = (c) => {
    setClienteNome(c.nome);
    setClienteWhatsapp(c.whatsapp || '');
    setEditarClienteId(c.id);
  };

  // 📅 Agenda
  const handleAgendaChange = (e) => {
    const { name, value } = e.target;
    setFormAgenda(prev => ({ ...prev, [name]: value }));
  };
  
  const adicionarOuEditarAgenda = () => {
    const { data, horario, servico, preco, clienteId } = formAgenda;
    if (!data || !horario || !servico.trim() || !preco || !clienteId) return showMsg('Preencha todos os campos, incluindo data e horário.');
    if (parseFloat(preco) <= 0) return showMsg('Preço deve ser maior que zero');
    
    const dataSelecionada = new Date(`${data}T00:00:00`);
    const dataDeHoje = new Date(new Date().setHours(0, 0, 0, 0));
    if (dataSelecionada < dataDeHoje) return showMsg('Data não pode ser no passado');

    if (editarAgendaId) {
      setAgenda(agenda.map(a => a.id === editarAgendaId ? { ...a, data, horario, servico: servico.trim(), preco: parseFloat(preco).toFixed(2), clienteId: Number(clienteId) } : a));
      setEditarAgendaId(null);
      showMsg('Agendamento editado!');
    } else {
      const novoAgendamento = { id: Date.now(), data, horario, servico: servico.trim(), preco: parseFloat(preco).toFixed(2), clienteId: Number(clienteId) };
      setAgenda([...agenda, novoAgendamento]);
      showMsg('Agendamento criado!');
    }
    setFormAgenda({ data: '', horario: '', servico: '', preco: '', clienteId: '' });
  };

  const cancelarEdicaoAgenda = () => {
    setFormAgenda({ data: '', horario: '', servico: '', preco: '', clienteId: '' });
    setEditarAgendaId(null);
  };
  
  const editarAgenda = (agendamento) => {
    setFormAgenda({
      data: agendamento.data,
      horario: agendamento.horario || '',
      servico: agendamento.servico,
      preco: agendamento.preco,
      clienteId: agendamento.clienteId
    });
    setEditarAgendaId(agendamento.id);
    window.scrollTo(0, 0);
  };

  const removerAgenda = (id) => {
    if (window.confirm('Deseja realmente remover este agendamento?')) {
      setAgenda(agenda.filter(a => a.id !== id));
      showMsg('Agendamento removido!');
    }
  };

  // 📊 Próximo agendamento + resumo financeiro
  const proximoAgendamento = useMemo(() => {
    return agenda
      .map(a => ({ ...a, dataHora: new Date(`${a.data}T${a.horario}`) }))
      .filter(a => a.dataHora > new Date())
      .sort((a, b) => a.dataHora - b.dataHora)[0];
  }, [agenda]);

  const resumoFinanceiro = useMemo(() => {
    const hoje = new Date().toISOString().slice(0, 10);
    const mesAtual = new Date().toISOString().slice(0, 7); // yyyy-mm
    const totalHoje = agenda
      .filter(a => a.data === hoje)
      .reduce((acc, a) => acc + parseFloat(a.preco), 0);
    const totalMes = agenda
      .filter(a => a.data.startsWith(mesAtual))
      .reduce((acc, a) => acc + parseFloat(a.preco), 0);
    return { totalHoje, totalMes };
  }, [agenda]);

  const sharedStateAndFunctions = {
    clientes, agenda, clienteNome, setClienteNome, clienteWhatsapp, setClienteWhatsapp, editarClienteId, formAgenda, editarAgendaId, filtroCliente, setFiltroCliente, mensagem,
    adicionarOuEditarCliente, removerCliente, editarCliente, cancelarEdicaoCliente,
    handleAgendaChange, adicionarOuEditarAgenda, editarAgenda, removerAgenda, cancelarEdicaoAgenda
  };
  
  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
        <h1 className="text-2xl font-bold mb-8 text-gray-800">Agenda Pro</h1>
        
        {/* Resumo */}
        <div className="mb-6 text-sm text-gray-700">
          <p><FiDollarSign className="inline mr-1" /> Hoje: <strong>R$ {resumoFinanceiro.totalHoje.toFixed(2)}</strong></p>
          <p><FiDollarSign className="inline mr-1" /> Mês: <strong>R$ {resumoFinanceiro.totalMes.toFixed(2)}</strong></p>
        </div>

        {/* Próximo horário */}
        {proximoAgendamento && (
          <div className="mb-6 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
            <strong>Próximo:</strong><br />
            {clientes.find(c => c.id === proximoAgendamento.clienteId)?.nome || 'Cliente'} <br />
            {proximoAgendamento.servico} às {proximoAgendamento.horario}
          </div>
        )}

        <nav>
          <ul>
            <li><NavLink to="/clientes" className={({isActive}) => `flex items-center mb-4 p-2 rounded-md font-semibold ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}><FiUser className="mr-3" /> Clientes</NavLink></li>
            <li><NavLink to="/" end className={({isActive}) => `flex items-center mb-4 p-2 rounded-md font-semibold ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}><FiCalendar className="mr-3" /> Agenda</NavLink></li>
          </ul>
        </nav>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 p-4 md:p-8">
        {/* Navbar mobile */}
        <nav className="md:hidden bg-white p-2 rounded-lg shadow mb-4">
          <div className="flex justify-around">
            <NavLink to="/clientes" className={({isActive}) => `flex items-center p-2 rounded-md font-semibold text-sm ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}><FiUser className="mr-2" /> Clientes</NavLink>
            <NavLink to="/" end className={({isActive}) => `flex items-center p-2 rounded-md font-semibold text-sm ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}><FiCalendar className="mr-2" /> Agenda</NavLink>
          </div>
        </nav>

        {/* Próximo horário no mobile */}
        {proximoAgendamento && (
          <div className="md:hidden mb-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
            <strong>Próximo:</strong> {clientes.find(c => c.id === proximoAgendamento.clienteId)?.nome || 'Cliente'} - {proximoAgendamento.servico} às {proximoAgendamento.horario}
          </div>
        )}

        <Outlet context={sharedStateAndFunctions} />
      </main>
    </div>
  );
}
