import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import dayjs from 'dayjs';
const ventasMock = [
    {
        id: 1,
        fecha: '2025-01-05',
        hora: '09:00 AM',
        productos: [
            { nombre: 'Laptop', cantidad: 1, precio: 2500 },
            { nombre: 'Mouse', cantidad: 1, precio: 45 },
        ],
    },
    {
        id: 2,
        fecha: '2025-02-15',
        hora: '10:30 AM',
        productos: [
            { nombre: 'Teclado', cantidad: 2, precio: 150 },
            { nombre: 'Monitor', cantidad: 1, precio: 1200 },
        ],
    },
    {
        id: 3,
        fecha: '2025-03-20',
        hora: '11:15 AM',
        productos: [
            { nombre: 'Webcam', cantidad: 1, precio: 180 },
            { nombre: 'Mousepad', cantidad: 2, precio: 20 },
        ],
    },
    {
        id: 4,
        fecha: '2025-04-10',
        hora: '01:00 PM',
        productos: [
            { nombre: 'Impresora', cantidad: 1, precio: 850 },
        ],
    },
    {
        id: 5,
        fecha: '2025-05-05',
        hora: '02:45 PM',
        productos: [
            { nombre: 'Switch HDMI', cantidad: 1, precio: 90 },
        ],
    },
    {
        id: 6,
        fecha: '2025-06-18',
        hora: '03:30 PM',
        productos: [
            { nombre: 'Tablet', cantidad: 1, precio: 1500 },
            { nombre: 'Lápiz óptico', cantidad: 1, precio: 120 },
        ],
    },
    {
        id: 7,
        fecha: '2025-07-10',
        hora: '10:30 AM',
        productos: [
            { nombre: 'Laptop', cantidad: 1, precio: 2500 },
            { nombre: 'Mouse', cantidad: 2, precio: 50 },
        ],
    },
    {
        id: 8,
        fecha: '2025-08-22',
        hora: '04:00 PM',
        productos: [
            { nombre: 'Disco Duro', cantidad: 2, precio: 350 },
        ],
    },
    {
        id: 9,
        fecha: '2025-09-01',
        hora: '12:15 PM',
        productos: [
            { nombre: 'Memoria RAM', cantidad: 2, precio: 200 },
        ],
    },
    {
        id: 10,
        fecha: '2025-10-12',
        hora: '09:45 AM',
        productos: [
            { nombre: 'Router WiFi', cantidad: 1, precio: 300 },
            { nombre: 'Cable Ethernet', cantidad: 3, precio: 25 },
        ],
    },
];


function Reportes() {
    const [filtroTipo, setFiltroTipo] = useState('diario');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    // Filtrado según fechas
    const ventasFiltradas = ventasMock.filter((venta) => {
        const fechaVenta = dayjs(venta.fecha);
        const desde = fechaInicio ? dayjs(fechaInicio) : null;
        const hasta = fechaFin ? dayjs(fechaFin) : null;

        if (desde && hasta) return fechaVenta.isBetween(desde, hasta, 'day', '[]');
        if (desde) return fechaVenta.isAfter(desde.subtract(1, 'day'));
        if (hasta) return fechaVenta.isBefore(hasta.add(1, 'day'));

        return true;
    });

    const generarPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text('Reporte de Ventas', 14, 15);

        autoTable(doc, {
            startY: 25,
            head: [['# Venta', 'Fecha', 'Hora', 'Producto(s)', 'Total']],
            body: ventasFiltradas.map((venta) => {
                const productos = venta.productos.map((p) => `${p.nombre} (x${p.cantidad})`).join(', ');
                const total = venta.productos.reduce((acc, p) => acc + p.cantidad * p.precio, 0);
                return [venta.id, venta.fecha, venta.hora, productos, `S/ ${total.toFixed(2)}`];
            }),
        });

        doc.save('reporte_ventas.pdf');
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Reportes Personalizados</h1>

            {/* Filtros */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <select
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="diario">Diario</option>
                    <option value="semanal">Semanal</option>
                    <option value="mensual">Mensual</option>
                    <option value="bimestral">Bimestral</option>
                    <option value="personalizado">Personalizado</option>
                </select>

                <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="border p-2 rounded"
                />
                <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="border p-2 rounded"
                />

                <button
                    onClick={generarPDF}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Emitir PDF
                </button>
            </div>

            {/* Lista de resultados */}
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2"># Venta</th>
                            <th className="px-4 py-2">Fecha</th>
                            <th className="px-4 py-2">Hora</th>
                            <th className="px-4 py-2">Productos</th>
                            <th className="px-4 py-2">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventasFiltradas.length > 0 ? (
                            ventasFiltradas.map((venta) => {
                                const total = venta.productos.reduce(
                                    (acc, p) => acc + p.cantidad * p.precio,
                                    0
                                );
                                return (
                                    <tr key={venta.id} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-2">{venta.id}</td>
                                        <td className="px-4 py-2">{venta.fecha}</td>
                                        <td className="px-4 py-2">{venta.hora}</td>
                                        <td className="px-4 py-2">
                                            {venta.productos.map((p) => `${p.nombre} x${p.cantidad}`).join(', ')}
                                        </td>
                                        <td className="px-4 py-2">S/ {total.toFixed(2)}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-gray-500">
                                    No hay ventas para este filtro.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Reportes;
