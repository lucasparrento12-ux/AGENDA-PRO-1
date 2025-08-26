import React from 'react';
import { useOutletContext } from 'react-router-dom';

export default function Clientes() {
  const { clientes } = useOutletContext();

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Clientes</h1>
      {clientes.map(c => (
        <div key={c.id} className="bg-white p-4 rounded shadow mb-2">
          {c.nome} {c.whatsapp && `- ${c.whatsapp}`}
        </div>
      ))}
    </div>
  );
}
