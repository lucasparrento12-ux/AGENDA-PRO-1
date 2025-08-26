// src/MVPAgendaAutonomos.jsx
import React, { useState, useEffect } from 'react';
import { FiUser, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { Outlet, NavLink } from 'react-router-dom';

export default function LayoutPrincipal() {
  // Toda a nossa lógica continua aqui, sem mudança
  const [clientes, setClientes] = useState(() => JSON.parse(localStorage.getItem('clientes')) || []);
  const [agenda, setAgenda] = useState(() => JSON.parse(localStorage.getItem('agenda')) || []);
  const [clienteNome, setClienteNome] = useState('');
  const [clienteWhatsapp, setClienteWhatsapp] = useState('');
  const [editarClienteId, setEditarClienteId] = useState(null);
  const [formAgenda, setFormAgenda] = useState({ data: '', servico: '', preco: '', clienteId: '' });
  const [editarAgendaId, setEditarAgendaId] = useState(null);
  const [filtroCliente, setFiltroCliente] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => { localStorage.setItem('clientes', JSON.stringify(clientes)); }, [clientes]);
  useEffect(() => { localStorage.setItem('agenda', JSON.stringify(agenda)); }, [agenda]);

  const showMsg = (msg, tempo = 2000) => {
    setMensagem(msg);
    setTimeout(() => setMensagem(''), tempo);
  };

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

  const handleAgendaChange = (e) => {
    const { name, value } = e.target;
    setFormAgenda(prev => ({ ...prev, [name]: value }));
  };

  const adicionarOuEditarAgenda = () => {
    const { data, servico, preco, clienteId } = formAgenda;
    if (!data || !servico.trim() || !preco || !clienteId) return showMsg('Preencha todos os campos, incluindo o cliente.');
    if (parseFloat(preco) <= 0) return showMsg('Preço deve ser maior que zero');
    if (new Date(data) < new Date(new Date().toISOString().slice(0, 10))) return showMsg('Data deve ser hoje ou futura');
    if (editarAgendaId) {
      setAgenda(agenda.map(a => a.id === editarAgendaId ? { ...a, data, servico: servico.trim(), preco: parseFloat(preco).toFixed(2), clienteId: Number(clienteId) } : a));
      setEditarAgendaId(null);
      showMsg('Agendamento editado!');
    } else {
      const novoAgendamento = { id: Date.now(), data, servico: servico.trim(), preco: parseFloat(preco).toFixed(2), clienteId: Number(clienteId) };
      setAgenda([...agenda, novoAgendamento]);
      showMsg('Agendamento criado!');
    }
    setFormAgenda({ data: '', servico: '', preco: '', clienteId: '' });
  };

  const editarAgenda = (agendamento) => {
    setFormAgenda({ data: agendamento.data, servico: agendamento.servico, preco: agendamento.preco, clienteId: agendamento.clienteId });
    setEditarAgendaId(agendamento.id);
    window.scrollTo(0, 0);
  };

  const removerAgenda = (id) => {
    if (window.confirm('Deseja realmente remover este agendamento?')) {
      setAgenda(agenda.filter(a => a.id !== id));
      showMsg('Agendamento removido!');
    }
  };

  const sharedStateAndFunctions = {
    clientes, agenda, clienteNome, setClienteNome, clienteWhatsapp, setClienteWhatsapp, editarClienteId, formAgenda, editarAgendaId, filtroCliente, setFiltroCliente, mensagem,
    adicionarOuEditarCliente, removerCliente, editarCliente, handleAgendaChange, adicionarOuEditarAgenda, editarAgenda, removerAgenda
  };
  
  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      {/* Menu Lateral para Desktop (continua escondido no celular) */}
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
        <h1 className="text-2xl font-bold mb-8 text-gray-800">Agenda Pro</h1>
        <nav>
          <ul>
            <li>
              <NavLink to="/clientes" className={({isActive}) => `flex items-center mb-4 p-2 rounded-md font-semibold ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}>
                <FiUser className="mr-3" /> Clientes
              </NavLink>
            </li>
            <li>
                <NavLink to="/" end className={({isActive}) => `flex items-center mb-4 p-2 rounded-md font-semibold ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}>
                <FiCalendar className="mr-3" /> Agenda
                </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      
      <main className="flex-1 p-4 md:p-8">
        
        {/* === NOVO: NAVEGAÇÃO PARA CELULAR === */}
        {/* Este menu só aparece em telas pequenas (md:hidden) */}
        <nav className="md:hidden bg-white p-2 rounded-lg shadow mb-4">
          <div className="flex justify-around">
            <NavLink to="/clientes" className={({isActive}) => `flex items-center p-2 rounded-md font-semibold text-sm ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}>
              <FiUser className="mr-2" /> Clientes
            </NavLink>
            <NavLink to="/" end className={({isActive}) => `flex items-center p-2 rounded-md font-semibold text-sm ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}>
              <FiCalendar className="mr-2" /> Agenda
            </NavLink>
          </div>
        </nav>
        {/* === FIM DA NAVEGAÇÃO PARA CELULAR === */}

        {/* O Outlet renderiza a página correta (Agenda ou Clientes) */}
        <Outlet context={sharedStateAndFunctions} />
      </main>
    </div>
  );
}