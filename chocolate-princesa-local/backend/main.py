"""
====================================================================
PROYECTO: Sistema de Gestión y Distribución - "Chocolate Princesa" (Santa Cruz, Bolivia)
PROPIETARIO / ESTUDIANTE: Dennis Yohan Martinez Illescas
CÓDIGO / REGISTRO: Dennis Yohan Martinez Illescas | REG: 219034821
ENTORNO: 100% Local (FastAPI REST Backend)
====================================================================
"""

import os
import requests
from contextlib import asynccontextmanager
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func

import models
import schemas
from database import engine, get_db, SessionLocal
from seed import seed_database


# ====================================================================
# CICLO DE VIDA DE LA APLICACIÓN (Creación de tablas y Seed)
# ====================================================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Crear automáticamente las 5 tablas si no existen
    try:
        models.Base.metadata.create_all(bind=engine, checkfirst=True)
    except Exception as e:
        print(f"[Lifespan Notice] create_all bypassed: {e}")
    
    # 2. Ejecutar semilla de datos si la base de datos está vacía
    try:
        db = SessionLocal()
        try:
            seed_database(db)
        finally:
            db.close()
    except Exception as e:
        print(f"[Lifespan Notice] seed_database bypassed: {e}")
        
    yield


# ====================================================================
# INICIALIZACIÓN DE FASTAPI CON DATOS DEL PROPIETARIO EN SWAGGER
# ====================================================================
app = FastAPI(
    title='Sistema de Gestión y Distribución - "Chocolate Princesa" (Santa Cruz, Bolivia) | Dennis Yohan Martinez Illescas',
    description="""
### Distribuidora de Chocolates Finos "Chocolate Princesa" — Santa Cruz, Bolivia
---
* **Propietario / Desarrollador:** Dennis Yohan Martinez Illescas
* **Código de Estudiante / Registro:** Dennis Yohan Martinez Illescas | REG: 219034821
* **Arquitectura:** Sistema Relacional de 5 Tablas (Categorías, Proveedores, Productos, Clientes, Pedidos)
* **Modo de Operación:** 100% Local (SQLite sin dependencias de servicios en la nube)
    """,
    version="1.0.0",
    lifespan=lifespan
)

# Configuración CORS permisiva para comunicación local con Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ====================================================================
# UTILIDADES: NOTIFICACIONES (SILENCIOSAS EN LOCAL)
# ====================================================================
def notify_webhook_safe(message: str):
    """
    Envía una notificación vía Webhook (ej. Slack) de forma 100% segura.
    En entorno local no bloquea la ejecución ante falta de internet o webhook no configurado.
    """
    webhook_url = os.getenv("SLACK_WEBHOOK_URL", "").strip()
    if not webhook_url:
        return
    try:
        requests.post(webhook_url, json={"text": message}, timeout=1.5)
    except Exception:
        # Falla silenciosa garantizada para entorno local
        pass


# ====================================================================
# ENDPOINT RAÍZ Y METADATOS
# ====================================================================
@app.get("/", tags=["General"])
def root():
    return {
        "proyecto": 'Sistema de Gestión y Distribución - "Chocolate Princesa" (Santa Cruz, Bolivia)',
        "propietario": "Dennis Yohan Martinez Illescas",
        "codigo_registro": "Dennis Yohan Martinez Illescas | REG: 219034821",
        "estado": "Operativo 100% Local",
        "documentacion_swagger": "/docs",
        "documentacion_redoc": "/redoc",
        "version": "1.0.0"
    }


@app.post("/api/v1/test-slack", tags=["General"])
def test_slack_webhook():
    """Envía un mensaje de prueba al webhook de Slack configurado en .env."""
    webhook_url = os.getenv("SLACK_WEBHOOK_URL", "").strip()
    if not webhook_url:
        return {
            "status": "config_missing",
            "message": "SLACK_WEBHOOK_URL no está configurada en .env. En local no bloquea el sistema."
        }
    try:
        res = requests.post(
            webhook_url,
            json={"text": "🔔 [PRUEBA DIPLOMADO] Alerta del Sistema 'Chocolate Princesa - Santa Cruz' enviada por Dennis Yohan Martinez Illescas."},
            timeout=3.0
        )
        return {"status": "success", "slack_response_code": res.status_code, "message": "Alerta enviada a Slack exitosamente."}
    except Exception as e:
        return {"status": "error", "detail": str(e)}


# ====================================================================
# 1. ENDPOINTS: CATEGORÍAS (/api/v1/categories)
# ====================================================================
@app.get("/api/v1/categories", response_model=List[schemas.CategoryResponse], tags=["1. Categorías"])
def list_categories(db: Session = Depends(get_db)):
    """Lista todas las categorías de productos de chocolate registradas."""
    return db.query(models.Category).order_by(models.Category.id.asc()).all()


