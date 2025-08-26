// src/pages/PaginaAgenda.jsx
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { FiTrash2, FiEdit, FiDollarSign } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function PaginaAgenda() {
  const {
    clientes, agenda, formAgenda, editarAgendaId, filtroCliente, setFiltroCliente, mensagem,
    handleAgendaChange, adicionarOuEditarAgenda, editarAgenda, removerAgenda
  } = useOutletContext();
  
  const totalFinanceiro = agenda.reduce((acc, a) => acc + parseFloat(a.preco), 0).toFixed(2);
  const clientesOrdenados = [...clientes].sort((a, b) => a.nome.localeCompare(b.nome));
  const agendaFiltrada = agenda
    .filter(a => {
        if (!filtroCliente) return true;
        const cliente = clientes.find(c => c.id === a.clienteId);
        return cliente ? cliente.nome.toLowerCase().includes(filtroCliente.toLowerCase()) : false;
    })
    .sort((a, b) => `${a.data} ${a.horario}`.localeCompare(`${b.data} ${b.horario}`));

  const hoje = new Date().toISOString().slice(0, 10);

  return (
    <>
      {mensagem && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-300 text-blue-800 rounded">{mensagem}</div>
      )}

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Agenda</h2>
        <div className={`bg-white p-4 rounded-lg shadow mb-4 grid grid-cols-2 lg:grid-cols-6 gap-3 items-end ${editarAgendaId ? 'border-green-500 border' : ''}`}>
          <div className="col-span-2 lg:col-span-2">
            <label htmlFor="clienteId" className="block text-sm font-medium text-gray-700">Cliente</label>
            <select id="clienteId" name="clienteId" value={formAgenda.clienteId} onChange={handleAgendaChange} className="mt-1 border p-2 w-full rounded-md bg-gray-50" aria-label="Selecionar cliente">
              <option value="">Selecione o Cliente</option>
              {clientesOrdenados.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="data" className="block text-sm font-medium text-gray-700">Data</label>
            <input id="data" type="date" name="data" className="mt-1 border p-2 w-full rounded-md bg-gray-50" value={formAgenda.data} onChange={handleAgendaChange} aria-label="Data do agendamento" />
          </div>
          <div>
            <label htmlFor="horario" className="block text-sm font-medium text-gray-700">Hora</label>
            <input id="horario" type="time" name="horario" className="mt-1 border p-2 w-full rounded-md bg-gray-50" value={formAgenda.horario} onChange={handleAgendaChange} aria-label="Horário do agendamento" />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <label htmlFor="servico" className="block text-sm font-medium text-gray-700">Serviço</label>
            <input id="servico" name="servico" className="mt-1 border p-2 w-full rounded-md bg-gray-50" placeholder="Serviço" value={formAgenda.servico} onChange={handleAgendaChange} aria-label="Serviço" />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <label htmlFor="preco" className="block text-sm font-medium text-gray-700">Preço</label>
            <input id="preco" type="number" name="preco" className="mt-1 border p-2 w-full rounded-md bg-gray-50" placeholder="Preço" value={formAgenda.preco} onChange={handleAgendaChange} aria-label="Preço" min="0" step="0.01" />
          </div>
          <button className={`px-4 py-2 w-full rounded-md font-semibold transition-colors col-span-2 lg:col-span-6 ${editarAgendaId ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`} onClick={adicionarOuEditarAgenda}>
            {editarAgendaId ? 'Salvar Edição' : 'Agendar'}
          </button>
        </div>
        <input className="border p-2 mb-4 w-full rounded-md" placeholder="Filtrar agendamentos por nome do cliente..." value={filtroCliente} onChange={e => setFiltroCliente(e.target.value)} aria-label="Filtrar agendamentos" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agendaFiltrada.map(a => {
            const cliente = clientes.find(c => c.id === a.clienteId);
            const isHoje = a.data === hoje;
            return (
              <div key={a.id} className={`bg-white p-4 rounded-lg shadow flex justify-between items-start ${isHoje ? 'border-2 border-yellow-400' : ''}`}>
                <div>
                  <div className="font-bold text-gray-800 flex items-center gap-2">
                    <span>{cliente ? cliente.nome : 'Cliente Removido'}</span>
                    {cliente && cliente.whatsapp && (
                      <a href={`https://wa.me/55${cliente.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" aria-label="Conversar no WhatsApp" className="text-green-500 hover:text-green-700"><FaWhatsapp size={18} /></a>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600 font-semibold">
                    {new Date(a.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                    {a.horario && ` às ${a.horario}`}
                  </div>

                  <div className="text-gray-700">{a.servico}</div>
                  <div className="font-semibold text-green-600 mt-2">R$ {a.preco}</div>

                  {/* ===== CÓDIGO DE DEBUG ADICIONADO ===== */}
                  <pre className="text-xs bg-gray-200 p-1 mt-2 rounded overflow-auto">
                    {JSON.stringify(a, null, 2)}
                  </pre>
                  {/* ===== FIM DO CÓDIGO DE DEBUG ===== */}

                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => editarAgenda(a)} className="text-blue-500 hover:text-blue-700 p-1" aria-label="Editar agendamento"><FiEdit size={18} /></button>
                  <button onClick={() => removerAgenda(a.id)} className="text-red-500 hover:text-red-700 p-1" aria-label="Remover agendamento"><FiTrash2 size={18} /></button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Resumo Financeiro</h2>
        <div className="bg-white p-6 rounded-lg shadow text-2xl font-bold text-blue-600">
           <FiDollarSign className="inline-block mr-2" /> Total a Receber: R$ {totalFinanceiro}
        </div>
      </section>
    </>
  );
}