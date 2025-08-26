// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutPrincipal from "./MVPAgendaAutonomos";
import Agenda from "./Agenda";
import Clientes from "./Clientes"; // se você já tiver essa página separada

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LayoutPrincipal />}>
          {/* Rota da agenda */}
          <Route index element={<Agenda />} />
          {/* Rota de clientes */}
          <Route path="clientes" element={<Clientes />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
