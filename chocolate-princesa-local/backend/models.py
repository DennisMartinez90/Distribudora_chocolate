"""
====================================================================
PROYECTO: Sistema de Gestión y Distribución - "Chocolate Princesa" (Santa Cruz, Bolivia)
PROPIETARIO / ESTUDIANTE: Dennis Yohan Martinez Illescas
CÓDIGO / REGISTRO: Dennis Yohan Martinez Illescas | REG: 219034821
ENTORNO: 100% Local (FastAPI + SQLAlchemy)
====================================================================
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

class Category(Base):
    """
    TABLA 1: Categorías de Productos
    Organiza las líneas de chocolate y define su temperatura óptima de conservación.
    """
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    storage_temp_c = Column(Float, default=18.0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relación con Productos
    products = relationship("Product", back_populates="category", cascade="all, delete-orphan")


class Supplier(Base):
    """
    TABLA 2: Proveedores de Cacao e Insumos
    Registra cooperativas y productores de cacao boliviano (Baures, Alto Beni, Chiquitanía).
    """
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(150), nullable=False, index=True)
    contact_name = Column(String(120), nullable=False)
    phone = Column(String(50), nullable=False)
    origin_region = Column(String(100), nullable=False)
    quality_grade = Column(String(100), default="Cacao Fino de Aroma - Primera", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relación con Productos
    products = relationship("Product", back_populates="supplier")


class Product(Base):
    """
    TABLA 3: Productos Principales de Chocolate Princesa
    Catálogo central de tabletas, bombones y coberturas con precios en Bs.
    """
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False, index=True)
    price = Column(Float, nullable=False)  # En Bolivianos (Bs.)
    stock = Column(Integer, default=0, nullable=False)
    cocoa_percentage = Column(Integer, default=70, nullable=False)
    weight_grams = Column(Integer, default=100, nullable=False)
    image_url = Column(String(300), nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relaciones
    category = relationship("Category", back_populates="products")
    supplier = relationship("Supplier", back_populates="products")
    orders = relationship("Order", back_populates="product", cascade="all, delete-orphan")


class Client(Base):
    """
    TABLA 4: Clientes Mayoristas y Puntos de Venta en Santa Cruz
    Negocios, pastelerías, boutiques y supermercados clientes de la distribuidora.
    """
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    business_name = Column(String(150), nullable=False, index=True)
    contact_owner = Column(String(120), nullable=False)
    nit_ci = Column(String(50), unique=True, nullable=False, index=True)
    phone = Column(String(50), nullable=False)
    zone_address = Column(String(150), nullable=False)
    business_type = Column(String(60), default="Mayorista", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relación con Pedidos
    orders = relationship("Order", back_populates="client")


class Order(Base):
    """
    TABLA 5: Pedidos y Despachos de Distribución
    Transacciones de venta realizadas a clientes con descuento automático de stock.
    """
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    status = Column(String(50), default="Completado", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relaciones
    client = relationship("Client", back_populates="orders")
    product = relationship("Product", back_populates="orders")
