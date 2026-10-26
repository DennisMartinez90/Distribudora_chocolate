/**
 * ====================================================================
 * PROYECTO: Sistema de Gestión y Distribución - "Chocolate Princesa" (Santa Cruz, Bolivia)
 * PROPIETARIO / ESTUDIANTE: Dennis Yohan Martinez Illescas
 * CÓDIGO / REGISTRO: Dennis Yohan Martinez Illescas | REG: 219034821
 * ENTORNO: 100% Local (Módulo de Categorías)
 * ====================================================================
 */

import React, { useState } from 'react';
import { Tag, Plus, Trash2, ThermometerSnowflake, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CategoriesModule({ categories, onCreateCategory, onDeleteCategory }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [storageTemp, setStorageTemp] = useState('18.0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      setNotification({ type: 'error', text: 'El nombre de la categoría es obligatorio.' });
      return;
    }

    try {
      setIsSubmitting(true);
      await onCreateCategory({
        name,
        description: description || null,
        storage_temp_c: parseFloat(storageTemp) || 18.0
      });

      setNotification({ type: 'success', text: `Categoría "${name}" registrada exitosamente.` });
      setName('');
      setDescription('');
      setStorageTemp('18.0');
    } catch (err) {
      setNotification({ type: 'error', text: err.message || 'Error al crear la categoría.' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotification(null), 4000);
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

      {/* Formulario */}
      <div className="bg-white rounded-2xl p-5 border border-cacao-100 shadow-md">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
          <div className="p-2 bg-oro-500/10 rounded-lg text-oro-700">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-cacao-950">
              Registrar Nueva Categoría de Chocolate
            </h3>
            <p className="text-xs text-gray-500">
              Crea líneas de productos y define su temperatura óptima de almacenamiento para el clima de Santa Cruz.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-cacao-900 mb-1">
              Nombre de la Categoría *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Tabletas Artesanales"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-oro-500 bg-crema-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cacao-900 mb-1">
              Temperatura de Almacenamiento (°C)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                required
                placeholder="18.0"
                value={storageTemp}
                onChange={(e) => setStorageTemp(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-oro-500 bg-crema-50 font-mono"
              />
              <span className="absolute right-3 top-2 text-xs font-bold text-gray-400">°C</span>
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-cacao-900 mb-1">
              Descripción de la Línea
            </label>
            <textarea
              rows={2}
              placeholder="Breve detalle sobre las características y proceso de elaboración de esta categoría..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-oro-500 bg-crema-50"
            />
          </div>

          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-cacao-900 hover:bg-cacao-800 text-oro-400 border border-oro-600/60 font-semibold px-6 py-2.5 rounded-lg text-sm shadow transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Guardando...' : 'Guardar Categoría'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Tabla de Categorías */}
      <div className="bg-white rounded-2xl p-5 border border-cacao-100 shadow-md">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
          <div className="p-2 bg-cacao-900 text-oro-400 rounded-lg">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-cacao-950">
              Categorías Registradas ({categories.length})
            </h3>
            <p className="text-xs text-gray-500">
              Control de conservación y líneas de producto para el departamento de Santa Cruz.
            </p>
          </div>
        </div>

        {categories.length === 0 ? (
          <p className="text-center py-8 text-gray-500 text-sm">No existen categorías registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-cacao-950 text-crema-100 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 rounded-l-lg">ID</th>
                  <th className="py-3 px-4">Nombre de Categoría</th>
                  <th className="py-3 px-4">Descripción</th>
                  <th className="py-3 px-4 text-center">Temp. Ideal (°C)</th>
                  <th className="py-3 px-4 text-center rounded-r-lg">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-crema-100/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-gray-500">#{c.id}</td>
                    <td className="py-3 px-4 font-bold text-cacao-950">{c.name}</td>
                    <td className="py-3 px-4 text-xs text-gray-600 max-w-xs">{c.description || 'Sin descripción'}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                        <ThermometerSnowflake className="w-3.5 h-3.5 text-blue-500" />
                        {c.storage_temp_c}°C
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar la categoría "${c.name}"? Los productos vinculados se verán afectados.`)) {
                            onDeleteCategory(c.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
                        title="Eliminar categoría"
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
