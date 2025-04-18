// src/pages/ProductosTable.jsx
const productos = [
    { id: 1, nombre: 'Martillo', stock: 12, precio: 25 },
    { id: 2, nombre: 'Taladro', stock: 5, precio: 120 },
  ];
  
  export default function ProductosTable() {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Inventario de Productos</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">ID</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Precio</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.id}</td>
                <td className="p-2">{p.nombre}</td>
                <td className="p-2">{p.stock}</td>
                <td className="p-2">${p.precio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  