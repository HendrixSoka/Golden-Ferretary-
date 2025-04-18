import { useState } from "react";
import { motion } from "framer-motion";
import garageImage from "../assets/doorGarage.jpg";

export default function Login() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  return (
    <motion.div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${garageImage})` }}
      animate={isLoggedIn ? { scale: 1.5, opacity: 0 } : { scale: 1, opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {!isLoggedIn && (
        <form
          onSubmit={handleLogin}
          className="bg-gray-900 bg-opacity-80 p-6 rounded-lg text-white flex flex-col items-center"
        >
          <h2 className="text-2xl mb-4">Acceso al Garaje</h2>
          <input
            type="text"
            placeholder="Usuario"
            className="mb-3 p-2 rounded text-black w-64"
          />
          <div className="relative w-64">
            <input
              type="password"
              placeholder="Contraseña"
              className="p-2 rounded text-black w-full"
              style={{ position: "absolute", bottom: "-20px", left: "20px" }}
            />
          </div>
          <button className="bg-green-500 px-4 py-2 mt-6 rounded hover:bg-green-700">
            Iniciar Sesión
          </button>
        </form>
      )}
    </motion.div>
  );
}
