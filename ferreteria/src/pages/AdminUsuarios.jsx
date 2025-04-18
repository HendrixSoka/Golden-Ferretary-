// src/pages/AdminUsuarios.jsx
const usuarios = [
    { id: 1, nombre: 'Juan Pérez', rol: 'Vendedor' },
    { id: 2, nombre: 'Ana Torres', rol: 'Administrador' },
  ];
  
  export default function AdminUsuarios() {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Gestión de Usuarios</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">ID</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Rol</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.id}</td>
                <td className="p-2">{u.nombre}</td>
                <td className="p-2">{u.rol}</td>
                <td className="p-2">
                  <button className="text-blue-600 hover:underline mr-2">Editar</button>
                  <button className="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  