/**
 * ====================================================================
 * PROYECTO: Sistema de Gestión y Distribución - "Chocolate Princesa" (Santa Cruz, Bolivia)
 * PROPIETARIO / ESTUDIANTE: Dennis Yohan Martinez Illescas
 * CÓDIGO / REGISTRO: Dennis Yohan Martinez Illescas | REG: 219034821
 * ENTORNO: 100% Local (Módulo de Proveedores de Cacao)
 * ====================================================================
 */

import React, { useState } from 'react';
import { Truck, Plus, Trash2, MapPin, Phone, Award, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SuppliersModule({ suppliers, onCreateSupplier, onDeleteSupplier }) {
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [originRegion, setOriginRegion] = useState('');
  const [qualityGrade, setQualityGrade] = useState('Cacao Fino de Aroma - Primera');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyName || !contactName || !phone || !originRegion) {
      setNotification({ type: 'error', text: 'Por favor complete todos los datos requeridos del proveedor.' });
      return;
    }

    try {
      setIsSubmitting(true);
      await onCreateSupplier({
        company_name: companyName,
        contact_name: contactName,
        phone,
        origin_region: originRegion,
        quality_grade: qualityGrade
      });

      setNotification({ type: 'success', text: `Proveedor "${companyName}" registrado con éxito.` });
      setCompanyName('');
      setContactName('');
      setPhone('');
      setOriginRegion('');
      setQualityGrade('Cacao Fino de Aroma - Primera');
    } catch (err) {
      setNotification({ type: 'error', text: err.message || 'Error al registrar el proveedor.' });
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
              Registrar Proveedor de Cacao Boliviano
            </h3>
            <p className="text-xs text-gray-500">
              Gestión de cooperativas y recolectores de cacao en el Beni, La Paz y Santa Cruz.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-cacao-900 mb-1">
              Razón Social / Cooperativa *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Productores Cacao Silvestre Baures"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-oro-500 bg-crema-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cacao-900 mb-1">
              Persona de Contacto *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Carlos Melgar Vaca"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-oro-500 bg-crema-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cacao-900 mb-1">
              Teléfono / WhatsApp *
            </label>
            <input
              type="text"
              required
              placeholder="+591 71029384"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-oro-500 bg-crema-50 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cacao-900 mb-1">
              Región Productora de Bolivia *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Baures, Beni - Amazonía Boliviana"
              value={originRegion}
              onChange={(e) => setOriginRegion(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-oro-500 bg-crema-50"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-cacao-900 mb-1">
              Clasificación de Calidad del Grano
            </label>
            <select
              value={qualityGrade}
              onChange={(e) => setQualityGrade(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-oro-500 bg-crema-50"
            >
              <option value="Cacao Silvestre de Recolección - Gran Reserva">
                Cacao Silvestre de Recolección - Gran Reserva
              </option>
              <option value="Cacao Fino de Aroma - Primera">
                Cacao Fino de Aroma - Primera Selección
              </option>
              <option value="Cacao Orgánico Certificado - Primera">
                Cacao Orgánico Certificado - Primera
              </option>
              <option value="Cacao Chiquitano Criollo Especial">
                Cacao Chiquitano Criollo Especial
              </option>
            </select>
          </div>

          <div className="md:col-span-2 lg:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-cacao-900 hover:bg-cacao-800 text-oro-400 border border-oro-600/60 font-semibold px-6 py-2.5 rounded-lg text-sm shadow transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Registrando...' : 'Registrar Proveedor'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl p-5 border border-cacao-100 shadow-md">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
          <div className="p-2 bg-cacao-900 text-oro-400 rounded-lg">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-cacao-950">
              Proveedores de Cacao Activos ({suppliers.length})
            </h3>
            <p className="text-xs text-gray-500">
              Fuentes de abastecimiento de materia prima seleccionada para Chocolate Princesa.
            </p>
          </div>
        </div>

        {suppliers.length === 0 ? (
          <p className="text-center py-8 text-gray-500 text-sm">No hay proveedores registrados aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-cacao-950 text-crema-100 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 rounded-l-lg">ID</th>
                  <th className="py-3 px-4">Empresa / Cooperativa</th>
                  <th className="py-3 px-4">Contacto</th>
                  <th className="py-3 px-4">Teléfono</th>
                  <th className="py-3 px-4">Región de Origen</th>
                  <th className="py-3 px-4">Calidad del Grano</th>
                  <th className="py-3 px-4 text-center rounded-r-lg">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {suppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-crema-100/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-gray-500">#{s.id}</td>
                    <td className="py-3 px-4 font-bold text-cacao-950">{s.company_name}</td>
                    <td className="py-3 px-4 text-xs text-gray-700">{s.contact_name}</td>
                    <td className="py-3 px-4 font-mono text-xs text-gray-600">
                      <span className="inline-flex items-center gap-1">
                        <Phone className="w-3 h-3 text-oro-600" />
                        {s.phone}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-cacao-800">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-selva-700" />
                        {s.origin_region}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs px-2.5 py-0.5 rounded-full font-medium">
                        <Award className="w-3 h-3 text-amber-600" />
                        {s.quality_grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar proveedor "${s.company_name}"?`)) {
                            onDeleteSupplier(s.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
                        title="Eliminar proveedor"
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
