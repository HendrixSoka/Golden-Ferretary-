import React from "react";
import product1 from "../assets/sierra.jpg";
import product2 from "../assets/drill.jpg";
import product3 from "../assets/tool.jpg";
import product4 from "../assets/box.jpg";

const offers = [
  {
    image: product1,
    title: "¡Sierra Eléctrica en Oferta!",
    description: "Aprovecha un 20% de descuento esta semana."
  },
  {
    image: product2,
    title: "Taladro de Alta Potencia",
    description: "Perfecto para trabajos exigentes. Solo por Bs. 320."
  },
  {
    image: product3,
    title: "Set de Herramientas Manuales",
    description: "El combo ideal para tu caja de herramientas."
  },
  {
    image: product4,
    title: "Caja de Herramientas Organizada",
    description: "Mantén todo en orden por solo Bs. 150."
  }
];

export default function Inicio() {
  return (
    <div className="p-6 space-y-8">
      <section className="text-center">
        <h1 className="text-3xl font-bold text-white">Bienvenido a Ferretería Golden</h1>
        <p className="text-amber-50">Las mejores ofertas y herramientas para tu hogar y trabajo</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-amber-50 mb-4">Ofertas de la Semana</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {offers.map((offer, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800">{offer.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{offer.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 text-center">
        <h2 className="text-xl font-semibold text-gray-700">Últimas Noticias</h2>
        <p className="text-gray-600 mt-2">Próximamente abriremos una nueva sucursal en La Paz 🎉</p>
      </section>
    </div>
  );
}
