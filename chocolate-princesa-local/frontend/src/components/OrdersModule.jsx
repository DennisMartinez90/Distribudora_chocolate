/**
 * ====================================================================
 * PROYECTO: Sistema de Gestión y Distribución - "Chocolate Princesa" (Santa Cruz, Bolivia)
 * PROPIETARIO / ESTUDIANTE: Dennis Yohan Martinez Illescas
 * CÓDIGO / REGISTRO: Dennis Yohan Martinez Illescas | REG: 219034821
 * ENTORNO: 100% Local (Módulo de Pedidos y Ventas)
 * ====================================================================
 */

import React, { useState } from 'react';
import { ShoppingCart, Plus, Trash2, CheckCircle2, AlertCircle, Sparkles, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrdersModule({
  orders,
  clients,
  products,
  onCreateOrder,
  onDeleteOrder
}) {
  const [clientId, setClientId] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  // Obtener producto seleccionado para calcular precio y validar stock
  const selectedProduct = products.find((p) => p.id === parseInt(productId, 10));
  const selectedClient = clients.find((c) => c.id === parseInt(clientId, 10));

  const qtyNumber = parseInt(quantity, 10) || 0;
  const unitPrice = selectedProduct ? selectedProduct.price : 0;
  const calculatedTotal = selectedProduct ? (qtyNumber * unitPrice).toFixed(2) : '0.00';
  const isStockInsufficient = selectedProduct && qtyNumber > selectedProduct.stock;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientId || !productId || qtyNumber <= 0) {
      setNotification({ type: 'error', text: 'Por favor seleccione el cliente, el producto y una cantidad válida.' });
      return;
    }

    if (isStockInsufficient) {
      setNotification({
        type: 'error',
        text: `Stock insuficiente en almacén. Solo quedan ${selectedProduct.stock} unidades de "${selectedProduct.name}".`
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await onCreateOrder({
        client_id: parseInt(clientId, 10),
        product_id: parseInt(productId, 10),
        quantity: qtyNumber,
        status: 'Completado'
      });

      // Efecto visual de celebración al registrar venta exitosa
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#D4AF37', '#F59E0B', '#3D1C0A', '#52B788']
        });
      } catch {
        // Fallback si no está disponible
      }

      setNotification({
        type: 'success',
        text: `¡Pedido registrado con éxito! Se despacharon ${qtyNumber} unidades para ${selectedClient?.business_name}. Stock actualizado en tiempo real.`
      });

      setClientId('');
      setProductId('');
      setQuantity(1);
    } catch (err) {
      setNotification({ type: 'error', text: err.message || 'Error al procesar el pedido.' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  return (
    <div className="space-y-6">

      {notification && (
        <div className={`p-3.5 rounded-xl text-sm font-medium flex items-center gap-2 border ${
          notification.type === 'success'
            ? 'bg-selva-900/10 text-selva-800 border-selva-700/40'
            : 'bg-red-50 text-red-800 border-red-300'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-selva-700 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Formulario de Nuevo Pedido */}
      <div className="bg-white rounded-2xl p-5 border border-cacao-100 shadow-md">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
          <div className="p-2 bg-oro-500/10 rounded-lg text-oro-700">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-cacao-950">
              Registrar Pedido y Despacho de Chocolates
            </h3>
            <p className="text-xs text-gray-500">
              Crea una venta para un cliente de Santa Cruz. El inventario se descuenta automáticamente de forma inmediata.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          
          {/* Selector de Cliente */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-cacao-900 mb-1">
              Cliente en Santa Cruz *
            </label>
            <select
              required
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-oro-500 bg-crema-50"
            >
              <option value="">-- Seleccionar Cliente Destino --</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.business_name} — {c.zone_address} ({c.business_type})
                </option>
              ))}
            </select>
          </div>

          {/* Selector de Producto */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-cacao-900 mb-1">
              Producto de Chocolate Princesa *
            </label>
            <select
              required
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-oro-500 bg-crema-50"
            >
              <option value="">-- Seleccionar Chocolate --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                  {p.name} — Bs. {Number(p.price).toFixed(2)} (Stock: {p.stock} uds) {p.stock <= 0 ? ' [AGOTADO]' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Cantidad solicitada */}
          <div>
            <label className="block text-xs font-semibold text-cacao-900 mb-1">
              Cantidad a Despachar *
            </label>
            <input
              type="number"
              min="1"
              max={selectedProduct ? selectedProduct.stock : undefined}
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 font-mono ${
                isStockInsufficient
                  ? 'border-red-500 bg-red-50 text-red-900 focus:ring-red-500'
                  : 'border-gray-200 bg-crema-50 focus:ring-oro-500'
              }`}
            />
            {selectedProduct && (
              <p className="text-[11px] text-gray-500 mt-1">
                Stock actual en almacén: <strong className={isStockInsufficient ? 'text-red-600' : 'text-selva-800'}>{selectedProduct.stock} uds</strong>
              </p>
            )}
          </div>

          {/* Resumen de cálculo automático */}
          <div className="bg-crema-200/70 border border-oro-600/30 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-cacao-900 uppercase tracking-wider">
              Precio Unitario
            </span>
            <div className="font-serif font-black text-cacao-950 text-base">
              Bs. {unitPrice.toFixed(2)}
            </div>
            <span className="text-[10px] text-gray-500">Por unidad despachada</span>
          </div>

          <div className="bg-gradient-to-br from-cacao-900 to-cacao-950 text-crema-50 border border-oro-600/60 rounded-xl p-3 flex flex-col justify-between shadow">
            <span className="text-[11px] font-semibold text-oro-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-oro-400" /> Total Calculado
            </span>
            <div className="font-serif font-black text-oro-400 text-xl">
              Bs. {calculatedTotal}
            </div>
            <span className="text-[10px] text-gray-300">Cálculo en Bolivianos</span>
          </div>

          {/* Advertencia de stock si supera el disponible */}
          {isStockInsufficient && (
            <div className="md:col-span-3 lg:col-span-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>
                <strong>Atención:</strong> La cantidad solicitada ({qtyNumber}) excede el stock disponible ({selectedProduct?.stock} uds). La base de datos rechazará la transacción.
              </span>
            </div>
          )}

          {/* Botón de envío */}
          <div className="md:col-span-3 lg:col-span-4 flex justify-end mt-2">
            <button
              type="submit"
              disabled={isSubmitting || isStockInsufficient || !selectedProduct}
              className="bg-oro-600 hover:bg-oro-500 text-cacao-950 font-bold px-7 py-2.5 rounded-lg text-sm shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{isSubmitting ? 'Procesando Despacho...' : 'Confirmar Pedido y Descontar Stock'}</span>
            </button>
          </div>

        </form>
      </div>

      {/* Historial de Pedidos */}
      <div className="bg-white rounded-2xl p-5 border border-cacao-100 shadow-md">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
          <div className="p-2 bg-cacao-900 text-oro-400 rounded-lg">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-cacao-950">
              Historial de Pedidos y Despachos ({orders.length})
            </h3>
            <p className="text-xs text-gray-500">
              Registro contable de ventas concretadas con los clientes de Santa Cruz.
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <p className="text-center py-8 text-gray-500 text-sm">No se han registrado pedidos todavía.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-cacao-950 text-crema-100 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 rounded-l-lg">ID Pedido</th>
                  <th className="py-3 px-4">Cliente (Santa Cruz)</th>
                  <th className="py-3 px-4">Producto Solicitado</th>
                  <th className="py-3 px-4 text-center">Cantidad</th>
                  <th className="py-3 px-4 text-right">Precio Unit. (Bs.)</th>
                  <th className="py-3 px-4 text-right">Total (Bs.)</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-center rounded-r-lg">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-crema-100/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-gray-500">#{o.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-cacao-950">{o.client?.business_name || `Cliente #${o.client_id}`}</div>
                      <div className="text-[11px] text-gray-500">{o.client?.zone_address || 'Santa Cruz'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-cacao-900">{o.product?.name || `Producto #${o.product_id}`}</div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-cacao-800">
                      {o.quantity} uds
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-gray-600">
                      Bs. {Number(o.unit_price).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-serif font-black text-oro-700 text-base">
                      Bs. {Number(o.total_price).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar el pedido #${o.id}? (Nota: No recupera el stock automáticamente).`)) {
                            onDeleteOrder(o.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
                        title="Eliminar pedido"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
