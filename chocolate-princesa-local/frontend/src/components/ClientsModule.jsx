/**
 * ====================================================================
 * PROYECTO: Sistema de Gestión y Distribución - "Chocolate Princesa" (Santa Cruz, Bolivia)
 * PROPIETARIO / ESTUDIANTE: Dennis Yohan Martinez Illescas
 * CÓDIGO / REGISTRO: Dennis Yohan Martinez Illescas | REG: 219034821
 * ENTORNO: 100% Local (Módulo de Clientes - Santa Cruz)
 * ====================================================================
 */

import React, { useState } from 'react';
import { Users, Plus, Trash2, MapPin, Phone, Building2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ClientsModule({ clients, onCreateClient, onDeleteClient }) {
  const [businessName, setBusinessName] = useState('');
  const [contactOwner, setContactOwner] = useState('');
  const [nitCi, setNitCi] = useState('');
  const [phone, setPhone] = useState('');
  const [zoneAddress, setZoneAddress] = useState('');
  const [businessType, setBusinessType] = useState('Mayorista');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!businessName || !contactOwner || !nitCi || !phone || !zoneAddress) {
      setNotification({ type: 'error', text: 'Por favor complete todos los datos requeridos del cliente.' });
      return;
    }

    try {
      setIsSubmitting(true);
      await onCreateClient({
        business_name: businessName,
        contact_owner: contactOwner,
        nit_ci: nitCi,
        phone,
        zone_address: zoneAddress,
        business_type: businessType
      });

      setNotification({ type: 'success', text: `Cliente "${businessName}" registrado con éxito en Santa Cruz.` });
      setBusinessName('');
      setContactOwner('');
      setNitCi('');
      setPhone('');
      setZoneAddress('');
      setBusinessType('Mayorista');
    } catch (err) {
      setNotification({ type: 'error', text: err.message || 'Error al registrar el cliente.' });
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
              Registrar Nuevo Cliente / Punto de Venta en Santa Cruz
            </h3>
            <p className="text-xs text-gray-500">
              Pastelerías, supermercados, boutiques gourmet y distribuidores mayoristas de la ciudad.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-cacao-900 mb-1">
              Razón Social / Nombre Comercial *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Pastelería Dulce Santa Cruz"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-oro-500 bg-crema-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cacao-900 mb-1">
              Propietario / Contacto Responsable *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Mariana Suárez Arteaga"
              value={contactOwner}
              onChange={(e) => setContactOwner(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-oro-500 bg-crema-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cacao-900 mb-1">
              NIT / C.I. *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: 4892104018"
              value={nitCi}
              onChange={(e) => setNitCi(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-oro-500 bg-crema-50 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cacao-900 mb-1">
              Teléfono / WhatsApp *
            </label>
            <input
              type="text"
              required
              placeholder="+591 77012345"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-oro-500 bg-crema-50 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cacao-900 mb-1">
              Zona / Dirección en Santa Cruz *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Equipetrol Norte, Calle 7 Oeste"
              value={zoneAddress}
              onChange={(e) => setZoneAddress(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-oro-500 bg-crema-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cacao-900 mb-1">
              Tipo de Negocio
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-oro-500 bg-crema-50"
            >
              <option value="Mayorista">Distribuidor Mayorista</option>
              <option value="Pastelería">Pastelería / Repostería</option>
              <option value="Supermercado">Supermercado Gourmet</option>
              <option value="Boutique">Cafetería / Boutique</option>
            </select>
          </div>

          <div className="md:col-span-2 lg:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-cacao-900 hover:bg-cacao-800 text-oro-400 border border-oro-600/60 font-semibold px-6 py-2.5 rounded-lg text-sm shadow transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Registrando...' : 'Registrar Cliente'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl p-5 border border-cacao-100 shadow-md">
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
          <div className="p-2 bg-cacao-900 text-oro-400 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-cacao-950">
              Red de Clientes en Santa Cruz ({clients.length})
            </h3>
            <p className="text-xs text-gray-500">
              Cartera de comercios y puntos de distribución de Chocolate Princesa.
            </p>
          </div>
        </div>

        {clients.length === 0 ? (
          <p className="text-center py-8 text-gray-500 text-sm">No existen clientes registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-cacao-950 text-crema-100 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 rounded-l-lg">ID</th>
                  <th className="py-3 px-4">Razón Social</th>
                  <th className="py-3 px-4">Propietario</th>
                  <th className="py-3 px-4">NIT / C.I.</th>
                  <th className="py-3 px-4">Teléfono</th>
                  <th className="py-3 px-4">Zona Santa Cruz</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4 text-center rounded-r-lg">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {clients.map((c) => (
                  <tr key={c.id} className="hover:bg-crema-100/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-gray-500">#{c.id}</td>
                    <td className="py-3 px-4 font-bold text-cacao-950">{c.business_name}</td>
                    <td className="py-3 px-4 text-xs text-gray-700">{c.contact_owner}</td>
                    <td className="py-3 px-4 font-mono text-xs text-gray-600">{c.nit_ci}</td>
                    <td className="py-3 px-4 font-mono text-xs text-gray-600">
                      <span className="inline-flex items-center gap-1">
                        <Phone className="w-3 h-3 text-oro-600" />
                        {c.phone}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <span className="inline-flex items-center gap-1 font-medium text-cacao-900">
                        <MapPin className="w-3 h-3 text-selva-700" />
                        {c.zone_address}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 bg-cacao-50 text-cacao-900 border border-cacao-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                        <Building2 className="w-3 h-3 text-oro-700" />
                        {c.business_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar cliente "${c.business_name}"?`)) {
                            onDeleteClient(c.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
                        title="Eliminar cliente"
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
