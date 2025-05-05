import { Link } from 'react-router-dom';
import maderaImg from '../assets/maderat.jpg';

const Header = () => {
  return (
    <header className="bg-cover bg-center border-b-4 border-black w-full" style={{ backgroundImage: `url(${maderaImg})` }}>
      <div className="flex justify-between items-center px-6 py-4">
        <h3 className="font-pixel text-3xl text-yellow-500 font-bold drop-shadow-[2px_2px_0px_black]">
          <Link to="/">Ferretería Golden</Link>
        </h3>
        <Link to='/Login' className="font-pixel bg-yellow-500 text-black border-4 border-black shadow-[4px_4px_0px_black] px-4 py-2 active:shadow-[2px_2px_0px_black] active:translate-x-1 active:translate-y-1">
          Iniciar Sesion
        </Link>
      </div>
      <nav>
        <ul className="flex justify-center space-x-6">
          <li>
            <Link
              to="/"
              className="font-pixel text-black cursor-pointer px-4 py-2 border-4 border-black bg-blue-300 shadow-[4px_4px_0px_black] hover:bg-blue-400 active:shadow-[2px_2px_0px_black] active:translate-x-1 active:translate-y-1"
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/OnlineStore"
              className="relative font-pixel text-black cursor-pointer px-6 py-3 bg-blue-300 border-4 border-black text-center
                hover:bg-blue-400 active:translate-x-[2px] active:translate-y-[2px] 
                before:absolute before:w-2 before:h-2 before:bg-black before:top-0 before:left-0 
                after:absolute after:w-2 after:h-2 after:bg-black after:top-0 after:right-0 
                before:content-[''] before:block after:content-[''] after:block"
            >
              Catálogo de Productos
            </Link>
          </li>
          <li>
            <Link
              to="/productos"
              className="font-pixel text-black cursor-pointer px-4 py-2 border-4 border-black bg-blue-300 shadow-[4px_4px_0px_black] hover:bg-blue-400 active:shadow-[2px_2px_0px_black] active:translate-x-1 active:translate-y-1"
            >
              Productos
            </Link>
          </li>
          <li>
            <Link
              to="/usuarios"
              className="font-pixel text-black cursor-pointer px-4 py-2 border-4 border-black bg-blue-300 shadow-[4px_4px_0px_black] hover:bg-blue-400 active:shadow-[2px_2px_0px_black] active:translate-x-1 active:translate-y-1"
            >
              Usuarios
            </Link>
          </li>
          <li>
            <Link
              to="/proveedores"
              className="font-pixel text-black cursor-pointer px-4 py-2 border-4 border-black bg-blue-300 shadow-[4px_4px_0px_black] hover:bg-blue-400 active:shadow-[2px_2px_0px_black] active:translate-x-1 active:translate-y-1"
            >
              Proveedores
            </Link>
          </li>
          <li>
            <Link
              to="/ventas"
              className="font-pixel text-black cursor-pointer px-4 py-2 border-4 border-black bg-blue-300 shadow-[4px_4px_0px_black] hover:bg-blue-400 active:shadow-[2px_2px_0px_black] active:translate-x-1 active:translate-y-1"
            >
              Ventas
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;


  