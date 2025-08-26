// src/Agenda.jsx
import React, { useState, useEffect } from 'react';
import { FiUser, FiCalendar, FiDollarSign, FiTrash2, FiEdit } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function Agenda() {
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

  const showMsg = (msg, tempo = 3000) => {
    setMensagem(msg);
    setTimeout(() => setMensagem(''), tempo);
  };

  const adicionarOuEditarCliente = () => {
    const nomeTrim = clienteNome.trim();
    const whatsappTrim = clienteWhatsapp.trim();
    if (!nomeTrim) return showMsg('Preencha o nome do cliente');
    if (clientes.some(c => c.nome.toLowerCase() === nomeTrim.toLowerCase() && c.id !== editarClienteId)) return showMsg('Cliente já existe');
    
    if (editarClienteId) {
      setClientes(clientes.map(c => c.id === editarClienteId ? { ...c, nome: nomeTrim, whatsapp: whatsappTrim } : c));
      setEditarClienteId(null);
      showMsg('Cliente editado!');
    } else {
      setClientes([...clientes, { id: Date.now(), nome: nomeTrim, whatsapp: whatsappTrim }]);
      showMsg('Cliente adicionado!');
    }
    setClienteNome('');
    setClienteWhatsapp('');
  };

  const removerCliente = (id) => {
    if (window.confirm('Deseja remover este cliente e seus agendamentos?')) {
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
    const { data, horario, servico, preco, clienteId } = formAgenda;
    if (!data || !horario || !servico.trim() || !preco || !clienteId) return showMsg('Preencha todos os campos do agendamento');

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

  const editarAgenda = (agendamento) => {
    setFormAgenda({
      data: agendamento.data,
      horario: agendamento.horario || '',
      servico: agendamento.servico,
      preco: agendamento.preco,
      clienteId: agendamento.clienteId
    });
    setEditarAgendaId(agendamento.id);
  };

  const removerAgenda = (id) => {
    if (window.confirm('Deseja remover este agendamento?')) {
      setAgenda(agenda.filter(a => a.id !== id));
      showMsg('Agendamento removido!');
    }
  };

  const totalFinanceiro = agenda.reduce((acc, a) => acc + parseFloat(a.preco || 0), 0).toFixed(2);
  const clientesOrdenados = [...clientes].sort((a, b) => a.nome.localeCompare(b.nome));
  const agendaFiltrada = agenda
    .filter(a => {
      if (!filtroCliente) return true;
      const cliente = clientes.find(c => c.id === a.clienteId);
      return cliente ? cliente.nome.toLowerCase().includes(filtroCliente.toLowerCase()) : false;
    })
    .sort((a, b) => `${a.data} ${a.horario || ''}`.localeCompare(`${b.data} ${b.horario || ''}`));
  
  const hoje = new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-screen md:flex bg-gray-100 font-sans">
      <aside className="w-full md:w-72 bg-white shadow-md p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Agenda Pro</h1>
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center"><FiUser className="mr-3" /> Clientes</h2>
          <div className="flex flex-col mb-4 gap-2">
            <input className={`border p-2 rounded-md ${editarClienteId ? 'border-green-500' : ''}`} placeholder="Nome do cliente" value={clienteNome} onChange={e => setClienteNome(e.target.value)} />
            <input type="tel" className={`border p-2 rounded-md ${editarClienteId ? 'border-green-500' : ''}`} placeholder="WhatsApp (Ex: 119...)" value={clienteWhatsapp} onChange={e => setClienteWhatsapp(e.target.value)} />
            <button className={`p-2 rounded-md font-semibold text-white transition-colors ${editarClienteId ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`} onClick={adicionarOuEditarCliente}>
              {editarClienteId ? 'Salvar Cliente' : 'Adicionar Cliente'}
            </button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {clientesOrdenados.map(c => (
              <div key={c.id} className="bg-gray-50 p-2 rounded-lg flex justify-between items-center">
                <div>
                  <span className="font-medium text-gray-800">{c.nome}</span>
                  {c.whatsapp && <p className="text-xs text-gray-500">{c.whatsapp}</p>}
                </div>
                <div className="flex gap-3 items-center">
                  {c.whatsapp && <a href={`https://wa.me/55${c.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"><FaWhatsapp size={20} className="text-green-500 hover:text-green-700" /></a>}
                  <button onClick={() => editarCliente(c)}><FiEdit size={16} className="text-blue-500 hover:text-blue-700" /></button>
                  <button onClick={() => removerCliente(c.id)}><FiTrash2 size={16} className="text-red-500 hover:text-red-700" /></button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </aside>
      
      <main className="flex-1 p-4 md:p-8">
        {mensagem && <div className="mb-4 p-3 bg-blue-100 border-l-4 border-blue-500 text-blue-800 rounded">{mensagem}</div>}
        
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 flex items-center"><FiCalendar className="mr-3" /> Agenda</h2>
          <div className={`bg-white p-4 rounded-lg shadow mb-4 grid grid-cols-2 lg:grid-cols-6 gap-3 items-end ${editarAgendaId ? 'border-2 border-green-500' : ''}`}>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Cliente</label>
              <select name="clienteId" value={formAgenda.clienteId} onChange={handleAgendaChange} className="mt-1 border p-2 w-full rounded-md bg-gray-50">
                <option value="">Selecione</option>
                {clientesOrdenados.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Data</label>
              <input type="date" name="data" className="mt-1 border p-2 w-full rounded-md bg-gray-50" value={formAgenda.data} onChange={handleAgendaChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Hora</label>
              <input type="time" name="horario" className="mt-1 border p-2 w-full rounded-md bg-gray-50" value={formAgenda.horario} onChange={handleAgendaChange} />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Serviço</label>
              <input name="servico" className="mt-1 border p-2 w-full rounded-md bg-gray-50" value={formAgenda.servico} onChange={handleAgendaChange} />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Preço</label>
              <input type="number" name="preco" className="mt-1 border p-2 w-full rounded-md bg-gray-50" value={formAgenda.preco} onChange={handleAgendaChange} min="0" step="0.01" />
            </div>
            <button className={`p-2 w-full rounded-md font-semibold text-white transition-colors col-span-2 lg:col-span-6 ${editarAgendaId ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`} onClick={adicionarOuEditarAgenda}>
              {editarAgendaId ? 'Salvar Edição' : 'Agendar'}
            </button>
          </div>
          
          <input className="border p-2 mb-4 w-full rounded-md" placeholder="Filtrar agendamentos por nome do cliente..." value={filtroCliente} onChange={e => setFiltroCliente(e.target.value)} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agendaFiltrada.map(a => {
              const cliente = clientes.find(c => c.id === a.clienteId);
              const isHoje = a.data === hoje;
              return (
                <div key={a.id} className={`bg-white p-4 rounded-lg shadow ${isHoje ? 'border-2 border-yellow-400' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-gray-800 flex items-center gap-2">
                        <span>{cliente ? cliente.nome : 'Cliente Removido'}</span>
                        {cliente && cliente.whatsapp && <a href={`https://wa.me/55${cliente.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"><FaWhatsapp size={18} className="text-green-500 hover:text-green-700" /></a>}
                      </div>
                      <div className="text-sm text-gray-600 font-semibold">
                        {new Date(a.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                        {a.horario && ` às ${a.horario}`}
                      </div>
                      <div className="text-gray-700">{a.servico}</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => editarAgenda(a)}><FiEdit size={18} className="text-blue-500 hover:text-blue-700" /></button>
                      <button onClick={() => removerAgenda(a.id)}><FiTrash2 size={18} className="text-red-500 hover:text-red-700" /></button>
                    </div>
                  </div>
                  <div className="font-semibold text-green-600 mt-2 text-right">R$ {a.preco}</div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Resumo Financeiro</h2>
          <div className="bg-white p-6 rounded-lg shadow text-2xl font-bold text-blue-600 flex items-center">
            <FiDollarSign className="mr-2" /> <span>Total a Receber: R$ {totalFinanceiro}</span>
          </div>
        </section>
      </main>
    </div>
  );
}