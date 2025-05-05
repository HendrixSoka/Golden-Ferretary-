
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useRef } from "react"
import Header from './components/header'
import OnlineStore from './pages/OnlineStore';
import Login from './pages/Login';
import VentaForm from './pages/VentaForm'; 
import AdminUsuarios from './pages/AdminUsuarios'; 
import AdminPedidos from './pages/AdminPedidos';
import ProductosTable from './pages/ProductosTable';
import AdminProveedores from './pages/AdminProveedores';
import Inicio from './pages/Inicio';
import WallBrick from './assets/brick-wall.webp'
import Toast from "./components/toast";
function App() {
  const toastRef = useRef();

  const showToast = (msg) => {
    toastRef.current?.showToast(msg);
  };

  return (
    <Router>
      <div className="text-black w-full h-full">
      <Routes>
        <Route path="/login" element={<Login />} /> 
      </Routes>
        <Header />
        <Toast ref={toastRef} />
        <main className="p-6 bg-repeat" style={{ backgroundImage: `url(${WallBrick})` }}>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/OnlineStore" element={<OnlineStore />} />
            <Route path="/ventas" element={<VentaForm showToast={showToast} />} />
            <Route path="/usuarios" element={<AdminUsuarios showToast={showToast} />} />
            <Route path="/pedidos" element={<AdminPedidos showToast={showToast} />} />
            <Route path="/productos" element={< ProductosTable showToast={showToast} />} />
            <Route path="/productosTable" element={<ProductosTable showToast={showToast} />} />
            <Route path="/proveedores" element={<AdminProveedores showToast = {showToast}/>}/>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
