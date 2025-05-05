from sqlalchemy import Boolean, Column, Integer, String, Text, Enum, ForeignKey, DECIMAL, DateTime
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
    
    ventas_como_vendedor = relationship("Venta", foreign_keys="[Venta.id_cajero]", back_populates="cajero")
    ventas_como_cliente = relationship("Venta", foreign_keys="[Venta.id_cliente]", back_populates="cliente")



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
    descripcion = Column(String(100), nullable=True)
    categoria = Column(String(100), nullable=False)
    precio = Column(DECIMAL(10, 2), nullable=False)
    stock = Column(Integer, default=0)
    imagen_url = Column(String(255), default="https://drive.google.com/uc?id=1vkOKzW-RHrzhBgZ_Xk0fHeIQUj9ebRub")
    activo = Column(Boolean, default=True)
    id_proveedor = Column(Integer, ForeignKey("proveedor.id_proveedor"))

    proveedor = relationship("Proveedor", back_populates="productos")
    detalles_venta = relationship("DetalleVenta", back_populates="producto")

class Venta(Base):
    __tablename__ = "venta"

    id_venta = Column(Integer, primary_key=True, index=True)
    id_cajero = Column(Integer, ForeignKey("usuario.id_usuario", ondelete="SET NULL"), nullable=True)
    id_cliente = Column(Integer, ForeignKey("usuario.id_usuario"), nullable=False, default=1)
    fecha = Column(DateTime, default=datetime.utcnow)
    total = Column(DECIMAL(10, 2), nullable=False)

    cliente = relationship("Usuario", foreign_keys=[id_cliente], back_populates="ventas_como_cliente")
    cajero = relationship("Usuario", foreign_keys=[id_cajero], back_populates="ventas_como_vendedor")

    detalles_venta = relationship("DetalleVenta", back_populates="venta", cascade="all, delete")


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
