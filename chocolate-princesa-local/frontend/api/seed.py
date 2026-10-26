"""
====================================================================
PROYECTO: Sistema de Gestión y Distribución - "Chocolate Princesa" (Santa Cruz, Bolivia)
PROPIETARIO / ESTUDIANTE: Dennis Yohan Martinez Illescas
CÓDIGO / REGISTRO: Dennis Yohan Martinez Illescas | REG: 219034821
ENTORNO: 100% Local (Semilla de Datos Realistas)
====================================================================
"""

import logging
from sqlalchemy.orm import Session
from models import Category, Supplier, Product, Client, Order

logger = logging.getLogger("chocolate_princesa_seed")

def seed_database(db: Session):
    """
    Inserta datos realistas para Chocolate Princesa - Santa Cruz, Bolivia
    si las tablas se encuentran vacías.
    """
    try:
        # Verificar si ya existen categorías
        if db.query(Category).first():
            logger.info("La base de datos ya contiene información. Omitiendo proceso de semilla.")
            return

        print("--> Iniciando carga de datos semilla para Chocolate Princesa (Santa Cruz, Bolivia)...")

        # 1. CATEGORÍAS (4)
        cat_tabletas = Category(
            name="Tabletas Artesanales",
            description="Tabletas de origen puro elaboradas con cacao silvestre boliviano seleccionado a mano.",
            storage_temp_c=18.0
        )
        cat_bombones = Category(
            name="Bombones Finos",
            description="Bombones cruceños rellenos con maracuyá chiquitana, café de los Yungas y licores amazónicos.",
            storage_temp_c=16.0
        )
        cat_cobertura = Category(
            name="Cobertura Pastelera",
            description="Bloques y discos de chocolate de alta fluidez ideales para pastelería y repostería gourmet.",
            storage_temp_c=20.0
        )
        cat_regalo = Category(
            name="Cajas de Regalo Princesa",
            description="Estuches dorados de lujo para regalos ejecutivos y ocasiones especiales en Santa Cruz.",
            storage_temp_c=17.5
        )
        db.add_all([cat_tabletas, cat_bombones, cat_cobertura, cat_regalo])
        db.flush()

        # 2. PROVEEDORES DE CACAO BOLIVIANO (3)
        sup_baures = Supplier(
            company_name="Productores Cacao Silvestre Baures",
            contact_name="Carlos Melgar Vaca",
            phone="+591 71029384",
            origin_region="Baures, Beni - Amazonía Boliviana",
            quality_grade="Cacao Silvestre de Recolección - Gran Reserva"
        )
        sup_alto_beni = Supplier(
            company_name="Cooperativa Cacaotera Alto Beni",
            contact_name="Elena Quispe Mamani",
            phone="+591 72154890",
            origin_region="Alto Beni, La Paz",
            quality_grade="Cacao Orgánico Certificado - Primera Selección"
        )
        sup_san_ignacio = Supplier(
            company_name="Hacienda Cacaotera San Ignacio",
            contact_name="Roberto Roca Justiniano",
            phone="+591 73619283",
            origin_region="San Ignacio de Velasco, Santa Cruz",
            quality_grade="Cacao Fino de Aroma Chiquitano"
        )
        db.add_all([sup_baures, sup_alto_beni, sup_san_ignacio])
        db.flush()

        # 3. PRODUCTOS DE CHOCOLATE (6)
        p1 = Product(
            name="Tableta Princesa Real 70% Cacao Silvestre",
            price=28.50,
            stock=150,
            cocoa_percentage=70,
            weight_grams=100,
            image_url="https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400",
            category_id=cat_tabletas.id,
            supplier_id=sup_baures.id
        )
        p2 = Product(
            name="Tableta Chiquitana Intensa 85% Cacao",
            price=32.00,
            stock=120,
            cocoa_percentage=85,
            weight_grams=100,
            image_url="https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400",
            category_id=cat_tabletas.id,
            supplier_id=sup_san_ignacio.id
        )
        p3 = Product(
            name="Caja Imperial 24 Bombones Cruceños",
            price=95.00,
            stock=45,
            cocoa_percentage=60,
            weight_grams=300,
            image_url="https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400",
            category_id=cat_bombones.id,
            supplier_id=sup_baures.id
        )
        p4 = Product(
            name="Bombones Princesa Mocca Yungueño (12 uds)",
            price=55.00,
            stock=60,
            cocoa_percentage=65,
            weight_grams=160,
            image_url="https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=400",
            category_id=cat_bombones.id,
            supplier_id=sup_alto_beni.id
        )
        p5 = Product(
            name="Cobertura Negra Princesa Chef 1Kg",
            price=85.00,
            stock=80,
            cocoa_percentage=55,
            weight_grams=1000,
            image_url="https://images.unsplash.com/photo-1511381939415-e44015466834?w=400",
            category_id=cat_cobertura.id,
            supplier_id=sup_alto_beni.id
        )
        p6 = Product(
            name="Estuche de Lujo Reina de Santa Cruz (Edición Oro)",
            price=140.00,
            stock=35,
            cocoa_percentage=75,
            weight_grams=450,
            image_url="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400",
            category_id=cat_regalo.id,
            supplier_id=sup_san_ignacio.id
        )
        db.add_all([p1, p2, p3, p4, p5, p6])
        db.flush()

        # 4. CLIENTES EN SANTA CRUZ DE LA SIERRA (4)
        c1 = Client(
            business_name="Pastelería Dulce Santa Cruz",
            contact_owner="Mariana Suárez Arteaga",
            nit_ci="4892104018",
            phone="+591 77012345",
            zone_address="Equipetrol Norte, Calle 7 Oeste",
            business_type="Pastelería"
        )
        c2 = Client(
            business_name="Supermercado Las Palmas Gourmet",
            contact_owner="Jorge Antelo Vaca",
            nit_ci="3019284012",
            phone="+591 78541290",
            zone_address="Barrio Las Palmas, Av. Ibérica esq. Rosales",
            business_type="Supermercado"
        )
        c3 = Client(
            business_name="Cafetería Casco Viejo 24 de Septiembre",
            contact_owner="Fernando Pinto Chávez",
            nit_ci="5129483015",
            phone="+591 76098234",
            zone_address="Centro Histórico, Calle 24 de Septiembre #140",
            business_type="Boutique"
        )
        c4 = Client(
            business_name="Distribuidora Mayorista El Abasto",
            contact_owner="Wilmer Gutiérrez Cruz",
            nit_ci="6721094019",
            phone="+591 71645321",
            zone_address="Av. Cristo Redentor y 4to Anillo",
            business_type="Mayorista"
        )
        db.add_all([c1, c2, c3, c4])
        db.flush()

        # 5. PEDIDOS INICIALES (4) CON DEDUCCIÓN DE STOCK
        # Pedido 1: Pastelería compra 5 Coberturas 1Kg
        qty1 = 5
        o1 = Order(
            client_id=c1.id,
            product_id=p5.id,
            quantity=qty1,
            unit_price=p5.price,
            total_price=p5.price * qty1,
            status="Completado"
        )
        p5.stock -= qty1

        # Pedido 2: Supermercado compra 20 Tabletas 70%
        qty2 = 20
        o2 = Order(
            client_id=c2.id,
            product_id=p1.id,
            quantity=qty2,
            unit_price=p1.price,
            total_price=p1.price * qty2,
            status="Completado"
        )
        p1.stock -= qty2

        # Pedido 3: Cafetería compra 4 Cajas Imperiales de Bombones
        qty3 = 4
        o3 = Order(
            client_id=c3.id,
            product_id=p3.id,
            quantity=qty3,
            unit_price=p3.price,
            total_price=p3.price * qty3,
            status="Completado"
        )
        p3.stock -= qty3

        # Pedido 4: Mayorista compra 15 Tabletas 85%
        qty4 = 15
        o4 = Order(
            client_id=c4.id,
            product_id=p2.id,
            quantity=qty4,
            unit_price=p2.price,
            total_price=p2.price * qty4,
            status="Completado"
        )
        p2.stock -= qty4

        db.add_all([o1, o2, o3, o4])
        db.commit()

        print("--> ¡Datos semilla cargados con éxito! 4 categorías, 3 proveedores, 6 chocolates, 4 clientes y 4 pedidos.")

    except Exception as e:
        db.rollback()
        print(f"Error al cargar semilla de datos: {e}")
