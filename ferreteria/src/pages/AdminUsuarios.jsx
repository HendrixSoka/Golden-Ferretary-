// src/pages/AdminUsuarios.jsx
import { useEffect, useState } from "react";

export default function AdminUsuarios({ showToast }) {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    id_usuario: null,
    nombre: "",
    correo: "",
    contraseña: "",
    cargo: "Cliente",
  });
  const [search, setSearch] = useState("");
  
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);


  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = () => {
    fetch("http://localhost:8000/usuarios")
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((error) => console.error("Error al obtener usuarios:", error));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = modoEdicion 
        ? `http://localhost:8000/usuarios/${usuarioEditando}` // Ruta de actualización
        : "http://localhost:8000/usuarios";
      
      const method = modoEdicion ? "PUT" : "POST";
      
      const dataToSend = { ...formData };
      if (!modoEdicion) {
        delete dataToSend.id_usuario;
      }
      console.log("Enviando:", JSON.stringify(dataToSend));
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
  
      if (!response.ok) throw new Error("Error en la solicitud");
  
      showToast(modoEdicion ? "Usuario actualizado" : "Usuario agregado");
        
      setFormData({
        nombre: "",
        correo: "",
        contraseña: "",
        cargo: "Gerente",
      });
      setModoEdicion(false);
      setUsuarioEditando(null);
      fetchUsuarios();
    } catch (error) {
      console.error("Error:", error);
      showToast("Error al guardar usuario");
    }
  };
  
  
  

  const handleEdit = (u) => {
    setFormData({
      id_usuario: u.id_usuario ?? null,
      nombre: u.nombre ?? "",
      correo: u.correo ?? "",
      contraseña: u.contraseña ?? "",
      cargo: u.cargo ?? "Cliente",
    });
    setModoEdicion(true);
    setUsuarioEditando(u.id_usuario);
  };
  

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      const response = await fetch(`http://localhost:8000/usuarios/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.detail || "Error desconocido al eliminar");
      }
  
      showToast("Usuario eliminado correctamente");
      fetchUsuarios(); 
    } catch (error) {
      console.error("Error en eliminar usuario:", error.message);
      showToast(`${error.message}`);
    }
  };
  
  const handlePrueba = async () => {
    try {
      const response = await fetch('http://localhost:8000/prueba', {
        method: 'DELETE',
      });
      const data = await response.json();
      console.log('Respuesta de prueba:', data);
    } catch (error) {
      console.error('Error en prueba', error);
    }
  };

  const usuariosFiltrados = usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 flex flex-col md:flex-row gap-4">
      {/* Formulario */}
      <div className="w-full md:w-1/3 border p-4 rounded shadow">
        <h2 className="text-lg font-bold mb-4">{formData.id_usuario ? "Editar Usuario" : "Agregar Usuario"}</h2>
        <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-3">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="border p-2 rounded"
            autoComplete="off"
          />
          <input
            type="email"
            name="correo"
            placeholder="Correo"
            value={formData.correo}
            onChange={handleChange}
            required
            className="border p-2 rounded"
            autoComplete="off"
          />
          <input
            type="password"
            name="contraseña"
            placeholder="Contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            className="border p-2 rounded"
            required={!formData.id_usuario} // solo requerido si es nuevo
            autoComplete="off"
          />
          <select
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          >
            <option value="Cliente">Cliente</option>
            <option value="Gerente">Gerente</option>
            <option value="Cajero">Cajero</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {formData.id_usuario ? "Actualizar Usuario" : "Agregar Usuario"}
          </button>
          {modoEdicion && (
            <button
              onClick={() => {
                setFormData({
                  id_usuario: null,
                  nombre: "",
                  correo: "",
                  contraseña: "",
                  cargo: "Cliente",
                });
                setModoEdicion(false);
                setProductoEditando(null);
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded mr-2"
            >
              Cancelar edición
            </button>
          )}

        </form>
      </div>

      {/* Tabla */}
      <div className="flex-1 overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Gestión de Usuarios</h2>

        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded mb-4 w-full"
        />

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">ID</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Correo</th>
              <th className="p-2">Cargo</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((u) => (
              <tr key={u.id_usuario} className="border-t">
                <td className="p-2">{u.id_usuario}</td>
                <td className="p-2">{u.nombre}</td>
                <td className="p-2">{u.correo}</td>
                <td className="p-2">{u.cargo}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(u)}
                    className="bg-yellow-400 px-2 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(u.id_usuario)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
