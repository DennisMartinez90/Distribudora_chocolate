/**
 * ====================================================================
 * PROYECTO: Sistema de Gestión y Distribución - "Chocolate Princesa" (Santa Cruz, Bolivia)
 * PROPIETARIO / ESTUDIANTE: Dennis Yohan Martinez Illescas
 * CÓDIGO / REGISTRO: Dennis Yohan Martinez Illescas | REG: 219034821
 * ENTORNO: 100% Local (Tarjetas de Métricas y KPIs)
 * ====================================================================
 */

import React from 'react';
import { Package, Layers, CircleDollarSign, Users, ShoppingCart, TrendingUp } from 'lucide-react';

export default function StatsCards({ stats }) {
  const cards = [
    {
      title: 'Productos en Catálogo',
      value: stats?.total_products ?? 0,
      subtext: 'Líneas finas activas',
      icon: Package,
      gradient: 'from-amber-700 to-amber-900',
      border: 'border-amber-700/40',
      textColor: 'text-amber-300'
    },
    {
      title: 'Unidades en Almacén',
      value: (stats?.total_stock_units ?? 0).toLocaleString(),
      subtext: 'Stock total disponible',
      icon: Layers,
      gradient: 'from-cacao-700 to-cacao-900',
      border: 'border-cacao-600/40',
      textColor: 'text-oro-300'
    },
    {
      title: 'Valor del Inventario',
      value: `Bs. ${(stats?.inventory_valuation_bs ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtext: 'Valuación al costo comercial',
      icon: CircleDollarSign,
      gradient: 'from-yellow-700 to-amber-900',
      border: 'border-yellow-600/40',
      textColor: 'text-yellow-400'
    },
    {
      title: 'Clientes en Santa Cruz',
      value: stats?.total_clients ?? 0,
      subtext: 'Puntos de venta registrados',
      icon: Users,
      gradient: 'from-emerald-800 to-teal-950',
      border: 'border-emerald-700/40',
      textColor: 'text-emerald-400'
    },
    {
      title: 'Pedidos Despachados',
      value: stats?.total_orders ?? 0,
      subtext: 'Órdenes completadas',
      icon: ShoppingCart,
      gradient: 'from-cacao-800 to-cacao-950',
      border: 'border-cacao-700/50',
      textColor: 'text-oro-400'
    },
    {
      title: 'Ventas Totales Realizadas',
      value: `Bs. ${(stats?.total_sales_bs ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtext: 'Facturación acumulada en Bs.',
      icon: TrendingUp,
      gradient: 'from-oro-700 to-oro-900',
      border: 'border-oro-600/60',
      textColor: 'text-oro-300'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className={`relative bg-gradient-to-br ${card.gradient} rounded-xl p-3.5 border ${card.border} shadow-lg text-crema-50 flex flex-col justify-between transition-transform hover:-translate-y-0.5`}
          >
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[11px] font-medium text-crema-200/90 leading-tight">
                {card.title}
              </span>
              <div className="p-1.5 rounded-lg bg-black/20 text-oro-400">
                <IconComponent className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className={`text-base sm:text-lg font-black font-serif tracking-tight ${card.textColor}`}>
                {card.value}
              </div>
              <div className="text-[10px] text-gray-300/80 mt-0.5 truncate">
                {card.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
