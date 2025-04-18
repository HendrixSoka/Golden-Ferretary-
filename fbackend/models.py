from sqlalchemy import Column, Integer, String, Text, Enum, ForeignKey, DECIMAL, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class Usuario(Base):
    __tablename__ = "usuario"

    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    correo = Column(String(100), unique=True, index=True, nullable=False)
    contraseña = Column(String(255), nullable=False)
    cargo = Column(Enum("Gerente", "Cajero", "Cliente"), nullable=False)
    fecha_registro = Column(DateTime, default=datetime.utcnow)

    ventas = relationship("Venta", back_populates="usuario")


class Proveedor(Base):
    __tablename__ = "proveedor"

    id_proveedor = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    telefono = Column(String(20))
    direccion = Column(Text)
    correo = Column(String(100))

    productos = relationship("Producto", back_populates="proveedor")


class Producto(Base):
    __tablename__ = "producto"

    id_producto = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(Text)
    precio = Column(DECIMAL(10, 2), nullable=False)
    stock = Column(Integer, default=0)
    id_proveedor = Column(Integer, ForeignKey("proveedor.id_proveedor"))

    proveedor = relationship("Proveedor", back_populates="productos")
    detalles_venta = relationship("DetalleVenta", back_populates="producto")


class Venta(Base):
    __tablename__ = "venta"

    id_venta = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuario.id_usuario"))
    fecha = Column(DateTime, default=datetime.utcnow)
    total = Column(DECIMAL(10, 2), nullable=False)

    usuario = relationship("Usuario", back_populates="ventas")
    detalles_venta = relationship("DetalleVenta", back_populates="venta")


class DetalleVenta(Base):
    __tablename__ = "detalle_venta"

    id_detalle_venta = Column(Integer, primary_key=True, index=True)
    id_venta = Column(Integer, ForeignKey("venta.id_venta"))
    id_producto = Column(Integer, ForeignKey("producto.id_producto"))
    cantidad = Column(Integer, nullable=False)

    venta = relationship("Venta", back_populates="detalles_venta")
    producto = relationship("Producto", back_populates="detalles_venta")

class OrdenCompra(Base):
    __tablename__ = "orden_compra"

    id_orden_compra = Column(Integer, primary_key=True, index=True)
    id_proveedor = Column(Integer, ForeignKey("proveedor.id_proveedor"))
    fecha = Column(DateTime, default=datetime.utcnow)
    estado = Column(Enum("pendiente", "aprobada", "enviada", "recibida"), default="pendiente")

    proveedor = relationship("Proveedor")
    detalles = relationship("DetalleCompra", back_populates="orden")

class DetalleCompra(Base):
    __tablename__ = "detalle_compra"

    id_detalle_compra = Column(Integer, primary_key=True, index=True)
    id_orden_compra = Column(Integer, ForeignKey("orden_compra.id_orden_compra"))
    id_producto = Column(Integer, ForeignKey("producto.id_producto"))
    cantidad = Column(Integer, nullable=False)
    precio_unitario = Column(DECIMAL(10, 2))

    orden = relationship("OrdenCompra", back_populates="detalles")
    producto = relationship("Producto")
