// src/pages/AdminProveedores.jsx
import { useEffect, useState } from "react";

export default function AdminProveedores({ showToast }) {
  const [proveedores, setProveedores] = useState([]);
  const [formData, setFormData] = useState({
    id_proveedor: null,
    nombre: "",
    correo: "",
    telefono: "",
    direccion: "",
  });
  const [search, setSearch] = useState("");

  const [modoEdicion, setModoEdicion] = useState(false);
  const [proveedorEditando, setProveedorEditando] = useState(null);

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = () => {
    fetch("http://localhost:8000/proveedores")
      .then((res) => res.json())
      .then((data) => setProveedores(data))
      .catch((error) => console.error("Error al obtener proveedores:", error));
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
        ? `http://localhost:8000/proveedores/${proveedorEditando}`
        : "http://localhost:8000/proveedores";
      const method = modoEdicion ? "PUT" : "POST";

      const dataToSend = { ...formData };
      if (!modoEdicion) delete dataToSend.id_proveedor;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) throw new Error("Error en la solicitud");

      showToast(modoEdicion ? "Proveedor actualizado" : "Proveedor agregado");

      setFormData({
        id_proveedor: null,
        nombre: "",
        correo: "",
        telefono: "",
        direccion: "",
      });
      setModoEdicion(false);
      setProveedorEditando(null);
      fetchProveedores();
    } catch (error) {
      console.error("Error:", error);
      showToast("Error al guardar proveedor");
    }
  };

  const handleEdit = (p) => {
    setFormData({
      id_proveedor: p.id_proveedor ?? null,
      nombre: p.nombre ?? "",
      correo: p.correo ?? "",
      telefono: p.telefono ?? "",
      direccion: p.direccion ?? "",
    });
    setModoEdicion(true);
    setProveedorEditando(p.id_proveedor);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este proveedor?")) return;
    try {
      const response = await fetch(`http://localhost:8000/proveedores/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error desconocido al eliminar");
      }

      showToast("Proveedor eliminado correctamente");
      fetchProveedores();
    } catch (error) {
      console.error("Error en eliminar proveedor:", error.message);
      showToast(`${error.message}`);
    }
  };

  const proveedoresFiltrados = proveedores.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 flex flex-col md:flex-row gap-4">
      {/* Formulario */}
      <div className="w-full md:w-1/3 border p-4 rounded shadow">
        <h2 className="text-lg font-bold mb-4">{modoEdicion ? "Editar Proveedor" : "Agregar Proveedor"}</h2>
        <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-3">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="email"
            name="correo"
            placeholder="Correo"
            value={formData.correo}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={formData.direccion}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {modoEdicion ? "Actualizar Proveedor" : "Agregar Proveedor"}
          </button>
          {modoEdicion && (
            <button
              type="button"
              onClick={() => {
                setFormData({
                  id_proveedor: null,
                  nombre: "",
                  correo: "",
                  telefono: "",
                  direccion: "",
                });
                setModoEdicion(false);
                setProveedorEditando(null);
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded"
            >
              Cancelar edición
            </button>
          )}
        </form>
      </div>

      {/* Tabla */}
      <div className="flex-1 overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Gestión de Proveedores</h2>

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
              <th className="p-2">Teléfono</th>
              <th className="p-2">Dirección</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedoresFiltrados.map((p) => (
              <tr key={p.id_proveedor} className="border-t">
                <td className="p-2">{p.id_proveedor}</td>
                <td className="p-2">{p.nombre}</td>
                <td className="p-2">{p.correo}</td>
                <td className="p-2">{p.telefono}</td>
                <td className="p-2">{p.direccion}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-yellow-400 px-2 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(p.id_proveedor)}
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
