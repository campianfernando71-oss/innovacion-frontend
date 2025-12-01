import React, { useEffect, useState } from "react";
import ModalBase from "../components/ModalBase";
import { ApiWebURL } from "../utils/Index";
import { useAuth } from "../context/AuthContext";

const Movimientos = () => {
    const { user } = useAuth();

    const [movimientos, setMovimientos] = useState([]);
    const [detalles, setDetalles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [productos, setProductos] = useState([]);

    const [form, setForm] = useState({
        tipo: "ENTRADA",
        usuario_id: "",
        cliente_id: "",
        motivo: "",
        detalles: [{ producto_id: "", cantidad: "", precio: "" }],
    });

    // Cargar datos iniciales
    useEffect(() => {
        if (user) setForm(f => ({ ...f, usuario_id: user.id }));
        fetchMovimientos();
        fetchClientes();
        fetchProductos();
    }, [user]);

    // Obtener movimientos
    const fetchMovimientos = async () => {
        try {
            const res = await fetch(`${ApiWebURL}api/movimientos`);
            const data = await res.json();
            setMovimientos(data);
        } catch (err) {
            console.error(err);
        }
    };

    // Obtener clientes
    const fetchClientes = async () => {
        try {
            const res = await fetch(`${ApiWebURL}api/clientes`);
            const data = await res.json();
            setClientes(data);
        } catch (err) {
            console.error(err);
        }
    };

    // Obtener productos
    const fetchProductos = async () => {
        try {
            const res = await fetch(`${ApiWebURL}api/productos`);
            const data = await res.json();
            setProductos(data);
        } catch (err) {
            console.error(err);
        }
    };

    // Obtener detalles de un movimiento
    const fetchDetalles = async (id) => {
        try {
            const res = await fetch(`${ApiWebURL}api/movimientos/${id}`);
            const data = await res.json();
            setDetalles(data.detalles);
            setShowModal(true);
        } catch (err) {
            console.error(err);
        }
    };

    // Manejar cambios en inputs
    const handleInputChange = (e, index, field) => {
        const newDetalles = [...form.detalles];

        if (field === "producto_id") {
            const productoId = e.target.value;
            newDetalles[index][field] = productoId;

            // Buscar precio del producto seleccionado
            const productoSeleccionado = productos.find(p => p.id.toString() === productoId);
            newDetalles[index].precio = productoSeleccionado ? productoSeleccionado.precio : "";
        } else {
            newDetalles[index][field] = e.target.value;
        }

        setForm({ ...form, detalles: newDetalles });
    };


    // Agregar un nuevo detalle
    const addDetalle = () => {
        setForm({
            ...form,
            detalles: [...form.detalles, { producto_id: "", cantidad: "", precio: "" }],
        });
    };

    // Enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${ApiWebURL}api/movimientos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            alert(data.message);
            setForm({
                tipo: "ENTRADA",
                usuario_id: user?.id || "",
                cliente_id: "",
                motivo: "",
                detalles: [{ producto_id: "", cantidad: "", precio: "" }],
            });
            fetchMovimientos();
        } catch (err) {
            console.error(err);
        }
    };



    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold mb-4">Movimientos de Inventario</h1>

            {/* Formulario */}
            <form
                onSubmit={handleSubmit}
                className="p-6 border rounded-lg shadow-lg bg-white space-y-4"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tipo de movimiento */}
                    <select
                        name="tipo"
                        value={form.tipo}
                        onChange={handleInputChange}
                        className="border p-2 rounded"
                        required
                    >
                        <option value="ENTRADA">ENTRADA</option>
                        <option value="SALIDA">SALIDA</option>
                        <option value="VENTA">VENTA</option>
                        <option value="AJUSTE">AJUSTE</option>
                    </select>

                    {/* Cliente */}
                    <select
                        name="cliente_id"
                        value={form.cliente_id}
                        onChange={handleInputChange}
                        className="border p-2 rounded"
                    >
                        <option value="">Seleccione Cliente</option>
                        {clientes.map(c => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                    </select>

                    {/* Motivo */}
                    <input
                        type="text"
                        name="motivo"
                        placeholder="Motivo"
                        value={form.motivo}
                        onChange={handleInputChange}
                        className="border p-2 rounded"
                        required
                    />
                </div>

                {/* Detalles */}
                <h2 className="font-semibold text-lg mt-4">Detalles del Movimiento</h2>
                {form.detalles.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                        <select
                            value={item.producto_id}
                            onChange={(e) => handleInputChange(e, index, "producto_id")}
                            className="border p-2 rounded"
                            required
                        >
                            <option value="">Seleccione Producto</option>
                            {productos.map(p => (
                                <option key={p.id} value={p.id}>{p.nombre}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="Cantidad"
                            value={item.cantidad}
                            onChange={(e) => handleInputChange(e, index, "cantidad")}
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Precio"
                            value={item.precio}
                            className="border p-2 rounded bg-gray-100"
                            readOnly
                        />

                    </div>
                ))}

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={addDetalle}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                        Agregar Producto
                    </button>
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    >
                        Guardar Movimiento
                    </button>
                </div>
            </form>

            {/* Lista de movimientos */}
            <div className="overflow-x-auto">
                <table className="min-w-full border rounded-lg bg-white shadow">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border px-4 py-2">ID</th>
                            <th className="border px-4 py-2">Tipo</th>
                            <th className="border px-4 py-2">Usuario</th>
                            <th className="border px-4 py-2">Cliente</th>
                            <th className="border px-4 py-2">Motivo</th>
                            <th className="border px-4 py-2">Detalles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movimientos.map(mov => (
                            <tr key={mov.id}>
                                <td className="border px-4 py-2">{mov.id}</td>
                                <td className="border px-4 py-2">{mov.tipo}</td>
                                <td className="border px-4 py-2">{mov.usuario}</td>
                                <td className="border px-4 py-2">{mov.cliente || "-"}</td>
                                <td className="border px-4 py-2">{mov.motivo}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        className="bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600 transition"
                                        onClick={() => fetchDetalles(mov.id)}
                                    >
                                        Ver Detalles
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <ModalBase
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Detalles del Movimiento"
            >
                <ul className="space-y-2">
                    {detalles.map((d, idx) => (
                        <li key={idx} className="border-b pb-1">
                            {d.nombre} - Cantidad: {d.cantidad} - Precio: {d.precio}
                        </li>
                    ))}
                </ul>
            </ModalBase>
        </div>
    );
};

export default Movimientos;
