// src/pages/ProductosTable.jsx
import { useState, useEffect } from "react";

export default function ProductosTable({ showToast }) {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    nombre: "",
    descripcion:"",
    categoria: "",
    proveedor: "",       
    id_proveedor: "",   
    precio: "",
    imagen: null,   
    url_imagen: "" 
  });
  
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const res = await fetch("http://localhost:8000/proveedores/"); // Asegúrate que esta ruta exista
        const data = await res.json();
        setProveedores(data);
      } catch (error) {
        console.error("Error al cargar proveedores:", error);
      }
    };
  
    fetchProveedores();
    fetchProductos();
  }, []);

  const fetchProductos = () => {
    fetch("http://localhost:8000/productos/")
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => {
        console.error("Error al obtener productos:", err);
        showToast("Error al cargar productos");
      });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
  
    if (name === "imagen") {
      setFormData({ ...formData, imagen: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const url = modoEdicion
      ? `http://localhost:8000/productos/${productoEditando}`
      : "http://localhost:8000/productos/";
    const method = modoEdicion ? "PUT" : "POST";
  
    const formDataToSend = new FormData();
    formDataToSend.append("nombre", formData.nombre);
    formDataToSend.append("descripcion", formData.descripcion);
    formDataToSend.append("categoria", formData.categoria);
    formDataToSend.append("precio", formData.precio);
    
    formDataToSend.append("id_proveedor", formData.id_proveedor);
    if (formData.imagen) {
      formDataToSend.append("imagen", formData.imagen);
    }
  
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
    try {
      const res = await fetch(url, {
        method,
        body: formDataToSend,
      });
  
      if (!res.ok) throw new Error("Error al guardar producto");
  
      showToast(modoEdicion ? "Producto actualizado" : "Producto agregado");
      setFormData({
        id: null,
        nombre: "",
        descripcion:"",
        categoria: "",
        proveedor: "",
        id_proveedor:"",
        precio: "",
        imagen: null,
        url_imagen:""
      });
      setModoEdicion(false);
      setProductoEditando(null);
      fetchProductos();
    } catch (err) {
      console.error(err);
      showToast("Error al guardar producto");
    }
  };
  

  const handleEdit = (p) => {
    setFormData({
      id: p.id_producto,
      nombre: p.nombre,
      descripcion: p.descripcion,
      categoria: p.categoria,
      proveedor: p.proveedor.nombre,
      id_proveedor: p.proveedor.id_proveedor,
      precio: p.precio,
      imagen: null,
      url_imagen:""
    });
    setModoEdicion(true);
    setProductoEditando(p.id_producto);
  };
  

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      const res = await fetch(`http://localhost:8000/productos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar producto");

      showToast("Producto eliminado");
      fetchProductos();
    } catch (err) {
      console.error(err);
      showToast("Error al eliminar producto");
    }
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gestión de Productos</h2>
      <input
        type="text"
        placeholder="Buscar producto..."
        className="mb-4 p-1 border"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">ID</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Precio</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((p) => (
            <tr key={p.id_producto} className="border-t">
              <td className="p-2">{p.id_producto}</td>
              <td className="p-2">{p.nombre}</td>
              <td className="p-2">{p.categoria}</td>
              <td className="p-2">{p.id_proveedor}</td>
              <td className="p-2">{p.stock}</td>
              <td className="p-2">${p.precio}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-yellow-400 px-2 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          className="mr-2 border p-1"
        />
        <input
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Descripcion"
          className="mr-2 border p-1"
        />
        <input
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          placeholder="Categoria"
          className="mr-2 border p-1"
        />
        <select
          name="id_proveedor"
          value={formData.id_proveedor}
          onChange={handleChange}
          className="mr-2 border p-1"
        >
          <option value="">Selecciona un proveedor</option>
          {proveedores.map((prov) => (
            <option key={prov.id_proveedor} value={prov.id_proveedor}>
              {prov.nombre}
            </option>
          ))}
        </select>

        <input
          name="precio"
          type="number"
          value={formData.precio}
          onChange={handleChange}
          placeholder="Precio"
          className="mr-2 border p-1"
        />
        <div className="flex items-center space-x-2">
          <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition duration-200">
            Seleccionar imagen
            <input
              type="file"
              name="imagen"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </label>

          {formData.imagen && (
            <span className="text-sm text-gray-700">{formData.imagen.name}</span>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          {modoEdicion ? "Actualizar" : "Agregar"}
        </button>
        {modoEdicion && (
          <button
            onClick={() => {
              setFormData({
                id: null,
                nombre: "",
                descripcion: "",
                categoria: "",
                proveedor: "",
                id_proveedor: "",
                precio: "",
                imagen: null,
                url_imagen: ""
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
  );
}
