import { useState } from "react";
import product1 from "../assets/produc1.png";
import product2 from "../assets/produc2.png";
import product3 from "../assets/produc3.png";
import product4 from "../assets/produc4.png";
const products = [
  { id: 1, name: "Martillo", category: "Herramientas Manuales", image : product1},
  { id: 2, name: "Destornillador", category: "Herramientas Manuales" , image :product2},
  { id: 3, name: "Taladro", category: "Herramientas Eléctricas" , image : product3},
  { id: 4, name: "Sierra Circular", category: "Herramientas Eléctricas" , image : product4}
];

export default function OnlineStore() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredProducts =
    selectedCategory === "Todos"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="flex h-full">
      <div className="w-1/4 bg-gray-800 text-white p-4">
        <h2 className="text-lg font-bold mb-4">Categorías</h2>
        <ul>
          {["Todos", "Herramientas Manuales", "Herramientas Eléctricas"].map((category) => (
            <li
              key={category}
              className={`cursor-pointer p-2 rounded ${
                selectedCategory === category ? "bg-gray-600" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </div>

      {/* Product Display */}
      <div className="w-3/4 p-4">
        <h2 className="text-xl font-bold mb-4">Productos</h2>
        <div className="grid grid-cols-2 gap-1 ">
          {filteredProducts.map((product) => (
            <div key={product.id} className="p-1 border rounded shadow w-60 aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${product.image})` }}>
              {product.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
