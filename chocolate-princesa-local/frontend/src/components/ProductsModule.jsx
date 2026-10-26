/**
 * ====================================================================
 * PROYECTO: Sistema de Gestión y Distribución - "Chocolate Princesa" (Santa Cruz, Bolivia)
 * PROPIETARIO / ESTUDIANTE: Dennis Yohan Martinez Illescas
 * CÓDIGO / REGISTRO: Dennis Yohan Martinez Illescas | REG: 219034821
 * ENTORNO: 100% Local (Módulo de Productos)
 * ====================================================================
 */

import React, { useState } from 'react';
import { Package, Plus, Trash2, Eye, Award, Scale, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ProductsModule({
  products,
  categories,
  suppliers,
  onSelectProductFor3D,
  selectedProductId,
  onCreateProduct,
  onDeleteProduct
}) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [cocoaPercentage, setCocoaPercentage] = useState(70);
  const [weightGrams, setWeightGrams] = useState(100);
  const [categoryId, setCategoryId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !stock || !categoryId || !supplierId) {
      setNotification({ type: 'error', text: 'Por favor complete todos los campos obligatorios.' });
      return;
    }

    try {
      setIsSubmitting(true);
      await onCreateProduct({
        name,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        cocoa_percentage: parseInt(cocoaPercentage, 10),
        weight_grams: parseInt(weightGrams, 10),
        category_id: parseInt(categoryId, 10),
        supplier_id: parseInt(supplierId, 10),
        image_url: null
      });

      setNotification({ type: 'success', text: `¡Producto "${name}" agregado al catálogo con éxito!` });
      setName('');
      setPrice('');
      setStock('');
      setCocoaPercentage(70);
      setWeightGrams(100);
      setCategoryId('');
      setSupplierId('');
    } catch (err) {
      setNotification({ type: 'error', text: err.message || 'Error al crear el producto.' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner de Notificación */}
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

      {/* Formulario de Registro de Nuevo Producto */}
      <div className="bg-white rounded-2xl p-5 border border-cacao-100 shadow-md">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
          <div className="p-2 bg-oro-500/10 rounded-lg text-oro-700">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-cacao-950">
              Registrar Nuevo Chocolate Princesa
            </h3>
            <p className="text-xs text-gray-500">
              Añade una nueva referencia de chocolate al catálogo de distribución con su categoría y proveedor.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-cacao-900 mb-1">
              Nombre Comercial del Producto *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Tableta Princesa Real 70% Cacao Silvestre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-oro-500 bg-crema-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cacao-900 mb-1">
              Precio Unitario (Bs.) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs font-bold text-gray-400">Bs.</span>
              <input
                type="number"
                step="0.50"
                min="1"
                required
                placeholder="28.50"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-oro-500 bg-crema-50 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-cacao-900 mb-1">
              Stock Inicial (Unidades) *
            </label>
            <input
              type="number"
              min="0"
              required
              placeholder="100"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-oro-500 bg-crema-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cacao-900 mb-1">
              % Cacao Puro
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={cocoaPercentage}
              onChange={(e) => setCocoaPercentage(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-oro-500 bg-crema-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cacao-900 mb-1">
              Peso Neto (Gramos)
            </label>
            <input
              type="number"
              min="10"
              value={weightGrams}
              onChange={(e) => setWeightGrams(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-oro-500 bg-crema-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cacao-900 mb-1">
              Categoría de Producto *
            </label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-oro-500 bg-crema-50"
            >
              <option value="">-- Seleccionar Categoría --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-cacao-900 mb-1">
              Proveedor de Cacao *
            </label>
            <select
              required
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-oro-500 bg-crema-50"
            >
              <option value="">-- Seleccionar Proveedor --</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.company_name} ({s.origin_region})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 lg:col-span-4 flex justify-end mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-cacao-900 hover:bg-cacao-800 text-oro-400 border border-oro-600/60 font-semibold px-6 py-2.5 rounded-lg text-sm shadow transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Guardando en Base de Datos...' : 'Guardar Producto en Almacén'}</span>
            </button>
          </div>

        </form>
      </div>

      {/* Catálogo de Productos Registrados */}
      <div className="bg-white rounded-2xl p-5 border border-cacao-100 shadow-md">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cacao-900 text-oro-400 rounded-lg">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-cacao-950">
                Catálogo de Productos ({products.length})
              </h3>
              <p className="text-xs text-gray-500">
                Línea oficial de Chocolates Princesa disponibles para despacho y distribución en Santa Cruz.
              </p>
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <Package className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p>No hay productos registrados aún en la base de datos local.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-cacao-950 text-crema-100 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 rounded-l-lg">ID</th>
                  <th className="py-3 px-4">Producto</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Origen Cacao</th>
                  <th className="py-3 px-4 text-center">% Cacao / Peso</th>
                  <th className="py-3 px-4 text-center">Stock</th>
                  <th className="py-3 px-4 text-right">Precio Unitario</th>
                  <th className="py-3 px-4 text-center rounded-r-lg">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => {
                  const isSelected = selectedProductId === p.id;
                  const inStock = p.stock > 0;
                  const lowStock = p.stock > 0 && p.stock <= 30;

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-crema-100/60 transition-colors ${
                        isSelected ? 'bg-oro-50/80 font-medium' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono text-xs text-gray-500">#{p.id}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-cacao-950">{p.name}</div>
                        {isSelected && (
                          <span className="text-[10px] text-oro-700 font-bold bg-oro-100 px-1.5 py-0.5 rounded">
                            Mostrando en Visor 3D
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block bg-crema-200 text-cacao-900 text-xs px-2.5 py-1 rounded-full font-medium border border-cacao-100">
                          {p.category?.name || 'Categoría'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-600">
                        {p.supplier?.origin_region || 'Bolivia'}
                      </td>
                      <td className="py-3 px-4 text-center text-xs">
                        <span className="font-bold text-cacao-800">{p.cocoa_percentage}%</span> / {p.weight_grams}g
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                          p.stock === 0
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : lowStock
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {p.stock} uds
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-serif font-black text-cacao-900 text-base">
                        <span className="text-xs font-normal text-gray-500 mr-1">Bs.</span>
                        {Number(p.price).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              onSelectProductFor3D(p);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
                              isSelected
                                ? 'bg-oro-500 text-cacao-950 font-bold shadow'
                                : 'bg-cacao-800 hover:bg-cacao-700 text-oro-300'
                            }`}
                            title="Inspeccionar en Visor 3D Interactivo"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Ver en 3D</span>
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar producto "${p.name}" del catálogo?`)) {
                                onDeleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
