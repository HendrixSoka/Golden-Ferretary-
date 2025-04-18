// src/pages/VentaForm.jsx
import React, { useState } from "react";

export default function VentaForm() {
  const [cliente, setCliente] = useState("");
  const [productoActual, setProductoActual] = useState({ nombre: "", cantidad: 1, precio: 0 });
  const [carrito, setCarrito] = useState([]);

  const agregarProducto = () => {
    if (productoActual.nombre && productoActual.cantidad > 0 && productoActual.precio > 0) {
      setCarrito([...carrito, productoActual]);
      setProductoActual({ nombre: "", cantidad: 1, precio: 0 });
    }
  };

  const totalVenta = carrito.reduce((total, p) => total + p.cantidad * p.precio, 0);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Realizar Venta</h2>

      <input
        type="text"
        placeholder="Nombre del cliente"
        className="border p-2 rounded w-full mb-4"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
      />

      <div className="grid grid-cols-3 gap-2 mb-4">
        <input
          type="text"
          placeholder="Producto"
          className="border p-2 rounded"
          value={productoActual.nombre}
          onChange={(e) => setProductoActual({ ...productoActual, nombre: e.target.value })}
        />
        <input
          type="number"
          placeholder="Cantidad"
          className="border p-2 rounded"
          value={productoActual.cantidad}
          onChange={(e) => setProductoActual({ ...productoActual, cantidad: parseInt(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Precio unitario"
          className="border p-2 rounded"
          value={productoActual.precio}
          onChange={(e) => setProductoActual({ ...productoActual, precio: parseFloat(e.target.value) })}
        />
      </div>

      <button
        type="button"
        onClick={agregarProducto}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mb-6"
      >
        Agregar al carrito
      </button>

      {carrito.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Carrito</h3>
          <ul className="space-y-2">
            {carrito.map((p, index) => (
              <li key={index} className="flex justify-between border p-2 rounded">
                <span>{p.nombre} (x{p.cantidad})</span>
                <span>{(p.cantidad * p.precio).toFixed(2)} Bs</span>
              </li>
            ))}
          </ul>
          <div className="text-right mt-2 font-bold">
            Total: {totalVenta.toFixed(2)} Bs
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          // Aquí iría el envío de los datos al backend
          console.log({ cliente, carrito });
        }}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
      >
        Confirmar Venta
      </button>
    </div>
  );
}
