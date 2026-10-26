/**
 * ====================================================================
 * PROYECTO: Sistema de Gestión y Distribución - "Chocolate Princesa" (Santa Cruz, Bolivia)
 * PROPIETARIO / ESTUDIANTE: Dennis Yohan Martinez Illescas
 * CÓDIGO / REGISTRO: Dennis Yohan Martinez Illescas | REG: 219034821
 * ENTORNO: 100% Local (Aplicación Principal React + Vite)
 * ====================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import { api } from './api/apiClient';
import Navbar from './components/Navbar';
import Chocolate3DViewer from './components/Chocolate3DViewer';
import StatsCards from './components/StatsCards';
import ProductsModule from './components/ProductsModule';
import CategoriesModule from './components/CategoriesModule';
import SuppliersModule from './components/SuppliersModule';
import ClientsModule from './components/ClientsModule';
import OrdersModule from './components/OrdersModule';
import { Package, Tag, Truck, Users, ShoppingCart, RefreshCw, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('products');
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedProductFor3D, setSelectedProductFor3D] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [backendError, setBackendError] = useState(null);

  // Carga unificada de todos los datos desde FastAPI
  const loadAllData = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setRefreshing(true);
      setBackendError(null);

      const [kpisData, catsData, supsData, prodsData, clientsData, ordersData] = await Promise.all([
        api.getDashboardKPIs(),
        api.getCategories(),
        api.getSuppliers(),
        api.getProducts(),
        api.getClients(),
        api.getOrders()
      ]);

      setStats(kpisData);
      setCategories(catsData);
      setSuppliers(supsData);
      setProducts(prodsData);
      setClients(clientsData);
      setOrders(ordersData);

      // Si no hay producto seleccionado en el visor 3D, seleccionar el primero disponible
      setSelectedProductFor3D((prev) => {
        if (prev && prodsData.some((p) => p.id === prev.id)) {
          return prodsData.find((p) => p.id === prev.id);
        }
        return prodsData.length > 0 ? prodsData[0] : null;
      });

    } catch (err) {
      console.error('Error al conectar con FastAPI:', err);
      setBackendError(err.message || 'No se pudo conectar con el servidor local FastAPI en http://127.0.0.1:8000');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Handlers para categorías
  const handleCreateCategory = async (data) => {
    await api.createCategory(data);
    await loadAllData(true);
  };
  const handleDeleteCategory = async (id) => {
    await api.deleteCategory(id);
    await loadAllData(true);
  };

  // Handlers para proveedores
  const handleCreateSupplier = async (data) => {
    await api.createSupplier(data);
    await loadAllData(true);
  };
  const handleDeleteSupplier = async (id) => {
    await api.deleteSupplier(id);
    await loadAllData(true);
  };

  // Handlers para productos
  const handleCreateProduct = async (data) => {
    const newProd = await api.createProduct(data);
    await loadAllData(true);
    setSelectedProductFor3D(newProd);
  };
  const handleDeleteProduct = async (id) => {
    await api.deleteProduct(id);
    await loadAllData(true);
  };

  // Handlers para clientes
  const handleCreateClient = async (data) => {
    await api.createClient(data);
    await loadAllData(true);
  };
  const handleDeleteClient = async (id) => {
    await api.deleteClient(id);
    await loadAllData(true);
  };

  // Handlers para pedidos
  const handleCreateOrder = async (data) => {
    await api.createOrder(data);
    await loadAllData(true);
  };
  const handleDeleteOrder = async (id) => {
    await api.deleteOrder(id);
    await loadAllData(true);
  };

  // Configuración de pestañas
  const tabs = [
    { id: 'products', label: '1. Catálogo Productos', count: products.length, icon: Package },
    { id: 'orders', label: '2. Pedidos y Ventas', count: orders.length, icon: ShoppingCart },
    { id: 'clients', label: '3. Clientes (Santa Cruz)', count: clients.length, icon: Users },
    { id: 'categories', label: '4. Categorías', count: categories.length, icon: Tag },
    { id: 'suppliers', label: '5. Proveedores Cacao', count: suppliers.length, icon: Truck },
  ];

  return (
    <div className="min-h-screen bg-crema-100 flex flex-col selection:bg-oro-500 selection:text-cacao-950">
      
      {/* 1. Barra de Navegación con datos del Estudiante / Propietario */}
      <Navbar onRefresh={() => loadAllData(false)} isRefreshing={refreshing} />

      {/* Alerta de conexión con FastAPI */}
      {backendError && (
        <div className="bg-red-600 text-white px-4 py-2 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-md">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              <strong>Aviso de Conexión:</strong> {backendError}.
            </span>
          </div>
          <button
            onClick={() => loadAllData(false)}
            className="bg-white text-red-700 px-3 py-1 rounded text-xs hover:bg-gray-100 font-bold"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* 2. Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Sección Superior: Tarjetas de Métricas y Visor 3D Interactivo */}
        <section className="space-y-4">
          
          {/* Métricas en Tiempo Real */}
          <StatsCards stats={stats} />

          {/* Fila con el Visor 3D y la Tarjeta Institucional */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Visor 3D Interactivo (7 columnas) */}
            <div className="lg:col-span-7">
              <Chocolate3DViewer product={selectedProductFor3D} />
            </div>

            {/* Banner Institucional y Datos de Santa Cruz (5 columnas) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-cacao-900 via-cacao-950 to-cacao-900 text-crema-50 rounded-2xl p-6 border-2 border-oro-600/50 shadow-xl flex flex-col justify-between">
              
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="p-1.5 bg-oro-500/20 text-oro-400 rounded-lg border border-oro-500/30">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-oro-400">
                    Tradición Chocolatera Cruceña
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-serif font-bold text-crema-50 mb-2 leading-snug">
                  Chocolate Princesa
                </h2>
                
                <p className="text-xs sm:text-sm text-crema-200/90 leading-relaxed font-light mb-4">
                  Distribución mayorista de chocolates artesanales elaborados con granos finos de aroma recolectados en la Amazonía boliviana (Baures, Beni), Alto Beni y la Chiquitanía cruceña. Abastecemos pastelerías, reposterías y puntos de venta en toda la ciudad de Santa Cruz de la Sierra.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-cacao-800 text-xs">
                  <div className="bg-cacao-800/60 p-2.5 rounded-lg border border-cacao-700/60">
                    <span className="block text-[10px] text-oro-400 uppercase font-semibold">Cacao de Origen</span>
                    <span className="font-bold text-crema-100">100% Boliviano</span>
                  </div>
                  <div className="bg-cacao-800/60 p-2.5 rounded-lg border border-cacao-700/60">
                    <span className="block text-[10px] text-oro-400 uppercase font-semibold">Conservación</span>
                    <span className="font-bold text-crema-100">16°C a 20°C Climatizado</span>
                  </div>
                </div>
              </div>

              {/* Tarjeta de autoría del estudiante visible */}
              <div className="mt-5 pt-4 border-t border-oro-600/30 bg-black/25 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-medium">Estudiante / Autor:</span>
                  <span className="font-bold text-oro-300">Dennis Yohan Martinez Illescas</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-gray-400 font-medium">Registro / Código:</span>
                  <span className="font-mono text-crema-100 font-bold">Dennis Yohan Martinez Illescas | REG: 219034821</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-gray-400 font-medium">Entorno:</span>
                  <span className="text-selva-500 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Local (SQLite)
                  </span>
                </div>
              </div>

            </div>

          </div>

        </section>

        {/* 3. Sistema de Pestañas (5 Módulos Relacionales) */}
        <section className="bg-white rounded-2xl shadow-md border border-cacao-100 overflow-hidden">
          
          {/* Barra de Pestañas */}
          <div className="bg-cacao-950 px-3 pt-3 border-b border-cacao-800 flex overflow-x-auto no-scrollbar gap-1">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-crema-100 text-cacao-950 border-t-2 border-oro-500 shadow-md font-bold'
                      : 'text-crema-200/70 hover:text-oro-300 hover:bg-cacao-900/60'
                  }`}
                >
                  <TabIcon className={`w-4 h-4 ${isActive ? 'text-oro-600' : 'text-gray-400'}`} />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-oro-500 text-cacao-950' : 'bg-cacao-800 text-gray-300'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Contenido Dinámico de la Pestaña Activa */}
          <div className="p-4 sm:p-6 bg-crema-100/50">
            {loading ? (
              <div className="text-center py-16 text-cacao-800">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-oro-600 mb-3" />
                <p className="font-semibold text-sm">Cargando base de datos de Chocolate Princesa...</p>
                <p className="text-xs text-gray-500 mt-1">Conectando a FastAPI (http://127.0.0.1:8000)...</p>
              </div>
            ) : (
              <>
                {activeTab === 'products' && (
                  <ProductsModule
                    products={products}
                    categories={categories}
                    suppliers={suppliers}
                    onSelectProductFor3D={setSelectedProductFor3D}
                    selectedProductId={selectedProductFor3D?.id}
                    onCreateProduct={handleCreateProduct}
                    onDeleteProduct={handleDeleteProduct}
                  />
                )}

                {activeTab === 'orders' && (
                  <OrdersModule
                    orders={orders}
                    clients={clients}
                    products={products}
                    onCreateOrder={handleCreateOrder}
                    onDeleteOrder={handleDeleteOrder}
                  />
                )}

                {activeTab === 'clients' && (
                  <ClientsModule
                    clients={clients}
                    onCreateClient={handleCreateClient}
                    onDeleteClient={handleDeleteClient}
                  />
                )}

                {activeTab === 'categories' && (
                  <CategoriesModule
                    categories={categories}
                    onCreateCategory={handleCreateCategory}
                    onDeleteCategory={handleDeleteCategory}
                  />
                )}

                {activeTab === 'suppliers' && (
                  <SuppliersModule
                    suppliers={suppliers}
                    onCreateSupplier={handleCreateSupplier}
                    onDeleteSupplier={handleDeleteSupplier}
                  />
                )}
              </>
            )}
          </div>

        </section>

      </main>

      {/* 4. Pie de Página (Footer con datos del Estudiante / Propietario) */}
      <footer className="bg-cacao-950 border-t-2 border-oro-600 text-crema-200 mt-12 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Identidad */}
          <div className="flex items-center gap-3">
            <img
              src="/logo-princesa.jpg"
              alt="Chocolate Princesa"
              className="w-12 h-12 rounded-full border border-oro-500 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/logo.png';
              }}
            />
            <div>
              <p className="font-serif font-bold text-crema-50 text-base">
                Chocolate Princesa — Santa Cruz, Bolivia
              </p>
              <p className="text-xs text-oro-300/80">
                Sistema Integral de Gestión y Distribución de Chocolates Finos
              </p>
            </div>
          </div>

          {/* Datos del Propietario / Estudiante en Footer */}
          <div className="text-center md:text-right text-xs space-y-1">
            <p className="text-crema-100 font-semibold">
              Propietario / Estudiante: <span className="text-oro-400 font-bold">Dennis Yohan Martinez Illescas</span>
            </p>
            <p className="text-gray-400">
              Código / Registro de Estudiante: <span className="font-mono text-crema-50 font-bold">Dennis Yohan Martinez Illescas | REG: 219034821</span>
            </p>
            <p className="text-gray-400">
              Proyecto: <span className="text-gray-200">Sistema de Gestión y Distribución - "Chocolate Princesa" (Santa Cruz, Bolivia)</span>
            </p>
            <div className="pt-2 flex items-center justify-center md:justify-end gap-2 text-[11px] text-gray-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>100% Entorno Local (SQLite + FastAPI + React Vite)</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
