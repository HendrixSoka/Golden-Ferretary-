
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header'
import OnlineStore from './pages/OnlineStore';
import Login from './pages/Login';
import VentaForm from './pages/VentaForm'; 
import AdminUsuarios from './pages/AdminUsuarios'; 
import AdminPedidos from './pages/AdminPedidos';
import ProductosTable from './pages/ProductosTable';
import Inicio from './pages/Inicio';
import WallBrick from './assets/brick-wall.webp'
function App() {
  return (
    <Router> 
      <Routes>
      <Route path="/login" element={<Login />} /> 
      </Routes>
      
      <div className=" text-black w-full h-full"  >
        <Header />
        <main className="p-6 bg-repeat" style={{ backgroundImage: `url(${WallBrick})`  }}>
          <Routes>
                <Route path="/" element={< Inicio/>} /> 
                <Route path="/OnlineStore" element={<OnlineStore />} /> 
                
                <Route path="/ventas" element={<VentaForm />} /> 
                
                <Route path="/usuarios" element={<AdminUsuarios />} /> 
                <Route path="/pedidos" element={<AdminPedidos />} /> 
                <Route path="/productos" element={<ProductosTable />} /> 

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App
