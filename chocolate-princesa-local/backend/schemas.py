"""
====================================================================
PROYECTO: Sistema de Gestión y Distribución - "Chocolate Princesa" (Santa Cruz, Bolivia)
PROPIETARIO / ESTUDIANTE: Dennis Yohan Martinez Illescas
CÓDIGO / REGISTRO: Dennis Yohan Martinez Illescas | REG: 219034821
ENTORNO: 100% Local (Pydantic v2 Schemas)
====================================================================
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field

# ====================================================================
# ESQUEMAS: CATEGORÍAS (TABLA 1)
# ====================================================================
class CategoryBase(BaseModel):
    name: str = Field(..., max_length=120, description="Nombre de la categoría")
    description: Optional[str] = Field(None, description="Descripción detallada de la línea")
    storage_temp_c: float = Field(18.0, description="Temperatura ideal de almacenamiento en °C")

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ====================================================================
# ESQUEMAS: PROVEEDORES (TABLA 2)
# ====================================================================
class SupplierBase(BaseModel):
    company_name: str = Field(..., max_length=150, description="Razón social o nombre de la cooperativa")
    contact_name: str = Field(..., max_length=120, description="Nombre del representante o contacto")
    phone: str = Field(..., max_length=50, description="Teléfono / WhatsApp de contacto")
    origin_region: str = Field(..., max_length=100, description="Región productora de Bolivia")
    quality_grade: str = Field("Cacao Fino de Aroma - Primera", max_length=100, description="Clasificación de calidad del grano")

class SupplierCreate(SupplierBase):
    pass

class SupplierResponse(SupplierBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ====================================================================
# ESQUEMAS: PRODUCTOS (TABLA 3)
# ====================================================================
class ProductBase(BaseModel):
    name: str = Field(..., max_length=150, description="Nombre comercial del producto")
    price: float = Field(..., gt=0, description="Precio unitario en Bolivianos (Bs.)")
    stock: int = Field(0, ge=0, description="Cantidad disponible en almacén")
    cocoa_percentage: int = Field(70, ge=0, le=100, description="Porcentaje de cacao puro")
    weight_grams: int = Field(100, gt=0, description="Peso neto en gramos")
    image_url: Optional[str] = Field(None, max_length=300, description="URL de la imagen del producto")
    category_id: int = Field(..., description="ID de la categoría asociada")
    supplier_id: int = Field(..., description="ID del proveedor de cacao asociado")

class ProductCreate(ProductBase):
    pass

class ProductSimple(BaseModel):
    """Esquema simplificado de producto para anidar en órdenes sin recursión."""
    id: int
    name: str
    price: float
    stock: int
    cocoa_percentage: int
    weight_grams: int

    model_config = ConfigDict(from_attributes=True)

class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    category: Optional[CategoryResponse] = None
    supplier: Optional[SupplierResponse] = None

    model_config = ConfigDict(from_attributes=True)


# ====================================================================
# ESQUEMAS: CLIENTES (TABLA 4)
# ====================================================================
class ClientBase(BaseModel):
    business_name: str = Field(..., max_length=150, description="Nombre comercial o razón social")
    contact_owner: str = Field(..., max_length=120, description="Nombre del propietario o encargado")
    nit_ci: str = Field(..., max_length=50, description="NIT o Carnet de Identidad")
    phone: str = Field(..., max_length=50, description="Teléfono de contacto")
    zone_address: str = Field(..., max_length=150, description="Zona y dirección en Santa Cruz")
    business_type: str = Field("Mayorista", max_length=60, description="Tipo: Mayorista, Pastelería, Supermercado, Boutique")

class ClientCreate(ClientBase):
    pass

class ClientResponse(ClientBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ====================================================================
# ESQUEMAS: PEDIDOS / VENTAS (TABLA 5)
# ====================================================================
class OrderBase(BaseModel):
    client_id: int = Field(..., description="ID del cliente que realiza la compra")
    product_id: int = Field(..., description="ID del producto de chocolate a comprar")
    quantity: int = Field(..., gt=0, description="Cantidad de unidades a solicitar")

class OrderCreate(OrderBase):
    status: Optional[str] = Field("Completado", description="Estado del pedido")

class OrderResponse(BaseModel):
    id: int
    client_id: int
    product_id: int
    quantity: int
    unit_price: float
    total_price: float
    status: str
    created_at: datetime
    client: Optional[ClientResponse] = None
    product: Optional[ProductSimple] = None

    model_config = ConfigDict(from_attributes=True)


# ====================================================================
# ESQUEMA: DASHBOARD / KPIS
# ====================================================================
class DashboardKPIs(BaseModel):
    total_products: int
    total_stock_units: int
    inventory_valuation_bs: float
    total_clients: int
    total_orders: int
    total_sales_bs: float

    model_config = ConfigDict(from_attributes=True)
