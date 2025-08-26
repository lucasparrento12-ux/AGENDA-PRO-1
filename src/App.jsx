// src/App.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LayoutPrincipal from './MVPAgendaAutonomos.jsx';
import PaginaAgenda from './pages/PaginaAgenda.jsx';
import PaginaClientes from './pages/PaginaClientes.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutPrincipal />,
    children: [
      {
        index: true, // Isso torna este o componente padrão para "/"
        element: <PaginaAgenda />,
      },
      {
        path: "clientes",
        element: <PaginaClientes />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;