@app.post("/api/v1/categories", response_model=schemas.CategoryResponse, status_code=status.HTTP_201_CREATED, tags=["1. Categorías"])
def create_category(category_in: schemas.CategoryCreate, db: Session = Depends(get_db)):
    """Crea una nueva categoría de chocolate (ej. Tabletas, Bombones, Coberturas)."""
    existing = db.query(models.Category).filter(models.Category.name == category_in.name).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"La categoría '{category_in.name}' ya está registrada.")
    
    cat = models.Category(**category_in.model_dump())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@app.delete("/api/v1/categories/{category_id}", tags=["1. Categorías"])
def delete_category(category_id: int, db: Session = Depends(get_db)):
    """Elimina una categoría por su ID."""
    cat = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Categoría no encontrada.")
    db.delete(cat)
    db.commit()
    return {"message": f"Categoría #{category_id} eliminada correctamente."}


# ====================================================================
# 2. ENDPOINTS: PROVEEDORES (/api/v1/suppliers)
# ====================================================================
@app.get("/api/v1/suppliers", response_model=List[schemas.SupplierResponse], tags=["2. Proveedores"])
def list_suppliers(db: Session = Depends(get_db)):
    """Lista todos los proveedores de cacao boliviano e insumos."""
    return db.query(models.Supplier).order_by(models.Supplier.id.asc()).all()


@app.post("/api/v1/suppliers", response_model=schemas.SupplierResponse, status_code=status.HTTP_201_CREATED, tags=["2. Proveedores"])
def create_supplier(supplier_in: schemas.SupplierCreate, db: Session = Depends(get_db)):
    """Registra una cooperativa o productor cacaotero de Bolivia."""
    sup = models.Supplier(**supplier_in.model_dump())
    db.add(sup)
    db.commit()
    db.refresh(sup)
    return sup


@app.delete("/api/v1/suppliers/{supplier_id}", tags=["2. Proveedores"])
def delete_supplier(supplier_id: int, db: Session = Depends(get_db)):
    """Elimina un proveedor por su ID."""
    sup = db.query(models.Supplier).filter(models.Supplier.id == supplier_id).first()
    if not sup:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado.")
    db.delete(sup)
    db.commit()
    return {"message": f"Proveedor #{supplier_id} eliminado correctamente."}


# ====================================================================
# 3. ENDPOINTS: PRODUCTOS (/api/v1/products)
# ====================================================================
@app.get("/api/v1/products", response_model=List[schemas.ProductResponse], tags=["3. Productos"])
def list_products(db: Session = Depends(get_db)):
    """Obtiene el catálogo completo de productos con datos de su categoría y proveedor."""
    return db.query(models.Product).order_by(models.Product.id.asc()).all()


@app.post("/api/v1/products", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED, tags=["3. Productos"])
def create_product(product_in: schemas.ProductCreate, db: Session = Depends(get_db)):
    """Crea un nuevo producto en el catálogo de Chocolate Princesa."""
    # Validar categoría
    category = db.query(models.Category).filter(models.Category.id == product_in.category_id).first()
    if not category:
        raise HTTPException(status_code=400, detail="La categoría seleccionada no existe.")
    
    # Validar proveedor
    supplier = db.query(models.Supplier).filter(models.Supplier.id == product_in.supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=400, detail="El proveedor seleccionado no existe.")
    
    prod = models.Product(**product_in.model_dump())
    db.add(prod)
    db.commit()
    db.refresh(prod)

    # Notificación silenciosa
    notify_webhook_safe(f"🍫 Nuevo producto creado: {prod.name} (Stock: {prod.stock}, Precio: Bs. {prod.price})")

    return prod


@app.delete("/api/v1/products/{product_id}", tags=["3. Productos"])
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """Elimina un producto del catálogo."""
    prod = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Producto no encontrado.")
    db.delete(prod)
    db.commit()
    return {"message": f"Producto #{product_id} eliminado correctamente."}


# ====================================================================
# 4. ENDPOINTS: CLIENTES (/api/v1/clients)
# ====================================================================
@app.get("/api/v1/clients", response_model=List[schemas.ClientResponse], tags=["4. Clientes"])
def list_clients(db: Session = Depends(get_db)):
    """Lista todos los clientes de Santa Cruz de la Sierra."""
    return db.query(models.Client).order_by(models.Client.id.asc()).all()


@app.post("/api/v1/clients", response_model=schemas.ClientResponse, status_code=status.HTTP_201_CREATED, tags=["4. Clientes"])
def create_client(client_in: schemas.ClientCreate, db: Session = Depends(get_db)):
    """Registra un nuevo cliente o punto de venta en Santa Cruz."""
    existing_nit = db.query(models.Client).filter(models.Client.nit_ci == client_in.nit_ci).first()
    if existing_nit:
        raise HTTPException(status_code=400, detail=f"Ya existe un cliente con el NIT/CI {client_in.nit_ci}.")
    
    client = models.Client(**client_in.model_dump())
    db.add(client)
    db.commit()
    db.refresh(client)
    return client


