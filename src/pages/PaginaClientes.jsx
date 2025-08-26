// src/pages/PaginaClientes.jsx
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { FiTrash2, FiEdit } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa'; // NOVO ÍCONE

export default function PaginaClientes() {
  const { 
    clientes, clienteNome, setClienteNome, clienteWhatsapp, setClienteWhatsapp, // RECEBE NOVOS ESTADOS
    editarClienteId, mensagem, adicionarOuEditarCliente, removerCliente, editarCliente 
  } = useOutletContext();

  const clientesOrdenados = [...clientes].sort((a, b) => a.nome.localeCompare(b.nome));

  return (
    <>
      {mensagem && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-300 text-blue-800 rounded">
          {mensagem}
        </div>
      )}

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Clientes</h2>
        <div className="flex flex-col md:flex-row mb-4 gap-2">
          <input className={`border p-2 flex-1 rounded-md ${editarClienteId ? 'border-green-500' : ''}`} placeholder="Nome do cliente" value={clienteNome} onChange={e => setClienteNome(e.target.value)} aria-label="Nome do cliente" />
          
          {/* NOVO CAMPO DE INPUT PARA WHATSAPP */}
          <input type="tel" className={`border p-2 flex-1 rounded-md ${editarClienteId ? 'border-green-500' : ''}`} placeholder="WhatsApp (Ex: 11987654321)" value={clienteWhatsapp} onChange={e => setClienteWhatsapp(e.target.value)} aria-label="WhatsApp do cliente" />

          <button className={`px-6 py-2 rounded-md font-semibold transition-colors ${editarClienteId ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`} onClick={adicionarOuEditarCliente}>
            {editarClienteId ? 'Salvar' : 'Adicionar'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clientesOrdenados.map(c => (
            <div key={c.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <span className="font-medium text-gray-800">{c.nome}</span>
                {/* MOSTRA O NÚMERO SE ELE EXISTIR */}
                {c.whatsapp && <p className="text-sm text-gray-500">{c.whatsapp}</p>}
              </div>

              <div className="flex gap-3 items-center">
                {/* NOVO ÍCONE CLICÁVEL DO WHATSAPP */}
                {c.whatsapp && (
                  <a href={`https://wa.me/55${c.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" aria-label="Conversar no WhatsApp" className="text-green-500 hover:text-green-700">
                    <FaWhatsapp size={22} />
                  </a>
                )}
                <button onClick={() => editarCliente(c)} className="text-blue-500 hover:text-blue-700 p-1" aria-label="Editar cliente"><FiEdit size={18} /></button>
                <button onClick={() => removerCliente(c.id)} className="text-red-500 hover:text-red-700 p-1" aria-label="Remover cliente"><FiTrash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}