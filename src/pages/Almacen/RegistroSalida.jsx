import React, { useState, useEffect } from "react";
import ModalBase from "../../components/ModalBase";
import { ApiWebURL } from "../../utils/Index";

const RegistroSalida = () => {
  const [openModal, setOpenModal] = useState(false);

  const [productos, setProductos] = useState([]);
  const [salidas, setSalidas] = useState([]);

  const [destino, setDestino] = useState("");
  const [usuario, setUsuario] = useState("");
  const [items, setItems] = useState([{ productId: "", qty: 1, unitPrice: 0 }]);

  // ===============================
  // 1) Cargar datos desde el backend
  // ===============================
  const cargarDatos = async () => {
    try {
      const resProductos = await fetch(`${ApiWebURL}/products`);
      const dataProductos = await resProductos.json();
      setProductos(dataProductos);

      const resSalidas = await fetch(`${ApiWebURL}/sales`);
      const dataSalidas = await resSalidas.json();
      setSalidas(dataSalidas);

    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // ======================================
  // 2) Manejo de items dentro del formulario
  // ======================================
  const agregarItem = () => {
    setItems([...items, { productId: "", qty: 1, unitPrice: 0 }]);
  };

  const actualizarItem = (index, campo, valor) => {
    const copia = [...items];
    copia[index][campo] = valor;
    setItems(copia);
  };

  // ======================================
  // 3) Enviar nueva salida al backend
  // ======================================
  const registrarSalida = async () => {
    const salida = { destino, usuario, items };

    try {
      const res = await fetch(`${ApiWebURL}/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(salida),
      });

      if (!res.ok) throw new Error("Error en el registro");

      await cargarDatos(); // refrescar tabla

      // limpiar formulario
      setDestino("");
      setUsuario("");
      setItems([{ productId: "", qty: 1, unitPrice: 0 }]);
      setOpenModal(false);

    } catch (error) {
      console.error(error);
      alert("No se pudo registrar la salida");
    }
  };

  // ======================================
  // 4) Expandir cada salida por items
  // ======================================
  const salidasExpand = salidas.flatMap(salida =>
    salida.items.map(item => ({
      id: salida.id,
      fecha: salida.fecha,
      destino: salida.destino,
      usuario: salida.usuario,
      qty: item.qty,
      unitPrice: item.unitPrice,
      total: item.qty * item.unitPrice,
      producto:
        productos.find(p => p.id === item.productId)?.nombre || "Desconocido",
    }))
  );

  // ======================================
  // 5) UI
  // ======================================
  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Registro de Salidas del Almacén</h2>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          onClick={() => setOpenModal(true)}
        >
          Registrar Salida
        </button>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">ID</th>
              <th className="px-4 py-2 border-b">Producto</th>
              <th className="px-4 py-2 border-b">Cantidad</th>
              <th className="px-4 py-2 border-b">Unitario</th>
              <th className="px-4 py-2 border-b">Total</th>
              <th className="px-4 py-2 border-b">Destino</th>
              <th className="px-4 py-2 border-b">Usuario</th>
              <th className="px-4 py-2 border-b">Fecha</th>
            </tr>
          </thead>

          <tbody>
            {salidasExpand.map((s, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{s.id}</td>
                <td className="px-4 py-2 border-b">{s.producto}</td>
                <td className="px-4 py-2 border-b">{s.qty}</td>
                <td className="px-4 py-2 border-b">S/ {s.unitPrice}</td>
                <td className="px-4 py-2 border-b font-semibold">S/ {s.total}</td>
                <td className="px-4 py-2 border-b">{s.destino}</td>
                <td className="px-4 py-2 border-b">{s.usuario}</td>
                <td className="px-4 py-2 border-b">{s.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <ModalBase open={openModal} onClose={() => setOpenModal(false)}>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Registrar Salida</h3>

          <div className="mb-3">
            <label>Destino:</label>
            <input
              className="border w-full p-2 rounded"
              value={destino}
              onChange={e => setDestino(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Usuario:</label>
            <input
              className="border w-full p-2 rounded"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
            />
          </div>

          <h4 className="font-semibold mb-2 mt-3">Items</h4>

          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 mb-2">
              {/* PRODUCTO */}
              <select
                className="border p-2 rounded"
                value={item.productId}
                onChange={e =>
                  actualizarItem(index, "productId", Number(e.target.value))
                }
              >
                <option value="">Seleccione producto</option>

                {productos.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>

              {/* CANTIDAD */}
              <input
                type="number"
                className="border p-2 rounded"
                value={item.qty}
                onChange={e =>
                  actualizarItem(index, "qty", Number(e.target.value))
                }
              />

              {/* UNIT PRICE */}
              <input
                type="number"
                className="border p-2 rounded"
                value={item.unitPrice}
                onChange={e =>
                  actualizarItem(index, "unitPrice", Number(e.target.value))
                }
              />
            </div>
          ))}

          <button className="text-blue-600 underline" onClick={agregarItem}>
            + Agregar item
          </button>

          <div className="flex justify-end mt-4">
            <button
              className="bg-gray-300 px-4 py-2 rounded mr-2"
              onClick={() => setOpenModal(false)}
            >
              Cancelar
            </button>

            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={registrarSalida}
            >
              Guardar
            </button>
          </div>
        </div>
      </ModalBase>
    </div>
  );
};

export default RegistroSalida;
