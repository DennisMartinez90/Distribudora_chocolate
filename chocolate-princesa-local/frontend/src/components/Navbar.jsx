/**
 * ====================================================================
 * PROYECTO: Sistema de Gestión y Distribución - "Chocolate Princesa" (Santa Cruz, Bolivia)
 * PROPIETARIO / ESTUDIANTE: Dennis Yohan Martinez Illescas
 * CÓDIGO / REGISTRO: Dennis Yohan Martinez Illescas | REG: 219034821
 * ENTORNO: 100% Local (Barra de Navegación)
 * ====================================================================
 */

import React from 'react';
import { Crown, Sparkles, Database, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Navbar({ onRefresh, isRefreshing }) {
  return (
    <header className="bg-cacao-900 border-b-2 border-oro-600 shadow-xl sticky top-0 z-50">
      {/* Barra superior de identificación del estudiante / propietario */}
      <div className="bg-cacao-950 px-4 py-1.5 border-b border-cacao-800 text-xs flex flex-wrap items-center justify-between text-crema-200">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-oro-700/30 text-oro-400 px-2 py-0.5 rounded-full font-medium border border-oro-600/40">
            <ShieldCheck className="w-3.5 h-3.5 text-oro-400" />
            {typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' ? 'Cloud + Supabase' : 'Local + Supabase'}
          </span>
          <span className="text-gray-400 hidden sm:inline">|</span>
          <span className="font-semibold text-oro-400">
            Dennis Yohan Martinez Illescas
          </span>
          <span className="text-gray-400 hidden md:inline">|</span>
          <span className="text-gray-300 hidden md:inline">
            Registro / Código: <strong className="text-crema-50">219034821</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' ? '/docs' : 'http://127.0.0.1:8000/docs'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-oro-400 hover:text-oro-300 hover:underline transition-colors"
            title="Abrir documentación interactiva OpenAPI / Swagger en FastAPI"
          >
            <span>Swagger API Docs</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Barra principal de navegación */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo e Identidad de Marca */}
          <div className="flex items-center gap-3.5">
            <div className="relative group">
              <img
                src="/logo-princesa.jpg"
                alt="Logo Chocolate Princesa - Santa Cruz, Bolivia"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-oro-500 shadow-md object-cover transition-transform group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/logo.png';
                }}
              />
              <div className="absolute -top-1 -right-1 bg-oro-500 text-cacao-950 p-0.5 rounded-full shadow">
                <Crown className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-crema-50 tracking-wide uppercase">
                  Chocolate Princesa
                </h1>
                <span className="bg-oro-500/20 text-oro-400 text-[10px] font-bold px-2 py-0.5 rounded-sm border border-oro-500/40 uppercase tracking-wider">
                  Santa Cruz, Bolivia
                </span>
              </div>
              <p className="text-xs text-oro-100/80 font-light flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3 h-3 text-oro-400 inline" />
                Sistema de Gestión y Distribución Mayorista de Cacao Fino
              </p>
            </div>
          </div>

          {/* Tarjeta de Datos del Propietario en Navbar */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="bg-cacao-800/90 border border-oro-600/50 rounded-lg px-3.5 py-1.5 shadow-sm text-right">
              <p className="text-[10px] text-oro-400 uppercase tracking-widest font-semibold">
                Propietario del Código
              </p>
              <p className="text-xs font-bold text-crema-50">
                Dennis Yohan Martinez Illescas
              </p>
              <p className="text-[10px] text-gray-300">
                REG: <span className="font-mono text-oro-300 font-bold">219034821</span>
              </p>
            </div>

            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="bg-oro-600 hover:bg-oro-500 active:scale-95 text-cacao-950 font-semibold px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
              title="Recargar datos desde FastAPI"
            >
              <Database className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Actualizar</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
