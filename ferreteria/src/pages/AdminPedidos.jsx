// src/pages/AdminPedidos.jsx
export default function AdminPedidos() {
    return (
      <div className="p-4 max-w-md">
        <h2 className="text-xl font-bold mb-4">Solicitar Productos</h2>
        <form className="grid gap-4">
          <input type="text" placeholder="Producto" className="border p-2 rounded" />
          <input type="number" placeholder="Cantidad" className="border p-2 rounded" />
          <textarea placeholder="Observaciones" className="border p-2 rounded" />
          <button className="bg-green-600 text-white py-2 rounded hover:bg-green-700">Enviar Pedido</button>
        </form>
      </div>
    );
  }
  