@app.delete("/api/v1/clients/{client_id}", tags=["4. Clientes"])
def delete_client(client_id: int, db: Session = Depends(get_db)):
    """Elimina un cliente por su ID."""
    client = db.query(models.Client).filter(models.Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado.")
    db.delete(client)
    db.commit()
    return {"message": f"Cliente #{client_id} eliminado correctamente."}


# ====================================================================
# 5. ENDPOINTS: PEDIDOS Y DESPACHOS (/api/v1/orders)
# ====================================================================
@app.get("/api/v1/orders", response_model=List[schemas.OrderResponse], tags=["5. Pedidos"])
def list_orders(db: Session = Depends(get_db)):
    """Lista el historial de pedidos y despachos realizados."""
    return db.query(models.Order).order_by(models.Order.id.desc()).all()


@app.post("/api/v1/orders", response_model=schemas.OrderResponse, status_code=status.HTTP_201_CREATED, tags=["5. Pedidos"])
def create_order(order_in: schemas.OrderCreate, db: Session = Depends(get_db)):
    """
    Registra un pedido de distribución.
    Regla de negocio:
    1. Verifica existencia del producto y cliente.
    2. Valida que el stock disponible sea suficiente (product.stock >= quantity).
    3. Si no hay stock, lanza HTTPException 400 'Stock insuficiente en almacén'.
    4. Calcula unit_price y total_price = unit_price * quantity.
    5. Descuenta automáticamente el stock: product.stock -= quantity.
    6. Persiste la orden y la actualización de inventario.
    """
    # 1. Validar cliente
    client = db.query(models.Client).filter(models.Client.id == order_in.client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="El cliente seleccionado no existe.")

    # 2. Validar producto
    product = db.query(models.Product).filter(models.Product.id == order_in.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="El producto seleccionado no existe.")

    # 3. Validar stock disponible
    if product.stock < order_in.quantity:
        raise HTTPException(
            status_code=400,
            detail=f"Stock insuficiente en almacén. Solicitado: {order_in.quantity}, Disponible: {product.stock} unidades de '{product.name}'."
        )

    # 4. Cálculo de importes en Bolivianos (Bs.)
    unit_price = float(product.price)
    total_price = round(unit_price * order_in.quantity, 2)

    # 5. Descuento de stock en almacén
    product.stock -= order_in.quantity

    # 6. Crear orden
    order = models.Order(
        client_id=client.id,
        product_id=product.id,
        quantity=order_in.quantity,
        unit_price=unit_price,
        total_price=total_price,
        status=order_in.status or "Completado"
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    # Notificación silenciosa
    notify_webhook_safe(f"📦 Nuevo pedido #{order.id}: {client.business_name} compró {order.quantity}x {product.name} (Total: Bs. {order.total_price})")

    return order


@app.delete("/api/v1/orders/{order_id}", tags=["5. Pedidos"])
def delete_order(order_id: int, db: Session = Depends(get_db)):
    """Elimina un registro de pedido."""
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Pedido no encontrado.")
    db.delete(order)
    db.commit()
    return {"message": f"Pedido #{order_id} eliminado correctamente."}


# ====================================================================
# 6. ENDPOINT DE RESUMEN Y KPIS: DASHBOARD (/api/v1/dashboard)
# ====================================================================
@app.get("/api/v1/dashboard", response_model=schemas.DashboardKPIs, tags=["6. Dashboard"])
def get_dashboard_kpis(db: Session = Depends(get_db)):
    """
    Retorna métricas consolidadas del negocio en tiempo real:
    - Total de tipos de productos
    - Unidades totales en stock físico
    - Valorización económica del inventario en Bolivianos (Bs.)
    - Total de clientes registrados en Santa Cruz
    - Total de pedidos concretados
    - Monto global de ventas en Bolivianos (Bs.)
    """
    total_products = db.query(models.Product).count()
    
    total_stock_units = db.query(func.coalesce(func.sum(models.Product.stock), 0)).scalar()
    
    all_products = db.query(models.Product).all()
    inventory_valuation_bs = round(sum(p.price * p.stock for p in all_products), 2)
    
    total_clients = db.query(models.Client).count()
    total_orders = db.query(models.Order).count()
    
    total_sales_bs = round(float(db.query(func.coalesce(func.sum(models.Order.total_price), 0.0)).scalar()), 2)

    return schemas.DashboardKPIs(
        total_products=total_products,
        total_stock_units=int(total_stock_units),
        inventory_valuation_bs=inventory_valuation_bs,
        total_clients=total_clients,
        total_orders=total_orders,
        total_sales_bs=total_sales_bs
    )
