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

# Obtener URL de base de datos de Dennis Yohan Martinez Illescas en Supabase
SUPABASE_URL = "postgresql://postgres:Martinez67741433.@db.zbrgzavtbenrylpoevbj.supabase.co:5432/postgres"
env_db_url = os.getenv("DATABASE_URL", "").strip().strip('"').strip("'")

# Garantizar el uso exclusivo del proyecto Supabase zbrgzavtbenrylpoevbj
if env_db_url and "zbrgzavtbenrylpoevbj" in env_db_url:
    DATABASE_URL = env_db_url
else:
    DATABASE_URL = SUPABASE_URL

# Ajuste de argumentos para SQLite en hilos múltiples si aplica
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
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
