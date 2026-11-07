import { Routes, Route, Navigate } from "react-router-dom";
import Reportes from "./pages/Reportes"; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/reportes" replace />} />
      <Route path="/reportes" element={<Reportes />} />
    </Routes>
  );
}

export default App;