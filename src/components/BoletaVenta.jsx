import React, { useRef } from 'react';

const BoletaVenta = ({ venta }) => {
  const boletaRef = useRef();

  const imprimir = () => {
    const contenido = boletaRef.current.innerHTML;
    const ventana = window.open('', '', 'width=300,height=600');
    ventana.document.write(`
      <html>
        <head>
          <title>Boleta de Venta</title>
          <style>
            body {
              font-family: monospace;
              font-size: 12px;
              width: 58mm;
              margin: 0 auto;
            }
            .ticket {
              text-align: center;
              padding: 10px;
            }
            .line {
              border-top: 1px dashed #000;
              margin: 5px 0;
            }
            .item {
              display: flex;
              justify-content: space-between;
              margin: 2px 0;
            }
            .total {
              font-weight: bold;
              margin-top: 10px;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${contenido}
        </body>
      </html>
    `);
    ventana.document.close();
  };

  return (
    <div className="mt-6">
      {/* 🔵 Vista visible: tabla simple */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-bold mb-2">Venta realizada</h3>
        <p><strong>Fecha:</strong> {venta.fecha}</p>
        <table className="w-full mt-3 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left py-1">Producto</th>
              <th className="text-center py-1">Cant.</th>
              <th className="text-right py-1">Precio</th>
              <th className="text-right py-1">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {venta.productos.map((p, i) => (
              <tr key={i}>
                <td className="py-1">{p.nombre}</td>
                <td className="text-center py-1">{p.cantidad}</td>
                <td className="text-right py-1">S/ {p.precio.toFixed(2)}</td>
                <td className="text-right py-1">
                  S/ {(p.cantidad * p.precio).toFixed(2)}
                </td>
              </tr>
            ))}
            <tr className="font-bold border-t">
              <td colSpan="3" className="text-right py-1">Total:</td>
              <td className="text-right py-1">S/ {venta.total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 🔵 Botón imprimir */}
      <div className="mt-4">
        <button
          onClick={imprimir}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          Imprimir Boleta
        </button>
      </div>

      {/* 🔴 Boleta oculta solo para impresión */}
      <div ref={boletaRef} style={{ display: 'none' }}>
        <div className="ticket">
          <p>********* PRECUENTA *********</p>
          <p><strong>CHIFA GAARA</strong></p>
          <p>RAZON SOCIAL</p>
          <p>00000000000</p>
          <p>DIRECCION - SEDE</p>
          <p>Tel: 948272858</p>

          <div className="line"></div>

          <p>FECHA: {venta.fecha}</p>
          <p>CAJA: {venta.caja}</p>
          <p>VENDEDOR: {venta.vendedor}</p>
          <p>MESA: {venta.mesa}</p>

          <div className="line"></div>

          {venta.productos.map((p, i) => (
            `<div class="item">
              <span>${p.cantidad.toFixed(1)} ${p.nombre}</span>
              <span>S/ ${(p.precio * p.cantidad).toFixed(2)}</span>
            </div>`
          )).join('')}

          <div className="line"></div>

          <div className="item total">
            <span>TOTAL:</span>
            <span>S/ {venta.total.toFixed(2)}</span>
          </div>

          <div className="line"></div>

          <p style={{ fontSize: '10px' }}>
            * Este documento NO es comprobante de pago<br />
            solicítelo en caja
          </p>

          <p style={{ fontSize: '11px', marginTop: '8px' }}>
            Un software de TriNetSoft<br />
            www.trinetsoft.com<br />
            ¡Gracias por su preferencia!
          </p>

          <p>*-*</p>
        </div>
      </div>
    </div>
  );
};

export default BoletaVenta;
