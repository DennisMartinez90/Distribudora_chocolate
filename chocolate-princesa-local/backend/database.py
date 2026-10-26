"""
====================================================================
PROYECTO: Sistema de Gestión y Distribución - "Chocolate Princesa" (Santa Cruz, Bolivia)
PROPIETARIO / ESTUDIANTE: Dennis Yohan Martinez Illescas
CÓDIGO / REGISTRO: Dennis Yohan Martinez Illescas | REG: 219034821
ENTORNO: 100% Local (SQLite por defecto)
====================================================================
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Carga de variables de entorno locales
load_dotenv()

# Obtener URL de base de datos (por defecto SQLite local sin requerir servicios en la nube)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./chocolate_princesa.db")

# Ajuste de argumentos para SQLite en hilos múltiples
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Generador de sesiones de base de datos para inyección de dependencias en FastAPI."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
